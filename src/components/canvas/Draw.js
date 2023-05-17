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
      copy[index] = {x: pos.x, y: pos.y, x1: copy[index].x1, y1: copy[index].y1}
    } else if (num == 1) {
      copy[index] = {x: copy[index].x, y: copy[index].y, x1: pos.x, y1: pos.y}
    }
    setElements(copy)
  }

  const handleDragAll = (e, index) => {
    if (!dragAll) return
    
    

  }

  return (
    <>
      {elements.map((element, index) => { 
        console.log(element.x)
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
            <Circle 
              x={element.x}
              y={element.y}
              radius={5}
              fill="#00FFFF"
              draggable={activeTool == 0 ? true : false}
              onDragStart={() => { setDragSingle(true) }}
              onDragEnd={() => { setDragSingle(false) }}
              onDragMove={(e) => { handleDragSingle(e, index, 0) }}
              shadowColor="grey"
              shadowBlur={4}
              shadowOffset={{ x: 2, y: 1 }}
              shadowOpacity={0.5}
              hitStrokeWidth={10}
            />
            <Line
              points={[element.x, element.y, element.x1, element.y1]}
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
            <Circle 
              x={element.x1}
              y={element.y1}
              radius={5}
              fill="#00FFFF"
              draggable={activeTool == 0 ? true : false}
              onDragStart={() => { setDragSingle(true) }}
              onDragEnd={() => { setDragSingle(false) }}
              onDragMove={(e) => { handleDragSingle(e, index, 1) }}
              shadowColor="grey"
              shadowBlur={4}
              shadowOffset={{ x: 2, y: 1 }}
              shadowOpacity={0.5}
              hitStrokeWidth={10}
            />
          </Group>
        )
      })}
    </>
  )
}