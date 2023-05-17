import styled from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowPointer, faArrowsUpDownLeftRight, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import React, { useContext } from "react";
import { CanvasContext } from "../../../context/canvasContext"

export default function Tools() {
  const { activeTool, setActiveTool, setElements } = useContext(CanvasContext);

  return (
    <Container>
      <ToolContainer>
        <Header>Edit</Header>
        <ToolRow>
          <Tool onClick={() => { setActiveTool(0) }} active={activeTool == 0 ? 1 : 0}>
            <FontAwesomeIcon icon={faArrowPointer} fixedWidth/>
          </Tool>
          <Tool onClick={() => { setActiveTool(1) }} active={activeTool == 1 ? 1 : 0}>
            <FontAwesomeIcon icon={faArrowsUpDownLeftRight} fixedWidth/>
          </Tool>
        </ToolRow>
      </ToolContainer>
      <ToolContainer>
        <Header>Draw</Header>
        <ToolRow>
          <Tool onClick={() => { setActiveTool(2) }} active={activeTool == 2 ? 1 : 0}>
            <FontAwesomeIcon icon={faPen} fixedWidth/>
          </Tool>
        </ToolRow>
      </ToolContainer>
      <ToolContainer>
        <Header>Delete</Header>
        <ToolRow>
          <Tool onClick={() => { setElements([])}}>
            <FontAwesomeIcon icon={faTrash} fixedWidth/>
          </Tool>
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
  padding: 15px 0px;
`

const Tool = styled.div`
  border-radius: 5px;
  padding: 3px;
  margin-left: 20px;
  color: ${props => props.active ? 'black' : '#999'};
  border: ${props => props.active ? '4px solid black' : '4px solid #999'};
  cursor: pointer;

  &:hover {
    color: black;
    border: 4px solid black;
  }
`

const Header = styled.h4`
  font-weight: 600;
  margin: 0px 0px 0px 40px;
`