"use client"
import React, {useState} from 'react';
import { Stage, Layer, Line, Circle, Group } from 'react-konva';

export default function Canvas({ activeTool, elements, setElements }) {
  const [drawing, setDrawing] = useState(false)

  const handleMouseDown = (e) => {
    if (activeTool == 3) {
      setDrawing(true)
      const pos = e.target.getStage().getRelativePointerPosition();
      
      setElements(prevState => [...prevState, { x: pos.x, y: pos.y, x1: pos.x, y1: pos.y }])
    }
  }

  const handleMouseMove = (e) => {
    if (!drawing) return

    const pos = e.target.getStage().getRelativePointerPosition();
    const index = elements.length - 1;
    const { x, y } = elements[index];

    const elementsCopy = [...elements];
    elementsCopy[index] = { x: x, y: y, x1: pos.x, y1: pos.y }
    setElements(elementsCopy)
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
  }

  return (
    <>
      <Stage 
        width={window.innerWidth} 
        height={window.innerHeight}
        style={{ background: "rgb(250, 250, 250)" }}
        draggable={activeTool == 1 ? true : false}
        onMouseEnter={e => {
          if (activeTool == 1) {
            const container = e.target.getStage().container();
            container.style.cursor = "move";
          }
        }}
        onMouseLeave={e => {
          const container = e.target.getStage().container();
          container.style.cursor = "default";
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} 
      >
        <Layer>
          {elements.map((element, index) => {
            return (
              <>
                <Group
                  key={index}
                  draggable={activeTool == 0 ? true : false}
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
    </>
  )
}