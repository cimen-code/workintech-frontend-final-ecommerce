import { Link } from 'react-router-dom'
import { footerColumns } from '../data/navigation.js'
import { FacebookIcon, InstagramIcon, TwitterIcon } from '../components/SocialIcons.jsx'

function Footer() {
  return (
    <footer className="flex w-full flex-col bg-white">
      <div className="flex w-full bg-light-gray-1">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-3 px-9 py-10 md:flex-row md:items-center md:justify-between md:px-4">
          <Link to="/" className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">
            Bandage
          </Link>
          <div className="flex items-center gap-5 text-primary-color">
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon size={24} /></a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon size={24} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><TwitterIcon size={24} /></a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-8 px-9 py-12 md:px-4 lg:flex-row lg:justify-between">
        <div className="flex flex-col gap-8 md:flex-row md:flex-wrap md:gap-x-16 lg:flex-nowrap lg:gap-x-12">
          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-5">
              <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">{column.title}</h5>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label} className="flex">
                    <Link to={link.path} className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color hover:text-primary-color">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-text-color">Get In Touch</h5>
          <form className="flex w-full max-w-[321px]" onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="footer-email" className="sr-only">Your Email</label>
            <input
              id="footer-email"
              type="email"
              placeholder="Your Email"
              className="min-w-0 flex-1 rounded-l-md border border-[#E6E6E6] bg-light-gray-1 px-5 py-4 text-sm text-text-color outline-none focus:border-primary-color"
            />
            <button type="submit" className="rounded-r-md border border-[#E6E6E6] bg-primary-color px-5 text-sm text-white">
              Subscribe
            </button>
          </form>
          <p className="text-xs leading-7 tracking-[0.2px] text-second-text-color">Lore imp sum dolor Amit</p>
        </div>
      </div>

      <div className="flex w-full bg-light-gray-1">
        <div className="mx-auto flex w-full max-w-[1050px] justify-center px-9 py-6 md:justify-start md:px-4">
          <p className="text-center text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">
            Made With Love By Finland All Right Reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
