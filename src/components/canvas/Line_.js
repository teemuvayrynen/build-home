import React, { useState, useContext, useEffect } from "react"
import {Circle, Line, Group} from "react-konva"
import { CanvasContext } from "../../context/canvasContext"
import * as math from "../../functions/math"

export default function Line_({index, element, points, stageMoving }) {
  const {elements, setElements, activeTool } = useContext(CanvasContext)
  const [dragSingle, setDragSingle] = useState(false)
  const [dragAll, setDragAll] = useState(false)

  const handleDragSingle = (e, index, indexOfElements) => {
    if (!dragSingle && stageMoving) return
    const pos = e.target.getStage().getRelativePointerPosition();
    const elementsCopy = [...elements]
    elementsCopy[indexOfElements].points[index] = {x: pos.x, y: pos.y}
    setElements(elementsCopy)
  }

  const handleDragAll = (e, index) => {
    if (!dragAll) return
  }

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
          stroke="#00FFFF"
          strokeWidth={2}
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
                handleDrag={handleDragSingle} 
                setDragSingle={setDragSingle}
                activeTool={activeTool}
              />
            </>
          )
        })}
      </Group>
    </>
  )
}

const Circles = ({ index, indexOfElements, element, handleDrag, setDragSingle, activeTool }) => {
  const [size, setSize] = useState(5)
  return (
    <>
      <Circle 
        x={element.x}
        y={element.y}
        radius={size}
        fill="#00FFFF"
        draggable={activeTool == 0 ? true : false}
        onDragStart={() => { setDragSingle(true) }}
        onDragEnd={() => { setDragSingle(false) }}
        onDragMove={(e) => { handleDrag(e, index, indexOfElements) }}
        shadowColor="grey"
        shadowBlur={4}
        shadowOffset={{ x: 2, y: 1 }}
        shadowOpacity={0.5}
        hitStrokeWidth={10}
        onMouseOver={() => { setSize(7) }}
        onMouseOut={() => { setSize(5) }}
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