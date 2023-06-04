import React, { useContext, useEffect, useState, useRef } from "react";
import { Rect } from "react-konva"
import { CanvasContext } from "../../context/canvasContext.jsx"
import Circle_ from "./Circle_.jsx";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { moveElement } from "../../redux/features/canvasSlice"

export default function Rect_ ({index, element, drawing, dragging}) {
  const canvasState = useAppSelector(state => state.canvas.items)
  const canvasDispatch = useAppDispatch()
  const {activeTool, selectedFloor, setSelectedElement } = useContext(CanvasContext)
  const [modifiedPoints, setModifiedPoints] = useState([])
  const rectRef = useRef()

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      floor: selectedFloor,
      indexOfElements: index,
      point: pos
    }))
  }

  useEffect(() => {
    if (canvasState[selectedFloor] && canvasState[selectedFloor].elements[index]) {
      const e = canvasState[selectedFloor].elements[index]
      setModifiedPoints([
        {x: e.x, y: e.y},
        {x: e.x + e.width, y: e.y + e.height},
        {x: e.x + e.width, y: e.y},
        {x: e.x, y: e.y + e.height}
      ])
    }
  }, [selectedFloor, canvasState, index])

  return (
    <>
      <Rect 
        ref={rectRef}
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        stroke="black"
        strokeWidth={element.strokeWidth}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.3}
        draggable={activeTool == "default" ? true : false}
        onDragEnd={handleDragEnd}
        onClick={() => {
          setSelectedElement({
            id: rectRef.current._id,
            type: "rectangle",
            indexOfElements: index,
            floor: selectedFloor
          })
        }}
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

export const mouseDownRect = (e, canvasState, canvasDispatch, selectedFloor, setSelectedElement, addElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const rectObject = {
    type: "rectangle",
    x: pos.x,
    y: pos.y,
    width: 0,
    height: 0,
    strokeWidth: 10
  }
  const dispatchObj = {
    element: rectObject,
    floor: selectedFloor,
    indexOfElements: canvasState[selectedFloor].elements.length,
  }
  canvasDispatch(addElement(dispatchObj))
  setSelectedElement({
    type: "rectangle",
    indexOfElements: canvasState[selectedFloor].elements.length,
  })
}

export const mouseMoveRect = (e, canvasDispatch, selectedFloor, selectedElement, movePoint) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const dispatchObj = {
    type: "rectangle",
    floor: selectedFloor,
    indexOfElements: selectedElement.indexOfElements,
    point: pos,
    index: 1
  }
  canvasDispatch(movePoint(dispatchObj))
}