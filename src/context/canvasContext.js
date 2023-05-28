import React, { useState, useReducer, useEffect } from 'react';

export const CanvasContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ELEMENTS_FROM_LS': {
      return action.elements
    }
    case 'ADD_LEVEL': {
      const prev = state[state.length - 1];
      const newLevel = {id: prev.id + 1, elements: [], history: [], historyStep: 0}
      return [...state, newLevel];
    }
    case 'DELETE_LEVEL': {
      if (state.length == 1) return state
      const copy = [...state];
      copy.splice(action.currentLevel, 1);
      for (let i = action.currentLevel; i < copy.length; i++) {
        copy[i].id = i;
      }
      return copy;
    }
    case 'ADD_ELEMENT_BASE': {
      const copy = [...state];
      copy[action.currentLevel].elements.push(action.element)
      copy[action.currentLevel].history.push({
        addElement: true, 
        closed: false,
        concat: false,
        index: action.indexOfElements, 
        row: action.row, 
        element: action.element})
      copy[action.currentLevel].historyStep += 1
      return copy
    }
    case 'CONCAT_POINTS': {
      const copy = [...state];
      const element = copy[action.currentLevel].elements[action.indexOfElements];
      const point = {
        x: action.pos.x - element.x,
        y: action.pos.y - element.y
      }
      if (action.row === 0) {
        element.points.unshift(point)
      } else {
        element.points.push(point)
      }
      copy[action.currentLevel].history.push({
        addElement: false,
        closed: false,
        concat: true, 
        index: action.indexOfElements, 
        row: action.row, 
        element: element
      })
      copy[action.currentLevel].historyStep += 1
      return copy
    }
    case 'CREATE_CLOSED_ELEMENT': {
      const copy = [...state];
      const element = copy[action.currentLevel].elements[action.indexOfElements];
      if (action.index === 0) {
        element.points.shift()
      } else {
        element.points.pop()
      }
      element.closed = true
      copy[action.currentLevel].history.push({
        index: action.indexOfElements, 
        row: action.index, 
        closed: true,
        addElement: false,
        concat: false,
      })
      copy[action.currentLevel].historyStep += 1
      return copy
    }
    case 'UPDATE_POS_DRAG_RECT': {
      const copy = [...state];
      const element = copy[action.currentLevel].elements[action.index];
      element.points[0] = action.pos
      element.points[1] = action.pos1
      return copy
    }
    case 'UPDATE_POS_DRAG_LINE': {
      const copy = [...state];
      const element = copy[action.currentLevel].elements[action.index];
      element.x = action.pos.x
      element.y = action.pos.y
      return copy
    }
    case 'MOVE_POINT': {
      const copy = [...state];
      if (action.lineType === "rectangle") {
        copy[action.currentLevel].elements[action.indexOfElements].points[action.index] = action.newPos;
      } else if (action.lineType === "line") {
        const element = copy[action.currentLevel].elements[action.indexOfElements];
        const newPos = {
          x: action.newPos.x - element.x,
          y: action.newPos.y - element.y
        }
        copy[action.currentLevel].elements[action.indexOfElements].points[action.index] = newPos;
      }
      return copy
    }
    case 'DIVIDE_LINE': {
      const copy = [...state];
      const points = copy[action.currentLevel].elements[action.indexOfElements].points;
      points.splice(action.index + 1, 0, action.pos);
      copy[action.currentLevel].historyStep += 1
      copy[action.currentLevel].history.push({
        index: action.indexOfElements, 
        row: action.index + 1,
        closed: true,
        addElement: false,
        concat: false,
        element: copy[action.currentLevel].elements[action.indexOfElements]
      })
      return copy
    }
    case 'UNDO': {
      if (state[action.currentLevel].historyStep === -1) return state
      const copy = [...state];
      const historyStep = copy[action.currentLevel].historyStep
      const historyElement = copy[action.currentLevel].history[historyStep]
      copy[action.currentLevel].historyStep -= 1
      // if (historyElement.deleteAll) {
      //   copy[action.currentLevel].elements = historyElement.elements
      //   return copy
      // }
      if (historyElement.closed) {
        copy[action.currentLevel].elements[historyElement.index].closed = false
        return copy
      }
      const element = copy[action.currentLevel].elements[historyElement.index];  
      if (historyElement.element.points.length === 2) {
        copy[action.currentLevel].elements.splice(historyElement.index, 1)
        return copy
      }
      if (historyElement.element.points.length > 2) {
        element.points.splice(historyElement.row, 1)
        return copy
      }
    }
    case 'REDO': {
      if (state[action.currentLevel].historyStep === state[action.currentLevel].history.length - 1) return state
      const copy = [...state];
      copy[action.currentLevel].historyStep += 1
      const next = copy[action.currentLevel].history[copy[action.currentLevel].historyStep]
      console.log(copy[action.currentLevel].historyStep)
      console.log(copy[action.currentLevel].history)
      
      // if (next.deleteAll) {
      //   copy[action.currentLevel].elements = []
      //   return copy
      // }
      if (next.closed) {
        copy[action.currentLevel].elements[next.index].closed = true
        return copy
      }
      if (next.addElement) {
        copy[action.currentLevel].elements.splice(next.index, 0, next.element)
        return copy
      }
      if (next.concat) {
        console.log(copy[action.currentLevel].elements[next.index])
        console.log(next)
        return copy
      }
    }
    case 'DELETE_ALL_ELEMENTS': {
      const copy = [...state];
      //copy[action.currentLevel].history.push({deleteAll: true, elements: copy[action.currentLevel].elements})
      copy[action.currentLevel].historyStep = -1
      copy[action.currentLevel].history = []
      copy[action.currentLevel].elements = [];
      return copy
    }
  }
  throw Error('Unknown action.');
}

export const CanvasProvider = (props) => {
  const [activeTool, setActiveTool] = useState("default");
  const [levelState, levelDispatch] = useReducer(reducer, [{
    id: 0, 
    elements: [], 
    history: [],
    historyStep: -1
  }])
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentElement, setCurrentElement] = useState(null)

  useEffect(() => {
    if (localStorage.getItem('levelState') !== null) {
      const elements = localStorage.getItem('levelState')
      levelDispatch({type: 'ADD_ELEMENTS_FROM_LS', elements: JSON.parse(elements)})
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('levelState', JSON.stringify(levelState))
  }, [levelState])

  return (
    <CanvasContext.Provider 
      value={{ 
        activeTool, 
        setActiveTool, 
        levelState,
        levelDispatch,
        currentLevel,
        setCurrentLevel,
        currentElement,
        setCurrentElement
      }}>
      {props.children}
    </CanvasContext.Provider>
  )
}