import React, { useContext, useEffect, useRef } from "react"
import styled from "styled-components"
import { CanvasContext } from "../context/canvasContext"
import { useAppSelector, useAppDispatch } from "@/redux/hooks"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScissors, faLock, faLayerGroup, faBezierCurve } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { deleteElement, changeToBezier } from "@/redux/features/canvasSlice"

export default function ContextMenu() {
  const { contextMenuObj, setContextMenuObj, setSelectedElement, selectedFloor, selectedElement } = useContext(CanvasContext)
  const canvasState = useAppSelector(state => state.canvas.items)
  const canvasDispatch = useAppDispatch()
  const elementRef = useRef()

  useEffect(() => {
    if (contextMenuObj && selectedElement) {
      const element = canvasState[selectedElement.floor].elements[selectedElement.id]
      elementRef.current = element
    }
  }, [selectedElement, canvasState, contextMenuObj])

  const handleDelete = () => {
    canvasDispatch(deleteElement({floor: selectedFloor, id: selectedElement.id }))
    setContextMenuObj(null)
    setSelectedElement(null)
  }

  const handleSplit = () => {
    setContextMenuObj(null)
    setSelectedElement(null)
  }

  const handleBezier = () => {
    canvasDispatch(changeToBezier({floor: selectedFloor, id: selectedElement.id, indexes: selectedElement.indexes}))
    setContextMenuObj(null)
    setSelectedElement(null)
  }
  
  return (
    <>
      {contextMenuObj && selectedElement && elementRef.current && (
        <Container x={contextMenuObj.x} y={contextMenuObj.y}>
          {selectedElement.type === "line" && selectedElement.indexes.length < elementRef.current.points.length && (
            <>
              <FlexRow onClick={handleSplit} style={{ borderRadius: "8px 8px 0px 0px" }}>
                <Item>Split</Item>
                <FontAwesomeIcon icon={faScissors} />
              </FlexRow>
              <hr style={{ margin: 0 }}/>
            </>
          )}
          {selectedElement.type === "line" && selectedElement.indexes.length === elementRef.current.points.length && (
            <>
              <FlexRow onClick={handleDelete} style={{ borderRadius: "8px 8px 0px 0px" }}>
                <Item>Lock</Item>
                <FontAwesomeIcon icon={faLock} />
              </FlexRow>
              <hr style={{ margin: 0 }}/>
            </>
          )}
          {selectedElement.type === "line" && (
            <>
              <FlexRow onClick={handleBezier} style={{ borderRadius: "0px 0px 0px 0px" }}>
                <Item>Bezier</Item>
                <FontAwesomeIcon icon={faBezierCurve} />
              </FlexRow>
              <hr style={{ margin: 0 }}/>

            </>
          )}
          {/* <hr style={{ margin: 0 }}/>
          <FlexRow onClick={handleDelete} style={{ borderRadius: "0px 0px 0px 0px" }}>
            <Item>Group</Item>
            <FontAwesomeIcon icon={faLayerGroup} />
          </FlexRow> */}
          <FlexRow onClick={handleDelete} style={{ borderRadius: "0px 0px 8px 8px" }}>
            <Item>Delete</Item>
            <FontAwesomeIcon icon={faTrashCan} />
          </FlexRow>
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  position: absolute;
  top: ${props => `${props.y}px`};
  left: ${props => `${props.x}px`};
  background: white;
  position: flex;
  flex-direction: column;
  jusitfy-content: flex-start;
  cursor: pointer;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  border-radius: 8px;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  &:hover {
    background: rgb(240, 240, 240);
  }
`

const Item = styled.div`
  font-size: 12px;
  padding-right: 25px;
`

