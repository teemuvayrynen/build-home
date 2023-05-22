import React, { useContext } from "react"
import { Line, Group } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import * as math from "../../functions/math"
import Circle_ from "./Circle_"

export default function Line_({index, element, points, dragLine, setDragLine, drawing }) {
  const { activeTool, levelDispatch, currentLevel } = useContext(CanvasContext)

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    
    levelDispatch({
      type: "UPDATE_POS_DRAG_LINE",
      index: index,
      pos: pos,
      currentLevel: currentLevel,
    })
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
          draggable={activeTool == 0 ? true : false}
          onDragEnd={handleDragEnd}
          hitStrokeWidth={10}
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
                drag={dragLine}
                setDrag={setDragLine}
                drawing={drawing}
                type="line"
              />
            </>
          )
        })}
      </Group>
    </>
  )
}


export const mouseDownLine = (e, levelState, levelDispatch, currentLevel, setCurrentElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();

  const elements = levelState[currentLevel].elements
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
        levelDispatch({
          type: "CONCAT_POINTS",
          indexOfElements: i,
          currentLevel: currentLevel,
          pos: pos,
          row: row
        })
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
  
  levelDispatch({
    type: "ADD_ELEMENT_BASE",
    element: lineObject,
    latestElement: {index: levelState[currentLevel].elements.length, row: 1},
    currentLevel: currentLevel
  })
  setCurrentElement({
    type: "line",
    indexOfElements: levelState[currentLevel].elements.length,
    index: 1
  })
}

export const mouseMoveLine = (e, levelState, levelDispatch, currentLevel) => {
  const pos = e.target.getStage().getRelativePointerPosition()
  const latest = levelState[currentLevel].latestElements.slice(-1)

  levelDispatch({
    type: "MOVE_LATEST_POINT",
    newPos: { x: pos.x, y: pos.y },
    currentLevel: currentLevel,
    index: latest[0].row,
    lineType: "line"

  })
}

export const mouseUpLine = (levelState, levelDispatch, currentLevel) => {
  const latest = levelState[currentLevel].latestElements.slice(-1)
  const element = levelState[currentLevel].elements[latest[0].index]
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
      levelDispatch({
        type: "CREATE_CLOSED_ELEMENT",
        currentLevel: currentLevel,
        indexOfElements: latest[0].index,
        index: latest[0].row
      })
    }
  }

}