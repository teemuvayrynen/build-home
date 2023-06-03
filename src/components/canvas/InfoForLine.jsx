import React, { useEffect, useContext, useRef, useState } from 'react';
import { Group, Text, Rect, Label, Tag } from 'react-konva';
import { CanvasContext } from "../../context/canvasContext.jsx"
import * as math from "../../functions/math"
import { useAppSelector } from "@/redux/hooks";

export default function InfoForLine ({ dragging}) {
  const canvasState = useAppSelector(state => state.canvas.items)
  const { selectedFloor, selectedElement } = useContext(CanvasContext);
  const items = useRef([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!dragging || selectedElement === null || selectedElement.type !== "line") { 
      setVisible(false)    
      return 
    }
    const element = canvasState[selectedFloor].elements[selectedElement.indexOfElements]
    if (element.points.length <= 2) { return }
    let currentPoint = null
    let previousPoint = null
    let nextPoint = null

    if (selectedElement.index === 0 || selectedElement.index === element.points.length - 1) {
      if (element.closed) {
        if (selectedElement.index === 0) {
          currentPoint = element.points[0]
          previousPoint = element.points[element.points.length - 1]
          nextPoint = element.points[1]
        } else {
          currentPoint = element.points[element.points.length - 1]
          previousPoint = element.points[element.points.length - 2]
          nextPoint = element.points[0]
        }
      } else { return }
    } else {
      currentPoint = element.points[selectedElement.index]
      previousPoint = element.points[selectedElement.index - 1]
      nextPoint = element.points[selectedElement.index + 1]
    }

    const l = math.lengthBetweenPointsMeters(previousPoint, currentPoint)
    const l1 = math.lengthBetweenPointsMeters(currentPoint, nextPoint)
    let a = math.angleOfVector(previousPoint, currentPoint, currentPoint, nextPoint)

    const obj = {
      type: "length",
      value: l,
      x: (element.x + currentPoint.x + element.x + previousPoint.x) / 2,
      y: (element.y + currentPoint.y + element.y + previousPoint.y) / 2
    }
    const obj1 = {
      type: "length",
      value: l1,
      x: (element.x + currentPoint.x + element.x + nextPoint.x) / 2,
      y: (element.y + currentPoint.y + element.y + nextPoint.y) / 2
    }
    const obj2 = {
      type: "angle",
      value: Math.round(a * 100) / 100,
      x: element.x + currentPoint.x - 60,
      y: element.y + currentPoint.y + 20
    }
    items.current = [obj, obj1, obj2]
    if (!visible) {
      setVisible(true)
    }
  }, [dragging, selectedElement, selectedFloor, canvasState, visible])

  return (
    <>
      <Group
        visible={visible}
      >
        {items.current.map((item, i) => {
          return (
            <Label
              key={i}
              x={item.x}
              y={item.y}
            >
              <Tag 
                fill={"white"}
                cornerRadius={10}
                shadowColor='black'
                shadowBlur={10}
                shadowOpacity={0.6}
                shadowOffsetX={1}
                shadowOffsetY={1}
              />
              <Text 
                text={item.type === "length" ? `L: ${item.value}m` : `A: ${item.value}°`}
                fontSize={12}
                padding={6}
                fontStyle='300'
                fill="rgb(50, 50, 50)"
              />
            </Label>
          )
        })}
      </Group>
    </>
  )
}