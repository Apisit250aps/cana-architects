import Image from 'next/image'

type FrameProps = {
  src: string
  title: string
  location: string
}

export default function ImageFrame({ src, title, location }: FrameProps) {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden group">
      {/* รูปภาพ */}
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover transition duration-300 group-hover:blur-sm"
      />
      {/* <div className="text-center p-4 absolute bottom-0 lg:hidden block bg-white/30 backdrop-blur-md">
        <p className="text-lg text-white font-light">{title}</p>
        <p className="text-sm text-white font-light">{location}</p>
      </div> */}

      {/* Overlay + Text สไลด์ขึ้น */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100 bg-opacity-60 translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-in-out z-10">
        <div className="text-center p-4">
          <p className="text-lg font-light">{title}</p>
          <p className="text-sm font-light">{location}</p>
        </div>
      </div>
    </div>
  )
}
