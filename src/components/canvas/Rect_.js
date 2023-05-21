import React, { useContext, useEffect, useState } from "react";
import { Rect } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import Circle_ from "./Circle_";

export default function Rect_ ({index, points, setDragRect, dragRect, drawing}) {
  const {elements, setElements, activeTool } = useContext(CanvasContext)
  const [modifiedPoints, setModifiedPoints] = useState(elements[index].points)

  const handleDragMove = (e) => {
    const elementsCopy = [...elements]
    const element = elementsCopy[index]
    const pos = e.target.position()
    const width = element.points[1].x - element.points[0].x
    const height = element.points[1].y - element.points[0].y

    element.points[0] = {x: pos.x, y: pos.y}
    element.points[1] = {x: pos.x + width, y: pos.y + height}

    elementsCopy[index] = element
    setElements(elementsCopy)
  }

  useEffect(() => {
    const p = elements[index].points
    setModifiedPoints([...p, {x: p[0].x, y: p[1].y}, {x: p[1].x, y: p[0].y}])
  }, [elements, index])

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
        draggable={activeTool == 0 ? true : false}
        onDragMove={handleDragMove}
      />
      {modifiedPoints.map((point, i) => {
        return (
          <>
            <Circle_
              index={i}
              indexOfElements={index}
              element={point} 
              drag={dragRect}
              setDrag={setDragRect}
              drawing={drawing}
              type="rect"
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