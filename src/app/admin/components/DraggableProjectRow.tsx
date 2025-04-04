import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Image from 'next/image'
import Link from 'next/link'

interface Project {
  _id: string
  title: string
  slug: string
  location: string
  type: string
  category: 'interior' | 'exterior' | 'product'
  client: string
  coverImage: string
  displayOrder?: number
}

interface DraggableProjectRowProps {
  project: Project
  index: number
  moveProject: (dragIndex: number, hoverIndex: number) => void
  onDelete: (id: string) => void
  isDeleting: boolean
}

const DraggableProjectRow = ({
  project,
  index,
  moveProject,
  onDelete,
  isDeleting
}: DraggableProjectRowProps) => {
  const ref = useRef<HTMLTableRowElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'PROJECT_ROW',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'PROJECT_ROW',
    hover: (item: { index: number }, monitor) => {
      if (!ref.current) return
      
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return

      // Get rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()
      
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      
      // Get mouse position
      const clientOffset = monitor.getClientOffset()
      
      // Get pixels to the top
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0
      
      // Only perform the move when the mouse has crossed half of the item's height
      // When dragging downward, only move when the cursor is below 50%
      // When dragging upward, only move when the cursor is above 50%
      
      // Dragging downward
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      
      // Dragging upward
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      // Time to actually perform the action
      moveProject(dragIndex, hoverIndex)
      
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  return (
    <tr 
      ref={ref} 
      className={`${isDragging ? 'opacity-50 bg-base-200' : ''}`}
      style={{ cursor: 'move' }}
    >
      <td className="w-8">
        <div className="flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 text-base-content/50" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" 
            />
          </svg>
        </div>
      </td>
      <td>
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="mask mask-squircle h-12 w-12">
              <Image
                src={project.coverImage || '/images/placeholder-project.jpg'}
                alt={project.title}
                width={64}
                height={64}
              />
            </div>
          </div>
          <div>
            <Link href={`/${project.slug}`} className="font-bold">
              {project.title}
            </Link>
            <div className="text-sm opacity-50">
              {project.location}
            </div>
          </div>
        </div>
      </td>
      <td>
        {project.type}
        <br />
        <span className="badge badge-ghost badge-sm">
          {project.category}
        </span>
      </td>
      <td>{project.client || 'N/A'}</td>
      <td>
        <div className="flex gap-2">
          <Link href={`/${project.slug}`} className="btn btn-ghost btn-xs">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Link>
          <Link href={`/admin/project/${project._id}`} className="btn btn-ghost btn-xs">
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </Link>
          <button
            className="btn btn-ghost btn-xs text-error"
            onClick={() => onDelete(project._id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default DraggableProjectRow