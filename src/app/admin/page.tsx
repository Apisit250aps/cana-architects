/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import DraggableProjectRow from './components/DraggableProjectRow'

// Define TypeScript interfaces
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

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField] = useState<keyof Project>('displayOrder')
  const [sortDirection] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [isSavingOrder, setIsSavingOrder] = useState(false)
  const [hasOrderChanged, setHasOrderChanged] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: '', type: '' })

  const projectsPerPage = 10

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/project?limit=1000`)

        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }

        const data = await response.json()

        // Sort projects by displayOrder if that's the active sort
        let sortedProjects = [...data.projects]
        if (sortField === 'displayOrder') {
          sortedProjects = sortedProjects.sort((a, b) => {
            return sortDirection === 'asc'
              ? (a.displayOrder || 0) - (b.displayOrder || 0)
              : (b.displayOrder || 0) - (a.displayOrder || 0)
          })
        }

        setProjects(sortedProjects)
        setTotalPages(Math.ceil(data.total / projectsPerPage))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [currentPage, sortField, sortDirection])

  // Handle sorting
  const handleSort = () => {}

  // Show toast message
  const showToast = (message: string, type: string) => {
    setToast({ visible: true, message, type })
    setTimeout(() => setToast({ visible: false, message: '', type: '' }), 3000)
  }

  // Move project (reorder)
  const moveProject = useCallback((dragIndex: number, hoverIndex: number) => {
    setProjects((prevProjects) => {
      const newProjects = [...prevProjects]
      const draggedProject = newProjects[dragIndex]

      // Remove the dragged project
      newProjects.splice(dragIndex, 1)
      // Insert it at the new position
      newProjects.splice(hoverIndex, 0, draggedProject)

      // Mark that order has changed
      setHasOrderChanged(true)

      return newProjects
    })
  }, [])

  // Save display order
  const saveDisplayOrder = async () => {
    setIsSavingOrder(true)

    try {
      // Create payload with project IDs and their new order
      const orderData = projects.map((project, index) => ({
        id: project._id,
        displayOrder: index
      }))

      const response = await fetch('/api/project/order', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projects: orderData })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update display order')
      }

      // Update the local projects with new displayOrder values
      setProjects((prev) =>
        prev.map((project, index) => ({
          ...project,
          displayOrder: index
        }))
      )

      setHasOrderChanged(false)
      showToast('Project order saved successfully', 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to save project order',
        'error'
      )
    } finally {
      setIsSavingOrder(false)
    }
  }

  // Delete project
  const handleDelete = async (projectId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this project? This action cannot be undone.'
      )
    ) {
      return
    }

    setIsDeleting(projectId)

    try {
      const response = await fetch(`/api/project/${projectId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete project')
      }

      // Remove project from state
      setProjects(projects.filter((project) => project._id !== projectId))
      showToast('Project deleted successfully', 'success')
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete project',
        'error'
      )
    } finally {
      setIsDeleting(null)
    }
  }

  // Render loading state
  if (isLoading && projects.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Projects</h5>
          <div className="flex justify-center items-center h-60">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Projects</h5>
          <div className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="card">
        {/* Toast notification */}
        {toast.visible && (
          <div className="toast toast-top toast-end z-50">
            <div className={`alert alert-${toast.type}`}>
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <h5 className="card-title m-0">Projects</h5>
            <div className="flex gap-3">
              {hasOrderChanged && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={saveDisplayOrder}
                  disabled={isSavingOrder}
                >
                  {isSavingOrder ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Saving Order...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Order
                    </>
                  )}
                </button>
              )}
              <Link href="/admin/upload" className="btn btn-primary btn-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Project
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th className="w-8">
                    <button
                      className={`btn btn-xs btn-ghost ${
                        sortField === 'displayOrder' ? 'text-primary' : ''
                      }`}
                      onClick={() => handleSort()}
                      title="Sort by display order (enables drag and drop reordering)"
                    >
                      #
                    </button>
                  </th>
                  <th onClick={() => handleSort()} className="cursor-pointer">
                    Project{' '}
                    {sortField === 'title' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort()} className="cursor-pointer">
                    Detail{' '}
                    {sortField === 'type' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th onClick={() => handleSort()} className="cursor-pointer">
                    Client{' '}
                    {sortField === 'client' &&
                      (sortDirection === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10">
                      <div className="flex flex-col items-center gap-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        <p className="text-lg font-medium">No projects found</p>
                        <Link
                          href="/admin/upload"
                          className="btn btn-primary btn-sm"
                        >
                          Create your first project
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : sortField === 'displayOrder' ? (
                  // Draggable rows when display order is the sort field
                  projects.map((project, index) => (
                    <DraggableProjectRow
                      key={project._id}
                      project={project}
                      index={index}
                      moveProject={moveProject}
                      onDelete={handleDelete}
                      isDeleting={isDeleting === project._id}
                    />
                  ))
                ) : (
                  // Regular rows for other sort fields
                  projects.map((project) => (
                    <tr key={project._id}>
                      <td className="w-8"></td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle h-12 w-12">
                              <Image
                                src={
                                  project.coverImage ||
                                  '/images/placeholder-project.jpg'
                                }
                                alt={project.title}
                                width={64}
                                height={64}
                              />
                            </div>
                          </div>
                          <div>
                            <Link
                              href={`/${project.slug}`}
                              className="font-bold"
                            >
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
                          <Link
                            href={`/${project.slug}`}
                            className="btn btn-ghost btn-xs"
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
                          <Link
                            href={`/admin/project/${project._id}`}
                            className="btn btn-ghost btn-xs"
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
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </Link>
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => handleDelete(project._id)}
                            disabled={isDeleting === project._id}
                          >
                            {isDeleting === project._id ? (
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
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* 
  
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 hidden">
              <div className="join">
                <button
                  className="join-item btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`join-item btn ${
                      currentPage === i + 1 ? 'btn-active' : ''
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="join-item btn"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          )}
           */}
        </div>
      </div>
    </DndProvider>
  )
}
