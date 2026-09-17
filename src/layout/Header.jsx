import { Link } from 'react-router-dom'
import {
  ChevronDown,
  Facebook,
  Heart,
  Instagram,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  UserRound,
  Youtube,
} from 'lucide-react'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
  { label: 'Pages', path: '/pages' },
]

function Header() {
  return (
    <header className="w-full bg-white">
      {/* Mobile Header */}
      <div className="flex w-full flex-col bg-white px-9 pb-16 pt-6 lg:hidden">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color"
          >
            Bandage
          </Link>

          <div className="flex items-center gap-6 text-text-color">
            <button type="button" aria-label="Search">
              <Search size={24} strokeWidth={2} />
            </button>

            <button type="button" aria-label="Shopping cart">
              <ShoppingCart size={24} strokeWidth={2} />
            </button>

            <button type="button" aria-label="Menu">
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </div>

        <nav className="mt-20 flex flex-col items-center gap-[30px]">
          {navLinks.slice(0, 4).map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className="text-[30px] font-normal leading-[45px] tracking-[0.2px] text-second-text-color"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden h-[58px] w-full bg-dark-background-color text-white lg:flex">
        <div className="mx-auto flex w-full max-w-[1438px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <a
              href="tel:+12255550118"
              className="flex items-center gap-[5px] p-[10px] text-sm font-bold leading-6 tracking-[0.2px]"
            >
              <Phone size={16} />
              <span>(225) 555-0118</span>
            </a>

            <a
              href="mailto:michelle.rivera@example.com"
              className="flex items-center gap-[5px] p-[10px] text-sm font-bold leading-6 tracking-[0.2px]"
            >
              <Mail size={16} />
              <span>michelle.rivera@example.com</span>
            </a>
          </div>

          <p className="text-sm font-bold leading-6 tracking-[0.2px]">
            Follow Us and get a chance to win 80% off
          </p>

          <div className="flex items-center gap-[10px]">
            <span className="text-sm font-bold leading-6 tracking-[0.2px]">
              Follow Us :
            </span>

            <div className="flex items-center gap-3">
              <Instagram size={16} />
              <Youtube size={16} />
              <Facebook size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden h-[78px] w-full bg-white lg:flex">
        <div className="mx-auto flex w-full max-w-[1438px] items-center px-8">
          <Link
            to="/"
            className="mr-28 text-2xl font-bold leading-8 tracking-[0.1px] text-text-color"
          >
            Bandage
          </Link>

          <nav className="flex items-center gap-[15px]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="flex items-center gap-1 text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color"
              >
                {link.label}

                {link.label === 'Shop' && (
                  <ChevronDown size={14} className="text-text-color" />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center text-primary-color">
            <Link
              to="/login"
              className="flex items-center gap-[5px] px-[15px] py-[15px] text-sm font-bold leading-6 tracking-[0.2px]"
            >
              <UserRound size={16} />
              <span>Login / Register</span>
            </Link>

            <button
              type="button"
              aria-label="Search"
              className="flex h-[46px] w-[46px] items-center justify-center"
            >
              <Search size={16} />
            </button>

            <button
              type="button"
              aria-label="Shopping cart"
              className="flex h-[46px] items-center gap-[5px] px-[15px]"
            >
              <ShoppingCart size={16} />
              <span className="text-xs">1</span>
            </button>

            <button
              type="button"
              aria-label="Favorites"
              className="flex h-[46px] items-center gap-[5px] px-[15px]"
            >
              <Heart size={16} />
              <span className="text-xs">1</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
