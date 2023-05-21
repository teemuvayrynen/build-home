import React, { useContext, useState } from "react"
import { Circle } from "react-konva"
import { CanvasContext } from "../../context/canvasContext"


export default function Circle_ ({ index, indexOfElements, element, drag, setDrag, drawing, type }) {
  const { elements, setElements, activeTool } = useContext(CanvasContext)
  const [visible, setVisible] = useState(false)

  const handleDrag = (e, index, indexOfElements) => {
    if (!drag) return
    const pos = e.target.getStage().getRelativePointerPosition();
    const elementsCopy = [...elements]
    if (type === "line" || (type === "rect" && (index === 0 || index === 1))) {
      elementsCopy[indexOfElements].points[index] = {x: pos.x, y: pos.y}
    } else if (type === "rect") {
      const pos = e.target.getStage().getRelativePointerPosition();
      const elementsCopy = [...elements]
      if (index === 2) {
        elementsCopy[indexOfElements].points[0] = {x: pos.x, y: elementsCopy[indexOfElements].points[0].y}
        elementsCopy[indexOfElements].points[1] = {x: elementsCopy[indexOfElements].points[1].x, y: pos.y}
      } else if (index === 3) {
        elementsCopy[indexOfElements].points[0] = {x: elementsCopy[indexOfElements].points[0].x, y: pos.y}
        elementsCopy[indexOfElements].points[1] = {x: pos.x, y: elementsCopy[indexOfElements].points[1].y}
      }
    }
    setElements(elementsCopy)
  }

  return (
    <>
      <Circle 
        x={element.x}
        y={element.y}
        radius={7}
        fill="black"
        draggable={activeTool == 0 ? true : false}
        onDragStart={() => { setDrag(true) }}
        onDragEnd={() => {  setDrag(false) }}
        onDragMove={(e) => { handleDrag(e, index, indexOfElements) }}
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