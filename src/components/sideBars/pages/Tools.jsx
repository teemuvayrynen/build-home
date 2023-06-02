import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer, faArrowsUpDownLeftRight, faPen, faTrash, faScissors, faBezierCurve } from '@fortawesome/free-solid-svg-icons'
import { faSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import React, { useContext, useState } from "react";
import { CanvasContext } from "../../../context/canvasContext.jsx"
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { deleteElements, addHistory, deleteLevel } from "../../../redux/features/canvasSlice"
import PopUpDialog from "../../PopUpDialog.jsx";
import { Container, ItemContainer, Header } from "./StyledFunctions.jsx"

export default function Tools() {
  const { activeTool, setActiveTool, currentLevel, setCurrentLevel } = useContext(CanvasContext);
  const [popUpVisible, setPopUpVisible] = useState(false)
  const canvasDispatch = useAppDispatch()
  const canvasState = useAppSelector(state => state.canvas.items)

  const handleRemoveLevel = () => {
    canvasDispatch(deleteLevel(currentLevel))
    if (currentLevel !== 0) {
      setCurrentLevel(prevState => prevState - 1)
    }
    setPopUpVisible(false)
  }

  const handleCancelClick = () => {
    setPopUpVisible(false)
  }

  return (
    <>
      <Container>
        <ItemContainer>
          <Header>Edit</Header>
          <ToolRow>
            <ToolColumn>
              <Tool onClick={() => { setActiveTool("default") }} active={activeTool === "default" ? 1 : 0}>
                <FontAwesomeIcon icon={faArrowPointer} fixedWidth/>
              </Tool>
              <Text>Object</Text>
            </ToolColumn>
            <ToolColumn>
              <Tool onClick={() => { setActiveTool("move") }} active={activeTool === "move" ? 1 : 0}>
                <FontAwesomeIcon icon={faArrowsUpDownLeftRight} fixedWidth/>
              </Tool>
              <Text>Move</Text>
            </ToolColumn>
            <ToolColumn>
              <Tool onClick={() => { setActiveTool("divide") }} active={activeTool === "divide" ? 1 : 0}>
                <FontAwesomeIcon icon={faScissors} fixedWidth/>
              </Tool>
              <Text>Divide</Text>
            </ToolColumn>
          </ToolRow>
        </ItemContainer>
        <ItemContainer>
          <Header>Draw</Header>
          <ToolRow>
            <ToolColumn>
              <Tool onClick={() => { setActiveTool("line") }} active={activeTool === "line" ? 1 : 0}>
                <FontAwesomeIcon icon={faPen} fixedWidth/>
              </Tool>
              <Text>Line</Text>
            </ToolColumn>
            <ToolColumn>
              <Tool onClick={() => { setActiveTool("bezier") }} active={activeTool === "bezier" ? 1 : 0}>
                <FontAwesomeIcon icon={faBezierCurve} fixedWidth/>
              </Tool>
              <Text>Bezier</Text>
            </ToolColumn>
            <ToolColumn>
              <Tool onClick={() => { setActiveTool("rectangle") }} active={activeTool === "rectangle" ? 1 : 0}>
                <FontAwesomeIcon icon={faSquare} fixedWidth/>
              </Tool>
              <Text>Rect</Text>
            </ToolColumn>
          </ToolRow>
        </ItemContainer>
        <ItemContainer>
          <Header>Delete</Header>
          <ToolRow>
            <ToolColumn>
              <Tool onClick={() => { 
                if (canvasState.length === 1) return
                setPopUpVisible(true)
              }}>
                <FontAwesomeIcon icon={faTrashCan} fixedWidth/>
              </Tool>
              <Text>Level</Text>
            </ToolColumn>
            <ToolColumn>
              <Tool onClick={() => {
                canvasDispatch(addHistory({
                  type: "deleteElements",
                  currentLevel: currentLevel,
                }))
                canvasDispatch(deleteElements(currentLevel))
              }}>
                <FontAwesomeIcon icon={faTrash} fixedWidth/>
              </Tool>
              <Text>Elements</Text>
            </ToolColumn>
          </ToolRow>
        </ItemContainer>
      </Container>
      {popUpVisible && 
        <PopUpDialog 
          colors={["#e8e8e8", "#ff4d4d"]}
          header="Are you sure you want to delete this level?"
          buttons={["Cancel", "Delete"]}
          handleClick={handleRemoveLevel}
          handleCancelClick={handleCancelClick}
        />
      }
    </>
  )
}

const ToolRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 0px 0px 0px;
  justify-content: space-evenly;
  width: 70%;
`

const ToolColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const Tool = styled.div`
  border-radius: 5px;
  padding: 2px;
  color: ${props => props.active ? 'black' : '#999'};
  border: ${props => props.active ? '3px solid black' : '3px solid #999'};
  cursor: pointer;
  &:hover {
    color: black;
    border: 3px solid black;
  }
`

const Text = styled.p`
  font-size: 12px;
  margin: 8px 0px;
  font-weight: 600;
`