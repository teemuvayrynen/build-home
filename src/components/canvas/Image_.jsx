import React, { useContext } from 'react'
import { Image } from 'react-konva'
import useImage from 'use-image'
import { useAppDispatch } from '@/redux/hooks'
import { moveElement } from '@/redux/features/canvasSlice'
import { CanvasContext } from '@/context/canvasContext'

export default function Image_({ index, element }) {
  const [img] = useImage(element.src)
  const canvasDispatch = useAppDispatch()
  const { selectedFloor } = useContext(CanvasContext)
  
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
        alt="element"
        x={element.x}
        y={element.y}
        image={img}
        draggable={true}
        onDragEnd={e => { handleDragEnd(e) }}
      />
    </>
  )
}