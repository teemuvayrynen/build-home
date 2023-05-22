import React, { useState, useReducer } from 'react';

export const CanvasContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_LEVEL': {
      const prev = state[state.length - 1];
      const newLevel = {id: prev.id + 1, elements: [], latestElements: []}
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
      copy[action.currentLevel].latestElements.push(action.latestElement)
      return copy
    }
    case 'MOVE_LATEST_POINT': {
      const copy = [...state];
      const latestIndex = copy[action.currentLevel].elements.length - 1;
      copy[action.currentLevel].elements[latestIndex].points[1] = action.newPos;
      return copy
    }
    case 'UPDATE_POS_DRAG_RECT': {
      const copy = [...state];
      const element = copy[action.currentLevel].elements[action.index];
      element.points[0] = action.pos
      element.points[1] = action.pos1
      return copy
    } 
    case 'UPDATE_POS_DRAG_CIRCLE': {
      const copy = [...state];
      copy[action.currentLevel].elements[action.indexOfElements].points[action.index] = action.pos
      return copy
    }
    case 'UNDO': {
      const copy = [...state];
      const popped = copy[action.currentLevel].latestElements.pop();
      const element = copy[action.currentLevel].elements[popped.index];
      if (element.closed) {
        element.closed = false;
      } else if (element.points.length <= 2) {
        copy[action.currentLevel].elements.pop();
      } else {
        element.points.splice(popped.row, 1)
        copy[action.currentLevel].elements[popped.index] = element;
      }
      return copy
    }
    case 'DELETE_ALL_ELEMENTS': {
      const copy = [...state];
      copy[action.currentLevel].elements = [];
      copy[action.currentLevel].latestElements = [];
      return copy
    }
  }
  throw Error('Unknown action.');
}

export const CanvasProvider = (props) => {
  const [elements, setElements] = useState([]);
  const [activeTool, setActiveTool] = useState(0);
  const [latestElement, setLatestElement] = useState([])
  const [levelState, levelDispatch] = useReducer(reducer, [{id: 0, elements: [], latestElements: []}])
  const [currentLevel, setCurrentLevel] = useState(0)

  return (
    <CanvasContext.Provider 
      value={{ 
        elements, 
        setElements, 
        activeTool, 
        setActiveTool, 
        latestElement,
        setLatestElement,
        levelState,
        levelDispatch,
        currentLevel,
        setCurrentLevel
      }}>
      {props.children}
    </CanvasContext.Provider>
  )
}