import Image from 'next/image'
export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-100 text-black p-10">
      <aside>
        <Image
          width={128}
          height={128}
          src={'/assets/logo/cana-architects-logo.png'}
          alt={''}
        />
        <p className="font-bold">
          CANA Architects
          <br />
          {/* Providing reliable tech since 1992 */}
        </p>
        <p>Copyright © {new Date().getFullYear()} - All right reserved</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a>
            <i className="bx bxl-tiktok bx-md"></i>
          </a>
          <a>
            <i className="bx bxl-facebook bx-md"></i>
          </a>
          <a>
            <i className="bx bxl-instagram bx-md"></i>
          </a>
        </div>
      </nav>
    </footer>
  )
}
