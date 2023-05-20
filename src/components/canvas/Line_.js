import React, { useState, useContext, useEffect } from "react"
import {Circle, Line, Group} from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import * as math from "../../functions/math"

export default function Line_({index, element, points, stageMoving, dragLine, setDragLine, drawing }) {
  const {elements, setElements, activeTool } = useContext(CanvasContext)

  return (
    <>
      <Group
        onMouseEnter={e => {
          if (activeTool == 0) {
            const container = e.target.getStage().container();
            container.style.cursor = "pointer";
          }
        }}
        onMouseLeave={e => {
          if (activeTool == 0) {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
          }
        }}
      >
        <Line
          points={points}
          stroke="black"
          strokeWidth={7}
          shadowColor="grey"
          shadowBlur={4}
          shadowOffset={{ x: 2, y: 1 }}
          shadowOpacity={0.3}
          // draggable={activeTool == 0 ? true : false}
          // onDragStart={() => { setDragAll(true) }}
          // onDragEnd={() => { setDragAll(false) }}
          // onDragMove={(e) => { handleDragAll(e, index) }}
          hitStrokeWidth={10}
        />
        {element.points.map((e, i) => {
          return (
            <>
              <Circles 
                index={i}
                indexOfElements={index}
                element={e} 
                dragLine={dragLine}
                setDragLine={setDragLine}
                drawing={drawing}
              />
            </>
          )
        })}
      </Group>
    </>
  )
}

const Circles = ({ index, indexOfElements, element, dragLine, setDragLine, drawing }) => {
  const { elements, setElements, activeTool } = useContext(CanvasContext)
  const [visible, setVisible] = useState(false)

  const handleDrag = (e, index, indexOfElements) => {
    if (!dragLine) return
    const pos = e.target.getStage().getRelativePointerPosition();
    const elementsCopy = [...elements]
    elementsCopy[indexOfElements].points[index] = {x: pos.x, y: pos.y}
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
        onDragStart={() => { setDragLine(true) }}
        onDragEnd={() => {  setDragLine(false) }}
        onDragMove={(e) => { handleDrag(e, index, indexOfElements) }}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.5}
        hitStrokeWidth={10}
        onMouseOver={() => { setVisible(true) }}
        onMouseOut={() => { setVisible(false)}}
        opacity={visible && !drawing ? 1 : 0}
      />
    </>
  )
}

export const mouseDownLine = (e, elements, setElements, setLatestElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const lineObject = {
    type: "line",
    points: []
  }
  if (elements.length > 0) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const j = element.points.findIndex(e => math.lengthBetweenPoints(e, pos) <= 5)
      if (j > -1) {
        const elementsCopy = [...elements]
        if (element.points.length - 1 == j) {
          elementsCopy[i].points.push({x: pos.x, y: pos.y})
          setElements(elementsCopy)
          setLatestElement(prevState => [...prevState, {index: i, row: j + 1}])
          return
        } else if (j == 0) {
          elementsCopy[i].points.unshift({x: pos.x, y: pos.y})
          setElements(elementsCopy)
          setLatestElement(prevState => [...prevState, {index: i, row: j}])
          return
        }
      }
    }
  }
  lineObject.points = [
    {x: pos.x, y: pos.y},
    {x: pos.x, y: pos.y}
  ]
  setElements(prevState => [...prevState, lineObject])
  setLatestElement(prevState => [...prevState, {index: elements.length, row: 1}])
}

export const mouseMoveLine = (e, elements, setElements, latestElement) => {
  const pos = e.target.getStage().getRelativePointerPosition();
  const elementsCopy = [...elements];
  const lastIndex = latestElement.length - 1
  if (latestElement.length > 0) {
    if (latestElement[lastIndex].row == 0) {
      elementsCopy[latestElement[lastIndex].index].points[0] = { x: pos.x, y: pos.y }
      setElements(elementsCopy)
      return
    } else if (latestElement[lastIndex].row == elementsCopy[latestElement[lastIndex].index].points.length - 1) {
      elementsCopy[latestElement[lastIndex].index].points[latestElement[lastIndex].row] = { x: pos.x, y: pos.y }
      setElements(elementsCopy)
      return
    }
  }
  const index = elements.length - 1;
  elementsCopy[index].points[1] = { x: pos.x, y: pos.y }
  setElements(elementsCopy)
}