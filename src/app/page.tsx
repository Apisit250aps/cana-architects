import Image from 'next/image'

export default function Home() {
  return (
    <>
      <div className="navbar  px-5 sm:px-10 lg:px-15 bg-base-100 sticky top-0 z-50 flex flex-col lg:flex-row items-center">
        <div className="navbar-start justify-center lg:justify-start">
          <Image
            width={96}
            height={96}
            src={'/assets/logo/cana-architects-logo.png'}
            alt={''}
            className="lg:hidden block"
          />
          <h1 className="font-bold text-xl uppercase hidden lg:block">
            Cana Architects
          </h1>
        </div>
        <div className="navbar-center">
          <ul className="flex gap-x-4 pb-5 lg:pb-0">
            <li>
              <a
                href="#"
                className="text-base lowercase font-thin hover:text-black"
              >
                Exterior
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base lowercase font-thin hover:text-black"
              >
                Interior
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base lowercase font-thin hover:text-black"
              >
                Other
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end lg:flex hidden">
          <ul className="flex gap-x-3">
            <li>
              <a href="#" className="lowercase font-thin">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="lowercase font-thin">
                About
              </a>
            </li>
            <li>
              <a href="#" className="lowercase font-thin">
                Contract
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-5 sm:px-10 lg:px-15 bg-base-100 pb-15">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-10 lg:gap-15">
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
      <footer className="footer footer-horizontal footer-center bg-base-100 text-black pb-10">
        <aside>
          <Image
            width={128}
            height={128}
            src={'/assets/logo/cana-architects-logo.png'}
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
          <p className="font-bold">
            CANA architects
            <br />
            {/* Providing reliable tech since 1992 */}
          </p>
          <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
      </footer>
    </>
  )
}
