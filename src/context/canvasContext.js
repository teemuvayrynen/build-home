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
      const latest = copy[action.currentLevel].latestElements.slice(-1)
      if (action.lineType === "rectangle") {
        copy[action.currentLevel].elements[latest[0].index].points[action.index] = action.newPos;
      } else if (action.lineType === "line") {
        const element = copy[action.currentLevel].elements[latest[0].index];
        const newPos = {
          x: action.newPos.x - element.x,
          y: action.newPos.y - element.y
        }
        copy[action.currentLevel].elements[latest[0].index].points[action.index] = newPos;
      }
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
      copy[action.currentLevel].latestElements.push({index: action.indexOfElements, row: action.row})
      return copy
    }
    case 'CREATE_CLOSED_ELEMENT': {
      const copy = [...state];
      const element = copy[action.currentLevel].elements[action.indexOfElements];
      const latest = copy[action.currentLevel].latestElements.slice(-1)
      if (latest[0].row === 0) {
        copy[action.currentLevel].elements[action.indexOfElements].points.shift()
      } else {
        copy[action.currentLevel].elements[action.indexOfElements].points.pop()
      }
      element.closed = true
      const length = copy[action.currentLevel].latestElements.length
      copy[action.currentLevel].latestElements[length - 1].closed = true
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
    case 'UPDATE_POS_DRAG_CIRCLE': {
      const copy = [...state];
      if (action.lineType === "rectangle") {
        copy[action.currentLevel].elements[action.indexOfElements].points[action.index] = action.pos
      } else if (action.lineType === "line") {
        const element = copy[action.currentLevel].elements[action.indexOfElements];
        const temp = {
          x: action.pos.x - element.x,
          y: action.pos.y - element.y
        }
        copy[action.currentLevel].elements[action.indexOfElements].points[action.index] = temp
      }
      return copy
    }
    case 'UNDO': {
      const copy = [...state];
      const popped = copy[action.currentLevel].latestElements.pop();
      const element = copy[action.currentLevel].elements[popped.index];
      if (popped.closed) {
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
  const [activeTool, setActiveTool] = useState(0);
  const [levelState, levelDispatch] = useReducer(reducer, [{id: 0, elements: [], latestElements: []}])
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentElement, setCurrentElement] = useState(null)

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