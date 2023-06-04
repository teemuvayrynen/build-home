import React, { useRef, useEffect, useContext, useState } from 'react'
import { Container, ItemContainer, Header } from "./StyledFunctions.jsx"
import styled from "styled-components"
import { useAppSelector } from '@/redux/hooks'
import globals from "../../../app/globals.js"
import { CanvasContext } from '@/context/canvasContext.jsx'
import * as math from "../../../functions/math.js"

export default function Info() {
  const canvasState = useAppSelector(state => state.canvas.items)
  const { selectedFloor } = useContext(CanvasContext)
  const [price, setPrice] = useState(null)
  const [specs, setSpecs] = useState(null)

  useEffect(() => {
    let windowAmount = 0
    let doorAmount = 0
    let wallLength = 0
    let squareMeter = 0
    const elements = canvasState[selectedFloor].elements
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      switch (element.type) {
        case "element": {
          if (element.item === "fixed-window") {
            windowAmount++
          } else if (element.item === "outside-door") {
            doorAmount++
          }
          break
        }
        case "rectangle": {
          const height = (element.height / globals.lengthParameter)
          const width = (element.width / globals.lengthParameter)
          wallLength += height * 2 + width * 2
          if (element.strokeWidth === 10) {
            squareMeter += height * width
          }
          break
        }
        case "line": {
          const points = element.points
          for (let j = 0; j < points.length - 1; j++) {
            const l = math.lengthBetweenPointsMeters(
              {x: element.x + points[j].x, y: element.y + points[j].y}, 
              {x: element.x + points[j + 1].x, y: element.y + points[j + 1].y})
            wallLength += l
          }
          if (element.closed && element.strokeWidth === 10) {
            squareMeter += math.calculateArea(element)
            
          }
        }
      }
    }

    setSpecs({
      squareMeter:  Math.round(squareMeter * 100) / 100,
      wallLength: Math.round(wallLength * 100) / 100,
      doors: doorAmount,
      windows: windowAmount
    })
    const tempWallPrice = Math.round(wallLength * globals.wallPricePerMeter * 100) / 100
    setPrice({
      wallPrice: tempWallPrice,
      doorsPrice: doorAmount * globals.doorPrice,
      windowsPrice: windowAmount * globals.windowPrice,
      together: windowAmount * globals.windowPrice + doorAmount * globals.doorPrice + tempWallPrice
    })

  }, [canvasState, selectedFloor])

  return (
    <Container>
      <ItemContainer>
        <Header>Specs</Header>
        <FlexContainer>
          <FlexRow>
            <Text>Square meters:</Text>
            {specs && (
              <Text>{specs.squareMeter} m²</Text>
            )}
          </FlexRow>
          <FlexRow>
            <Text>Wall length:</Text>
            {specs && (
              <Text>{specs.wallLength} m</Text>
            )}
          </FlexRow>
        </FlexContainer>
      </ItemContainer>
      <ItemContainer>
        <Header>Elements</Header>
        <FlexContainer>
          <FlexRow>
            <Text>Door amount:</Text>
            {specs && (
              <Text>{specs.doors}</Text>
            )}
          </FlexRow>
          <FlexRow>
            <Text>Window amount:</Text>
            {specs && (
              <Text>{specs.windows}</Text>
            )}
          </FlexRow>
        </FlexContainer>
      </ItemContainer>
      <ItemContainer>
        <Header>Price</Header>
        <FlexContainer>
          <FlexRow>
            <Text>Wall price:</Text>
            {price && (
              <Text>{price.wallPrice} €</Text>
            )}
          </FlexRow>
          <FlexRow>
            <Text>Doors price:</Text>
            {price && (
              <Text>{price.doorsPrice} €</Text>
            )}
          </FlexRow>
          <FlexRow>
            <Text>Windows price:</Text>
            {price && (
              <Text>{price.windowsPrice} €</Text>
            )}
          </FlexRow>
          <FlexRow>
            <Text>Together:</Text>
            {price && (
              <Text>{price.together} €</Text>
            )}
          </FlexRow>
        </FlexContainer>
      </ItemContainer>
    </Container>
  )
}

const FlexContainer = styled.div`
  margin-top: 10px;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 5px 20px 0px 0px;
`

const Text = styled.div`
  font-weight: 500;
  font-size: 14px;
  padding-bottom: 3px;
`
