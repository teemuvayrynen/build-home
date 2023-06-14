import React from "react"
import Image from 'next/image.js'

const Images = ({ element, setSelectedElement, dragging }) => {
  return (
    <>
      {element.map((e, i) => {
        return (
          <Image 
            key={i}
            alt={e.item}
            src={e.src}
            width={e.width}
            height={e.height}
            draggable="true"
            onDragStart={() => {
              dragging[1](true)
              setSelectedElement({
                type: "element",
                src: e.altSrc,
                item: e.item
              })
            }}
            onDragEnd={() => {
              dragging[1](false)
            }}
            style={{ cursor: "grab" }}
          />
        )
      })}
    </>
  )
}

export default Images