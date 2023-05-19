import React, { useContext, useEffect, useState } from 'react';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"
import * as math from "../../functions/math"

export default function InfoBox () {
  const { elements, latestElement } = useContext(CanvasContext);
  const [length, setLength] = useState(0)
  const [angle, setAngle] = useState(0)
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [position, setPosition] = useState({x: 0, y: 0})

  useEffect(() => {
    const calculateHeightAndWidth = (element) => {
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
      setPosition(pos1)
      setWidth(Math.round(w / 40 * 100) / 100)
      setHeight(Math.round(h / 40 * 100) / 100)
    }

    const calculateLengthAndAngle = (element, length) => {
      if (latestElement[length].row == 0) {
        const pos0 = element.points[0]
        const pos1 = element.points[1]
        setPosition(pos0)
        const l = math.lengthBetweenPoints(pos0, pos1)
        setLength(Math.round(l / 40 * 100) / 100)
        const a = math.angleOfVector(pos0, pos1, {x: pos0.x, y: pos0.y}, {x: 2000, y: pos0.y})
        if (l <= 5) {
          setAngle(0)
          return
        }
        setAngle(Math.round(a * 180 / Math.PI * 100) / 100)
      } else {
        const pos0 = element.points[latestElement[length].row - 1]
        const pos1 = element.points[latestElement[length].row]
        setPosition(pos1)
        const l = math.lengthBetweenPoints(pos0, pos1)
        setLength(Math.round(l / 40 * 100) / 100)
        const a = math.angleOfVector(pos0, pos1, {x: pos0.x, y: pos0.y}, {x: pos0.x, y: 2000})
        if (l <= 5) {
          setAngle(0)
          return
        }
        setAngle(Math.round(a * 180 / Math.PI * 100) / 100)
      }
    }


    const length = latestElement.length - 1
    const element = elements[latestElement[length].index]
    if (element.type === "line") {
      calculateLengthAndAngle(element, length)
    } else if (element.type === "rectangle") {
      calculateHeightAndWidth(element)
    }
  }, [latestElement, elements])


  return (
    <>
      <Box 
        x={position.x}
        y={position.y}
      >
        {elements[latestElement[latestElement.length - 1].index].type === "line" && (
          <>
            <Text>Length: {length}m</Text>
            <Text>Angle: {angle}</Text>
          </>      
        )}

        {elements[latestElement[latestElement.length - 1].index].type === "rectangle" && (
          <>
            <Text>Width: {width}m</Text>
            <Text>height: {height}m</Text>
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
  width: 90px;
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