import React, { useContext, useEffect, useState, useRef } from 'react'
import { Container, ItemContainer, Header } from "./StyledFunctions.jsx"
import styled from "styled-components"
import Image from 'next/image.js'
import { CanvasContext } from "../../../context/canvasContext.jsx"
import elements from "../../../app/images"


export default function Items() {
  const { setSelectedElement, dragging } = useContext(CanvasContext)

  return (
    <Container>
      <ItemContainer>
        <Header>Rooms</Header>
      </ItemContainer>
      <ItemContainer>
        <Header>Wall Elements</Header>
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

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0px 5px 0px;
`
