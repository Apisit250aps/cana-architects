import Image from 'next/image'

type FrameProps = {
  src: string
  title: string
  location: string
}

export default function ImageFrame({ src, title, location }: FrameProps) {
  return (
    <div className="relative w-full aspect-[4/3] overflow-hidden cursor-pointer group">
      {/* รูปภาพ */}
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
      />

      {/* Overlay ที่จะค่อยๆ เพิ่มความเข้ม */}
      <div className="absolute inset-0 bg-base-200/0 transition-colors duration-700 ease-out group-hover:bg-base-200/90" />

      {/* Text ที่จะเลื่อนขึ้นจากด้านล่างพร้อมกับค่อยๆ ปรากฏ */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="text-center transform translate-y-full opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 px-6 py-3">
          <h3 className="text-lg font-light text-black">{title}</h3>
          <p className="text-sm font-extralight text-black/90">{location}</p>
        </div>
      </div>
    </div>
  )
}
