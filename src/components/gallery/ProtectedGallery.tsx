'use client'
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ProtectedGallery({ images, title }: { images: string[], title: string }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // Add protection against right-click and other download attempts
  useEffect(() => {
    const galleryElement = galleryRef.current;
    
    if (!galleryElement) return;
    
    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Prevent drag start
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };
    
    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+P, etc.
      if ((e.ctrlKey || e.metaKey) && 
          (e.key === 's' || e.key === 'p' || e.key === 'a')) {
        e.preventDefault();
        return false;
      }
    };
    
    // Add event listeners to the gallery container
    galleryElement.addEventListener('contextmenu', handleContextMenu);
    galleryElement.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listeners on component unmount
    return () => {
      galleryElement.removeEventListener('contextmenu', handleContextMenu);
      galleryElement.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return (
    <div ref={galleryRef} className="select-none">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 relative lg:px-32 py-10"> 
        {images.map((image, index) => { 
          return ( 
            <div key={index} className="relative aspect-[4/3] w-full group"> 
              <div className="absolute inset-0 z-10 bg-transparent pointer-events-none"></div>
              <Image 
                src={image} 
                alt={`${title} - Image ${index + 1}`} 
                fill 
                className="object-cover"
                unoptimized
                draggable="false" 
                // Hide the image from dev tools inspector
                loading="lazy"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end pb-2 justify-center">
                <span className="text-white text-xs bg-black/70 px-3 py-1 rounded-full">
                  {/* © {new Date().getFullYear()}  */}
                  {title}
                </span>
              </div>
            </div> 
          ) 
        })} 
      </div>
    </div>
  );
}