import React, { useContext, useRef, useEffect } from 'react'
import { Image, Transformer } from 'react-konva'
import useImage from 'use-image'
import { useAppDispatch } from '@/redux/hooks'
import { moveElement, rotateElement } from '@/redux/features/canvasSlice'
import { CanvasContext } from '@/context/canvasContext'

export default function Image_({ index, element }) {
  const [img] = useImage(element.src)
  const canvasDispatch = useAppDispatch()
  const { selectedFloor, selectedElement, setSelectedElement, activeTool } = useContext(CanvasContext)
  const imageRef = useRef(null)
  const trRef = useRef()

  useEffect(() => {
    if (selectedElement && imageRef.current && imageRef.current._id === selectedElement.id) {
      trRef.current.nodes([imageRef.current])
      trRef.current.getLayer().batchDraw()
    }
  }, [selectedElement])

  
  const handleDragEnd = (e) => {
    const pos = e.target.position()
    canvasDispatch(moveElement({
      floor: selectedFloor,
      indexOfElements: index,
      point: pos
    }))
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
        onDragEnd={e => { handleDragEnd(e) }}
        onClick={() => {
          setSelectedElement({
            id: imageRef.current._id
          })
        }}
        onTransformEnd={() => {
          const node = imageRef.current
          canvasDispatch(rotateElement({
            floor: selectedFloor,
            indexOfElements: index,
            rotation: node.attrs.rotation
          }))
        }}
      />
      {selectedElement && imageRef.current && selectedElement.id === imageRef.current._id && (
        <Transformer
          ref={trRef}
          resizeEnabled={false}
        />
      )}
    </>
  )
}