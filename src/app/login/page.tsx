'use client';
import React from 'react';
import styled from "styled-components"
import { Formik } from "formik"

export default function Login() {
 
  
  return (
    <Container>
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={(values) => {
         console.log(values)
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <LoginBox onSubmit={handleSubmit}>
            <Header>Login</Header>
            <ItemBox>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                placeholder='email'
              />
              {errors.email && touched.email && errors.email}
              <Input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                placeholder='password'
              />
              {errors.password && touched.password && errors.password}
              <Button type="submit" >
                Login
              </Button>
            </ItemBox>
            <Text>
              Not registered? <span style={{ color: "#00B3FF", cursor: "pointer" }}>Create an account</span>
            </Text>
          </LoginBox>
        )}
      </Formik>
    </Container>
  )
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(40, 40, 40);
`

const LoginBox = styled.form`
  width: 350px;
  height: 320px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 18px;
`

const Header = styled.h2`
  color: rgb(20, 20, 20);
  font-weight: 400;
  margin: 0;
`

const ItemBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 220px;
`

const Input = styled.input`
  border: none;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.8);
  background: rgb(240, 240, 240);
  width: 100%;
  font-size: 16px;
  border-radius: 4px;
  height: 40px;
  box-sizing: border-box;
  margin-bottom: 25px;
  padding: 0px 10px;
`

const Button = styled.button`
  background: #00B3FF;
  border: none;
  font-size: 16px;
  border-radius: 4px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 1);
  cursor: pointer;
  color: white;
  font-weight: 400;
  width: 100%;
  height: 40px;
  &:active {
    transform: scale(0.98);
  }
`

const Text = styled.div`
  color: grey;
  font-size: 12px;
`