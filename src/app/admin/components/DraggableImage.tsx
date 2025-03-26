import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Image from 'next/image'

interface ImageItem {
  id: string
  src: string
}

interface DraggableImageProps {
  image: ImageItem
  index: number
  moveImage: (dragIndex: number, hoverIndex: number) => void
  removeImage: (id: string) => void
}

const DraggableImage = ({
  image,
  index,
  moveImage,
  removeImage
}: DraggableImageProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (item: { index: number }, monitor) => {
      console.log(monitor)
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return
      moveImage(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={`relative group w-48 h-48 border rounded-lg m-2 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <Image
        src={image.src}
        alt="Project image"
        width={192}
        height={192}
        className="object-cover w-full h-full rounded-lg"
      />
      <button
        type="button"
        className="btn btn-error btn-circle btn-xs absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => removeImage(image.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-base-300 bg-opacity-70 text-base-content text-xs">
        Drag to reorder
      </div>
    </div>
  )
}

export default DraggableImage
