import React, { useContext, useEffect, useState, useRef } from 'react'
import { Container, ItemContainer, Header } from "./StyledFunctions.jsx"
import styled from "styled-components"
import Image from 'next/image.js'
import { CanvasContext } from "../../../context/canvasContext.jsx"
import elements from "../../../app/images"


export default function Items() {
  const { currentElement, setCurrentElement } = useContext(CanvasContext)

  return (
    <Container>
      <ItemContainer>
        <Header>Rooms</Header>
      </ItemContainer>
      <ItemContainer>
        <Header>Wall Elements</Header>
        <FlexRow>
          <HoverDialog 
            setCurrentElement={setCurrentElement}
            src={"doors/door-black.svg"}
            element={elements.doorElements}
          />
          <HoverDialog 
            setCurrentElement={setCurrentElement}
            src={"windows/fixed-window.svg"}
            element={elements.windowElements}
          />
        </FlexRow>

      </ItemContainer>
      <ItemContainer>
        <Header>Furniture</Header>
      </ItemContainer>
    </Container>
  )
}

const HoverDialog = ({ setCurrentElement, src, element }) => {
  const [currentList, setCurrentList] = useState([])
  const visible = useRef(false)

  return (
    <div
      onMouseOver={() => { visible.current = true; setCurrentList(element) }}
      onMouseLeave={() => { visible.current = false; setCurrentList([]) }}
    >
      <Image
        alt={"elementIcon"}
        src={src}
        width={30}
        height={30}
      />
      {currentList.length > 0 && visible && (
        <ElementContainer>
          {currentList.map((e, index) => {
            return (
              <Image 
                key={index}
                alt={e}
                src={e.src}
                width={30}
                height={30}
                draggable="true"
                onDragStart={() => {
                  setCurrentElement({
                    type: "element",
                    src: e.altSrc,
                  })
                }}
                style={{ cursor: "grab" }}
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
