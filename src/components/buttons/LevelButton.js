import React, { useReducer, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { addLevel, copyElements } from "../../redux/features/canvasSlice"
import PopUpDialog from "../PopUpDialog"


export default function LevelButton ({ currentLevel, setCurrentLevel }) {
  const canvasState = useAppSelector(state => state.canvas.items)
  const canvasDispatch = useAppDispatch()
  const [popUpVisible, setPopUpVisible] = useState(false)

  const handleCancelClick = () => {
    setPopUpVisible(false)
    canvasDispatch(addLevel())
    setCurrentLevel(canvasState.length)
  }

  const handleLevelAdd = () => {
    canvasDispatch(addLevel())
    setPopUpVisible(false)
    canvasDispatch(copyElements(currentLevel))
    setCurrentLevel(canvasState.length)
  }

  return (
    <>
      <ToggleButtonContainer>
        <ToggleButtonGroup>
          {canvasState.map((i) => {
            if (i.id == 0 && i.id == canvasState.length - 1) {
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
            } else if (i.id == canvasState.length - 1) {
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
        <AddLevelButton onClick={() => { setPopUpVisible(true) }}>
          <FontAwesomeIcon icon={faPlus} />
        </AddLevelButton>
      </ToggleButtonContainer>
      {popUpVisible && 
        <PopUpDialog 
          setPopUpVisible={setPopUpVisible}
          colors={["#e8e8e8", "#00B3FF"]}
          header="Do you wan to copy existing floor plan?"
          buttons={["Cancel", "Copy"]}
          handleClick={handleLevelAdd}
          handleCancelClick={handleCancelClick}
        />
      
      }
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