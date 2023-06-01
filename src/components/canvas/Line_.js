import React, { useContext } from "react"
import { Line, Group, Shape } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import * as math from "../../functions/math"
import Circle_ from "./Circle_"
import { useAppDispatch } from "@/redux/hooks";
import { moveElement, divideLine, addHistory } from "../../redux/features/canvasSlice"

export default function Line_({index, element, points, drawing, dragging}) {
  const canvasDispatch = useAppDispatch()
  const { activeTool, currentLevel } = useContext(CanvasContext)

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      currentLevel: currentLevel,
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
          currentLevel: currentLevel,
          indexOfElements: index,
          point: p,
          index: 0
        }))
        canvasDispatch(addHistory({
          type: "addPoint",
          currentLevel: currentLevel,
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
                currentLevel: currentLevel,
                indexOfElements: index,
                point: p,
                index: i
              }))
              canvasDispatch(addHistory({
                type: "addPoint",
                currentLevel: currentLevel,
                indexOfElements: index,
                index: i
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
              currentLevel: currentLevel,
              indexOfElements: index,
              point: p,
              index: element.points.length - 1
            }))
            canvasDispatch(addHistory({
              type: "addPoint",
              currentLevel: currentLevel,
              indexOfElements: index,
              index: element.points.length - 1
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
          strokeWidth={7}
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


export const mouseDownLine = (e, canvasState, canvasDispatch, currentLevel, setCurrentElement, addElement, addPoint) => {
  const pos = e.target.getStage().getRelativePointerPosition();

  const elements = canvasState[currentLevel].elements
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
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
          currentLevel: currentLevel,
          indexOfElements: i,
          index: row,
          point: pos
        }
        canvasDispatch(addPoint(dispatchObj))
        setCurrentElement({
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
    currentLevel: currentLevel,
    indexOfElements: canvasState[currentLevel].elements.length,
    index: 1
  }

  canvasDispatch(addElement(dispatchObj))
  setCurrentElement({
    type: "line",
    indexOfElements: canvasState[currentLevel].elements.length,
    index: 1
  })
}

export const mouseMoveLine = (e, canvasDispatch, currentLevel, currentElement, movePoint) => {
  const pos = e.target.getStage().getRelativePointerPosition()
  const dispatchObj = {
    type: "line",
    point: pos,
    currentLevel: currentLevel,
    index: currentElement.index,
    indexOfElements: currentElement.indexOfElements
  }
  canvasDispatch(movePoint(dispatchObj))
}

export const checkIsNearEndOfLine = (canvasState, canvasDispatch, currentLevel, currentElement, closedElement) => {
  if (canvasState[currentLevel].elements.length === 0 || !currentElement) return false
  const element = canvasState[currentLevel].elements[currentElement.indexOfElements]
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
        currentLevel: currentLevel,
        indexOfElements: currentElement.indexOfElements,
        index: currentElement.index
      }
      canvasDispatch(closedElement(dispatchObj))
      return true
    }
  }
  return false

}