import React, { useContext } from "react"
import { Line, Group, Shape } from "react-konva"
import { CanvasContext } from "../../context/canvasContext.jsx"
import * as math from "../../functions/math"
import Circle_ from "./Circle_.jsx"
import { useAppDispatch } from "@/redux/hooks";
import { moveElement, divideLine, addHistory } from "../../redux/features/canvasSlice"
import { v4 as uuidv4 } from 'uuid';

export default function Line_({element, points, drawing, dragging}) {
  const canvasDispatch = useAppDispatch()
  const { activeTool, selectedFloor, setSelectedElement, selectedElement, setContextMenuObj } = useContext(CanvasContext)

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      id: element.id,
      floor: selectedFloor,
      point: pos
    }))
  }

  const handleClick = (e) => {
    if (activeTool === "divide") {
      const stage = e.target.getStage()
      const pos = stage.getRelativePointerPosition()
      const p = {
        x: pos.x - element.x,
        y: pos.y - element.y
      }
      if (element.points.length === 2) {
        canvasDispatch(divideLine({
          id: element.id,
          floor: selectedFloor,
          point: p,
          index: 1
        }))
        canvasDispatch(addHistory({
          id: element.id,
          type: "addPoint",
          floor: selectedFloor,
          index: 1
        }))
      } else {
        for (let i = 0; i < element.points.length; ++i) {
          if (i <= element.points.length - 2) {
            const p1 = {
              x: element.points[i].x + element.x,
              y: element.points[i].y + element.y
            }
            const p2 = {
              x: element.points[i + 1].x + element.x,
              y: element.points[i + 1].y + element.y
            }
            const l = math.lengthBetweenPoints(p1, p2)
            const l1 = math.lengthBetweenPoints(pos, p1)
            const l2 = math.lengthBetweenPoints(pos, p2)
            if (Math.abs(l1 + l2 - l) < 5) {
              canvasDispatch(divideLine({
                id: element.id,
                floor: selectedFloor,
                point: p,
                index: i + 1
              }))
              canvasDispatch(addHistory({
                id: element.id,
                type: "addPoint",
                floor: selectedFloor,
                index: i + 1
              }))
              break
            }
          }
        }
        if (element.closed) {
          const p1 = {
            x: element.points[element.points.length - 1].x + element.x,
            y: element.points[element.points.length - 1].y + element.y
          }
          const p2 = {
            x: element.points[0].x + element.x,
            y: element.points[0].y + element.y
          }
          const l = math.lengthBetweenPoints(p1, p2)
          const l1 = math.lengthBetweenPoints(pos, p1)
          const l2 = math.lengthBetweenPoints(pos, p2)
          if (Math.abs(l1 + l2 - l) < 5) {
            canvasDispatch(divideLine({
              id: element.id,
              floor: selectedFloor,
              point: p,
              index: element.points.length
            }))
            canvasDispatch(addHistory({
              id: element.id,
              type: "addPoint",
              floor: selectedFloor,
              index: element.points.length
            }))
          }
        }
      }
    } else if (activeTool === "default") {
      if (!drawing && !dragging[0]) {
        setSelectedElement({
          id: element.id,
          type: "line",
          floor: selectedFloor
        })
      }
      if (e.evt.button === 2) {
        setContextMenuObj({
          id: element.id,
          x: e.evt.clientX,
          y: e.evt.clientY,
          floor: selectedFloor
        })
      } 
    }
  }
  

  return (
    <Group>
      <Shape 
        sceneFunc={(context, shape) => {
          context.beginPath()
          context.moveTo(element.x, element.y)
          
          for (let i = 1; i < element.points.length; i++) {
            const point = element.points[i]
            if (point.bezier) {
              
            } else {
              context.lineTo(element.x + point.x, element.y + point.y)
            }
            
          }
          context.stroke()

          if (element.closed) {
            context.closePath()
          }
          context.fillStrokeShape(shape)
        }}
        stroke={!drawing && !dragging[0] && selectedElement && selectedElement.id === element.id ? "#00B3FF" : "black"}
        strokeWidth={element.strokeWidth}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.3}
        draggable={activeTool == "default" ? true : false}
        onDragEnd={handleDragEnd}
        hitStrokeWidth={10}
        onClick={handleClick}
      />
      {element.points.map((point, i) => {
        const temp = {
          x: point.x + element.x,
          y: point.y + element.y
        }
        return (
          <Circle_ 
            key={i}
            element={element}
            index={i}
            point={temp}
            drawing={drawing}
            type="line"
            dragging={dragging}
          />
        )
      })}
    </Group>
  )
}


export const mouseDownLine = (e, canvasState, canvasDispatch, selectedFloor, setSelectedElement, addElement, addPoint) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const elements = canvasState[selectedFloor].elements

  for (const key in elements) {
    const element = elements[key]
    if (element.type !== "line") continue
    const j = element.points.findIndex(e => {
      const p = {
        x: e.x + element.x,
        y: e.y + element.y
      }
      return math.lengthBetweenPoints(p, pos) <= 10
    })
    if (j > -1) {
      const row = j === 0 ? 0 : j + 1
      if (row === 0 || row === element.points.length) {
        const dispatchObj = {
          id: element.id,
          floor: selectedFloor,
          index: row,
          point: pos
        }
        canvasDispatch(addPoint(dispatchObj))
        setSelectedElement({
          id: element.id,
          type: "line",
          index: row
        })
        return
      }
    }
  }
  
  const lineObject = {
    id: uuidv4(),
    type: "line",
    closed: false,
    points: [{x: 0, y: 0, bezier: false}, {x: 0, y: 0, bezier: false}],
    x: pos.x,
    y: pos.y,
    strokeWidth: 10,
    originalX: pos.x,
    originalY: pos.y
  }
  const dispatchObj = {
    id: lineObject.id,
    element: lineObject,
    floor: selectedFloor,
  }

  canvasDispatch(addElement(dispatchObj))
  setSelectedElement({
    id: lineObject.id,
    type: "line",
    index: 1
  })
}

export const mouseMoveLine = (e, canvasDispatch, selectedFloor, selectedElement, movePoint) => {
  const pos = e.target.getStage().getRelativePointerPosition()
  const dispatchObj = {
    id: selectedElement.id,
    type: "line",
    point: pos,
    floor: selectedFloor,
    index: selectedElement.index,
  }
  canvasDispatch(movePoint(dispatchObj))
}

export const checkIsNearEndOfLine = (canvasState, canvasDispatch, selectedFloor, selectedElement, closedElement) => {
  if (Object.keys(canvasState[selectedFloor].elements).length === 0 || !selectedElement) return false
  const element = canvasState[selectedFloor].elements[selectedElement.id]
  if (element.points.length > 3) {
    const pos0 = {
      x: element.x + element.points[0].x,
      y: element.y + element.points[0].y
    }
    const pos1 = {
      x: element.x + element.points[element.points.length - 1].x,
      y: element.y + element.points[element.points.length - 1].y
    }
    if (math.lengthBetweenPoints(pos0, pos1) <= 10) {
      const dispatchObj = {
        id: selectedElement.id,
        floor: selectedFloor,
        index: selectedElement.index
      }
      canvasDispatch(closedElement(dispatchObj))
      return true
    }
  }
  return false

}