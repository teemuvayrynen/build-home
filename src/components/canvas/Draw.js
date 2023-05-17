import React, { useState } from "react"
import {Circle, Line, Group} from "react-konva"


export default function Line_({ setElements, elements, activeTool, drawing }) {
  const lastElement = elements.length - 1;
  const [moving, setMoving] = useState(false)
  const [dragSingle, setDragSingle] = useState(false)


  const handleDragSingle = (e, index, num) => {
    if (!dragSingle) return
    const pos = e.target.getStage().getRelativePointerPosition();
    const copy = [...elements]
    if (num == 0) {
      copy[index] = {x: pos.x, y: pos.y, x1: copy[index].x1, y1: copy[index].y1}
    } else if (num == 1) {
      copy[index] = {x: copy[index].x, y: copy[index].y, x1: pos.x, y1: pos.y}
    }
    setElements(copy)
  }


  const handleDragEndAll = (e, index) => {
    
    if (!moving) return
    const pos = e.target
    const elementCopy = [...elements]
    console.log(pos.children[0].target.x())
    console.log(pos.x())
    console.log(pos.y())
    // elementCopy[index] = { 
    //   x: pos.children[0].attrs.x, 
    //   y: pos.children[0].attrs.y, 
    //   x1: pos.children[1].attrs.x, 
    //   y1: pos.children[1].attrs.y}

    // setElements(elementCopy)

    setMoving(false)
  }

  return (
    <>
      {elements.map((element, index) => { 
        return (
          <Group
            key={index}
            // draggable={activeTool == 0 ? true : false}
            // onDragStart={(e) => { setMoving(true); console.log(elements[index].x);  console.log(e.target.x()) }}
            // onDragEnd={(e) => { handleDragEndAll(e, index) }}
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
            />
            <Line
              points={[element.x, element.y, element.x1, element.y1]}
              stroke="#00FFFF"
              strokeWidth={2}
              shadowColor="grey"
              shadowBlur={4}
              shadowOffset={{ x: 2, y: 1 }}
              shadowOpacity={0.3}
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
            />
          </Group>
        )
      })}
    </>
  )
}