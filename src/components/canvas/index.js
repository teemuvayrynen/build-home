"use client"
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';

export default function Canvas({ activeTool, setActiveTool }) {
  const [elements, setElements] = useState([])
  const [drawing, setDrawing] = useState(false)

  const handleMouseDown = (e) => {
    if (activeTool == 3) {
      setDrawing(true)
      const { clientX, clientY } = e;
      console.log(clientX, clientY)
      setElements(prevState => [...prevState, { x: clientX, y: clientY, x1: clientX, y1: clientY }])
    }
  }

  const handleMouseMove = (e) => {
    if (!drawing) return

    const { clientX, clientY } = e;
    const index = elements.length - 1;
    const { x, y } = elements[index];

    const elementsCopy = [...elements];
    elementsCopy[index] = { x: x, y: y, x1: clientX, y1: clientY }
    setElements(elementsCopy)
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
  }

  const DrawLines = (element) => {
    
  }

  return (
    <>
      <div
        width={window.innerWidth} 
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Stage 
          width={window.innerWidth} 
          height={window.innerHeight}
          style={{ background: "rgb(250, 250, 250)" }} 
        >
          <Layer>
            {elements.map((element, index) => {
              return (
                <>
                  <Group
                    draggable={activeTool == 0 ? true : false}
                    onMouseEnter={e => {
                      const container = e.target.getStage().container();
                      container.style.cursor = "pointer";
                    }}
                    onMouseLeave={e => {
                      const container = e.target.getStage().container();
                      container.style.cursor = "default";
                    }}
                  >
                    <Circle 
                      x={element.x}
                      y={element.y}
                      radius={5}
                      fill="#00FFFF"
                    />
                    <Line
                      points={[element.x, element.y, element.x1, element.y1]}
                      stroke="#00FFFF"
                    />
                    <Circle 
                      x={element.x1}
                      y={element.y1}
                      radius={5}
                      fill="#00FFFF"
                    />
                  </Group>
                </>
              )
            })}
          </Layer>
        </Stage>
      </div>
    </>
  )
}