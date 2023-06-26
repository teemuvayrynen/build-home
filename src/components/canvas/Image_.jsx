import React, { useContext, useRef, useEffect } from 'react'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import { useAppDispatch } from '@/redux/hooks'
import { moveElement, editElement, addHistoryAsync } from '@/redux/features/canvasSlice'
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
    canvasDispatch(addHistoryAsync({floor: selectedFloor}))
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
        scaleX={element.scaleX}
        scaleY={element.scaleY}
        draggable={activeTool === "default" && !element.locked ? true : false}
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
          canvasDispatch(editElement({
            id: element.id,
            floor: selectedFloor,
            rotation: node.attrs.rotation,
            scaleX: node.attrs.scaleX,
            scaleY: node.attrs.scaleY
          }))
          canvasDispatch(addHistoryAsync({floor: selectedFloor}))
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