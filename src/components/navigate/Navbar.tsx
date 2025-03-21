export default function Navbar() {
  return (
    <div className="navbar  px-5 sm:px-10 lg:px-15 bg-base-100 sticky top-0 z-50 flex flex-col lg:flex-row items-center">
      <div className="navbar-start justify-center lg:justify-start">
        <h1 className="font-bold text-xl uppercase">Cana Architects</h1>
      </div>
      <div className="navbar-center">
        <ul className="flex gap-x-4">
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
      <div className="navbar-end">
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
  )
}
