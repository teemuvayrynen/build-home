import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer, faArrowsUpDownLeftRight, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import React, { useContext } from "react";
import { CanvasContext } from "../../../context/canvasContext"

export default function Tools() {
  const { activeTool, setActiveTool, levelDispatch, currentLevel, setCurrentLevel } = useContext(CanvasContext);

  return (
    <Container>
      <ToolContainer>
        <Header>Edit</Header>
        <ToolRow>
          <ToolColumn>
            <Tool onClick={() => { setActiveTool(0) }} active={activeTool == 0 ? 1 : 0}>
              <FontAwesomeIcon icon={faArrowPointer} fixedWidth/>
            </Tool>
            <Text>Object</Text>
          </ToolColumn>
          <ToolColumn>
            <Tool onClick={() => { setActiveTool(1) }} active={activeTool == 1 ? 1 : 0}>
              <FontAwesomeIcon icon={faArrowsUpDownLeftRight} fixedWidth/>
            </Tool>
            <Text>Move</Text>
          </ToolColumn>
        </ToolRow>
      </ToolContainer>
      <ToolContainer>
        <Header>Draw</Header>
        <ToolRow>
          <ToolColumn>
            <Tool onClick={() => { setActiveTool(2) }} active={activeTool == 2 ? 1 : 0}>
              <FontAwesomeIcon icon={faPen} fixedWidth/>
            </Tool>
            <Text>Line</Text>
          </ToolColumn>
          <ToolColumn>
            <Tool onClick={() => { setActiveTool(3) }} active={activeTool == 3 ? 1 : 0}>
              <FontAwesomeIcon icon={faSquare} fixedWidth/>
            </Tool>
            <Text>Rectangle</Text>
          </ToolColumn>
        </ToolRow>
      </ToolContainer>
      <ToolContainer>
        <Header>Delete</Header>
        <ToolRow>
          <ToolColumn>
            <Tool onClick={() => { 
              levelDispatch({ 
                type: 'DELETE_LEVEL', 
                currentLevel: currentLevel 
              }) 
              if (currentLevel != 0) {
                setCurrentLevel(currentLevel - 1)
              }
            }}>
              <FontAwesomeIcon icon={faTrashCan} fixedWidth/>
            </Tool>
            <Text>Level</Text>
          </ToolColumn>
          <ToolColumn>
            <Tool onClick={() => { levelDispatch({ type: 'DELETE_ALL_ELEMENTS', currentLevel: currentLevel }) }}>
              <FontAwesomeIcon icon={faTrash} fixedWidth/>
            </Tool>
            <Text>Elements</Text>
          </ToolColumn>
        </ToolRow>
      </ToolContainer>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ToolContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  border-bottom: 1px solid #e8e8e8;
`

const ToolRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px 0px 0px 5px;
`

const ToolColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 15px;
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

const Header = styled.h4`
  font-weight: 600;
  margin: 0px 0px 0px 40px;
`

const Text = styled.p`
  font-size: 12px;
  margin: 8px 0px;
  font-weight: 600;
`