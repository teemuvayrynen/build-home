import { Image } from 'react-konva'
import useImage from 'use-image'

export default function Image_({ element }) {
  const [img] = useImage(element.src)

  return (
    <>
      <Image
        alt="element"
        x={element.point.x}
        y={element.point.y}
        image={img}
        draggable={true}
      />
    </>
  )
}