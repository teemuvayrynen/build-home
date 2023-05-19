import React, { useState, useContext, useEffect } from "react"
import {Circle, Line, Group} from "react-konva"
import { CanvasContext } from "../../context/canvasContext"


export default function Line_({index, element, stageMoving }) {
  const [dragSingle, setDragSingle] = useState(false)
  const [dragAll, setDragAll] = useState(false)
  const [points, setPoints] = useState([])

  useEffect(() => {
    const temp = []
    element.points.forEach(e => {
      temp.push(e.x)
      temp.push(e.y)
    })
    setPoints(temp)
  }, [element.points, points])

  const {elements, setElements, activeTool } = useContext(CanvasContext)

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