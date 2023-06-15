import { useContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import styled from "styled-components"
import elements from "../../../../app/images"
import { CanvasContext } from "../../../../context/canvasContext.jsx"
import { Container, FlexContainer, FlexRow, FlexRowSpaceBetween, Header, ItemContainer, Text } from "../StyledFunctions.jsx"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import * as math from "../../../../functions/math.js"
import { addElement, removeGeneratedRooms } from '@/redux/features/canvasSlice'
import HoverDialog from "./HoverDialog.jsx"
import Images from "./Images.jsx"


export default function Items() {
  const { setSelectedElement, dragging, selectedFloor } = useContext(CanvasContext)
  const canvasState = useAppSelector(state => state.canvas.items)
  const canvasDispatch = useAppDispatch()
  const [num, setNum] = useState(0)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {console.log(canvasState)}, [canvasState])

  const handleSubmit = () => {
    if (!generating && num > 0) {
      canvasDispatch(removeGeneratedRooms(selectedFloor))
      setGenerating(true)
      const rooms = math.generateRooms(canvasState, selectedFloor, num)
      rooms.forEach((room, index) => {
        const rectObject = {
          id: uuidv4(),
          type: "rectangle",
          x: room.x,
          y: room.y,
          width: room.width,
          height: room.height,
          strokeWidth: 5,
          generated: true,
        }
        const dispatchObj = {
          id: rectObject.id,
          element: rectObject,
          floor: selectedFloor,
        }
        canvasDispatch(addElement(dispatchObj))
      })
      setGenerating(false)
    }
  }

  return (
    <Container>
      <ItemContainer>
        <Header>Rooms</Header>
        <FlexContainer>
          <FlexRowSpaceBetween>
            <Text>Number of rooms:</Text>
            <Input 
              name="numOfRooms" 
              type="number" 
              value={num} 
              onChange={(e) => { 
                if (e.target.value <= 100) {
                  setNum(e.target.value)
                } else {
                  setNum(prev => prev)
                }
              }}
            />
          </FlexRowSpaceBetween>
          <FlexRow style={{ justifyContent: "center" }}>
            <SubmitButton onClick={handleSubmit} >
              Generate
              <FontAwesomeIcon icon={faArrowDown} style={{ marginLeft: 10 }} />
            </SubmitButton>
          </FlexRow>
        </FlexContainer>
      </ItemContainer>
      <ItemContainer>
        <Header>Wall Elements</Header>
        <FlexContainer>
          <FlexRow>
            <HoverDialog 
              setSelectedElement={setSelectedElement}
              src={"/doors/door.svg"}
              element={elements.doorElements}
              dim={{width: 30, height: 30}}
              margin={0}
              dragging={dragging}
            />
            <HoverDialog 
              setSelectedElement={setSelectedElement}
              src={"/windows/fixed-window.svg"}
              element={elements.windowElements}
              dim={{width: 10, height: 30}}
              margin={20}
              dragging={dragging}
            />
          </FlexRow>
        </FlexContainer>
      </ItemContainer>
      <ItemContainer>
        <Header>Bathroom</Header>
        <FlexRow>
          <Images 
            element={elements.bathroomElements} 
            setSelectedElement={setSelectedElement}
            dragging={dragging}/>
        </FlexRow>
      </ItemContainer>
    </Container>
  )
}

const Input = styled.input`
  max-width: 40px;
  padding: 5px;
  border: none;
  box-shadow: 0px 0px 4px rgba(0,0,0,0.6);
  border-radius: 5px;
`

const SubmitButton = styled.button`
  background: #242836;
  border: none;
  font-size: 14px;
  padding: 10px;
  border-radius: 5px;
  font-weight: 500;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.6);
  cursor: pointer;
  margin-top: 10px;
  color: white;
  &:hover {
    background: rgb(70, 70, 70);
  }
  &:active {
    transform: scale(0.98);
  }
`
