import React, { useState, useRef } from 'react';

export const CanvasContext = React.createContext();

export const CanvasProvider = (props) => {
  const [activeTool, setActiveTool] = useState("default");
  const [selectedFloor, setSelectedFloor] = useState(0)
  const [selectedElement, setSelectedElement] = useState(null)
  const [drawing, setDrawing] = useState(false)
  const dragging = useState(false)

  return (
    <CanvasContext.Provider 
      value={{ 
        activeTool, 
        setActiveTool, 
        selectedFloor,
        setSelectedFloor,
        selectedElement,
        setSelectedElement,
        dragging,
        drawing,
        setDrawing
      }}>
      {props.children}
    </CanvasContext.Provider>
  )
}