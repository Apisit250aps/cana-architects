'use client'
import ImageFrame from '@/components/gallery/ImageFrame'
import Footer from '@/components/navigate/Footer'
import { IProject } from '@/models/projects'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect, SetStateAction, useCallback } from 'react'

export default function Home() {
  // Navigation and filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  
  // Project data states
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])
  const [projects, setProjectData] = useState<IProject[]>([])
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  
  // Projects per page
  const limit = 12

  // Fetch data with pagination and filtering
  const fetchData = useCallback(async (page: number, category: string | null = null) => {
    setIsLoading(true)
    try {
      // Build URL with query parameters
      let url = `/api/project?page=${page}&limit=${limit}`
      
      // Add category filter if not 'all'
      if (category && category !== 'all') {
        url += `&category=${category}`
      }
      
      // Add sort parameters (sorting by displayOrder by default)
      url += `&sortBy=displayOrder&sortOrder=asc`
      
      const response = await axios.get(url)
      
      if (page === 1) {
        // Replace projects for first page
        setProjectData(response.data.projects)
      } else {
        // Append projects for subsequent pages
        setProjectData(prev => [...prev, ...response.data.projects])
      }
      
      // Update pagination information
      setTotalPages(response.data.totalPages)
      setHasMore(page < response.data.totalPages)
      
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial data load
  useEffect(() => {
    setCurrentPage(1) // Reset to page 1
    fetchData(1, activeFilter !== 'all' ? activeFilter : null)
  }, [activeFilter, fetchData])

  // Update filtered projects when projects change
  useEffect(() => {
    setFilteredProjects(projects)
  }, [projects])

  // Handle filter click
  const handleFilterClick = (filter: SetStateAction<string>) => {
    setActiveFilter(filter)
    setCurrentPage(1) // Reset to page 1 when filter changes
    
    // Close mobile filter menu after selection on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsFilterOpen(false)
    }
  }

  // Load more projects
  const loadMoreProjects = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      fetchData(nextPage, activeFilter !== 'all' ? activeFilter : null)
    }
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-base-100">
        <div className="navbar px-5 sm:px-10 lg:px-15 flex flex-col lg:flex-row items-center">
          <div className="navbar-start justify-center lg:justify-start">
            <a href={'/'}>
              <Image
                width={64}
                height={64}
                src={'/assets/logo/cana-architects-v.png'}
                alt="Cana Architects Logo"
              />
            </a>
          </div>

          {/* Desktop navigation */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex gap-x-4">
              {/* <li>
                <button
                  onClick={() => handleFilterClick('all')}
                  className={`text-base lowercase font-extralight hover:text-black ${
                    activeFilter === 'all' ? 'text-black font-light' : ''
                  }`}
                >
                  All
                </button>
              </li> */}
              <li>
                <button
                  onClick={() => handleFilterClick('exterior')}
                  className={`text-base lowercase font-extralight hover:text-black ${
                    activeFilter === 'exterior' ? 'text-black font-light' : ''
                  }`}
                >
                  Exterior
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFilterClick('interior')}
                  className={`text-base lowercase font-extralight hover:text-black ${
                    activeFilter === 'interior' ? 'text-black font-light' : ''
                  }`}
                >
                  Interior
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFilterClick('product')}
                  className={`text-base lowercase font-extralight hover:text-black ${
                    activeFilter === 'product' ? 'text-black font-light' : ''
                  }`}
                >
                  Product
                </button>
              </li>
            </ul>
          </div>

          <div className="navbar-end hidden lg:flex">
            <ul className="flex gap-x-3">
              <li>
                <a
                  href={'/'}
                  className="text-base lowercase font-extralight hover:text-black"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href={'/about'}
                  className="text-base lowercase font-extralight hover:text-black"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href={'/contact'}
                  className="text-base lowercase font-extralight hover:text-black"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          {/* Mobile navigation buttons */}
          <div className="navbar-end lg:hidden flex flex-row justify-between w-full mt-4">
            <button
              className="btn btn-ghost btn-sm border p-0"
              onClick={() => {
                setIsMenuOpen(false)
                setIsFilterOpen(!isFilterOpen)
              }}
              id="filter"
              aria-label="filter"
            >
              <i className="bx bx-filter bx-sm"></i>
            </button>

            <button
              className="btn btn-ghost btn-sm border p-0"
              onClick={() => {
                setIsFilterOpen(false)
                setIsMenuOpen(!isMenuOpen)
              }}
              id="menu"
              aria-label="menu"
            >
              <i className="bx bx-menu-alt-right bx-sm"></i>
            </button>
          </div>
        </div>

        {/* Mobile filter collapse */}
        <div
          className={`collapse lg:hidden ${
            isFilterOpen ? 'collapse-open' : 'collapse-close hidden'
          }`}
        >
          <div className="collapse-content bg-base-100 px-5 sm:px-10 lg:px-15 pt-0 pb-4 shadow-md">
            <ul className="flex flex-col gap-y-2 mt-2">
              <li>
                <button
                  onClick={() => handleFilterClick('all')}
                  className={`text-base lowercase font-extralight hover:text-black block w-full text-left ${
                    activeFilter === 'all' ? 'text-black font-light' : ''
                  }`}
                >
                  All
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFilterClick('exterior')}
                  className={`text-base lowercase font-extralight hover:text-black block w-full text-left ${
                    activeFilter === 'exterior' ? 'text-black font-light' : ''
                  }`}
                >
                  Exterior
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFilterClick('interior')}
                  className={`text-base lowercase font-extralight hover:text-black block w-full text-left ${
                    activeFilter === 'interior' ? 'text-black font-light' : ''
                  }`}
                >
                  Interior
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFilterClick('product')}
                  className={`text-base lowercase font-extralight hover:text-black block w-full text-left ${
                    activeFilter === 'product' ? 'text-black font-light' : ''
                  }`}
                >
                  Product
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Mobile menu collapse */}
        <div
          className={`collapse lg:hidden ${
            isMenuOpen ? 'collapse-open' : 'collapse-close hidden'
          }`}
        >
          <div className="collapse-content bg-base-100 px-5 sm:px-10 lg:px-15 pt-0 pb-4 shadow-md">
            <ul className="flex flex-col gap-y-2 mt-2">
              <li>
                <a
                  href={'/'}
                  className="text-black lowercase font-extralight hover:text-black"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href={'/about'}
                  className="text-black lowercase font-extralight hover:text-black"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href={'/contact'}
                  className="text-black lowercase font-extralight hover:text-black"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-15 bg-base-100 pb-15">
        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-10 lg:gap-15">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ImageFrame
                key={`${project._id}-${index}`}
                slug={project.slug}
                coverImage={project.coverImage}
                title={project.title}
                location={project.location}
              />
            ))
          ) : !isLoading ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-lg font-light">No projects found in this category.</p>
            </div>
          ) : null}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center my-10">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        )}

        {/* Load more button */}
        {hasMore && filteredProjects.length > 0 && !isLoading && (
          <div className="flex justify-center mt-10">
            <button 
              onClick={loadMoreProjects}
              className="btn btn-outline border-gray-300 min-w-40"
            >
              Load More Projects
            </button>
          </div>
        )}

        {/* Pagination info */}
        {filteredProjects.length > 0 && (
          <div className="text-center text-sm text-gray-500 mt-6">
            Showing {filteredProjects.length} of {totalPages * limit} projects
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}