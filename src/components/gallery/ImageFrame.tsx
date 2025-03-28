import Image from 'next/image'

export default function ImageFrame({
  coverImage,
  title,
  location,
  slug
}: {
  coverImage: string
  title: string
  location: string
  slug: string
}) {
  return (
    <a
      href={`${slug}`}
      className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer group"
    >
      <Image 
        src={coverImage} 
        alt={coverImage.slice(-3)} 
        fill 
        unoptimized 
        className="object-cover transition-all duration-700 ease-out group-hover:scale-105 md:group-hover:scale-105"
      />

      {/* Desktop-only overlay and hover effects */}
      <div className="hidden md:block">
        {/* Overlay that increases in intensity on hover */}
        <div className="absolute inset-0 bg-base-200/0 transition-colors duration-700 ease-out group-hover:bg-base-200/90" />
        
        {/* Text that slides up on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-center transform translate-y-full opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 px-6 py-3">
            <h3 className="text-lg font-light text-black">{title}</h3>
            <p className="text-sm font-extralight text-black/90">{location}</p>
          </div>
        </div>
      </div>

      {/* Mobile-specific text overlay */}
      <div className="md:hidden absolute inset-0 bg-black/50 flex items-end p-4">
        <div className="text-center w-full">
          <h3 className="text-lg font-light text-white">{title}</h3>
          <p className="text-sm font-extralight text-white/90">{location}</p>
        </div>
      </div>
      
    </a>
  )
}
