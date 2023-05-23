import React, { useContext, useEffect, useState, useRef } from 'react';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import * as math from "../../functions/math"

export default function InfoBox ({ stageRef }) {
  const { levelState, currentLevel, currentElement } = useContext(CanvasContext);
  const length = useRef(0)
  const angle = useRef(0)
  const height = useRef(0)
  const width = useRef(0)
  const position = useRef({x: 0, y: 0})


  useEffect(() => {
    if (currentElement) {
      if (currentElement.type === "rectangle") {
        const element = levelState[currentLevel].elements[currentElement.indexOfElements]
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
        width.current = Math.round(w / 40 * 100) / 100
        height.current = Math.round(h / 40 * 100) / 100
      } else if (currentElement.type === "line") {
        const element = levelState[currentLevel].elements[currentElement.indexOfElements]
        let pos0 = {}
        let pos1 = {}
        if (currentElement.index === 0) {
          pos0 = {
            x: element.x + element.points[0].x,
            y: element.y + element.points[0].y
          }
          pos1 = {
            x: element.x + element.points[1].x,
            y: element.y + element.points[1].y
          }
        } else {
          pos0 = {
            x: element.x + element.points[currentElement.index - 1].x,
            y: element.y + element.points[currentElement.index - 1].y
          }
          pos1 = {
            x: element.x + element.points[currentElement.index].x,
            y: element.y + element.points[currentElement.index].y
          }
        }
        const l = math.lengthBetweenPoints(pos0, pos1)
        length.current = Math.round(l / 40 * 100) / 100
        const a = math.angleOfVector(pos0, pos1, {x: pos0.x, y: pos0.y}, {x: 2000, y: pos0.y})
        if (a < 0) {
          angle.current = (Math.round(a * 180 / Math.PI * 100) / 100) * -1
          return
        }
        angle.current = Math.round(a * 180 / Math.PI * 100) / 100
      }
    }
  }, [currentElement, currentLevel, levelState])


  return (
    <>
      <Box 
        x={(stageRef.current.getRelativePointerPosition().x + stageRef.current.position().x)}
        y={(stageRef.current.getRelativePointerPosition().y + stageRef.current.position().y)}
      >
        {currentElement && currentElement.type === "line" && (
          <>
            <Text>Length: {length.current}m</Text>
            <Text>Angle: {angle.current}</Text>
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
  left: ${props => props.x - 120}px;
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