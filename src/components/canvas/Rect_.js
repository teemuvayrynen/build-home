import React, { useContext, useEffect, useState } from "react";
import { Rect, Circle } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"

export default function Rect_ ({index, points, stageMoving, setDragRect, dragRect }) {
  const {elements, setElements, activeTool } = useContext(CanvasContext)
  const [size, setSize] = useState(5)

  const handleDrag = (e) => {
    if (!dragRect) return
    const pos = e.target.getStage().getRelativePointerPosition();
    const elementsCopy = [...elements]
    elementsCopy[index].points[1] = {x: pos.x, y: pos.y}
    setElements(elementsCopy)
  }


  return (
    <>
      <Rect 
        x={points[0].x}
        y={points[0].y}
        width={points[1].x - points[0].x}
        height={points[1].y - points[0].y}
        stroke="#00FFFF"
        strokeWidth={2}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.3}
      />
      <Circle 
        onMouseEnter={e => {
          if (activeTool == 0) {
            const container = e.target.getStage().container();
            container.style.cursor = "pointer";
            setSize(7)
          }
        }}
        onMouseLeave={e => {
          if (activeTool == 0) {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
            setSize(5)
          }
        }}
        x={points[1].x}
        y={points[1].y}
        radius={size}
        fill="#00FFFF"
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.5}
        draggable={activeTool == 0 ? true : false}
        onDragStart={() => { setDragRect(true) }}
        onDragEnd={() => { setDragRect(false) }}
        onDragMove={e => { handleDrag(e) }}
      />
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