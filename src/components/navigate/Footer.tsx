import Image from 'next/image'
export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-100 text-black pb-10">
      <aside>
        <a href={`/`} className=''>
          <Image
            width={72}
            height={72}
            src={'/assets/logo/cana-architects-v.png'}
            alt={'cana-architects'}
          />
        </a>
        <nav>
          <div className="grid grid-flow-col gap-4 pt-2">
            <a
              href={'https://www.facebook.com/cana.architects'}
              id="facebook"
              aria-label="facebook"
            >
              <i className="bx bxl-facebook "></i>
            </a>
            <a
              href={'https://www.tiktok.com/@cana.architects'}
              id="tiktok"
              aria-label="tiktok"
            >
              <i className="bx bxl-tiktok "></i>
            </a>
            <a
              href={'https://www.instagram.com/cana.architects/'}
              id="instagram"
              aria-label="instagram"
            >
              <i className="bx bxl-instagram "></i>
            </a>
          </div>
        </nav>
      </aside>
    </footer>
  )
}
