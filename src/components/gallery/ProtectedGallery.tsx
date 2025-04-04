'use client'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
// import dynamic from 'next/dynamic'
import Flicking from '@egjs/react-flicking'

// // Dynamically import Flicking to avoid SSR issues
// const Flicking = dynamic(() => import('@egjs/react-flicking'), {
//   ssr: false,
// })

// Dynamically import CSS
const FlickingStyles = () => {
  useEffect(() => {
    // // Add Flicking CSS
    // import('@egjs/react-flicking/dist/flicking.css')
    // // Optional: Add Flicking plugins if needed
    // import('@egjs/flicking-plugins/dist/arrow.css')
  }, [])
  return null
}

export default function ImageCarousel({
  images,
  title
}: {
  images: string[]
  title: string
}) {
  const flickingRef = useRef<Flicking>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  // const flickingRef = useRef<unknown>(null)
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial dimensions
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Add protection against right-click and other download attempts
  useEffect(() => {
    const galleryElement = galleryRef.current

    if (!galleryElement) return

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }

    // Prevent drag start
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault()
      return false
    }

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+P, etc.
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 's' || e.key === 'p' || e.key === 'a')
      ) {
        e.preventDefault()
        return false
      }

      // Handle arrow keys for carousel navigation when open
      if (carouselOpen) {
        if (e.key === 'ArrowRight') {
          flickingRef.current?.next()
        } else if (e.key === 'ArrowLeft') {
          flickingRef.current?.prev()
        } else if (e.key === 'Escape') {
          closeCarousel()
        }
      }
    }

    // Add event listeners to the gallery container
    galleryElement.addEventListener('contextmenu', handleContextMenu)
    galleryElement.addEventListener('dragstart', handleDragStart)
    document.addEventListener('keydown', handleKeyDown)

    // Clean up event listeners on component unmount
    return () => {
      galleryElement.removeEventListener('contextmenu', handleContextMenu)
      galleryElement.removeEventListener('dragstart', handleDragStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [carouselOpen])

  const openCarousel = (index: number) => {
    setCurrentImageIndex(index)
    setCarouselOpen(true)
    document.body.style.overflow = 'hidden' // Prevent background scrolling
    
    // Wait for the carousel to open before setting the index
    setTimeout(() => {
      flickingRef.current?.moveTo(index)
    }, 100)
  }

  const closeCarousel = () => {
    setCarouselOpen(false)
    document.body.style.overflow = '' // Restore scrolling
  }
  
  // Handle Flicking events
  const handleFlickingChange = (e: { index: number }) => {
    setCurrentImageIndex(e.index)
  }

  return (
    <>
      <FlickingStyles />
      <div ref={galleryRef} className="select-none">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 relative lg:px-12 py-10">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-[16/9] w-full group cursor-pointer"
              onClick={() => openCarousel(index)}
            >
              <div className="absolute inset-0 z-10 bg-transparent pointer-events-none"></div>
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-cover"
                unoptimized
                draggable="false"
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end pb-2 justify-center">
                <span className="text-white text-xs bg-black/70 px-3 py-1 rounded-full">
                  {title}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Flicking Carousel Overlay */}
        {carouselOpen && (
          <div className="fixed inset-0 bg-white/95 z-50 flex flex-col">
            {/* Top navigation bar */}
            <div className="bg-white w-full py-4 px-6 flex justify-between items-center">
              <div className="text-black font-medium flex items-center">
                <span className="mr-4">{title}</span>
                <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {images.length}
                </span>
              </div>
              <button
                onClick={closeCarousel}
                className="text-black p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close carousel"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Carousel container */}
            <div className="flex-1 relative">
              <Flicking
                ref={flickingRef}
                className="h-full"
                align="center"
                circular={true}
                defaultIndex={currentImageIndex}
                onChanged={handleFlickingChange}
                inputType={["touch", "mouse"]}
                bound={true}
                renderOnlyVisible={true}
                moveType="snap"
              >
                {images.map((image, index) => (
                  <div key={index} className="flicking-panel h-full w-full flex items-center justify-center p-4">
                    <div className="relative w-full h-full max-h-[calc(80vh-120px)]">
                      <Image
                        src={image}
                        alt={`${title} - Image ${index + 1}`}
                        fill
                        className="object-contain"
                        unoptimized
                        draggable="false"
                        onContextMenu={(e) => e.preventDefault()}
                        sizes={`${dimensions.width}px`}
                        priority={index === currentImageIndex}
                      />
                    </div>
                  </div>
                ))}
              </Flicking>

              {/* Navigation buttons */}
              <button
                onClick={() => flickingRef.current?.prev()}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-black rounded-full p-3 hover:bg-white transition-colors z-10"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={() => flickingRef.current?.next()}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-black rounded-full p-3 hover:bg-white transition-colors z-10"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            {/* Bottom thumbnail navigation (optional) */}
            {/* <div className="bg-white border-t p-2 overflow-x-auto whitespace-nowrap">
              <div className="flex gap-2 px-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative h-16 w-24 flex-shrink-0 cursor-pointer transition-all duration-300 ${
                      currentImageIndex === index ? 'ring-2 ring-blue-500 opacity-100' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => {
                      setCurrentImageIndex(index)
                      flickingRef.current?.moveTo(index)
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover rounded-sm"
                      unoptimized
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        )}
      </div>
    </>
  )
}