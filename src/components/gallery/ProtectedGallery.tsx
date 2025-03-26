'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function ProtectedGallery({
  images,
  title
}: {
  images: string[]
  title: string
}) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [carouselOpen, setCarouselOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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
          goToNextImage()
        } else if (e.key === 'ArrowLeft') {
          goToPrevImage()
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
  }

  const closeCarousel = () => {
    setCarouselOpen(false)
    document.body.style.overflow = '' // Restore scrolling
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToPrevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    )
  }

  return (
    <div ref={galleryRef} className="select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 relative lg:px-32 py-10">
        {images.map((image, index) => {
          return (
            <div
              key={index}
              className="relative aspect-[4/3] w-full group cursor-pointer"
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
          )
        })}
      </div>

      {/* Carousel Overlay */}
      {carouselOpen && (
        <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeCarousel}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-50"
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

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>

          {/* Image container */}
          <div className="relative w-full h-full max-w-6xl max-h-screen flex items-center justify-center px-4 sm:px-8 md:px-16 lg:px-24">
            <div className="relative w-full h-[80vh] select-none">
              <Image
                src={images[currentImageIndex]}
                alt={`${title} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                unoptimized
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <span className="text-white text-sm bg-black/70 px-4 py-2 rounded-full">
                  {title}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={goToPrevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black rounded-full p-3  transition-colors"
            aria-label="Previous image"
          >
            <i className="bx bx-chevron-left"></i>
          </button>
          <button
            onClick={goToNextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-black rounded-full p-3  transition-colors"
            aria-label="Next image"
          >
             <i className="bx bx-chevron-right"></i>
          </button>

          {/* Thumbnail navigation (optional, for larger screens) */}
          <div className="absolute bottom-4 left-0 right-0 overflow-x-auto px-4 hidden md:flex justify-center space-x-2">
            {images.map((thumb, index) => (
              <div
                key={`thumb-${index}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-16 w-24 relative flex-shrink-0 cursor-pointer transition-all duration-200 ${
                  index === currentImageIndex
                    ? 'border-2 border-white'
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <Image
                  src={thumb}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
