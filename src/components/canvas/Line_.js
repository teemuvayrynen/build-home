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

  const handleClick = (e) => {
    if (activeTool === "divide") {
      const stage = e.target.getStage()
      const pos = stage.getRelativePointerPosition()
      const p = {
        x: pos.x - element.x,
        y: pos.y - element.y
      }

      if (element.points.length === 2) {
       levelDispatch({
          type: "DIVIDE_LINE",
          indexOfElements: index,
          currentLevel: currentLevel,
          pos: p,
          index: 0
       })
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
            console.log(l1 + l2)
            console.log(l)
            if (Math.abs(l1 + l2 - l) < 5) {
              levelDispatch({
                type: "DIVIDE_LINE",
                indexOfElements: index,
                currentLevel: currentLevel,
                pos: p,
                index: i
             })
              break
            }
          }
        }
      }
      
      // for (let i = 0; i < element.points.length; ++i) {
      //   const p1 = {
      //     x: element.points[i].x + element.x,
      //     y: element.points[i].y + element.y
      //   }
      //   const l = math.lengthBetweenPoints(p, p1)
        
      // }

      // levelDispatch({
      //   type: "DIVIDE_LINE",

      // })

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
    type: "MOVE_POINT",
    newPos: { x: pos.x, y: pos.y },
    currentLevel: currentLevel,
    index: latest[0].row,
    lineType: "line",
    indexOfElements: latest[0].index
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