import React, { useContext, useEffect, useState, useRef } from 'react';
import { CanvasContext } from "../../context/canvasContext.jsx"
import styled from "styled-components"
import * as math from "../../functions/math"
import useMousePosition from "../../hooks/useMousePosition.jsx"
import globals from "../../app/globals"
import { useAppSelector } from "@/redux/hooks";

export default function InfoBox ({ stageRef, drawing, dragging }) {
  const canvasState = useAppSelector(state => state.canvas.items)
  const { selectedFloor, selectedElement } = useContext(CanvasContext);
  const mousePosition = useMousePosition()
  const [visible, setVisible] = useState(false)
  const length = useRef(0)
  const angle = useRef(0)
  const height = useRef(0)
  const width = useRef(0)


  useEffect(() => {
    if (selectedElement && (dragging || drawing)) {
      const element = canvasState[selectedFloor].elements[selectedElement.id]
      if (selectedElement.type === "rectangle") {
        if (!visible) {
          setVisible(true)
        }
        const element = canvasState[selectedFloor].elements[selectedElement.id]
        
        width.current = Math.round(element.width / globals.lengthParameter * 100) / 100
        height.current = Math.round(element.height / globals.lengthParameter * 100) / 100
      } else if (selectedElement.type === "line" && !element.closed) {
        let pos0 = {}
        let pos1 = {}
        let a = 0
        if (!visible) {
          setVisible(true)
        }
        if (selectedElement.index === 0) {
          pos0 = {
            x: element.x + element.points[0].x,
            y: element.y + element.points[0].y,
          }
          pos1 = {
            x: element.x + element.points[1].x,
            y: element.y + element.points[1].y,
          }
          if (element.points.length > 2) {
            const pos2 = {
              x: element.x + element.points[2].x,
              y: element.y + element.points[2].y
            }
            a = math.angleOfVector(pos0, pos1, pos1, pos2)
          } else {
            a = math.findLineAngle(pos0, pos1)
          }
        } else if (selectedElement.index === element.points.length - 1) { 
          pos0 = {
            x: element.x + element.points[selectedElement.index - 1].x,
            y: element.y + element.points[selectedElement.index - 1].y
          }
          pos1 = {
            x: element.x + element.points[selectedElement.index].x,
            y: element.y + element.points[selectedElement.index].y,
          }
          if (element.points.length > 2) {
            const pos2 = {
              x: element.x + element.points[selectedElement.index - 2].x,
              y: element.y + element.points[selectedElement.index - 2].y
            }
            a = math.angleOfVector(pos2, pos0, pos0, pos1)
          } else {
            a = math.findLineAngle(pos0, pos1)
          }
        }
        const l = math.lengthBetweenPointsMeters(pos0, pos1)
        length.current = l
        if (a < 0) {
          angle.current = Math.round(a * (-1) * 100) / 100
          return
        }
        angle.current = Math.round((a) * 100) / 100
      }
    } else if (!dragging && !drawing) {
      setVisible(false)
    }
  }, [selectedElement, selectedFloor, canvasState, visible, dragging, drawing])


  return (
    <>
      <Box 
        x={mousePosition.x}
        y={mousePosition.y}
        visible={visible ? 1 : 0}
      >
        {selectedElement && selectedElement.type === "line" && (
          <>
            <Text>Length: {length.current}m</Text>
            <Text>Angle: {angle.current}º</Text>
          </>      
        )}
        {selectedElement && selectedElement.type === "rectangle" && (
          <>
            <Text>Width: {width.current}m</Text>
            <Text>height: {height.current}m</Text>
          </>      
        )}
      </Box>
    </>
  )
}

const Box = styled.div.attrs(props => ({
  style: {
    top: `${props.y}px`,
    left: `${props.x - 150}px`,
    visibility: props.visible ? "visible" : "hidden"
  }
}))`
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  display: flex;
  flex-direction: column;
  width: 100px;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
  border-radius: 5px;
  padding: 5px;
  z-index: 1;
`



const Text = styled.p`
  font-size: 12px;
  font-weight: 300;
  margin: 0;
  padding: 3px;
  color: rgb(50, 50, 50);
`