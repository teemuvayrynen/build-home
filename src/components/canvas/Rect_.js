import React, { useContext, useEffect, useState } from "react";
import { Rect } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import Circle_ from "./Circle_";
import { useAppSelector } from "@/redux/hooks";

export default function Rect_ ({index, points, drawing, dragging}) {
  const canvasState = useAppSelector(state => state.canvasReducer.items)
  const {activeTool, currentLevel } = useContext(CanvasContext)
  const [modifiedPoints, setModifiedPoints] = useState([])

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    const tempPoints = canvasState[currentLevel].elements[index].points
    const width = tempPoints[1].x - tempPoints[0].x
    const height = tempPoints[1].y - tempPoints[0].y
    const pos1 = {x: pos.x + width, y: pos.y + height}

    // levelDispatch({
    //   type: "UPDATE_POS_DRAG_RECT",
    //   index: index,
    //   pos: pos,
    //   pos1: pos1,
    //   currentLevel: currentLevel
    // })
  }

  useEffect(() => {
    if (canvasState[currentLevel].elements[index]) {
      const p = canvasState[currentLevel].elements[index].points
      setModifiedPoints([...p, {x: p[0].x, y: p[1].y}, {x: p[1].x, y: p[0].y}])
    }
  }, [currentLevel, canvasState, index])

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
        draggable={activeTool == "default" ? true : false}
        onDragEnd={handleDragEnd}
      />
      {modifiedPoints.map((point, i) => {
        return (
          <>
            <Circle_
              index={i}
              indexOfElements={index}
              point={point} 
              drawing={drawing}
              type="rectangle"
              dragging={dragging}
            />
          </>
        )
      })}
    </>
  )
}

export const mouseDownRect = (e, canvasState, canvasDispatch, currentLevel, setCurrentElement, addElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const rectObject = {
    type: "rectangle",
    points: [
      {x: pos.x, y: pos.y},
      {x: pos.x, y: pos.y}
    ],
  }
  const dispatchObj = {
    element: rectObject,
    currentLevel: currentLevel,
    indexOfElements: canvasState[currentLevel].elements.length,
    index: 1
  }
  canvasDispatch(addElement(dispatchObj))
  setCurrentElement({
    type: "rectangle",
    indexOfElements: canvasState[currentLevel].elements.length,
    index: 1
  })
}

export const mouseMoveRect = (e, canvasDispatch, currentLevel, currentElement, movePoint) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const dispatchObj = {
    type: "rectangle",
    point: pos,
    currentLevel: currentLevel,
    index: currentElement.index,
    indexOfElements: currentElement.indexOfElements
  }
  canvasDispatch(movePoint(dispatchObj))
}