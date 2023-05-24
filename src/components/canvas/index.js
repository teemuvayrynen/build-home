"use client"
import React, { useState, useContext, useRef, useEffect, useReducer } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import Line_, { mouseDownLine, mouseMoveLine, mouseUpLine } from "./Line_"
import Rect_, { mouseDownRect, mouseMoveRect } from "./Rect_"
import InfoBox from "./InfoBox"
import LevelButton from "../buttons/LevelButton"
import * as math from "../../functions/math"

const scaleBy = 1.05;

export default function Canvas() {
  const [drawing, setDrawing] = useState(false)
  const { activeTool, levelState, levelDispatch, currentLevel, setCurrentLevel, currentElement, setCurrentElement } = useContext(CanvasContext);
  const [dragLine, setDragLine] = useState(false)
  const [dragRect, setDragRect] = useState(false)
  const stageRef = useRef(null)

  const handleMouseDown = (e) => {
    switch (activeTool) {
      case "line":
        setDrawing(true)
        mouseDownLine(e, levelState, levelDispatch, currentLevel, setCurrentElement)
        break;
      case "rectangle":
        setDrawing(true)
        mouseDownRect(e, levelState, levelDispatch, currentLevel, setCurrentElement)
        break;
    }
  }

  const handleMouseMove = (e) => {
    if (!drawing) return
    switch (activeTool) {
      case "line":
        mouseMoveLine(e, levelState, levelDispatch, currentLevel, setCurrentElement)
        break;
      case "rectangle":
        mouseMoveRect(e, levelState, levelDispatch, currentLevel)
        break;
    }
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
    if ((activeTool == "line" || activeTool == "rectangle") && currentElement) {
      const element = levelState[currentLevel].elements[currentElement.indexOfElements]
      if (element.points.length <= 2) {
        const pos0 = element.points[0]
        const pos1 = element.points[1]
        const distance = math.lengthBetweenPoints(pos0, pos1)
        if (distance < 5) {
          handleUndo()
        }
      }
      setCurrentElement(null)
    }
    mouseUpLine(levelState, levelDispatch, currentLevel) 
  }

  const handleUndo = () => {
    levelDispatch({
      type: "UNDO",
      currentLevel: currentLevel
    })
  }

  const handleWheel = (e) => {
    e.evt.preventDefault();
    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      }
      stage.position(newPos);
      stage.batchDraw();
    }
  }

  return (
    <>
      <Stage 
        ref={stageRef}
        onWheel={handleWheel}
        perfectDrawEnabled={false}
        width={typeof window !== 'undefined' ? window.innerWidth : 0 } 
        height={typeof window !== 'undefined' ? window.innerHeight : 0 }
        style={{ background: "rgb(250, 250, 250)" }}
        draggable={activeTool === "move" ? true : false}
        onMouseEnter={e => {
          if (activeTool === "move") {
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
        <Layer
          onMouseEnter={e => {
            if (activeTool === "default" || activeTool === "divide") {
              const container = e.target.getStage().container();
              container.style.cursor = "pointer";
            }
          }}
          onMouseLeave={e => {
            if (activeTool === "default" || activeTool === "divide") {
              const container = e.target.getStage().container();
              container.style.cursor = "default";
            }
          }}
        >
          {levelState.map((level, index) => {
            return (
              <>
                <Group
                  visible={level.id == currentLevel ? true : false}
                >
                  {levelState[index].elements.map((element, i) => {
                    if (element.type === "line") {
                      const points = []
                      element.points.forEach(point => {
                        points.push(point.x)
                        points.push(point.y)
                      })
                      return (
                        <>
                          <Line_ 
                            key={i}
                            index={i}
                            element={element}
                            points={points}
                            dragLine={dragLine}
                            setDragLine={setDragLine}
                            drawing={drawing}
                          />
                        </>
                      )
                    } else if (element.type = "rectangle") {
                      return (
                        <Rect_ 
                          key={i}
                          index={i}
                          points={element.points}
                          setDragRect={setDragRect}
                          dragRect={dragRect}
                          drawing={drawing}
                        />
                      )
                    }
                  })}
                </Group>
              </>
            )
          })}
        </Layer>
      </Stage>
      <LevelButton 
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevel}
        levelState={levelState}
        levelDispatch={levelDispatch}
      />
      {levelState[currentLevel].elements.length > 0 &&
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