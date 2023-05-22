"use client"
import React, { useState, useContext, useRef, useEffect, useReducer } from 'react';
import { Stage, Layer, Group } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import Line_, { mouseDownLine, mouseMoveLine, mouseUpLine } from "./Line_"
import Rect_, { mouseDownRect, mouseMoveRect } from "./Rect_"
import InfoBox from "./InfoBox"
import LevelButton from "../buttons/LevelButton"

export default function Canvas() {
  const [drawing, setDrawing] = useState(false)
  const { activeTool, elements, setElements, latestElement, setLatestElement, levelState, levelDispatch, currentLevel, setCurrentLevel } = useContext(CanvasContext);
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
        mouseDownRect(e, levelState, levelDispatch, currentLevel)
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
        mouseMoveRect(e, levelDispatch, currentLevel)
        break;
    }
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
    if (activeTool == 2 || activeTool == 3) {
      //mouseUpLine(e, elements, setElements, latestElement, setLatestElement)
    }
  }

  const handleUndo = () => {
    levelDispatch({
      type: "UNDO",
      currentLevel: currentLevel
    })
  }

  useEffect(() => {
    //console.log(levelState) 
  }, [levelState, currentLevel])

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
      >
        <Layer
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
                          {/* <Line_ 
                            key={i}
                            index={i}
                            element={element}
                            points={points}
                            dragLine={dragLine}
                            setDragLine={setDragLine}
                            drawing={drawing}
                          /> */}
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