'use client';
import React, { useState, createContext } from 'react';
import LeftBar from '../components/sideBars/LeftBar.jsx'
import { CanvasProvider } from '../context/canvasContext.jsx'
import CanvasSSRDisabled from '../components/canvas/disableSSR.jsx'
import TopBar from '../components/topBar/index.jsx'
import styled from 'styled-components'


export default function Home() {
 
  
  return (
    <main>
      <TopBar />
      <Container>
        <CanvasProvider>
          <LeftBar />
          <CanvasSSRDisabled />
        </CanvasProvider>
      </Container>
    </main>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0px;
  flex-grow: 0;
  overflow: hidden;
  height: calc(100vh - 50px);
`
