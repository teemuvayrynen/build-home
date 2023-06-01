import React, { useState, useReducer, useEffect } from 'react';

export const CanvasContext = React.createContext();

export const CanvasProvider = (props) => {
  const [activeTool, setActiveTool] = useState("default");
  const [currentLevel, setCurrentLevel] = useState(0)
  const [currentElement, setCurrentElement] = useState(null)

  return (
    <CanvasContext.Provider 
      value={{ 
        activeTool, 
        setActiveTool, 
        currentLevel,
        setCurrentLevel,
        currentElement,
        setCurrentElement
      }}>
      {props.children}
    </CanvasContext.Provider>
  )
}