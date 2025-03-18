export default function Navbar() {
  return (
    <div className="navbar px-20 bg-base-200 sticky top-0 z-50">
      <div className="navbar-start">
        <h1 className="font-light text-xl">Cana Architects</h1>
      </div>
      <div className="navbar-center">
        <ul className="flex gap-x-4">
          <li>
            <a href="#" className="text-base font-thin hover:text-black">
              Exterior
            </a>
          </li>
          <li>
            <a href="#" className="text-base font-thin hover:text-black">
              Interior
            </a>
          </li>
          <li>
            <a href="#" className="text-base font-thin hover:text-black">
              Other
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <ul className="flex gap-x-3">
          <li>
            <a href="#" className="text-base font-thin hover:text-black">
              Projects
            </a>
          </li>
          <li>
            <a href="#" className="text-base font-thin hover:text-black">
              About us
            </a>
          </li>
          <li>
            <a href="#" className="text-base font-thin hover:text-black">
              Contract us
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
