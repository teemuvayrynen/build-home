import React, { useState, useEffect } from "react"
import styled from "styled-components"
import { useAppDispatch } from '@/redux/hooks';
import { changeStrokeWidth } from '@/redux/features/canvasSlice'; 

const SelectMenuWall = ({ width, selectedElement }) => {
  const canvasDispatch = useAppDispatch()
  const [value, setValue] = useState(width)

  useEffect(() => {
    setValue(width)
  }, [width])

  const handleChange = (e) => {
    canvasDispatch(changeStrokeWidth({
      id: selectedElement.id,
      strokeWidth: Number(e.target.value),
      floor: selectedElement.floor,
    }))
    setValue(Number(e.target.value))
  }

  return (
    <>
      <Select value={value} onChange={handleChange}>
        <option value={10}>Outer wall</option>
        <option value={5}>Inside wall</option>
      </Select>
    </>
  )
}

const Select = styled.select`
  font-size: 14px;
  border: none;
`

export default SelectMenuWall