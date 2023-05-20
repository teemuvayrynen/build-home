"use client"
import React, { useState, useContext, useRef } from 'react';
import { Stage, Layer } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import Line_, { mouseDownLine, mouseMoveLine, mouseUpLine } from "./Line_"
import Rect_, { mouseDownRect, mouseMoveRect } from "./Rect_"
import InfoBox from "./InfoBox"
import LevelButton from "../buttons/LevelButton"
import * as math from "../../functions/math"

export default function Canvas() {
  const [drawing, setDrawing] = useState(false)
  const { activeTool, elements, setElements, latestElement, setLatestElement } = useContext(CanvasContext);
  const [stageMoving, setStageMoving] = useState(false)
  const [dragLine, setDragLine] = useState(false)
  const [dragRect, setDragRect] = useState(false)
  const stageRef = useRef(null)

  const handleMouseDown = (e) => {
    switch (activeTool) {
      case 2:
        setDrawing(true)
        mouseDownLine(e, elements, setElements, setLatestElement)
        break;
      case 3:
        setDrawing(true)
        mouseDownRect(e, elements, setElements, setLatestElement)
        break;
    }
  }

  const handleMouseMove = (e) => {
    if (!drawing) return
    switch (activeTool) {
      case 2:
        mouseMoveLine(e, elements, setElements, latestElement)
        break;
      case 3:
        mouseMoveRect(e, elements, setElements)
        break;
    }
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
    if (activeTool == 2 || activeTool == 3) {
      mouseUpLine(e, elements, setElements, latestElement, setLatestElement)
      // const latest = latestElement[latestElement.length - 1]
      // const element = elements[latest.index]
      // const elementsCopy = [...elements]
      // if (latest.row <= 1) {
      //   if (math.lengthBetweenPoints(element.points[0], element.points[1]) <= 5) {
      //     if (latest.row == 0) {
      //       elementsCopy[latest.index].points.shift()
      //     } else {
      //       elementsCopy.pop()
      //     }
      //     setElements(elementsCopy)
      //     const latestElementCopy = [...latestElement]
      //     latestElementCopy.pop()
      //     setLatestElement(latestElementCopy)
      //   }
      // } else {
      //   if (math.lengthBetweenPoints(element.points[latest.row - 1], element.points[latest.row]) <= 5) {
      //     elementsCopy[latest.index].points.splice(latest.row, 1)
      //     setElements(elementsCopy)
      //     const latestElementCopy = [...latestElement]
      //     latestElementCopy.pop()
      //     setLatestElement(latestElementCopy)
      //   }
      // }
    }
  }

  const handleUndo = () => {
    const latestElementCopy = [...latestElement]
    const popped = latestElementCopy.pop()
    setLatestElement(latestElementCopy)
    const elementsCopy = [...elements]
    const element = elementsCopy[popped.index]
    if (popped.closed) {
      element.closed = false
    } else if (element.points.length <= 2) {
      elementsCopy.pop()
    } else {
      element.points.splice(popped.row, 1)
      elementsCopy[popped.index].points = element.points
    }
    setElements(elementsCopy)
  }

  const handleStageDrag = (e) => {
  }

  return (
    <>
      <Stage 
        ref={stageRef}
        width={typeof window !== 'undefined' ? window.innerWidth : 0 } 
        height={typeof window !== 'undefined' ? window.innerHeight : 0 }
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
        onDragStart={() => { setStageMoving(true) }}
        onDragMove={handleStageDrag} 
      >
        <Layer>
          {elements.map((element, i) => {
            if (element.type === "line") {
              const points = []
              element.points.forEach(point => {
                points.push(point.x)
                points.push(point.y)
              })
              return (
                <Line_ 
                  key={i}
                  index={i}
                  element={element}
                  points={points}
                  stageMoving={stageMoving}
                  dragLine={dragLine}
                  setDragLine={setDragLine}
                  drawing={drawing}
                />
              )
            } else if (element.type = "rectangle") {
              return (
                <Rect_ 
                  key={i}
                  index={i}
                  points={element.points}
                  stageMoving={stageMoving}
                  setDragRect={setDragRect}
                  dragRect={dragRect}
                  drawing={drawing}
                />
              )
            }
          })}
         
        </Layer>
      </Stage>
      <LevelButton />
      {elements.length > 0 &&
        <>
          <UndoButton onClick={handleUndo}>Undo</UndoButton>
        </>
      }
      {(drawing || dragLine || dragRect) &&
        <InfoBox 
          stageRef={stageRef}
        />
      }
    </>
  )
}

const UndoButton = styled.button`
  position: absolute;
  bottom: 30px;
  left: 270px;
  background: rgb(250, 250, 250);
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 12px;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
  cursor: pointer;
  &:hover {
    background: rgb(230, 230, 230);
  }  
`

const ModeButton = styled.button`
  position: absolute;
`