import React, { useContext, useState } from "react"
import { Circle } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"


export default function Circle_ ({ index, indexOfElements, point, drawing, type, dragging }) {
  const { activeTool, levelState, levelDispatch, currentLevel, setCurrentElement } = useContext(CanvasContext)
  const [visible, setVisible] = useState(false)

  const handleDrag = (e) => {
    if (!dragging[0]) return
    const pos = e.target.getStage().getRelativePointerPosition();
    if (type === "rectangle") {
      if (index === 0 || index === 1) {
        levelDispatch({
          type: "MOVE_POINT",
          index: index,
          indexOfElements: indexOfElements,
          newPos: pos,
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
      } else if (index === 2) {
        const element = levelState[currentLevel].elements[indexOfElements]
        levelDispatch({
          type: "MOVE_POINT",
          index: 0,
          indexOfElements: indexOfElements,
          newPos: {x: pos.x, y: element.points[0].y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
        levelDispatch({
          type: "MOVE_POINT",
          index: 1,
          indexOfElements: indexOfElements,
          newPos: {x: element.points[1].x, y: pos.y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
      } else if (index === 3) {
        const element = levelState[currentLevel].elements[indexOfElements]
        levelDispatch({
          type: "MOVE_POINT",
          index: 0,
          indexOfElements: indexOfElements,
          newPos: {x: element.points[0].x, y: pos.y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
        levelDispatch({
          type: "MOVE_POINT",
          index: 1,
          indexOfElements: indexOfElements,
          newPos: {x: pos.x, y: element.points[1].y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
      }
    } else if (type === "line") {
      levelDispatch({
        type: "MOVE_POINT",
        index: index,
        indexOfElements: indexOfElements,
        newPos: pos,
        currentLevel: currentLevel,
        lineType: "line"
      })
    }
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