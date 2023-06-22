import React, { useContext, useState, useEffect, useRef } from "react"
import { useAppSelector } from "@/redux/hooks";
import { CanvasContext } from "../../context/canvasContext"
import { Label, Tag, Text, Shape } from "react-konva";


const LineSelected = () => {
  const { selectedFloor, selectedElement, drawing, dragging } = useContext(CanvasContext)
  const [points, setPoints] = useState(null)
  const canvasState = useAppSelector(state => state.canvas.items)

  useEffect(() => {
    setPoints(null)
    if (!selectedElement || dragging[0] || drawing) return
    if (selectedElement.type !== "line") return

    const element = canvasState[selectedFloor].elements[selectedElement.id]
    if (!element || !selectedElement.indexes) return

    let arr = []

    for (let i = 0; i < selectedElement.indexes.length; i++) {
      const index = selectedElement.indexes[i]
      let secondIndex = 0
      if (index !== element.points.length - 1) {
        secondIndex = index + 1
      } else {
        if (!element.closed) break
      }
      const p1 = {
        x: element.x + element.points[index].x,
        y: element.y + element.points[index].y
      }
      const p2 = {
        x: element.x + element.points[secondIndex].x,
        y: element.y + element.points[secondIndex].y
      }
      const mid = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
      }
      arr.push(mid)
      
    }

    setPoints(arr)
  }, [canvasState, dragging, drawing, selectedElement, selectedFloor])

  return (
    <>
      {!drawing && !dragging[0] && selectedElement && selectedElement.type === "line" && (
        <Shape 
          sceneFunc={(context, shape) => {
            context.beginPath()
            if (!selectedElement.indexes) return
            const element = canvasState[selectedFloor].elements[selectedElement.id]

            for (let i = 0; i < selectedElement.indexes.length; i++) {
              const index = selectedElement.indexes[i]
              if (!element.closed && index === element.points.length - 1) break
              const point = element.points[index]
              let point2 = element.points[0]
              if (index !== element.points.length - 1) {
                point2 = element.points[index + 1]
              }
              if (i === 0) {
                context.moveTo(element.x + point.x, element.y + point.y)
                context.lineTo(element.x + point2.x, element.y + point2.y)
              } else {
                if (selectedElement.indexes[i - 1] + 1 === index) {
                  context.lineTo(element.x + point2.x, element.y + point2.y)
                } else {
                  context.moveTo(element.x + point.x, element.y + point.y)
                  context.lineTo(element.x + point2.x, element.y + point2.y)
                }
              }
            }

            if (selectedElement.indexes.length !== element.points.length && selectedElement.indexes[0] === 0 && selectedElement.indexes.at(-1) === element.points.length - 1) {
              const point = element.points.at(-1)
              const point2 = element.points[0]
              const point3 = element.points[1]
              context.moveTo(element.x + point.x, element.y + point.y)
              context.lineTo(element.x + point2.x, element.y + point2.y)
              context.lineTo(element.x + point3.x, element.y + point3.y)
            }
            context.stroke()

            if (element.closed && selectedElement.indexes.length === element.points.length) {
              context.closePath()
            }

            context.fillStrokeShape(shape)
          }}
          stroke={"#00B3FF"}
          strokeWidth={canvasState[selectedFloor].elements[selectedElement.id] ? canvasState[selectedFloor].elements[selectedElement.id].strokeWidth : 0}
          shadowColor="grey"
          shadowBlur={4}
          shadowOffset={{ x: 2, y: 1 }}
          shadowOpacity={0.3}
          listening={false}
        />
      )}
      {points && points.map((p, i) => {
        return (
          <Label
            key={i}
            x={p.x}
            y={p.y}
          >
            <Tag 
              fill={"white"}
              cornerRadius={6}
              shadowColor='black'
              shadowBlur={10}
              shadowOpacity={0.6}
              shadowOffsetX={1}
              shadowOffsetY={1}
            />
            <Text 
              text={i + 1}
              fontSize={14}
              padding={6}
              fontStyle='300'
              fill="rgb(50, 50, 50)"
            />
          </Label>
        )
      })}
    </>
  )
}

export default LineSelected