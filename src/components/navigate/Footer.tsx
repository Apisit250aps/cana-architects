import Image from 'next/image'
export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-neutral-content p-10">
      <aside>
        <Image
          width={128}
          height={128}
          src={'/assets/logo/cana-architects-logo.png'}
          alt={''}
        />
      </aside>
      <nav className="text-black">
        <h6 className="footer-title">Social</h6>
        <div className="grid grid-flow-col gap-4 text-black">
          <a>
            <i className="bx bxl-facebook bx-md"></i>
          </a>
          <a>
            <i className="bx bxl-tiktok bx-md"></i>
          </a>
          <a>
            <i className="bx bxl-instagram bx-md"></i>
          </a>
        </div>
      </nav>
    </footer>
  )
}
