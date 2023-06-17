import React, { useState } from "react"
import styled from "styled-components"

import { useAppDispatch } from '@/redux/hooks';
import * as math from "@/functions/math"
import { movePoint } from '@/redux/features/canvasSlice';

const BarItemsForLine = ({ selected, index, point, selectedElement, selectedFloor }) => {
  const [length, setLength] = useState(() => {
    const p1 = {
      x: selected.x + point.x,
      y: selected.y + point.y
    }
    const p2 = {
      x: selected.x + selected.points[index + 1].x,
      y: selected.y + selected.points[index + 1].y
    }

    return math.lengthBetweenPointsMeters(p1, p2)
  })
  const canvasDispatch = useAppDispatch()


  return (
    <FlexRow style={{ paddingLeft: 20, paddingRight: 20 }}>
      <Text>{index + 1}</Text>
      <Input 
        type="number" 
        value={length} 
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value >= 0.2) {
            const p1 = {
              x: selected.x + point.x,
              y: selected.y + point.y
            }
            const p2 = {
              x: selected.x + selected.points[index + 1].x,
              y: selected.y + selected.points[index + 1].y
            }
            const p = math.getNewPointByLength(p1, p2, length)
            canvasDispatch(movePoint({
              type: "line",
              id: selectedElement.id,
              floor: selectedFloor,
              point: p,
              index: index + 1
            }))
          }
        }}
        onChange={e => {
          setLength(e.target.value)
        }}
      />
    </FlexRow>
  )
}

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px;
  border-bottom: 1px solid #e8e8e8;
  justify-content: space-between;
  align-items: center;
`

const Text = styled.div`
  weight: 400;
  margin: 0;
  font-size: 14px;
`

const Input = styled.input`
  border: none;
  padding: 8px;
  font-size: 14px;
  width: 70px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0.3);
  border-radius: 6px;
`

export default BarItemsForLine