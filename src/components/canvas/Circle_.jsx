import React, { useContext, useState, useRef } from "react"
import { Circle } from "react-konva"
import { CanvasContext } from "../../context/canvasContext.jsx"
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { movePoint } from "../../redux/features/canvasSlice"


export default function Circle_ ({ element, index, indexOfElements, point, drawing, type, dragging }) {
  const canvasDispatch = useAppDispatch()
  const oldDim = useRef({ x: 0, y: 0 })
  const { activeTool, currentLevel, setCurrentElement } = useContext(CanvasContext)
  const [visible, setVisible] = useState(false)

  const handleDrag = (e) => {
    if (!dragging[0]) return
    const pos = e.target.getStage().getRelativePointerPosition()
    const dispatchObj = {
      type,
      currentLevel: currentLevel,
      indexOfElements: indexOfElements,
      index: index,
      point: pos,
      oldDim: oldDim.current
    }
    canvasDispatch(movePoint(dispatchObj))
    e.target.getLayer().batchDraw()
  }

  return (
    <>
      <Circle 
        x={point.x}
        y={point.y}
        radius={7}
        fill="black"
        draggable={activeTool === "default" ? true : false}
        onDragStart={() => {
          if (type === "rectangle") {
            oldDim.current = {
              x: element.width + element.x,
              y: element.height + element.y
            }
          }
          setCurrentElement({
            type: type,
            indexOfElements: indexOfElements,
            index: index,
          })
          dragging[1](true)
        }}
        onMouseUp={() => { dragging[1](false); setCurrentElement(null) }}
        onDragMove={handleDrag}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.5}
        hitStrokeWidth={10}
        onMouseOver={() => { setVisible(true) }}
        onMouseOut={() => { setVisible(false)}}
        opacity={visible && !drawing && !dragging[0] ? 1 : 0}
      />
    </>
  )
}