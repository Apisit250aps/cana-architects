'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Flicking from '@egjs/react-flicking'
// Import just the core CSS
import '@egjs/react-flicking/dist/flicking.css'
// Import AutoPlay plugin
import { AutoPlay } from '@egjs/flicking-plugins'

export default function ClientSideCarousel({
  images,
  title
}: {
  images: string[]
  title: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flickingRef = useRef<Flicking>(null)

  // Initialize AutoPlay plugin after component mounts
  useEffect(() => {
    const flickingInstance = flickingRef.current
    if (flickingInstance && typeof flickingInstance.addPlugins === 'function') {
      try {
        // Create AutoPlay plugin instance
        const autoplayPlugin = new AutoPlay({
          duration: 3000,
          direction: 'NEXT',
          stopOnHover: true
        })

        flickingInstance.addPlugins(autoplayPlugin)

        return () => {
          if (
            flickingInstance &&
            typeof flickingInstance.removePlugins === 'function'
          ) {
            try {
              flickingInstance.removePlugins(autoplayPlugin)
            } catch (e) {
              console.error('Error removing plugins:', e)
            }
          }
        }
      } catch (e) {
        console.error('Error adding plugins:', e)
      }
    }
  }, [])

  // Navigation functions
  const handlePrev = () => {
    const flickingInstance = flickingRef.current
    if (flickingInstance && typeof flickingInstance.prev === 'function') {
      flickingInstance.prev()
    }
  }

  const handleNext = () => {
    const flickingInstance = flickingRef.current
    if (flickingInstance && typeof flickingInstance.next === 'function') {
      flickingInstance.next()
    }
  }

  return (
    <div className="relative">
      {/* Simplest possible Flicking implementation with only essential props */}
      <Flicking
        ref={flickingRef}
        circular={true}
        className="aspect-[16/9] rounded overflow-hidden"
        onChanged={(e) => setCurrentIndex(e.index)}
        defaultIndex={0}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full h-full">
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`${title} - Image ${index + 1}`}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          </div>
        ))}
      </Flicking>

      {/* Arrow navigation buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 rounded-full flex items-center justify-center z-20"
        aria-label="Previous slide"
      >
        <i className="bx bx-chevron-left"></i>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-12 h-12 rounded-full flex items-center justify-center z-20"
        aria-label="Next slide"
      >
        <i className="bx bx-chevron-right"></i>
      </button>

      {/* Pagination indicators */}
      {/* <div className="flex justify-center gap-2 mt-4 pb-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index ? 'bg-black w-6' : 'bg-transparent'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => {
              const flickingInstance = flickingRef.current
              if (
                flickingInstance &&
                typeof flickingInstance.moveTo === 'function'
              ) {
                flickingInstance.moveTo(index)
              }
            }}
          />
        ))}
      </div> */}

      {/* Image title overlay */}
      <div className="absolute bottom-0 left-0 w-full z-10 bg-gradient-to-t from-black/60 to-transparent p-6 pt-12">
        <p className="text-white text-xl md:text-2xl font-medium">
          {title}{' '}
          <span className="opacity-70">
            • {currentIndex + 1}/{images.length}
          </span>
        </p>
      </div>
    </div>
  )
}
