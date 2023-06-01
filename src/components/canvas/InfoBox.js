import React, { useContext, useEffect, useState, useRef } from 'react';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import * as math from "../../functions/math"
import useMousePosition from "../../hooks/useMousePosition"
import globals from "../../app/globals"
import { useAppSelector } from "@/redux/hooks";

export default function InfoBox ({ stageRef, drawing, dragging }) {
  const canvasState = useAppSelector(state => state.canvasReducer.items)
  const { currentLevel, currentElement } = useContext(CanvasContext);
  const mousePosition = useMousePosition()
  const [visible, setVisible] = useState(false)
  const length = useRef(0)
  const angle = useRef(0)
  const height = useRef(0)
  const width = useRef(0)


  useEffect(() => {
    if (currentElement && (dragging || drawing)) {
      const element = canvasState[currentLevel].elements[currentElement.indexOfElements]
      if (currentElement.type === "rectangle") {
        if (!visible) {
          setVisible(true)
        }
        const element = canvasState[currentLevel].elements[currentElement.indexOfElements]
        const pos0 = element.points[0]
        const pos1 = element.points[1]
        let w = pos1.x - pos0.x
        let h = pos1.y - pos0.y
        if (w < 0) {
          w = w * -1
        }
        if (h < 0) {
          h = h * -1
        }
        width.current = Math.round(w / globals.lengthParameter * 100) / 100
        height.current = Math.round(h / globals.lengthParameter * 100) / 100
      } else if (currentElement.type === "line" && !element.closed) {
        let pos0 = {}
        let pos1 = {}
        let a = 0
        if (currentElement.index === 0) {
          if (!visible) {
            setVisible(true)
          }
          pos0 = {
            x: element.x + element.points[0].x,
            y: element.y + element.points[0].y
          }
          pos1 = {
            x: element.x + element.points[1].x,
            y: element.y + element.points[1].y
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
        } else if (currentElement.index === element.points.length - 1) { 
          if (!visible) {
            setVisible(true)
          }
          pos0 = {
            x: element.x + element.points[currentElement.index - 1].x,
            y: element.y + element.points[currentElement.index - 1].y
          }
          pos1 = {
            x: element.x + element.points[currentElement.index].x,
            y: element.y + element.points[currentElement.index].y
          }
          if (element.points.length > 2) {
            const pos2 = {
              x: element.x + element.points[currentElement.index - 2].x,
              y: element.y + element.points[currentElement.index - 2].y
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
  }, [currentElement, currentLevel, canvasState, visible, dragging, drawing])


  return (
    <>
      <Box 
        x={mousePosition.x}
        y={mousePosition.y}
        visible={visible ? 1 : 0}
      >
        {currentElement && currentElement.type === "line" && (
          <>
            <Text>Length: {length.current}m</Text>
            <Text>Angle: {angle.current}º</Text>
          </>      
        )}
        {currentElement && currentElement.type === "rectangle" && (
          <>
            <Text>Width: {width.current}m</Text>
            <Text>height: {height.current}m</Text>
          </>      
        )}
      </Box>
    </>
  )
}


const Box = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x - 150}px;
  display: flex;
  flex-direction: column;
  width: 100px;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
  border-radius: 5px;
  padding: 5px;
  z-index: 1;
  visibility: ${props => props.visible ? "visible" : "hidden"};
`

const Text = styled.p`
  font-size: 12px;
  font-weight: 300;
  margin: 0;
  padding: 3px;
  color: rgb(50, 50, 50);
`