'use client';
import React from 'react';
import LeftBar from '@/components/sideBars/LeftBar.jsx'
import { CanvasProvider } from '@/context/canvasContext.jsx'
import CanvasSSRDisabled from '@/components/canvas/disableSSR.jsx'
import styled from 'styled-components'


export default function Project() {
 
  return (
    <Container>
      <CanvasProvider>
        <LeftBar />
        <CanvasSSRDisabled />
      </CanvasProvider>
    </Container>
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