import styled from 'styled-components';
import React, { useState, useContext } from 'react';
import Tools from './pages/Tools.jsx';
import Items from './pages/items/Items.jsx';
import Info from './pages/Info.jsx';
import { CanvasContext } from '../../context/canvasContext.jsx';


export default function LeftBar() {
  const [active, setActive] = useState(0);
  const { setActiveTool } = useContext(CanvasContext);

  return (
    <Container>
      <SideBarNav>
        <Item onClick={() => { setActive(0); setActiveTool("default") }} active={active == 0 ? 1 : 0} >Tools</Item>
        <Item onClick={() => { setActive(1); setActiveTool("default") }} active={active == 1 ? 1 : 0}>Items</Item>
        <Item onClick={() => { setActive(2); setActiveTool("default") }} active={active == 2 ? 1 : 0}>Info</Item>
      </SideBarNav>
      {active == 0 && <Tools />}
      {active == 1 && <Items />}
      {active == 2 && <Info />}
    </Container>
  )
}

const Container = styled.div`
  width: 250px;
  min-width: 250px;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
  z-index: 1;
`

const SideBarNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  padding: 20px 20px;
  border-bottom: 1px solid #e8e8e8;
`

const Item = styled.button`
  font-weight: 400;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 14px;
  color: ${props => props.active ? '#000' : '#999'};
`