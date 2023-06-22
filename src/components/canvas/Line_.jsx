import React, { useContext, useRef } from "react"
import { Line, Group, Shape } from "react-konva"
import { CanvasContext } from "../../context/canvasContext.jsx"
import * as math from "../../functions/math"
import Circle_ from "./Circle_.jsx"
import { useAppDispatch } from "@/redux/hooks";
import { moveElement, divideLine, addHistory } from "../../redux/features/canvasSlice"
import { v4 as uuidv4 } from 'uuid';

export default function Line_({element, drawing, dragging}) {
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
    const stage = e.target.getStage()
    const pos = stage.getRelativePointerPosition()
    if (activeTool === "divide") {
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
        let index = math.getLine(element, pos)
        if (index === -1) return
        canvasDispatch(divideLine({
          id: element.id,
          floor: selectedFloor,
          point: p,
          index: index + 1
        }))
        canvasDispatch(addHistory({
          id: element.id,
          type: "addPoint",
          floor: selectedFloor,
          index: index + 1
        }))
      }
    } else if (activeTool === "default") {
      if (dragging[0] || drawing) return
      let index = math.getLine(element, pos)
      let arr = []
      if (e.evt.button === 2) {
        setContextMenuObj({
          id: element.id,
          x: e.evt.clientX,
          y: e.evt.clientY,
          floor: selectedFloor
        })
        if (!selectedElement) {
          if (index === -1 ) {
            arr = [...Array(element.points.length).keys()]
          } else {
            arr.push(index)
          }
          setSelectedElement({
            id: element.id,
            type: "line",
            floor: selectedFloor,
            indexes: arr.sort()
          })
        }
      } else {
        if (index === -1 ) {
          arr = [...Array(element.points.length).keys()]
        } else if (index !== -1 && !e.evt.shiftKey) {
          arr.push(index)
        } else if (index !== -1 && e.evt.shiftKey) {
          if (selectedElement) {
            if (selectedElement.indexes.length !== element.points.length) {
              arr = selectedElement.indexes
            }
            if (!selectedElement.indexes.includes(index)) {
              arr.push(index)
            }
          } else {
            arr.push(index)
          }
        }
        setSelectedElement({
          id: element.id,
          type: "line",
          floor: selectedFloor,
          indexes: arr.sort()
        })
      }
    }
  }

  return (
    <Group>
      <Shape 
        x={element.x}
        y={element.y}
        sceneFunc={(context, shape) => {
          context.beginPath()
          context.moveTo(element.points[0].x, element.points[0].y)
          
          for (let i = 1; i < element.points.length; i++) {
            const point = element.points[i]
            if (point.bezier) {
              
            } else {
              context.lineTo(point.x, point.y)
            }
          }

          if (element.closed) {
            context.closePath()
          }
          context.fillStrokeShape(shape)
        }}
        stroke={"black"}
        strokeWidth={element.strokeWidth}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.3}
        draggable={activeTool === "default" && !element.locked ? true : false}
        onDragStart={() => {
          setSelectedElement(null)
        }}
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
    group: null,
    locked: false
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