'use client'
import ImageFrame from '@/components/gallery/ImageFrame'
import Footer from '@/components/navigate/Footer'

import { IProject } from '@/models/projects'
import axios from 'axios'
import Image from 'next/image'
import { useState, useEffect, SetStateAction, useCallback } from 'react'

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [filteredProjects, setFilteredProjects] = useState<IProject[]>([])
  const [projects, setProjectData] = useState<IProject[]>([])

  // Fetch data only once when component mounts
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('/api/project')
      setProjectData(response.data.projects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Filter projects when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(
        (project) => project.category === activeFilter
      )
      setFilteredProjects(filtered)
    }
  }, [activeFilter, projects])

  // Handle filter click
  const handleFilterClick = (filter: SetStateAction<string>) => {
    setActiveFilter(filter)

    // Close mobile filter menu after selection on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsFilterOpen(false)
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
            {/* <h1 className="text-xl uppercase font-medium">Cana Architects</h1> */}
          </div>

          {/* Desktop navigation */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex gap-x-4">
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
                    activeFilter === 'all' ? 'text-black font-light' : ''
                  }`}
                >
                  product
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
          <div className="collapse-content bg-base-100 px-5 sm:px-10 lg:px-15  pt-0 pb-4 shadow-md">
            <ul className="flex flex-col gap-y-2 mt-2">
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
                    activeFilter === 'all' ? 'text-black font-light' : ''
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
            isMenuOpen ? 'collapse-open' : 'collapse-close '
          }`}
        >
          <div className="collapse-content bg-base-100 px-5 sm:px-10 lg:px-15  pt-0 pb-4 shadow-md">
            <ul className="flex flex-col gap-y-2 mt-2">
              <li>
                <a
                  href={'/'}
                  className=" text-black lowercase font-extralight hover:text-black"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href={'/about'}
                  className=" text-black lowercase font-extralight hover:text-black"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href={'/contact'}
                  className=" text-black lowercase font-extralight hover:text-black"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-15 bg-base-100 pb-15">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-10 lg:gap-15">
          {filteredProjects.map((project, index) => (
            <ImageFrame
              key={index}
              slug={project.slug}
              coverImage={project.coverImage}
              title={project.title}
              location={project.location}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}