import Image from 'next/image.js'
import { useContext, useRef, useState, useEffect } from 'react'
import styled from "styled-components"
import elements from "../../../app/images"
import { CanvasContext } from "../../../context/canvasContext.jsx"
import { Container, FlexContainer, FlexRow, FlexRowSpaceBetween, Header, ItemContainer, Text } from "./StyledFunctions.jsx"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import * as math from "../../../functions/math.js"
import { addElement, removeGeneratedRooms } from '@/redux/features/canvasSlice'


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
          type: "rectangle",
          x: room.x,
          y: room.y,
          width: room.width,
          height: room.height,
          strokeWidth: 5,
          generated: true,
        }
        const dispatchObj = {
          element: rectObject,
          floor: selectedFloor,
          indexOfElements: canvasState[selectedFloor].elements.length,
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
              src={"doors/door-black.svg"}
              element={elements.doorElements}
              dim={{width: 30, height: 30}}
              margin={0}
              dragging={dragging}
            />
            <HoverDialog 
              setSelectedElement={setSelectedElement}
              src={"windows/fixed-window.svg"}
              element={elements.windowElements}
              dim={{width: 10, height: 30}}
              margin={20}
              dragging={dragging}
            />
          </FlexRow>
        </FlexContainer>
      </ItemContainer>
      <ItemContainer>
        <Header>Furniture</Header>
      </ItemContainer>
    </Container>
  )
}

const HoverDialog = ({ setSelectedElement, src, element, dim, margin, dragging }) => {
  const [currentList, setCurrentList] = useState([])
  const visible = useRef(false)

  return (
    <div
      onMouseOver={() => { visible.current = true; setCurrentList(element) }}
      onMouseLeave={() => { visible.current = false; setCurrentList([]) }}
      style={{ marginLeft: `${margin}px` }}
    >
      <Image
        alt={"elementIcon"}
        src={src}
        width={dim.width}
        height={dim.height}
        draggable="false"
      />
      {currentList.length > 0 && visible && (
        <ElementContainer>
          {currentList.map((e, index) => {
            return (
              <Image 
                key={index}
                alt={e}
                src={e.src}
                width={e.width}
                height={e.height}
                draggable="true"
                onDragStart={() => {
                  dragging[1](true)
                  setSelectedElement({
                    type: "element",
                    src: e.altSrc,
                    item: e.item
                  })
                }}
                onDragEnd={() => {
                  dragging[1](false)
                }}
                style={{ cursor: "grab", padding: 3 }}
              />
            )
          })}
        </ElementContainer>
      )}
    </div>
  )
}

const ElementContainer = styled.div`
  background: white;
  position: absolute;
  top: 72px;
  z-index: 100;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100px;
  padding: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  justify-content: space-evenly;
`

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
