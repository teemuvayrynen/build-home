"use client"
import React, { useState, useContext, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import Line_, { mouseDownLine, mouseMoveLine } from "./Line_"
import Rect_, { mouseDownRect, mouseMoveRect } from "./Rect_"
import InfoBox from "./InfoBox"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import * as math from "../../functions/math"

export default function Canvas() {
  const [drawing, setDrawing] = useState(false)
  const { activeTool, elements, setElements, latestElement, setLatestElement } = useContext(CanvasContext);
  const [stageMoving, setStageMoving] = useState(false)
  

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

  const handleMouseUp = () => {
    setDrawing(false)
    if (activeTool == 2 || activeTool == 3) {
      const latest = latestElement[latestElement.length - 1]
      const element = elements[latest.index]
      const elementsCopy = [...elements]
      if (latest.row <= 1) {
        if (math.lengthBetweenPoints(element.points[0], element.points[1]) <= 5) {
          if (latest.row == 0) {
            elementsCopy[latest.index].points.shift()
          } else {
            elementsCopy.pop()
          }
          setElements(elementsCopy)
          const latestElementCopy = [...latestElement]
          latestElementCopy.pop()
          setLatestElement(latestElementCopy)
        }
      } else {
        if (math.lengthBetweenPoints(element.points[latest.row - 1], element.points[latest.row]) <= 5) {
          elementsCopy[latest.index].points.splice(latest.row, 1)
          setElements(elementsCopy)
          const latestElementCopy = [...latestElement]
          latestElementCopy.pop()
          setLatestElement(latestElementCopy)
        }
      }
    }
  }

  const handleUndo = (e) => {
    const latestElementCopy = [...latestElement]
    const popped = latestElementCopy.pop()
    setLatestElement(latestElementCopy)
    const elementsCopy = [...elements]
    const element = elementsCopy[popped.index]
    if (element.points.length <= 2) {
      elementsCopy.pop()
    } else {
      element.points.splice(popped.row, 1)
      elementsCopy[popped.index].points = element.points
    }
    setElements(elementsCopy)
  }

  const handleStageDrag = (e) => {
  }

  useEffect(() => { 
    //console.log(elements)
  }, [elements])

  return (
    <>
      <Stage 
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
                />
              )
            } else if (element.type = "rectangle") {
              return (
                <Rect_ 
                  key={i}
                  index={i}
                  points={element.points}
                  stageMoving={stageMoving}
                />
              )
            }
          })}
         
        </Layer>
      </Stage>
      {elements.length > 0 && !drawing &&
        <>
          <CheckButton 
            element={elements[latestElement[latestElement.length - 1].index].points[latestElement[latestElement.length - 1].row]} 
          >
            <FontAwesomeIcon icon={faCheck} size='lg' />
          </CheckButton>
          <XButton 
            element={elements[latestElement[latestElement.length - 1].index].points[latestElement[latestElement.length - 1].row]} 
            onClick={handleUndo} 
          >
            <FontAwesomeIcon icon={faXmark} size='lg' />
          </XButton>
        </>
      }
      {drawing &&
        <InfoBox />
      }
    </>
  )
}

const Button = styled.button`
  position: absolute;
  border: none;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  cursor: pointer;
  transform: translate(-50%, 0);
  &:hover {
    height: 27px;
  width: 27px;
  }
`

const CheckButton = styled(Button)`
  background: #55FF33;
  top: ${props => props.element.y + 20}px;
  left: ${props => props.element.x + 18}px;
  
`

const XButton = styled(Button)`
  background: red;
  top: ${props => props.element.y + 20}px;
  left: ${props => props.element.x - 18}px;
`