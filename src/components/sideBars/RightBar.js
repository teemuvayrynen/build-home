import styled from 'styled-components';
import React, { useState } from 'react';


export default function RightBar() {
  const [visible, setVisible] = useState(false);
  

  return (
    <Container visible={visible ? 1 : 0}>
      moi
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  right: ${props => props.visible ? "0px" : "-250px"};
  width: 250px;
  min-width: 250px;
  background: white;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
  z-index: 0.5;
  transition: 1s ease-in-out;
`
