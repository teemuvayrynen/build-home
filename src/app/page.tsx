'use client';
import React, { useState } from 'react';

import SideBar from '../components/sideBar'
import Canvas from '../components/Canvas'
import TopBar from '../components/TopBar'

export default function Home() {
  const [activeTool, setActiveTool] = useState(0)
  const [elements, setElements] = useState([]) 


  return (
    <main style={{ width: "100vw", height: "100vh"}}>
      <TopBar />
      <div className='container'>
        <SideBar 
          activeTool={activeTool} 
          setActiveTool={setActiveTool}
          setElements={setElements} />
        {/* <Canvas 
          activeTool={activeTool} 
          elements={elements}
          setElements={setElements} /> */}
      </div>
    </main>
  )
}
