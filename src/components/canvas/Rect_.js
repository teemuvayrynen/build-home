import React, { useContext, useEffect, useState } from "react";
import { Rect } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import Circle_ from "./Circle_";

export default function Rect_ ({index, points, setDragRect, dragRect, drawing}) {
  const {activeTool, levelState, levelDispatch, currentLevel } = useContext(CanvasContext)
  const [modifiedPoints, setModifiedPoints] = useState([])

  const handleDragEnd = (e) => {
    const pos = e.target.position()
    const tempPoints = levelState[currentLevel].elements[index].points
    const width = tempPoints[1].x - tempPoints[0].x
    const height = tempPoints[1].y - tempPoints[0].y
    const pos1 = {x: pos.x + width, y: pos.y + height}

    levelDispatch({
      type: "UPDATE_POS_DRAG_RECT",
      index: index,
      pos: pos,
      pos1: pos1,
      currentLevel: currentLevel
    })
  }

  useEffect(() => {
    if (levelState[currentLevel].elements[index]) {
      const p = levelState[currentLevel].elements[index].points
      setModifiedPoints([...p, {x: p[0].x, y: p[1].y}, {x: p[1].x, y: p[0].y}])
    }
  }, [currentLevel, levelState, index])

  return (
    <>
      <Rect 
        x={points[0].x}
        y={points[0].y}
        width={points[1].x - points[0].x}
        height={points[1].y - points[0].y}
        stroke="black"
        strokeWidth={7}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.3}
        draggable={activeTool == 0 ? true : false}
        onDragEnd={handleDragEnd}
      />
      {modifiedPoints.map((point, i) => {
        return (
          <>
            <Circle_
              index={i}
              indexOfElements={index}
              point={point} 
              drag={dragRect}
              setDrag={setDragRect}
              drawing={drawing}
              type="rectangle"
            />
          </>
        )
      })}
    </>
  )
}

export const mouseDownRect = (e, levelState, levelDispatch, currentLevel, setCurrentElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const lineObject = {
    type: "rectangle",
    points: [],
  }

  lineObject.points = [
    {x: pos.x, y: pos.y},
    {x: pos.x, y: pos.y}
  ]

  levelDispatch({
    type: "ADD_ELEMENT_BASE",
    element: lineObject,
    latestElement: {index: levelState[currentLevel].elements.length, row: 1},
    currentLevel: currentLevel
  })
  setCurrentElement({
    type: "rectangle",
    indexOfElements: levelState[currentLevel].elements.length,
    index: 1
  })
}

export const mouseMoveRect = (e, levelDispatch, currentLevel) => {
  const pos = e.target.getStage().getRelativePointerPosition();

  levelDispatch({
    type: "MOVE_LATEST_POINT",
    newPos: { x: pos.x, y: pos.y },
    currentLevel: currentLevel,
    lineType: "rectangle",
    index: 1
  })
}