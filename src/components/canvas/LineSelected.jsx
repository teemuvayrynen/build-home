import React, { useContext, useState, useEffect } from "react"
import { useAppSelector } from "@/redux/hooks";
import { CanvasContext } from "../../context/canvasContext"
import { Label, Tag, Text } from "react-konva";


const LineSelected = () => {
  const { selectedFloor, selectedElement, drawing, dragging } = useContext(CanvasContext)
  const [points, setPoints] = useState(null)
  const canvasState = useAppSelector(state => state.canvas.items)

  useEffect(() => {
    setPoints(null)
    if (!selectedElement || dragging[0] || drawing) return
    if (selectedElement.type !== "line") return

    const element = canvasState[selectedFloor].elements[selectedElement.id]
    let arr = []
    for (let i = 0; i < element.points.length - 1; i++) {
      const p1 = {
        x: element.x + element.points[i].x,
        y: element.y + element.points[i].y
      }
      const p2 = {
        x: element.x + element.points[i + 1].x,
        y: element.y + element.points[i + 1].y
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