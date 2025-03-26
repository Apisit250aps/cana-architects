import Image from 'next/image'
export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-100 text-black pb-10">
      <aside>
        <Image
          width={128}
          height={128}
          src={'/assets/logo/cana-architects-v.png'}
          alt={''}
        />
        <nav>
          <div className="grid grid-flow-col gap-7 pt-4">
            <a
              href={'https://www.tiktok.com/@cana.architects'}
              id="tiktok"
              aria-label="tiktok"
            >
              <i className="bx bxl-tiktok bx-sm"></i>
            </a>
            <a
              href={'https://www.facebook.com/cana.architects'}
              id="facebook"
              aria-label="facebook"
            >
              <i className="bx bxl-facebook bx-sm"></i>
            </a>
            <a
              href={'https://www.instagram.com/cana.architects/'}
              id="instagram"
              aria-label="instagram"
            >
              <i className="bx bxl-instagram bx-sm"></i>
            </a>
          </div>
        </nav>
      </aside>
    </footer>
  )
}
