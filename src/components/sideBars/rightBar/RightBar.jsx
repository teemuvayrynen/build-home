import styled from 'styled-components';
import React, { useState, useContext, useEffect } from 'react';
import { CanvasContext } from '@/context/canvasContext';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import globals from "../../../app/globals"
import { rotateElement, changeRectDim, deleteElement } from '@/redux/features/canvasSlice';
import SelectMenuWall from "./SelectMenuWall"
import * as math from "@/functions/math"
import BarItemsForLine from "./BarItemsForLine.jsx"


export default function RightBar() {
  const [visible, setVisible] = useState(false)
  const canvasState = useAppSelector(state => state.canvas.items)
  const canvasDispatch = useAppDispatch()
  const { selectedElement, dragging, drawing, selectedFloor, setSelectedElement } = useContext(CanvasContext)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!dragging[0] && !drawing && selectedElement) {
      setVisible(true)
      const element = canvasState[selectedFloor].elements[selectedElement.id]
      setSelected(element)
    } else {
      setVisible(false)
      setSelected(null)
    }
  }, [selectedElement, dragging, drawing, canvasState, selectedFloor]) 

  return (
    <Container visible={visible ? 1 : 0}>
      {selectedElement && selectedElement.type === "element" && (
        <FlexRow>
          <Text>Rotation:</Text>
          <Input type="number" value={selected ? Math.round(selected.rotation * 100) / 100 : 0} onChange={e => {
            canvasDispatch(rotateElement({
              id: selectedElement.id,
              floor: selectedFloor,
              rotation: e.target.value
            }))
          }} />
        </FlexRow>
      )}
      {selectedElement && selected && selectedElement.type !== "element" && (
        <FlexRow style={{ padding: 15 }}>
          <Text>Wall:</Text>
          <SelectMenuWall width={selected.strokeWidth} selectedElement={selectedElement} />
        </FlexRow>
      )}
      {selectedElement && selected && selectedElement.type === "rectangle" && (
        <>
          <FlexRow>
            <Text>Width:</Text>
            <Input type="number" value={selected ? Math.round(selected.width / globals.lengthParameter * 100) / 100 : 0} onChange={e => {
              canvasDispatch(changeRectDim({
                id: selectedElement.id,
                floor: selectedFloor,
                width: e.target.value * globals.lengthParameter,
                height: selected.height
              }))
            }} />
          </FlexRow>
          <FlexRow>
            <Text>Height:</Text>
            <Input type="number" value={selected ? Math.round(selected.height / globals.lengthParameter * 100) / 100 : 0} onChange={e => {
              canvasDispatch(changeRectDim({
                id: selectedElement.id,
                floor: selectedFloor,
                width: selected.width,
                height: e.target.value * globals.lengthParameter
              }))
            }} />
          </FlexRow>
        </>
      )}
      {selectedElement && selected && selectedElement.type === "line" && (
        <>
          {selectedElement.indexes && selectedElement.indexes.map((item, index) => {
            const point = selected.points[item]
            if (item !== selected.points.length - 1 || selected.closed) {
              return (
                <BarItemsForLine 
                  key={index} 
                  index={item} 
                  point={point} 
                  selected={selected}
                  selectedElement={selectedElement}
                  selectedFloor={selectedFloor}
                  closed={selected.closed}
                />
              )
            }
          })}
        </>
      )}
      {selectedElement && selected && (
        <DeleteButton onClick={() => {
          canvasDispatch(deleteElement({floor: selectedFloor, id: selectedElement.id}))
          setSelectedElement(null)
        }}>
          Delete
        </DeleteButton>
      )}
    </Container>
  )
}

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
  overflow-y: scroll;
`

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

const DeleteButton = styled.button`
  background: #FF0000;
  border: none;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 0px rgba(0,0,0,1);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin: 0px 15px;
  margin-top: 20px;
  margin-bottom: 100px;
  color: white;
  &:hover {
    background: #ff4d4d;
  }
`

const Input = styled.input`
  border: none;
  padding: 8px;
  font-size: 14px;
  width: 70px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0.3);
  border-radius: 6px;
`

