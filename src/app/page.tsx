'use client';
import React, { useState, createContext } from 'react';
import LeftBar from '../components/sideBars/LeftBar'
import { CanvasProvider } from '../context/canvasContext'
import CanvasSSRDisabled from '../components/canvas/disableSSR'
import TopBar from '../components/topBar'


export default function Home() {
 
  
  return (
    <main style={{ width: "100vw", height: "100vh"}}>
      <TopBar />
      <div className='container'>
        <CanvasProvider>
          <LeftBar />
          <CanvasSSRDisabled />
        </CanvasProvider>
      </div>
    </main>
  )
}
