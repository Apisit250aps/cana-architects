import ImageFrame from '@/components/gallery/ImageFrame'
import Image from 'next/image'

export default function Home() {
  const projects = [
    {
      src: 'A ROCKET.jpg',
      title: 'A ROCKET',
      location: 'Chonburi, Thailand'
    },
    {
      src: 'BAAN PHALANG.jpg',
      title: 'BAAN PHALANG',
      location: 'Khao Yai, Thailand'
    },
    {
      src: 'RUEDUFON.png',
      title: 'RUEDUFON',
      location: 'Chiangdao, Chiangmai'
    },
    {
      src: 'VIN PRINT DESIGN.png',
      title: 'VIN PRINT DESIGN',
      location: 'Bangkok, Thailand'
    },
    {
      src: 'X3 TARA RESORT.jpg',
      title: 'X3 TARA RESORT',
      location: 'Nan, Thailand'
    },
    {
      src: 'BAAN RIM NAAM.png',
      title: 'BAAN RIM NAAM',
      location: 'Khao Yai, Thailand'
    },
    {
      src: 'X3 KHAOYAI.jpg',
      title: 'X3 KHAOYAI',
      location: 'Khao Yai, Thailand'
    },
    {
      src: 'KHUEN POOL VILLA.jpg',
      title: 'KHUEN POOL VILLA',
      location: 'Ranong, Thailand'
    },
    {
      src: 'PARK 51.png',
      title: 'PARK 51',
      location: 'Bangkok, Thailand'
    },
    {
      src: 'DOI CHANG VILLA.jpg',
      title: 'DOI CHANG',
      location: 'Doi Chang, Chiangrai'
    },
    {
      src: 'PPP GEMS.png',
      title: 'PPP GEMS',
      location: 'Everywhere'
    }
  ]

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
          <h1 className=" text-xl uppercase hidden lg:block">
            Cana Architects
          </h1>
        </div>
        <div className="navbar-center">
          <ul className="flex gap-x-4 pb-5 lg:pb-0">
            <li>
              <a
                href="#"
                className=" text-base uppercase font-extralight hover:text-black"
              >
                Exterior
              </a>
            </li>
            <li>
              <a
                href="#"
                className=" text-base uppercase font-extralight hover:text-black"
              >
                Interior
              </a>
            </li>
            <li>
              <a
                href="#"
                className=" text-base uppercase font-extralight hover:text-black"
              >
                Other
              </a>
            </li>
          </ul>
        </div>
        <div className="navbar-end lg:flex hidden">
          <ul className="flex gap-x-3">
            <li>
              <a
                href="#"
                className="text-base uppercase font-extralight hover:text-black"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base uppercase font-extralight hover:text-black"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-base uppercase font-extralight hover:text-black"
              >
                Contract
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-5 sm:px-10 lg:px-15 bg-base-100 pb-15">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-10 lg:gap-15">
          {projects.map((project, index) => (
            <ImageFrame
              key={index}
              src={`/assets/projects/${project.src}`}
              title={project.title}
              location={project.location}
            />
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
