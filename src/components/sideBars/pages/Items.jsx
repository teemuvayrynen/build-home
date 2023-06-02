import React from 'react'
import styled from 'styled-components'
import { Container, ItemContainer, Header } from "./StyledFunctions.jsx"


export default function Items() {

  return (
    <Container>
      <ItemContainer>
        <Header>Rooms</Header>

      </ItemContainer>
      <ItemContainer>
        <Header>Wall Elements</Header>

      </ItemContainer>
      <ItemContainer>
        <Header>Furniture</Header>

      </ItemContainer>
    </Container>
  )
}
