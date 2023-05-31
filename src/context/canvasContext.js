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