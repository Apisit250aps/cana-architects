import Navbar from '@/components/navigate/Navbar'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="px-20 bg-base-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-20">
          {Array.from({ length: 16 }, (_, index) => (
            <div
              key={index}
              className="relative w-full aspect-[4/3] overflow-hidden group"
            >
              {/* รูปภาพ */}
              <Image
                src="/assets/projects/X3 TARA RESORT.jpg"
                alt={`Project ${index + 1}`}
                fill
                className="object-cover transition duration-300 group-hover:blur-sm"
              />

              {/* Overlay เบลอเบา ๆ (พื้นหลังจาง 50%) */}
              <div className="absolute inset-0 bg-base-100 bg-opacity-50 opacity-0 group-hover:opacity-45 transition duration-300 pointer-events-none" />

              {/* ตัวอักษรอยู่ด้านบน overlay แยกต่างหาก ชัดเจนเสมอ */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none z-10">
                <p className=" text-lg font-light">Fosfaatweg</p>
                <p className=" text-sm font-light">Amsterdam, CH.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
