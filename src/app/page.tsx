'use client'
import ImageFrame from '@/components/gallery/ImageFrame'
import Image from 'next/image'
import { useState, useEffect, SetStateAction } from 'react'

interface Project {
  src: string
  title: string
  location: string
  type: string
}

export default function Home() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])

  const projects = [
    {
      src: 'A ROCKET.jpg',
      title: 'A ROCKET',
      location: 'Chonburi, Thailand',
      type: 'exterior'
    },
    {
      src: 'BAAN PHALANG.jpg',
      title: 'BAAN PHALANG',
      location: 'Khao Yai, Thailand',
      type: 'exterior'
    },
    {
      src: 'RUEDUFON.png',
      title: 'RUEDUFON',
      location: 'Chiangdao, Chiangmai',
      type: 'exterior'
    },
    {
      src: 'VIN PRINT DESIGN.png',
      title: 'VIN PRINT DESIGN',
      location: 'Bangkok, Thailand',
      type: 'interior'
    },
    {
      src: 'X3 TARA RESORT.jpg',
      title: 'X3 TARA RESORT',
      location: 'Nan, Thailand',
      type: 'interior'
    },
    {
      src: 'BAAN RIM NAAM.png',
      title: 'BAAN RIM NAAM',
      location: 'Khao Yai, Thailand',
      type: 'interior'
    },
    {
      src: 'X3 KHAOYAI.jpg',
      title: 'X3 KHAOYAI',
      location: 'Khao Yai, Thailand',
      type: 'exterior'
    },
    {
      src: 'KHUEN POOL VILLA.jpg',
      title: 'KHUEN POOL VILLA',
      location: 'Ranong, Thailand',
      type: 'interior'
    },
    {
      src: 'PARK 51.png',
      title: 'PARK 51',
      location: 'Bangkok, Thailand',
      type: 'exterior'
    },
    {
      src: 'DOI CHANG VILLA.jpg',
      title: 'DOI CHANG',
      location: 'Doi Chang, Chiangrai',
      type: 'exterior'
    },
    {
      src: 'PPP GEMS.png',
      title: 'PPP GEMS',
      location: 'Everywhere',
      type: 'interior'
    }
  ]

  // Filter projects when activeFilter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter(
        (project) => project.type === activeFilter
      )
      setFilteredProjects(filtered)
    }
  }, [activeFilter])

  // Handle filter click
  const handleFilterClick = (filter: SetStateAction<string>) => {
    setActiveFilter(filter)
    // Close mobile filter menu after selection on mobile
    if (window.innerWidth < 1024) {
      setIsFilterOpen(false)
    }
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-base-100">
        <div className="navbar px-5 sm:px-10 lg:px-15 flex flex-col lg:flex-row items-center">
          <div className="navbar-start justify-center lg:justify-start">
            <Image
              width={192}
              height={192}
              src={'/assets/logo/cana-architects-h.png'}
              alt={''}
            />
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
                  onClick={() => handleFilterClick('all')}
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
              className="btn btn-ghost btn-sm border"
              onClick={() => {
                setIsMenuOpen(false)
                setIsFilterOpen(!isFilterOpen)
              }}
            >
              <i className="bx bx-filter"></i>
            </button>

            <button
              className="btn btn-ghost btn-sm border"
              onClick={() => {
                setIsFilterOpen(false)
                setIsMenuOpen(!isMenuOpen)
              }}
            >
              <i className="bx bx-menu-alt-right"></i>
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
                  onClick={() => handleFilterClick('all')}
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
        </div>
      </div>

      <div className="px-5 sm:px-10 lg:px-15 bg-base-100 pb-15">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-10 lg:gap-15">
          {filteredProjects.map((project, index) => (
            <ImageFrame
              key={index}
              src={`/assets/projects/${project.src}`}
              title={project.title}
              location={project.location}
            />
          ))}
        </div>
      </div>

      <footer className="footer footer-horizontal footer-center bg-base-100 text-black pb-10">
        <aside>
          <Image
            width={256}
            height={256}
            src={'/assets/logo/cana-architects-logo-h.png'}
            alt={''}
          />
          <nav>
            <div className="grid grid-flow-col gap-4">
              <a>
                <i className="bx bxl-tiktok bx-sm"></i>
              </a>
              <a>
                <i className="bx bxl-facebook bx-sm"></i>
              </a>
              <a>
                <i className="bx bxl-instagram bx-sm"></i>
              </a>
            </div>
          </nav>
          
        </aside>
      </footer>
    </>
  )
}
