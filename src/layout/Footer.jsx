import { Link, useLocation } from 'react-router-dom'
import { footerColumns } from '../data/navigation.js'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../components/SocialIcons.jsx'

function Footer() {
  const { pathname } = useLocation()

  return (
    <footer className="flex w-full flex-col bg-white">
      {/* Figma draws this band #FAFAFA on the Home frame and white on the other frames */}
      <div className={`flex w-full ${pathname === '/' ? 'bg-light-gray-1' : 'bg-white'}`}>
        <div className="mx-auto flex h-[173px] w-full max-w-[1050px] flex-col md:h-[142px] md:px-4 xl:px-0">
          <div className="flex flex-col gap-[22px] pl-12 pt-[55px] md:flex-row md:items-start md:justify-between md:pl-0">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">
              Bandage
            </Link>
            <div className="-ml-1 flex items-center gap-5 text-primary-color md:ml-0 md:mt-0.5 xl:mr-[62px]">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon size={24} /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={24} /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><TwitterIcon size={24} /></a>
            </div>
          </div>
          <div className="mb-1 mt-auto hidden h-px w-full bg-[#E6E6E6] lg:flex xl:w-[1057px]" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-[31px] px-[46px] pb-[75px] pt-[71px] md:px-4 md:pb-[52px] md:pt-[51px] lg:flex-row lg:gap-0 xl:px-0">
        <div className="flex flex-col gap-[31px] md:flex-row md:flex-wrap md:gap-x-16 lg:w-[68.57%] lg:flex-nowrap lg:gap-x-0">
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-[19px] lg:w-1/4">
              <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">{column.title}</h5>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label} className="flex">
                    <Link to={link.path} onClick={() => window.scrollTo(0, 0)} className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color hover:text-primary-color">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-[19px] lg:flex-1">
          <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">Get In Touch</h5>
          <div className="flex flex-col gap-2">
            <form className="flex h-[58px] w-full max-w-[321px]" onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="footer-email" className="sr-only">Your Email</label>
              <input
                id="footer-email"
                type="email"
                placeholder="Your Email"
                className="min-w-0 flex-1 rounded-l-md border border-[#E6E6E6] bg-light-gray-1 px-5 text-sm text-text-color outline-none placeholder:text-second-text-color focus:border-primary-color"
              />
              <button type="submit" className="w-[116px] rounded-r-md border border-[#E6E6E6] bg-primary-color text-sm text-white">
                Subscribe
              </button>
            </form>
            <p className="pl-0.5 text-xs leading-4 tracking-[0.2px] text-second-text-color">Lore imp sum dolor Amit</p>
          </div>
        </div>
      </div>

      <div className="flex w-full bg-light-gray-1">
        <div className="mx-auto flex w-full max-w-[1050px] justify-center px-9 pb-6 pt-[26px] md:justify-start md:px-4 xl:px-0">
          <p className="text-center text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">
            Made With Love By<br className="md:hidden" /> Finland All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
