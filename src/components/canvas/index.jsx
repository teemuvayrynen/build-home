"use client"
import React, { useContext, useRef, useEffect } from 'react';
import { Stage, Layer, Group, Rect, Image } from 'react-konva';
import { v4 as uuidv4 } from 'uuid';
import { CanvasContext } from "../../context/canvasContext.jsx"
import styled from "styled-components"
import Line_, { mouseDownLine, mouseMoveLine, checkIsNearEndOfLine } from "./Line_.jsx"
import Rect_, { mouseDownRect, mouseMoveRect } from "./Rect_.jsx"
import InfoBox from "./InfoBox.jsx"
import InfoForLine from "./InfoForLine.jsx"
import Image_ from "./Image_.jsx"
import RightBar from "../sideBars/RightBar.jsx"
import LevelButton from "../buttons/LevelButton.jsx"
import * as math from "../../functions/math"
import ContextMenu from "../ContextMenu.jsx"
import useWindowSize from "../../hooks/useWindowSize.jsx"
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { addElement, movePoint, addPoint, closedElement, undo, redo, addHistory, undoMisClick } from "../../redux/features/canvasSlice"

const scaleBy = 1.05;

export default function Canvas() {
  const canvasState = useAppSelector(state => state.canvas.items)
  const canvasDispatch = useAppDispatch()

  useEffect(() => {
    console.log("canvasState", canvasState)
  }, [canvasState])

  const { 
    activeTool,
    selectedFloor, 
    setSelectedFloor, 
    selectedElement, 
    setSelectedElement,
    dragging,
    drawing,
    setDrawing,
    setContextMenuObj} = useContext(CanvasContext);
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
    if (selectedElement) {
      if (selectedElement.type === "line") {
        const element = canvasState[selectedFloor].elements[selectedElement.indexOfElements]
        if (element.points.length <= 2) {
          const pos0 = element.points[0]
          const pos1 = element.points[1]
          const distance = math.lengthBetweenPoints(pos0, pos1)
          if (distance < 5) {
            canvasDispatch(undoMisClick({
              floor: selectedFloor,
              type: "default",
            }))
            return true
          }
        } else {
          const p1 = element.points[selectedElement.index]
          let p2 = null
          if (selectedElement.index === 0) {
            p2 = element.points[selectedElement.index + 1]
          } else {
            p2 = element.points[selectedElement.index - 1]
          }
          const distance = math.lengthBetweenPoints(p1, p2)
          if (distance < 5) {
            canvasDispatch(undoMisClick({
              floor: selectedFloor,
              indexOfElements: selectedElement.indexOfElements,
              index: selectedElement.index,
              type: "point",
            }))
            return true
          }
        }
      } else if (selectedElement.type === "rectangle") {
        const element = canvasState[selectedFloor].elements[selectedElement.indexOfElements]
        if (element.width < 5 && element.height < 5) {
          canvasDispatch(undoMisClick({
            floor: selectedFloor,
            type: "default",
          }))
          return true
        }
      }
    }
    return false
  }

  const handleMouseDown = (e) => {
    if (e.evt.button === 0) {
      setContextMenuObj(null)
      switch (activeTool) {
        case "default":
          if (!dragging[0] && e.target === e.target.getStage()) {
            setSelectedElement(null)
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
          mouseDownLine(e, canvasState, canvasDispatch, selectedFloor, setSelectedElement, addElement, addPoint)
          break;
        case "rectangle":
          setDrawing(true)
          mouseDownRect(e, canvasState, canvasDispatch, selectedFloor, setSelectedElement, addElement)
          break;
      }
    }
  }

  const handleMouseMove = (e) => {
    if (e.evt.button === 0) {
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
            mouseMoveLine(e, canvasDispatch, selectedFloor, selectedElement, movePoint)
          }
          break;
        case "rectangle":
          if (drawing) {
            mouseMoveRect(e, canvasDispatch, selectedFloor, selectedElement, movePoint)
          }
          break;
      }
    }
  }

  const handleMouseUp = (e) => {
    setDrawing(false)
    if (e.evt.button === 0) {
      if (activeTool === "rectangle") {
        const notMishap = checkIsMishap()
        if (!notMishap) {
          canvasDispatch(addHistory({
            floor: selectedFloor,
            indexOfElements: selectedElement.indexOfElements,
            type: "add"
          }))
        }
      }
      if (activeTool == "default") {
        selection.current.visible = false
        updateSelectionRect() 
      }
      if (activeTool == "line") {
        const isNear = checkIsNearEndOfLine(canvasState, canvasDispatch, selectedFloor, selectedElement, closedElement)
        if (!isNear) {
          const notMisHap = checkIsMishap()
          if (!notMisHap) {
            if (canvasState[selectedFloor].elements[selectedElement.indexOfElements].points.length === 2) {
              canvasDispatch(addHistory({
                floor: selectedFloor,
                indexOfElements: selectedElement.indexOfElements,
                type: "add"
              }))
            } else {
              canvasDispatch(addHistory({
                type: "addPoint",
                floor: selectedFloor,
                indexOfElements: selectedElement.indexOfElements,
                index: selectedElement.index,
              }))
            }
          }
        }
      }
    }
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
    <div
      onDrop={(e) => {
        if (selectedElement && selectedElement.type === "element") {
          e.preventDefault();
          stageRef.current.setPointersPositions(e)
          const pos = stageRef.current.getRelativePointerPosition()
          const elementObj = {
            id: uuidv4(),
            type: "element",
            src: selectedElement.src,
            x: pos.x,
            y: pos.y,
            rotation: 0,
            item: selectedElement.item
          }
          const dispatchObj = {
            id: elementObj.id,
            element: elementObj,
            floor: selectedFloor,
            indexOfElements: canvasState[selectedFloor].elements.length,
          }
          canvasDispatch(addElement(dispatchObj))
          canvasDispatch(addHistory({
            id: elementObj.id,
            floor: selectedFloor,
            indexOfElements: canvasState[selectedFloor].elements.length,
            type: "add"
          }))
          dragging[1](false)
          setSelectedElement(null)
        }
      }}
      onDragOver={(e) => e.preventDefault()}
    >
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
        onContextMenu={(e) => {
          e.evt.preventDefault()
          setContextMenuObj(null)
        }}
      >
        {canvasState.map((level, index) => {
          return (
            <Layer
              key={level.id}
              visible={level.id === selectedFloor ? true : false}
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
                  if (element && element.type === "line") {
                    const points = []
                    element.points.forEach(point => {
                      points.push(point.x)
                      points.push(point.y)
                    })
                    return (
                      <Line_ 
                        key={element.id}
                        index={i}
                        element={element}
                        points={points}
                        drawing={drawing}
                        dragging={dragging}
                      />
                    )
                  } else if (element && element.type === "rectangle") {
                    return (
                      <Rect_ 
                        key={element.id}
                        index={i}
                        element={element}
                        drawing={drawing}
                        dragging={dragging}
                      />
                    )
                  } else if (element && element.type === "element") {
                    return (
                      <Image_ 
                        key={element.id}
                        index={i}
                        element={element}
                        dragging={dragging}
                      />
                    )
                  }
                })}
              </Group>
            </Layer>
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
        selectedFloor={selectedFloor}
        setSelectedFloor={setSelectedFloor}
      />
      {canvasState[selectedFloor].history.length > 0 &&
        <>
          <ButtonRow>
            <UndoRedoButton onClick={() => { canvasDispatch(undo(selectedFloor)); setSelectedElement(null) }}>Undo</UndoRedoButton>
            <UndoRedoButton onClick={() => { canvasDispatch(redo(selectedFloor)); setSelectedElement(null) }}>Redo</UndoRedoButton>
          </ButtonRow>
        </>
      }
      <InfoBox 
        stageRef={stageRef}
        drawing={drawing}
        dragging={dragging[0]}
      />
      <RightBar />
      <ContextMenu />
    </div>
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