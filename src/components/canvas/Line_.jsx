import React, { useContext } from "react"
import { Line, Group } from "react-konva"
import { CanvasContext } from "../../context/canvasContext.jsx"
import * as math from "../../functions/math"
import Circle_ from "./Circle_.jsx"
import { useAppDispatch } from "@/redux/hooks";
import { moveElement, divideLine, addHistory } from "../../redux/features/canvasSlice"

export default function Line_({index, element, points, drawing, dragging}) {
  const canvasDispatch = useAppDispatch()
  const { activeTool, selectedFloor } = useContext(CanvasContext)

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      floor: selectedFloor,
      indexOfElements: index,
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
          floor: selectedFloor,
          indexOfElements: index,
          point: p,
          index: 1
        }))
        canvasDispatch(addHistory({
          type: "addPoint",
          floor: selectedFloor,
          indexOfElements: index,
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
                floor: selectedFloor,
                indexOfElements: index,
                point: p,
                index: i + 1
              }))
              canvasDispatch(addHistory({
                type: "addPoint",
                floor: selectedFloor,
                indexOfElements: index,
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
              floor: selectedFloor,
              indexOfElements: index,
              point: p,
              index: element.points.length
            }))
            canvasDispatch(addHistory({
              type: "addPoint",
              floor: selectedFloor,
              indexOfElements: index,
              index: element.points.length
            }))
          }
        }
      }
    }

  }

  return (
    <>
      <Group>
        <Line
          x={element.x}
          y={element.y}
          points={points}
          stroke="black"
          strokeWidth={10}
          shadowColor="grey"
          shadowBlur={4}
          shadowOffset={{ x: 2, y: 1 }}
          shadowOpacity={0.3}
          closed={element.closed}
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
            <>
              <Circle_ 
                index={i}
                indexOfElements={index}
                point={temp}
                drawing={drawing}
                type="line"
                dragging={dragging}
              />
            </>
          )
        })}
      </Group>
    </>
  )
}


export const mouseDownLine = (e, canvasState, canvasDispatch, selectedFloor, setSelectedElement, addElement, addPoint) => {
  const pos = e.target.getStage().getRelativePointerPosition();

  const elements = canvasState[selectedFloor].elements
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
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
          floor: selectedFloor,
          indexOfElements: i,
          index: row,
          point: pos
        }
        canvasDispatch(addPoint(dispatchObj))
        setSelectedElement({
          type: "line",
          indexOfElements: i,
          index: row
        })
        return
      }
    }
  }
  const lineObject = {
    type: "line",
    closed: false,
    points: [{x: 0, y: 0}, {x: 0, y: 0}],
    x: pos.x,
    y: pos.y,
  }
  const dispatchObj = {
    element: lineObject,
    floor: selectedFloor,
    indexOfElements: canvasState[selectedFloor].elements.length,
    index: 1
  }

  canvasDispatch(addElement(dispatchObj))
  setSelectedElement({
    type: "line",
    indexOfElements: canvasState[selectedFloor].elements.length,
    index: 1
  })
}

export const mouseMoveLine = (e, canvasDispatch, selectedFloor, selectedElement, movePoint) => {
  const pos = e.target.getStage().getRelativePointerPosition()
  const dispatchObj = {
    type: "line",
    point: pos,
    floor: selectedFloor,
    index: selectedElement.index,
    indexOfElements: selectedElement.indexOfElements
  }
  canvasDispatch(movePoint(dispatchObj))
}

export const checkIsNearEndOfLine = (canvasState, canvasDispatch, selectedFloor, selectedElement, closedElement) => {
  if (canvasState[selectedFloor].elements.length === 0 || !selectedElement) return false
  const element = canvasState[selectedFloor].elements[selectedElement.indexOfElements]
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
        floor: selectedFloor,
        indexOfElements: selectedElement.indexOfElements,
        index: selectedElement.index
      }
      canvasDispatch(closedElement(dispatchObj))
      return true
    }
  }
  return false

}