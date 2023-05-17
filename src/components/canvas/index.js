"use client"
import React, { useState, useContext, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import Line_ from "./Draw"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function Canvas() {
  const [drawing, setDrawing] = useState(false)
  const { activeTool, setActiveTool, elements, setElements } = useContext(CanvasContext);

  const handleMouseDown = (e) => {
    if (activeTool == 2) {
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
        width={typeof window !== 'undefined' ? window.innerWidth : 0 } 
        height={typeof window !== 'undefined' ? window.innerHeight : 0 }
        style={{ background: "rgb(250, 250, 250)" }}
        // draggable={activeTool == 1 ? true : false}
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
          <Line_ setElements={setElements} elements={elements} activeTool={activeTool} drawing={drawing} />
        </Layer>
      </Stage>
      {elements.length > 0 && !drawing && 
        <>
          <CheckButton element={elements[elements.length - 1]}>
            <FontAwesomeIcon icon={faCheck} size='lg' />
          </CheckButton>
          <XButton 
            element={elements[elements.length - 1]} 
            onClick={() => {
              const elementsCopy = [...elements]
              elementsCopy.pop()
              setElements(elementsCopy)
            }} 
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
  top: ${props => props.element.y1 + 20}px;
  left: ${props => props.element.x1 + 18}px;
  
`

const XButton = styled(Button)`
  background: red;
  position: absolute;
  top: ${props => props.element.y1 + 20}px;
  left: ${props => props.element.x1 - 18}px;
`