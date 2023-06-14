'use client';
import React from 'react';
import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'



export default function Projects() {
 
  
  return (
    <Container>
      <Header>Projects</Header>
      <ProjectContainer>
        <AddButton>
          <FontAwesomeIcon icon={faPlus} color={"rgb(200, 200, 200)"} size={"3x"} />
        </AddButton>
      </ProjectContainer>
    </Container>
  )
}

const Container = styled.div`
  position: relative
  height: calc(100vh - 50px);
  width: 100vw;
`

const ProjectContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 20px 40px;
`

const AddButton = styled.div`
  background: rgb(240, 240, 240);
  width: 200px;
  height: 200px;
  border: solid rgb(220, 220, 220);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: rgb(220, 220, 220);
    border: solid rgb(200, 200, 200);
  }
`

const Header = styled.h1`
  text-align: center;
  color: rgb(20, 20, 20);
  margin-top: 20px;
`