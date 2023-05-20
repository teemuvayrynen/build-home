import React, { useContext, useEffect, useState } from "react";
import { Rect, Circle } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import Circle_ from "./Circle_";

export default function Rect_ ({index, points, stageMoving, setDragRect, dragRect, drawing }) {
  const {elements, setElements, activeTool } = useContext(CanvasContext)
  const [visible, setVisible] = useState(true)
  

  return (
    <>
      <Rect 
        x={points[0].x}
        y={points[0].y}
        width={points[1].x - points[0].x}
        height={points[1].y - points[0].y}
        stroke="black"
        strokeWidth={7}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.3}
      />
      {points.map((point, i) => {
        return (
          <>
            <Circle_
              index={i}
              indexOfElements={index}
              element={point} 
              drag={dragRect}
              setDrag={setDragRect}
              drawing={drawing}
            />
          </>
        )
      })}
    </>
  )
}

export const mouseDownRect = (e, elements, setElements, setLatestElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const lineObject = {
    type: "rectangle",
    points: []
  }

  lineObject.points = [
    {x: pos.x, y: pos.y},
    {x: pos.x, y: pos.y}
  ]
  setElements(prevState => [...prevState, lineObject])
  setLatestElement(prevState => [...prevState, {index: elements.length, row: 1}])
}

export const mouseMoveRect = (e, elements, setElements) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const elementsCopy = [...elements];
  const index = elements.length - 1;
  elementsCopy[index].points[1] = { x: pos.x, y: pos.y }
  setElements(elementsCopy)
}