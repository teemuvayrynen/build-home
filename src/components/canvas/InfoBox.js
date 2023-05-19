import React, { useContext, useEffect, useState } from 'react';
import { CanvasContext } from "../../context/canvasContext"
import styled from "styled-components"

export default function InfoBox () {
  const { activeTool, elements, setElements, latestElement, setLatestElement } = useContext(CanvasContext);
  const [length, setLength] = useState(0)
  const [angle, setAngle] = useState(0)
  const [position, setPosition] = useState({x: 0, y: 0})

  useEffect(() => {
    const length = latestElement.length - 1
    if (latestElement[length].row == 0) {
      setPosition(elements[latestElement[length].index].points[1])
    } else {
      setPosition(elements[latestElement[length].index].points[latestElement[length].row - 1])
    }
  }, [latestElement, elements])


  return (
    <>
      <Box position={position}>
        <Text>Length: {length}m</Text>
        <Text>Angle: {angle}</Text>
      </Box>
    </>
  )
}


const Box = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: ${props => props.position.y}px;
  left: ${props => props.position.x - 90}px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
  border-radius: 5px;
  padding: 5px;
`

const Text = styled.p`
  font-size: 12px;
  font-weight: 300;
  margin: 0;
  padding: 3px;
  color: rgb(50, 50, 50);
`