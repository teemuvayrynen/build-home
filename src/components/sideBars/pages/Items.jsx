import React, { useContext, useEffect } from 'react'
import { Container, ItemContainer, Header } from "./StyledFunctions.jsx"
import styled from "styled-components"
import Image from 'next/image.js'
import { CanvasContext } from "../../../context/canvasContext.jsx"


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
          <Image 
            alt="doorBlack"
            src="door-black.svg"
            width={30}
            height={30}
            draggable="true"
            onDragStart={() => {
              setCurrentElement({
                type: "element",
                src: "door-white.svg",
              })
            }}
          />
          <Image 
            alt="doorBlackMirror"
            src="door-black-mirror.svg"
            width={30}
            height={30}
            draggable="true"
            onDragStart={() => {
              setCurrentElement({
                type: "element",
                src: "door-white-mirror.svg",
              })
            }}
          />
        </FlexRow>
      </ItemContainer>
      <ItemContainer>
        <Header>Furniture</Header>

      </ItemContainer>
    </Container>
  )
}

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 10px 0px 5px 0px;
`
