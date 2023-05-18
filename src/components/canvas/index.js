"use client"
import React, { useState, useContext, useEffect, use } from 'react';
import { Stage, Layer } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import Line_ from "./Draw"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import * as math from "../../functions/math"

export default function Canvas() {
  const [drawing, setDrawing] = useState(false)
  const { activeTool, elements, setElements, latestElement, setLatestElement } = useContext(CanvasContext);
  const [stageMoving, setStageMoving] = useState(false)
  

  const handleMouseDown = (e) => {
    if (activeTool == 2) {
      setDrawing(true)
      const pos = e.target.getStage().getRelativePointerPosition();

      if (elements.length > 0) {
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
  
          const j = element.findIndex(e => math.lengthBetweenPoints(e, pos) <= 5)
          if (j > -1) {
            if (element.length - 1 == j) {
              const elementsCopy = [...elements]
              elementsCopy[i].push({x: pos.x, y: pos.y})
              setElements(elementsCopy)
              setLatestElement([...latestElement, {index: i, row: j + 1}])
              return
            } else if (j == 0) {
              const elementsCopy = [...elements]
              elementsCopy[i].unshift({x: pos.x, y: pos.y})
              setElements(elementsCopy)
              setLatestElement([...latestElement, {index: i, row: j}])
              return
            }
          }
        }
      }
      
      const temp = [
        {x: pos.x, y: pos.y},
        {x: pos.x, y: pos.y}
      ]
      setElements(prevState => [...prevState, temp])
      setLatestElement(prevState => [...prevState, {index: elements.length, row: 1}])
    }
  }

  const handleMouseMove = (e) => {
    if (!drawing) return

    const pos = e.target.getStage().getRelativePointerPosition();
    const elementsCopy = [...elements];
    const lastIndex = latestElement.length - 1

    if (latestElement.length > 0) {
      if (latestElement[lastIndex].row == 0) {
        elementsCopy[latestElement[lastIndex].index][0] = { x: pos.x, y: pos.y }
        setElements(elementsCopy)
        return
      } else if (latestElement[lastIndex].row == elementsCopy[latestElement[lastIndex].index].length - 1) {
        elementsCopy[latestElement[lastIndex].index][latestElement[lastIndex].row] = { x: pos.x, y: pos.y }
        setElements(elementsCopy)
        return
      }
    }

    const index = elements.length - 1;
    elementsCopy[index][1] = { x: pos.x, y: pos.y }
    setElements(elementsCopy)
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
    const latest = latestElement[latestElement.length - 1]
    
    const element = elements[latest.index]
    const elementsCopy = [...elements]
    if (latest.row <= 1) {
      if (math.lengthBetweenPoints(element[0], element[1]) <= 5) {
        if (latest.row == 0) {
          elementsCopy[latest.index].shift()
        } else {
          elementsCopy.pop()
        }
        setElements(elementsCopy)
        const latestElementCopy = [...latestElement]
        latestElementCopy.pop()
        setLatestElement(latestElementCopy)
      }
    } else {
      if (math.lengthBetweenPoints(element[latest.row - 1], element[latest.row]) <= 5) {
        elementsCopy[latest.index].splice(latest.row, 1)
        setElements(elementsCopy)
        const latestElementCopy = [...latestElement]
        latestElementCopy.pop()
        setLatestElement(latestElementCopy)
      }
    }
  }

  const handleUndo = (e) => {
    const latestElementCopy = [...latestElement]
    const popped = latestElementCopy.pop()
    setLatestElement(latestElementCopy)
    const elementsCopy = [...elements]
    const element = elementsCopy[popped.index]
    if (element.length <= 2) {
      elementsCopy.pop()
    } else {
      element.splice(popped.row, 1)
      elementsCopy[popped.index] = element
    }
    setElements(elementsCopy)
  }

  const handleStageDrag = (e) => {
  }

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
          <Line_ 
            stageMoving={stageMoving}
          />
        </Layer>
      </Stage>
      {elements.length > 0 && !drawing &&
        <>
          <CheckButton 
            element={elements[latestElement[latestElement.length - 1].index][latestElement[latestElement.length - 1].row]} 
          >
            <FontAwesomeIcon icon={faCheck} size='lg' />
          </CheckButton>
          <XButton 
            element={elements[latestElement[latestElement.length - 1].index][latestElement[latestElement.length - 1].row]} 
            onClick={handleUndo} 
          >
            <FontAwesomeIcon icon={faXmark} size='lg' />
          </XButton>
        </>
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
  position: absolute;
  top: ${props => props.element.y + 20}px;
  left: ${props => props.element.x - 18}px;
`