import React, { useContext, useState } from "react"
import { Circle } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"


export default function Circle_ ({ index, indexOfElements, point, drag, setDrag, drawing, type }) {
  const { activeTool, levelState, levelDispatch, currentLevel, setCurrentElement } = useContext(CanvasContext)
  const [visible, setVisible] = useState(false)

  const handleDrag = (e) => {
    if (!drag) return
    const pos = e.target.getStage().getRelativePointerPosition();
    if (type === "rectangle") {
      if (index === 0 || index === 1) {
        levelDispatch({
          type: "UPDATE_POS_DRAG_CIRCLE",
          index: index,
          indexOfElements: indexOfElements,
          pos: pos,
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
      } else if (index === 2) {
        const element = levelState[currentLevel].elements[indexOfElements]
        levelDispatch({
          type: "UPDATE_POS_DRAG_CIRCLE",
          index: 0,
          indexOfElements: indexOfElements,
          pos: {x: pos.x, y: element.points[0].y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
        levelDispatch({
          type: "UPDATE_POS_DRAG_CIRCLE",
          index: 1,
          indexOfElements: indexOfElements,
          pos: {x: element.points[1].x, y: pos.y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
      } else if (index === 3) {
        const element = levelState[currentLevel].elements[indexOfElements]
        levelDispatch({
          type: "UPDATE_POS_DRAG_CIRCLE",
          index: 0,
          indexOfElements: indexOfElements,
          pos: {x: element.points[0].x, y: pos.y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
        levelDispatch({
          type: "UPDATE_POS_DRAG_CIRCLE",
          index: 1,
          indexOfElements: indexOfElements,
          pos: {x: pos.x, y: element.points[1].y},
          currentLevel: currentLevel,
          lineType: "rectangle"
        })
      }
    } else if (type === "line") {
      levelDispatch({
        type: "UPDATE_POS_DRAG_CIRCLE",
        index: index,
        indexOfElements: indexOfElements,
        pos: pos,
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
        draggable={activeTool == 0 ? true : false}
        onDragStart={() => {
          setCurrentElement({
            type: type,
            indexOfElements: indexOfElements,
            index: index,
          })
          setDrag(true)
        }}
        onMouseUp={() => { setDrag(false); setCurrentElement(null) }}
        onDragMove={handleDrag}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.5}
        hitStrokeWidth={10}
        onMouseOver={() => { setVisible(true) }}
        onMouseOut={() => { setVisible(false)}}
        opacity={visible && !drawing && !drag ? 1 : 0}
      />
    </>
  )
}