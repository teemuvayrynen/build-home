import React, { useRef, useEffect, useContext, useState } from 'react'
import { Container, ItemContainer, Header, Text, FlexContainer, FlexRowSpaceBetween } from "./StyledFunctions.jsx"
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
          if (element.closed) {
            wallLength += math.lengthBetweenPointsMeters(
              {x: element.x + points[0].x, y: element.y + points[0].y}, 
              {x: element.x + points.at(-1).x, y: element.y + points.at(-1).y})
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
          <FlexRowSpaceBetween>
            <Text>Square meters:</Text>
            {specs && (
              <Text>{specs.squareMeter} m²</Text>
            )}
          </FlexRowSpaceBetween>
          <FlexRowSpaceBetween>
            <Text>Wall length:</Text>
            {specs && (
              <Text>{specs.wallLength} m</Text>
            )}
          </FlexRowSpaceBetween>
        </FlexContainer>
      </ItemContainer>
      <ItemContainer>
        <Header>Elements</Header>
        <FlexContainer>
          <FlexRowSpaceBetween>
            <Text>Door amount:</Text>
            {specs && (
              <Text>{specs.doors}</Text>
            )}
          </FlexRowSpaceBetween>
          <FlexRowSpaceBetween>
            <Text>Window amount:</Text>
            {specs && (
              <Text>{specs.windows}</Text>
            )}
          </FlexRowSpaceBetween>
        </FlexContainer>
      </ItemContainer>
      <ItemContainer>
        <Header>Price</Header>
        <FlexContainer>
          <FlexRowSpaceBetween>
            <Text>Wall price:</Text>
            {price && (
              <Text>{price.wallPrice} €</Text>
            )}
          </FlexRowSpaceBetween>
          <FlexRowSpaceBetween>
            <Text>Doors price:</Text>
            {price && (
              <Text>{price.doorsPrice} €</Text>
            )}
          </FlexRowSpaceBetween>
          <FlexRowSpaceBetween>
            <Text>Windows price:</Text>
            {price && (
              <Text>{price.windowsPrice} €</Text>
            )}
          </FlexRowSpaceBetween>
          <FlexRowSpaceBetween>
            <Text>Together:</Text>
            {price && (
              <Text>{price.together} €</Text>
            )}
          </FlexRowSpaceBetween>
        </FlexContainer>
      </ItemContainer>
    </Container>
  )
}