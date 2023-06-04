import styled from 'styled-components';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { CanvasContext } from '@/context/canvasContext';
import { useAppSelector } from '@/redux/hooks';
import { useAppDispatch } from '@/redux/hooks';
import { changeStrokeWidth } from '@/redux/features/canvasSlice';


export default function RightBar() {
  const [visible, setVisible] = useState(false);
  const canvasState = useAppSelector(state => state.canvas.items)
  const { selectedElement, dragging, drawing, selectedFloor } = useContext(CanvasContext)
  const selectedRef = useRef()

  useEffect(() => {
    if (!dragging[0] && !drawing && selectedElement) {
      setVisible(true)
      const element = canvasState[selectedFloor].elements[selectedElement.indexOfElements]
      selectedRef.current = element
    } else {
      setVisible(false)
      selectedRef.current = null
    }
  }, [selectedElement, dragging, drawing, canvasState, selectedFloor])

  useEffect(() => { console.log(visible)}, [visible])
  

  return (
    <Container visible={visible ? 1 : 0}>
      {selectedElement && selectedElement.type === "element" && (
        null
      )}
      {selectedElement && selectedRef.current && selectedElement.type === "rectangle" && (
        <FlexRow>
          <Text>Wall:</Text>
          <SelectMenuWall width={selectedRef.current.strokeWidth} selectedElement={selectedElement} />
        </FlexRow>
      )}
      {selectedElement && selectedRef.current && selectedElement.type === "line" && (
        <FlexRow>
          <Text>Wall:</Text>
          <SelectMenuWall width={selectedRef.current.strokeWidth} selectedElement={selectedElement} />
        </FlexRow>
      )}
    </Container>
  )
}

const SelectMenuWall = ({ width, selectedElement }) => {
  const canvasDispatch = useAppDispatch()
  const [value, setValue] = useState(width)

  const handleChange = (e) => {
    canvasDispatch(changeStrokeWidth({
      strokeWidth: Number(e.target.value),
      floor: selectedElement.floor,
      indexOfElements: selectedElement.indexOfElements
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
  font-size: 16px;
  border: none;
`

const Container = styled.div`
  position: fixed;
  width: 250px;
  height: 100%;
  background: white;
  right: ${props => props.visible ? "0px" : "-250px"};
  top: 50px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
  transition: 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
  justify-content: space-between;
`

const Text = styled.div`
  weight: 400;
  margin: 0;
`

