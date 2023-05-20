import React, { useReducer, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

function reducer(state, action) {
  if (action.type === 'addLevel') {
    const prev = state[0];
    return [prev + 1, ...state];
    
  }
  throw Error('Unknown action.');
}

export default function LevelButton () {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [levelState, levelDispatch] = useReducer(reducer, [0])

  return (
    <>
      <ToggleButtonContainer>
        <ToggleButtonGroup>
          {levelState.map((i) => {
            if (i == 0 && i == levelState.length - 1) {
              return (
                <LevelToggleButton 
                  bottom={true} 
                  top={true} 
                  onlyone={true}
                  current={currentLevel == i ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i)}} 
                  key={i}
                >
                  {i}
                </LevelToggleButton>
              )
            } else if (i == 0) {
              return (
                <LevelToggleButton 
                  bottom={true} 
                  current={currentLevel == i ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i)}} 
                  key={i}
                >
                  {i}
                </LevelToggleButton>
              )
            } else if (i == levelState.length - 1) {
              return (
                <LevelToggleButton 
                  top={true} 
                  current={currentLevel == i ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i)}} 
                  key={i}
                >
                  {i}
                </LevelToggleButton>
              )
            } else {
              return (
                <LevelToggleButton 
                  current={currentLevel == i ? 1 : 0} 
                  onClick={() => {setCurrentLevel(i)}} 
                  key={i}
                >
                  {i}
                </LevelToggleButton>
              )
            }
          })}
        </ToggleButtonGroup>
        <AddLevelButton onClick={() => { levelDispatch({ type: 'addLevel' }); }}>
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
  flex-direction: column;
  align-items: center;
  justify-content: center; 
`

const LevelToggleButton = styled.button`
  background: ${props => props.onlyone ? "rgb(250, 250, 250)" : props.current ? "rgb(230, 230, 230)" : "rgb(250, 250, 250)"};
  border: none;
  width: 30px;
  height: 30px;
  font-size: 14px;
  cursor: pointer;
  border-bottom: ${props => props.bottom ? "none" : "1px solid rgb(230, 230, 230)"};
  border-radius: ${props => props.onlyone ? "5px" : props.top ? "5px 5px 0px 0px" : props.bottom ? "0px 0px 5px 5px" : "0px"};
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