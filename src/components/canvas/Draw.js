import React, { useState, useContext } from "react"
import {Circle, Line, Group} from "react-konva"
import { CanvasContext } from "../../context/canvasContext"


export default function Line_({ stageMoving }) {
  const [dragSingle, setDragSingle] = useState(false)
  const [dragAll, setDragAll] = useState(false)

  const {elements, setElements, activeTool } = useContext(CanvasContext)


  const handleDragSingle = (e, index, num) => {
    if (!dragSingle && stageMoving) return
    const pos = e.target.getStage().getRelativePointerPosition();
    const copy = [...elements]
    if (num == 0) {
      copy[index][0] = { x: pos.x, y: pos.y }
    } else if (num == 1) {
      copy[index][1] = { x: pos.x, y: pos.y }
    }
    setElements(copy)
  }

  const handleDragAll = (e, index) => {
    if (!dragAll) return
  }

  return (
    <>
      {elements.map((element, index) => {
        const points = []
        element.map((e) => {
          points.push(e.x)
          points.push(e.y)
        })
        return (
          <Group
            key={index}
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
            {element.map((e, i) => {
              return (
                <>
                  <Circles 
                    element={e} 
                    handleDrag={handleDragSingle} 
                    setDragSingle={setDragSingle}
                    activeTool={activeTool}
                  />
                </>
              )
            })}
          </Group>
        )
      })}
    </>
  )
}

const Circles = ({ element, handleDrag, setDragSingle, activeTool }) => {
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
        onDragMove={(e) => { handleDrag(e, index, 0) }}
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