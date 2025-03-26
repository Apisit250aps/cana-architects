import Image from "next/image";

export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 bg-base-100">
      <div className="navbar px-5 sm:px-10 lg:px-15 flex flex-col lg:flex-row items-center">
        <div className="navbar-start justify-center lg:justify-start">
          <Image
            width={64}
            height={64}
            src={'/assets/logo/cana-architects-v.png'}
            alt="Cana Architects Logo"
          />
          {/* <h1 className="text-xl uppercase font-medium">Cana Architects</h1> */}
        </div>

        {/* Desktop navigation */}
        <div className="navbar-end hidden lg:flex">
          <ul className="flex gap-x-3">
            <li>
              <a
                href={'/'}
                className="text-base lowercase font-extralight hover:text-black"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href={'/about'}
                className="text-base lowercase font-extralight hover:text-black"
              >
                About
              </a>
            </li>
            <li>
              <a
                href={'/contact'}
                className="text-base lowercase font-extralight hover:text-black"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        
        {/* Mobile navigation button */}
        <div className="navbar-end lg:hidden flex flex-row justify-end w-full mt-4">
          <button
            className="btn btn-ghost btn-sm border"
            id="menu"
            aria-label="menu"
          >
            <i className="bx bx-menu-alt-right"></i>
          </button>
        </div>
      </div>

      {/* Mobile menu collapse - Note: Will need client component for this */}
      <div className="collapse collapse-close lg:hidden" id="mobile-menu">
        <div className="collapse-content bg-base-100 px-5 sm:px-10 lg:px-15 pt-0 pb-4 shadow-md">
          <ul className="flex flex-col gap-y-2 mt-2">
            <li>
              <a
                href={'/'}
                className="text-black lowercase font-extralight hover:text-black"
              >
                Projects
              </a>
            </li>
            <li>
              <a
                href={'/about'}
                className="text-black lowercase font-extralight hover:text-black"
              >
                About
              </a>
            </li>
            <li>
              <a
                href={'/contact'}
                className="text-black lowercase font-extralight hover:text-black"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}