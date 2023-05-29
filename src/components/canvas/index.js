"use client"
import React, { useState, useContext, useRef, useEffect } from 'react';
import { Stage, Layer, Group, Rect } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import Line_, { mouseDownLine, mouseMoveLine, checkIsNearAnotherLine } from "./Line_"
import Rect_, { mouseDownRect, mouseMoveRect } from "./Rect_"
import InfoBox from "./InfoBox"
import InfoForLine from "./InfoForLine"
import RightBar from "../sideBars/RightBar"
import LevelButton from "../buttons/LevelButton"
import * as math from "../../functions/math"
import useWindowSize from "../../hooks/useWindowSize"
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { addElement, movePoint, addPoint } from "../../redux/features/canvasSlice"

const scaleBy = 1.05;

export default function Canvas() {
  const canvasState = useAppSelector(state => state.canvasReducer.items)
  const canvasDispatch = useAppDispatch()

  useEffect(() => {
    // console.log(canvasState)
  }, [canvasState])

  const [drawing, setDrawing] = useState(false)
  const dragging = useState(false)
  const { 
    activeTool, 
    levelState, 
    levelDispatch, 
    currentLevel, 
    setCurrentLevel, 
    currentElement, 
    setCurrentElement} = useContext(CanvasContext);
  const stageRef = useRef(null)
  const selection = useRef({
    visible: false,
    x: 0,
    y: 0,
    x2: 0,
    y2: 0
  })
  const selectionRectRef = useRef()
  const windowSize = useWindowSize() 


  const updateSelectionRect = () => {
    const node = selectionRectRef.current
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x, selection.current.x2),
      y: Math.min(selection.current.y, selection.current.y2),
      width: Math.abs(selection.current.x2 - selection.current.x),
      height: Math.abs(selection.current.y2 - selection.current.y),
    })
    node.getLayer().batchDraw()
  }

  const checkIsMishap = () => {
    if (currentElement) {
      const element = canvasState[currentLevel].elements[currentElement.indexOfElements]
      if (element.points.length <= 2) {
        const pos0 = element.points[0]
        const pos1 = element.points[1]
        const distance = math.lengthBetweenPoints(pos0, pos1)
        if (distance < 5) {
          handleUndo()
        }
      } else {
        const p1 = element.points[currentElement.index]
        let p2 = null
        if (currentElement.index === 0) {
          p2 = element.points[currentElement.index + 1]
        } else {
          p2 = element.points[currentElement.index - 1]
        }
        if (p1.x === p2.x && p1.y === p2.y) {
          handleUndo()
        }
      }
    }
  }

  const handleMouseDown = (e) => {
    switch (activeTool) {
      case "default":
        if (!dragging[0] && e.target === e.target.getStage()) {
          const pos = e.target.getStage().getRelativePointerPosition();
          selection.current.visible = true
          selection.current.x = pos.x
          selection.current.y = pos.y
          selection.current.x2 = pos.x
          selection.current.y2 = pos.y
          updateSelectionRect()
        }
        break;
      case "line":
        setDrawing(true)
        mouseDownLine(e, canvasState, canvasDispatch, currentLevel, setCurrentElement, addElement, addPoint)
        break;
      case "rectangle":
        setDrawing(true)
        mouseDownRect(e, canvasState, canvasDispatch, currentLevel, setCurrentElement, addElement)
        break;
    }
  }

  const handleMouseMove = (e) => {
    switch (activeTool) {
      case "default":
        if (selection.current.visible) {
          const pos = e.target.getStage().getRelativePointerPosition();
          selection.current.x2 = pos.x
          selection.current.y2 = pos.y
          updateSelectionRect()
        }
        break
      case "line":
        if (drawing) {
          mouseMoveLine(e, canvasDispatch, currentLevel, currentElement, movePoint)
        }
        break;
      case "rectangle":
        if (drawing) {
          mouseMoveRect(e, canvasDispatch, currentLevel, currentElement, movePoint)
        }
        break;
    }
  }

  const handleMouseUp = (e) => {
    if ((activeTool == "line" || activeTool == "rectangle")) {
      checkIsMishap()
      setDrawing(false)
    }
    selection.current.visible = false
    updateSelectionRect()
    checkIsNearAnotherLine(canvasState, levelDispatch, currentLevel, currentElement) 
    setCurrentElement(null)
  }

  const handleUndo = () => {
    levelDispatch({
      type: "UNDO",
      currentLevel: currentLevel
    })
  }

  const handleRedo = () => {
    levelDispatch({
      type: "REDO",
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
        onMouseOut={() => {
          dragging[1](false)
        }}
        ref={stageRef}
        onWheel={handleWheel}
        perfectDrawEnabled={false}
        width={windowSize.width} 
        height={windowSize.height}
        style={{ background: "rgb(240, 240, 240)" }}
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
        {canvasState.map((level, index) => {
          return (
            <>
              <Layer
              visible={level.id == currentLevel ? true : false}
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
                <Group>
                  {canvasState[index].elements.map((element, i) => {
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
                            drawing={drawing}
                            dragging={dragging}
                          />
                        </>
                      )
                    } else if (element.type === "rectangle") {
                      return (
                        <Rect_ 
                          key={i}
                          index={i}
                          points={element.points}
                          drawing={drawing}
                          dragging={dragging}
                        />
                      )
                    }
                  })}
                </Group>
              </Layer>
            </>
          )
        })}
        <Layer>
          <InfoForLine dragging={dragging[0]} />
          <Rect 
            ref={selectionRectRef}
            fill="rgba(0, 161, 255, 0.3)"
          />
        </Layer>
      </Stage>
      <LevelButton 
        currentLevel={currentLevel}
        setCurrentLevel={setCurrentLevel}
      />
      {canvasState[currentLevel].history.length > 0 &&
        <>
          <ButtonRow>
            <UndoRedoButton onClick={handleUndo}>Undo</UndoRedoButton>
            <UndoRedoButton onClick={handleRedo}>Redo</UndoRedoButton>
          </ButtonRow>
        </>
      }
      {/* <InfoBox 
        stageRef={stageRef}
        drawing={drawing}
        dragging={dragging[0]}
      /> */}
      <RightBar />
    </>
  )
}

const ButtonRow = styled.div`
  position: absolute;
  bottom: 30px;
  left: 270px;
  display: flex;
  flex-direction: row;
`

const UndoRedoButton = styled.button`
  background: rgb(250, 250, 250);
  border: none;
  border-radius: 5px;
  padding: 6px 10px;
  font-size: 12px;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.5);
  cursor: pointer;
  margin: 0px 5px;
  &:hover {
    background: rgb(230, 230, 230);
  }  
`