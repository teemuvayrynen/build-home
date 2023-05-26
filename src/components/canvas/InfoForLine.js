import React, { useEffect, useContext, useRef } from 'react';
import { CanvasContext } from "../../context/canvasContext"
import gloabls from "../../app/globals"

export default function InfoForLine ({ dragging}) {
  const { levelState, currentLevel, currentElement } = useContext(CanvasContext);
  const length = useRef([])
  const angle = useRef([])

  useEffect(() => {

  }, [])

  return (
    <>
      
    </>
  )
}