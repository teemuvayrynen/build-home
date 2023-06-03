import React, { useState, useRef } from 'react';

export const CanvasContext = React.createContext();

export const CanvasProvider = (props) => {
  const [activeTool, setActiveTool] = useState("default");
  const [selectedFloor, setSelectedFloor] = useState(0)
  const [selectedElement, setSelectedElement] = useState(null)

  return (
    <CanvasContext.Provider 
      value={{ 
        activeTool, 
        setActiveTool, 
        selectedFloor,
        setSelectedFloor,
        selectedElement,
        setSelectedElement
      }}>
      {props.children}
    </CanvasContext.Provider>
  )
}