import React, { useState, useRef } from "react"
import Image from 'next/image.js'
import styled from "styled-components"

const HoverDialog = ({ setSelectedElement, src, element, dim, margin, dragging }) => {
  const [currentList, setCurrentList] = useState([])
  const visible = useRef(false)

  return (
    <div
      onMouseOver={() => { visible.current = true; setCurrentList(element) }}
      onMouseLeave={() => { visible.current = false; setCurrentList([]) }}
      style={{ marginLeft: `${margin}px` }}
    >
      <Image
        alt={"elementIcon"}
        src={src}
        width={dim.width}
        height={dim.height}
        draggable="false"
      />
      {currentList.length > 0 && visible && (
        <ElementContainer>
          {currentList.map((e, index) => {
            return (
              <Image 
                key={index}
                alt={e}
                src={e.src}
                width={e.width}
                height={e.height}
                draggable="true"
                onDragStart={() => {
                  dragging[1](true)
                  setSelectedElement({
                    type: "element",
                    src: e.src,
                    item: e.item
                  })
                }}
                onDragEnd={() => {
                  dragging[1](false)
                }}
                style={{ cursor: "grab", padding: 3 }}
              />
            )
          })}
        </ElementContainer>
      )}
    </div>
  )
}

const ElementContainer = styled.div`
  background: white;
  position: absolute;
  top: 72px;
  z-index: 100;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 100px;
  padding: 10px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  justify-content: space-evenly;
`

export default HoverDialog