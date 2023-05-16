import styled from 'styled-components';
import React, {useState} from 'react';
import Tools from './pages/tools';
import Items from './pages/items';
import Info from './pages/info';

export default function SideBar({activeTool, setActiveTool, setElements}) {
  const [active, setActive] = useState(0);

  return (
    <Container>
      <SideBarNav>
        <Item onClick={() => { setActive(0) }} isActive={active == 0 ? true : false} >Tools</Item>
        <Item onClick={() => { setActive(1) }} isActive={active == 1 ? true : false}>Items</Item>
        <Item onClick={() => { setActive(2) }} isActive={active == 2 ? true : false}>Info</Item>
      </SideBarNav>
      {active == 0 && <Tools activeTool={activeTool} setActiveTool={setActiveTool} setElements={setElements} />}
      {active == 1 && <Items />}
      {active == 2 && <Info />}
    </Container>
  )
}

const Container = styled.div`
  height: 100%;
  width: 250px;
  min-width: 250px;
  background: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  margin-top: 50px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.4);
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
  color: ${props => props.isActive ? '#000' : '#999'};
`