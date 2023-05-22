import React, { useReducer, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function LevelButton ({ levelState, currentLevel, setCurrentLevel, levelDispatch }) {
  return (
    <>
      <ToggleButtonContainer>
        <ToggleButtonGroup>
          {levelState.map((i) => {
            if (i.id == 0 && i.id == levelState.length - 1) {
              return (
                <LevelToggleButton 
                  bottom={1} 
                  top={1} 
                  center={1}
                  current={currentLevel == i.id ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i.id)}} 
                  key={i.id}
                >
                  {i.id}
                </LevelToggleButton>
              )
            } else if (i.id == 0) {
              return (
                <LevelToggleButton 
                  bottom={1} 
                  current={currentLevel == i.id ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i.id)}} 
                  key={i.id}
                >
                  {i.id}
                </LevelToggleButton>
              )
            } else if (i.id == levelState.length - 1) {
              return (
                <LevelToggleButton 
                  top={1} 
                  current={currentLevel == i.id ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i.id)}} 
                  key={i.id}
                >
                  {i.id}
                </LevelToggleButton>
              )
            } else {
              return (
                <LevelToggleButton 
                  current={currentLevel == i.id ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i.id)}} 
                  key={i.id}
                >
                  {i.id}
                </LevelToggleButton>
              )
            }
          })}
        </ToggleButtonGroup>
        <AddLevelButton onClick={() => { levelDispatch({ type: 'ADD_LEVEL' }); }}>
          <FontAwesomeIcon icon={faPlus} />
        </AddLevelButton>
      </ToggleButtonContainer>

    </>
  )

}

const ToggleButtonContainer = styled.div`
  position: absolute;
  left: 270px;
  top: 70px;
`

const ToggleButtonGroup = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center; 
`

const LevelToggleButton = styled.button`
  background: ${props => props.center ? "rgb(250, 250, 250)" : props.current ? "rgb(230, 230, 230)" : "rgb(250, 250, 250)"};
  border: none;
  width: 30px;
  height: 30px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: ${props => props.bottom ? "none" : "1px solid rgb(230, 230, 230)"};
  border-radius: ${props => props.center ? "5px" : props.top ? "5px 5px 0px 0px" : props.bottom ? "0px 0px 5px 5px" : "0px"};
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
  &:hover {
    background: rgb(230, 230, 230);
  }
`

const AddLevelButton = styled.button`
  background: rgb(250, 250, 250);
  border: none;
  width: 30px;
  height: 30px;
  font-size: 14px;
  margin-top: 10px;
  cursor: pointer;
  box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.3);
  border-radius: 5px;
  &:hover {
    background: rgb(230, 230, 230);
  }
`