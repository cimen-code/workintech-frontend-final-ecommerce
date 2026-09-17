import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  Heart,
  LogOut,
  Mail,
  Package,
  Phone,
  Search,
  TextAlignEnd,
  ShoppingCart,
  UserRound,
  X,
} from 'lucide-react'
import { contactInfo, navLinks } from '../data/navigation.js'
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon } from '../components/SocialIcons.jsx'
import CartDropdown from '../components/CartDropdown.jsx'
import Gravatar from '../components/Gravatar.jsx'
import { logoutUser } from '../store/actions/clientActions.js'
import { categoryPath } from '../utils/helpers.js'

function CategoryMenu({ categories, onNavigate }) {
  const groups = [
    { title: 'Kadın', items: categories.filter((category) => category.gender === 'k') },
    { title: 'Erkek', items: categories.filter((category) => category.gender === 'e') },
  ]

  return (
    <div className="flex gap-12 rounded-md bg-white px-8 py-6 text-left shadow-xl">
      {groups.map((group) => (
        <div key={group.title} className="flex min-w-[120px] flex-col gap-4">
          <p className="text-base font-bold text-text-color">{group.title}</p>
          {group.items.map((category) => (
            <Link
              key={category.id}
              to={categoryPath(category)}
              onClick={onNavigate}
              className="text-sm font-bold text-second-text-color hover:text-primary-color"
            >
              {category.title}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

function Header() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const user = useSelector((state) => state.client.user)
  const categories = useSelector((state) => state.product.categories)
  const cart = useSelector((state) => state.shoppingCart.cart)
  const [openMenu, setOpenMenu] = useState(null)
  const [showMobileCategories, setShowMobileCategories] = useState(false)
  const headerRef = useRef(null)

  const isLoggedIn = Boolean(user?.email)
  const cartCount = cart.reduce((sum, item) => sum + item.count, 0)

  const toggle = (name) => setOpenMenu((current) => (current === name ? null : name))
  const close = () => setOpenMenu(null)

  useEffect(() => {
    const handleClick = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = () => {
    dispatch(logoutUser())
    close()
    history.push('/')
  }

  const loginLink = { pathname: '/login', state: { from: location } }
  const signupLink = { pathname: '/signup', state: { from: location } }

  const userArea = isLoggedIn ? (
    <div className="relative flex">
      <button
        type="button"
        onClick={() => toggle('user')}
        className="flex items-center gap-2 px-2 py-3 text-sm font-bold text-primary-color md:px-4"
        aria-expanded={openMenu === 'user'}
      >
        <Gravatar email={user.email} size={28} />
        <span className="hidden max-w-[140px] truncate sm:inline">{user.name}</span>
        <ChevronDown size={14} />
      </button>
      {openMenu === 'user' && (
        <div className="absolute right-0 top-full z-50 flex w-52 flex-col rounded-md bg-white py-2 text-sm font-bold text-text-color shadow-xl">
          <Link to="/orders" onClick={close} className="flex items-center gap-2 px-4 py-2.5 hover:bg-light-gray-1">
            <Package size={16} /> Previous Orders
          </Link>
          <button type="button" onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-left hover:bg-light-gray-1">
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    // Figma 414px header shows only search/cart/menu; logged-out users reach Login/Register in the expanded menu
    <div className="hidden items-center gap-1 px-4 py-3 text-sm font-bold text-primary-color lg:flex">
      <UserRound size={16} />
      <Link to={loginLink} className="hover:underline">Login</Link>
      <span>/</span>
      <Link to={signupLink} className="hover:underline">Register</Link>
    </div>
  )

  return (
    <header ref={headerRef} className="relative z-40 flex w-full flex-col bg-white">
      {/* Top bar (desktop) */}
      <div className="hidden w-full bg-dark-background-color text-white lg:flex">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-2.5 text-sm font-bold leading-6 tracking-[0.2px]">
          <div className="flex items-center gap-7">
            <a href={contactInfo.phoneHref} className="flex items-center gap-1.5">
              <Phone size={16} />
              <span>{contactInfo.phone}</span>
            </a>
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-1.5">
              <Mail size={16} />
              <span>{contactInfo.email}</span>
            </a>
          </div>
          <p>Follow Us and get a chance to win 80% off</p>
          <div className="flex items-center gap-2.5">
            <span>Follow Us :</span>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><YoutubeIcon /></a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><TwitterIcon /></a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-7 py-5 lg:px-10 lg:py-4">
        <Link to="/" onClick={close} className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">
          Bandage
        </Link>

        <nav className="hidden items-center gap-4 lg:ml-24 lg:mr-auto lg:flex">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.path} className="relative flex items-center">
                <NavLink
                  to={link.path}
                  onClick={close}
                  className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color hover:text-text-color"
                  activeClassName="text-text-color"
                >
                  {link.label}
                </NavLink>
                <button type="button" aria-label="Open categories" onClick={() => toggle('shop')} className="flex p-1 text-text-color">
                  <ChevronDown size={14} />
                </button>
                {openMenu === 'shop' && (
                  <div className="absolute left-0 top-full z-50 flex pt-2">
                    <CategoryMenu categories={categories} onNavigate={close} />
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={link.path}
                exact={link.path === '/'}
                to={link.path}
                onClick={close}
                className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color hover:text-text-color"
                activeClassName="text-text-color"
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 text-text-color lg:gap-0 lg:text-primary-color">
          {userArea}

          <button type="button" aria-label="Search" onClick={() => history.push('/shop')} className="flex p-2 md:p-3.5">
            <Search size={24} className="lg:h-4 lg:w-4" />
          </button>

          <div className="relative flex">
            <button
              type="button"
              aria-label="Shopping cart"
              onClick={() => toggle('cart')}
              className="flex items-center gap-1 p-2 md:p-3.5"
              aria-expanded={openMenu === 'cart'}
            >
              <ShoppingCart size={24} className="lg:h-4 lg:w-4" />
              <span className={`text-xs ${cartCount === 0 ? 'hidden lg:inline' : ''}`}>{cartCount}</span>
            </button>
            {openMenu === 'cart' && (
              <div className="absolute right-0 top-full z-50 flex">
                <CartDropdown onNavigate={close} />
              </div>
            )}
          </div>

          <button type="button" aria-label="Favorites" className="hidden items-center gap-1 p-3.5 lg:flex">
            <Heart size={16} />
            <span className="text-xs">0</span>
          </button>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={openMenu === 'mobile'}
            onClick={() => toggle('mobile')}
            className="flex p-2 lg:hidden"
          >
            {openMenu === 'mobile' ? <X size={24} /> : <TextAlignEnd size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile navigation (same navLinks source) */}
      {openMenu === 'mobile' && (
        <nav className="flex flex-col items-center gap-[30px] pb-24 pt-20 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={close}
              className="text-3xl leading-[45px] tracking-[0.2px] text-second-text-color"
            >
              {link.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <div className="flex items-center gap-2 text-3xl leading-[45px] text-primary-color">
              <UserRound size={28} />
              <Link to={loginLink} onClick={close}>Login</Link>
              <span>/</span>
              <Link to={signupLink} onClick={close}>Register</Link>
            </div>
          )}
          {isLoggedIn && (
            <Link to="/orders" onClick={close} className="text-3xl leading-[45px] text-primary-color">
              Previous Orders
            </Link>
          )}
          {categories.length > 0 && (
            <button
              type="button"
              onClick={() => setShowMobileCategories((current) => !current)}
              aria-expanded={showMobileCategories}
              className="flex items-center gap-2 text-base font-bold text-second-text-color"
            >
              Shop categories <ChevronDown size={16} className={showMobileCategories ? 'rotate-180' : ''} />
            </button>
          )}
          {categories.length > 0 && showMobileCategories && (
            <div className="flex w-full justify-center px-6">
              <CategoryMenu categories={categories} onNavigate={close} />
            </div>
          )}
        </nav>
      )}
    </header>
  )
}

export default Header
