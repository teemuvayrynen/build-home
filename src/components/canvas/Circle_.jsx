import React, { useContext, useState, useRef } from "react"
import { Circle } from "react-konva"
import { CanvasContext } from "../../context/canvasContext.jsx"
import { useAppDispatch } from "@/redux/hooks";
import { movePoint } from "../../redux/features/canvasSlice"
import * as math from "../../functions/math.js"


export default function Circle_ ({ element, index, point, drawing, type, dragging }) {
  const canvasDispatch = useAppDispatch()
  const oldDim = useRef({ x: 0, y: 0 })
  const { activeTool, selectedFloor, setSelectedElement } = useContext(CanvasContext)
  const [visible, setVisible] = useState(false)

  const getAngle = () => {
    let angle = -1
    if (index !== element.points.length - 1) {
      angle = math.findLineAngle({
        x: element.x + element.points[index].x,
        y: element.y + element.points[index].y
      },
      {
        x: element.x + element.points[index + 1].x,
        y: element.y + element.points[index + 1].y
      })
    } else {
      angle = math.findLineAngle({
        x: element.x + element.points[index - 1].x,
        y: element.y + element.points[index - 1].y
      },
      {
        x: element.x + element.points[index].x,
        y: element.y + element.points[index].y
      })
    }
    return angle
  }

  const handleDrag = (e) => {
    if (!dragging[0]) return
    const angle = getAngle()
    const pos = e.target.getStage().getRelativePointerPosition()

    if (angle === 90 || angle === 0) {
      if (math.lengthBetweenPoints(point, pos) < 10) return 
    }
    
    const dispatchObj = {
      id: element.id,
      type,
      floor: selectedFloor,
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
        radius={8}
        fill="black"
        draggable={activeTool === "default" ? true : false}
        onDragStart={() => {
          if (type === "rectangle") {
            oldDim.current = {
              x: element.width + element.x,
              y: element.height + element.y
            }
          }
          setSelectedElement({
            id: element.id,
            type: type,
            index: index,
          })
          dragging[1](true)
        }}
        onMouseUp={() => { dragging[1](false); setSelectedElement(null) }}
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