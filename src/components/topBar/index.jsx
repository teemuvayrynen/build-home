import React from "react"
import styled from "styled-components"

export default function TopBar() {

  return (
    <Container>
      <h3 style={{ color: "white", fontWeight: 600, marginLeft: 40 }}>Build your home</h3>
      <div 
        className="userInfo"
        style={{ cursor: "pointer"}}
      >
        <div style={{ background: "white", width: "30px", height: "30px", borderRadius: "50%", marginRight: 10 }}/>
        <h4 style={{ color: "white", fontWeight: 400 }}>Matti Meikäläinen</h4>
      </div>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  background: rgb(40, 40, 40);
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
  box-shadow: 0 4px 2px -2px rgba(0,0,0,0.5);s
`