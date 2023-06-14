import React, { useContext, useEffect, useState, useRef } from "react";
import { Rect } from "react-konva"
import { CanvasContext } from "../../context/canvasContext.jsx"
import Circle_ from "./Circle_.jsx";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { moveElement } from "../../redux/features/canvasSlice"
import { v4 as uuidv4 } from 'uuid';

export default function Rect_ ({ element, drawing, dragging}) {
  const canvasState = useAppSelector(state => state.canvas.items)
  const canvasDispatch = useAppDispatch()
  const {activeTool, selectedFloor, setSelectedElement, selectedElement } = useContext(CanvasContext)
  const [modifiedPoints, setModifiedPoints] = useState([])

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      id: element.id,
      floor: selectedFloor,
      point: pos
    }))
  }

  useEffect(() => {
    if (canvasState[selectedFloor] && canvasState[selectedFloor].elements[element.id]) {
      const e = canvasState[selectedFloor].elements[element.id]
      setModifiedPoints([
        {x: e.x, y: e.y},
        {x: e.x + e.width, y: e.y + e.height},
        {x: e.x + e.width, y: e.y},
        {x: e.x, y: e.y + e.height}
      ])
    }
  }, [selectedFloor, canvasState, element])

  return (
    <>
      <Rect 
        x={element.x}
        y={element.y}
        width={element.width}
        height={element.height}
        stroke={!drawing && !dragging[0] && selectedElement && selectedElement.id === element.id ? "#00B3FF" : "black"}
        strokeWidth={element.strokeWidth}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.3}
        draggable={activeTool == "default" ? true : false}
        onDragEnd={handleDragEnd}
        onClick={() => {
          setSelectedElement({
            id: element.id,
            type: "rectangle",
            floor: selectedFloor
          })
        }}
      />
      {modifiedPoints.map((point, i) => {
        return (
          <Circle_
            key={i}
            element={element}
            index={i}
            point={point} 
            drawing={drawing}
            type="rectangle"
            dragging={dragging}
          />
        )
      })}
    </>
  )
}

export const mouseDownRect = (e, canvasDispatch, selectedFloor, setSelectedElement, addElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const rectObject = {
    id: uuidv4(),
    type: "rectangle",
    x: pos.x,
    y: pos.y,
    width: 0,
    height: 0,
    strokeWidth: 10,
    generated: false,
  }
  const dispatchObj = {
    id: rectObject.id,
    element: rectObject,
    floor: selectedFloor,
  }
  canvasDispatch(addElement(dispatchObj))
  setSelectedElement({
    id: rectObject.id,
    type: "rectangle",
  })
}

export const mouseMoveRect = (e, canvasDispatch, selectedFloor, selectedElement, movePoint) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const dispatchObj = {
    id: selectedElement.id,
    type: "rectangle",
    floor: selectedFloor,
    point: pos,
    index: 1
  }
  canvasDispatch(movePoint(dispatchObj))
}