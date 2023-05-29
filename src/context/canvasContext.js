import React, { useState, useReducer, useEffect } from 'react';

export const CanvasContext = React.createContext();

function reducer(state, action) {
  function concatHistory(copy, item) {
    let history = copy[action.currentLevel].history.slice(0, copy[action.currentLevel].historyStep + 1)
    history = history.concat([item])
    return history
  }
  switch (action.type) {
    case 'ADD_ELEMENTS_FROM_LS': {
      return action.elements
    }
    case 'ADD_LEVEL': {
      const prev = state.state[state.state.length - 1];
      const newLevel = {id: prev.id + 1, elements: [], history: [], historyStep: 0}
      return {...state, state: [...state.state, newLevel]}
    }
    case 'DELETE_LEVEL': {
      if (state.state.length == 1) return state
      const copy = [...state.state];
      copy.splice(action.currentLevel, 1);
      for (let i = action.currentLevel; i < copy.length; i++) {
        copy[i].id = i;
      }
      return {...state, state: copy}
    }
    case 'ADD_ELEMENT_BASE': {
      const copy = [...state.state];
      copy[action.currentLevel].elements.push(action.element)
      copy[action.currentLevel].history = concatHistory(copy, {
        addElement: true, 
        closed: false,
        concat: false,
        index: action.indexOfElements, 
        row: action.row, 
        element: action.element})
      copy[action.currentLevel].historyStep += 1
      return {...state, state: copy}
    }
    case 'CONCAT_POINTS': {
      const copy = [...state.state];
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

      const newItem = {
        addElement: false,
        closed: false,
        concat: true, 
        index: action.indexOfElements, 
        row: action.row,
        element: element
      }

      console.log(newItem)
    
      let history = copy[action.currentLevel].history.slice(0, copy[action.currentLevel].historyStep + 1)
      history.push(newItem)

      console.log(history)
      
      copy[action.currentLevel].history = history
      copy[action.currentLevel].historyStep += 1

      return {...state, state: [...copy, ]}
    }
    case 'CREATE_CLOSED_ELEMENT': {
      const copy = [...state.state];
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
      return {...state, state: copy}
    }
    case 'UPDATE_POS_DRAG_RECT': {
      const copy = [...state.state];
      const element = copy[action.currentLevel].elements[action.index];
      element.points[0] = action.pos
      element.points[1] = action.pos1
      return {...state, state: copy}
    }
    case 'UPDATE_POS_DRAG_LINE': {
      const copy = [...state.state];
      const element = copy[action.currentLevel].elements[action.index];
      element.x = action.pos.x
      element.y = action.pos.y
      return {...state, state: copy}
    }
    case 'MOVE_POINT': {
      const copy = [...state.state];
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
      return {...state, state: copy}
    }
    case 'DIVIDE_LINE': {
      const copy = [...state.state];
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
      return {...state, state: copy}
    }
    case 'UNDO': {
      if (state.state[action.currentLevel].historyStep === -1) return state
      const copy = [...state.state];
      const historyStep = copy[action.currentLevel].historyStep
      const historyElement = copy[action.currentLevel].history[historyStep]
      copy[action.currentLevel].historyStep -= 1
      console.log(copy[action.currentLevel].history)
      console.log(historyElement)
      // if (historyElement.deleteAll) {
      //   copy[action.currentLevel].elements = historyElement.elements
      //   return copy
      // }
      if (historyElement.closed) {
        copy[action.currentLevel].elements[historyElement.index].closed = false
        return {...state, state: copy}
      }
      const element = copy[action.currentLevel].elements[historyElement.index];  
      if (historyElement.addElement) {
        copy[action.currentLevel].elements.splice(historyElement.index, 1)
        return {...state, state: copy}
      }
      if (historyElement.concat) {
        element.points.splice(historyElement.row, 1)
        return {...state, state: copy}
      }
      break
    }
    case 'REDO': {
      if (state.state[action.currentLevel].historyStep === state.state[action.currentLevel].history.length - 1) return state
      const copy = [...state.state];
      copy[action.currentLevel].historyStep += 1
      const next = copy[action.currentLevel].history[copy[action.currentLevel].historyStep]
      
      // if (next.deleteAll) {
      //   copy[action.currentLevel].elements = []
      //   return copy
      // }
      if (next.closed) {
        copy[action.currentLevel].elements[next.index].closed = true
        return {...state, state: copy}
      }
      if (next.addElement) {
        copy[action.currentLevel].elements.splice(next.index, 0, next.element)
        return {...state, state: copy}
      }
      if (next.concat) {
        console.log(next)
        const point = next.elementtttt.points[next.row]
        console.log(point)
        copy[action.currentLevel].elements[next.index].points.splice(next.row, 0, point)
        return {...state, state: copy}
      }
      break
    }
    case 'DELETE_ALL_ELEMENTS': {
      const copy = [...state.state];
      //copy[action.currentLevel].history.push({deleteAll: true, elements: copy[action.currentLevel].elements})
      copy[action.currentLevel].historyStep = -1
      copy[action.currentLevel].history = []
      copy[action.currentLevel].elements = [];
      return {...state, state: copy}
    }
  }
  throw Error('Unknown action.');
}

export const CanvasProvider = (props) => {
  const [activeTool, setActiveTool] = useState("default");
  const [levelState, levelDispatch] = useReducer(reducer, {
    state: [{
      id: 0, 
      elements: [], 
      history: [],
      historyStep: -1
    }]
  })
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