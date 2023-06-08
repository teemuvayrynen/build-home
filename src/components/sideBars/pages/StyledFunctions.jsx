import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 0px;
  padding-left: 20px;
  border-bottom: 1px solid #e8e8e8;
  position: relative;
`

export const Header = styled.h4`
  font-weight: 600;
  margin: 0;
`

export const Text = styled.div`
  font-weight: 500;
  font-size: 14px;
`

export const FlexContainer = styled.div`
  margin-top: 5px;
`

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 20px 0px 0px;
`

export const FlexRowSpaceBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 0px 0px;
`