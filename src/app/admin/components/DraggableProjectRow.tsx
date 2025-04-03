import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  _id: string
  title: string
  slug: string
  location: string
  type: string
  category: 'interior' | 'exterior' | 'product'
  client: string
  coverImage: string
  displayOrder: number
}

interface DraggableProjectRowProps {
  project: Project
  index: number
  moveProject: (dragIndex: number, hoverIndex: number) => void
  onDelete: (projectId: string) => void
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
    type: 'PROJECT',
    item: { index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  })

  const [, drop] = useDrop({
    accept: 'PROJECT',
    hover: (item: { index: number }, monitor) => {
      console.log(monitor)
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return
      
      // Call the move function
      moveProject(dragIndex, hoverIndex)
      
      // Update the index for the dragged item
      item.index = hoverIndex
    }
  })

  drag(drop(ref))

  return (
    <tr 
      ref={ref} 
      className={`${isDragging ? 'opacity-50 bg-base-200' : ''} cursor-move`}
    >
      <td className="w-8">
        <div className="flex justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-6 h-6 text-base-content/50"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" 
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
          <Link href={`/admin/project/${project._id}`} className="btn btn-ghost btn-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default DraggableProjectRow