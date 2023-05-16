import React, { useState } from 'react';

export const CanvasContext = React.createContext();

export const CanvasProvider = (props) => {
  const [elements, setElements] = useState([]);
  const [activeTool, setActiveTool] = useState(0);


  return (
    <CanvasContext.Provider value={{ elements, setElements, activeTool, setActiveTool }}>
      {props.children}
    </CanvasContext.Provider>
  )
}