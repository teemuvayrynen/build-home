import React, { useContext, useRef, useEffect } from 'react'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import { useAppDispatch } from '@/redux/hooks'
import { moveElement, rotateElement } from '@/redux/features/canvasSlice'
import { CanvasContext } from '@/context/canvasContext'

export default function Image_({ element, dragging }) {
  const [img] = useImage(element.src)
  const canvasDispatch = useAppDispatch()
  const { selectedFloor, selectedElement, setSelectedElement, activeTool } = useContext(CanvasContext)
  const imageRef = useRef(null)
  const trRef = useRef()

  useEffect(() => {
    if (selectedElement && element.id === selectedElement.id) {
      trRef.current.nodes([imageRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [selectedElement, element])

  
  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      id: element.id,
      floor: selectedFloor,
      point: pos
    }))
    dragging[1](false)
  }

  return (
    <>
      <Image
        ref={imageRef}
        alt="element"
        x={element.x}
        y={element.y}
        rotation={element.rotation}
        image={img}
        draggable={activeTool === "default" ? true : false}
        onDragStart={() => { dragging[1](true) }}
        onDragEnd={e => { handleDragEnd(e) }}
        onClick={() => {
          setSelectedElement({
            id: element.id,
            type: "element",
            floor: selectedFloor
          })
        }}
        onTransformEnd={() => {
          const node = imageRef.current
          canvasDispatch(rotateElement({
            id: element.id,
            floor: selectedFloor,
            rotation: node.attrs.rotation
          }))
        }}
      />
      {selectedElement && selectedElement.id === element.id && (
        <Transformer
          ref={trRef}
        />
      )}
    </>
  )
}