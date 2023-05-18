import React, { useState } from 'react';

export const CanvasContext = React.createContext();

export const CanvasProvider = (props) => {
  const [elements, setElements] = useState([]);
  const [activeTool, setActiveTool] = useState(0);
  const [latestElement, setLatestElement] = useState([])

  return (
    <CanvasContext.Provider 
      value={{ 
        elements, 
        setElements, 
        activeTool, 
        setActiveTool, 
        latestElement,
        setLatestElement
      }}>
      {props.children}
    </CanvasContext.Provider>
  )
}