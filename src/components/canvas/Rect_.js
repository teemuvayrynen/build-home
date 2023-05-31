import React, { useContext, useEffect, useState } from "react";
import { Rect } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import Circle_ from "./Circle_";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { moveElement } from "../../redux/features/canvasSlice"

export default function Rect_ ({index, element, drawing, dragging}) {
  const canvasState = useAppSelector(state => state.canvasReducer.items)
  const canvasDispatch = useAppDispatch()
  const {activeTool, currentLevel } = useContext(CanvasContext)
  const [modifiedPoints, setModifiedPoints] = useState([])

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      currentLevel: currentLevel,
      indexOfElements: index,
      point: pos
    }))
  }

  useEffect(() => {
    if (canvasState[currentLevel].elements[index]) {
      const e = canvasState[currentLevel].elements[index]
      setModifiedPoints([
        {x: e.x, y: e.y},
        {x: e.x + e.width, y: e.y + e.height},
        {x: e.x + e.width, y: e.y},
        {x: e.x, y: e.y + e.height}
      ])
    }
  }, [currentLevel, canvasState, index])

  return (
    <>
      <Rect 
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
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
              element={element}
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
    x: pos.x,
    y: pos.y,
    width: 0,
    height: 0
  }
  const dispatchObj = {
    element: rectObject,
    currentLevel: currentLevel,
    indexOfElements: canvasState[currentLevel].elements.length,
  }
  canvasDispatch(addElement(dispatchObj))
  setCurrentElement({
    type: "rectangle",
    indexOfElements: canvasState[currentLevel].elements.length,
  })
}

export const mouseMoveRect = (e, canvasDispatch, currentLevel, currentElement, movePoint) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const dispatchObj = {
    type: "rectangle",
    currentLevel: currentLevel,
    indexOfElements: currentElement.indexOfElements,
    point: pos,
    index: 1
  }
  canvasDispatch(movePoint(dispatchObj))
}