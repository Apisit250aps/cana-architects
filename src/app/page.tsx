import Navbar from '@/components/navigate/Navbar'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-25">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className="relative w-full aspect-[4/3] overflow-hidden group cursor-pointer"
            >
              <Image
                src="/assets/projects/X3 TARA RESORT.jpg"
                alt={`Project ${index + 1}`}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />

              {
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-base-100 bg-opacity-40 opacity-0 group-hover:opacity-50 transition duration-300">
                  <p className="text-black text-lg font-medium">Fosfaatweg</p>
                  <p className="text-black text-sm">Amsterdam, CH.</p>
                </div>
              }
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
