import React from "react";
import styled from "styled-components";


export default function PopUpDialog({ colors, header, buttons, handleClick, handleCancelClick }) {
  return (
    <>
      <Container>
        <Header>{header}</Header>
        <FlexButtons>
          <Button color={colors[0]} onClick={handleCancelClick}>{buttons[0]}</Button>
          <Button color={colors[1]} onClick={handleClick}>{buttons[1]}</Button>
        </FlexButtons>
      </Container>
      <Background/>
    </>
  )
}

const Container = styled.div`
  position: absolute;
  top: 40%;
  left: 0;
  right: 0;
  margin: auto;
  transform: translateY(-50%);
  width: 300px;
  height: 150px;
  background: white;
  z-index: 100;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.6);
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`
const Header = styled.h3`
  text-align: center;
  font-weight: 500;
  margin: 0px;
  padding: 0px 20px;
`

const FlexButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const Button = styled.button`
  background: ${props => props.color};
  border: none;
  padding: 8px;
  border-radius: 5px;
  box-shadow: 0px 0px 2px 0px rgba(0,0,0,1);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin: 0px 15px;
  
`

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
`