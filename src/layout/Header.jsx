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
  const location = useLocation()
  const groups = [
    { title: 'Kadın', items: categories.filter((category) => category.gender === 'k') },
    { title: 'Erkek', items: categories.filter((category) => category.gender === 'e') },
  ]

  const searchParams = new URLSearchParams(location.search)
  const sort = searchParams.get('sort') || ''
  const filter = searchParams.get('filter') || ''
  const preservedSearch = new URLSearchParams({ ...(filter && { filter }), ...(sort && { sort }) }).toString()

  return (
    <div className="flex border border-[#ECECEC] bg-white px-5 pb-4 pt-3 text-left lg:border-t-0">
      {groups.map((group) => (
        <div key={group.title} className="flex w-[116px] flex-col gap-[13px] lg:w-[155px]">
          <p className="pb-3.5 text-sm font-bold text-text-color">{group.title}</p>
          {group.items.map((category) => (
            <Link
              key={category.id}
              to={{ pathname: categoryPath(category), search: preservedSearch }}
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

// Mounted only while the mobile menu is open, so it always opens collapsed
function MobileCategories({ categories, onNavigate }) {
  const [open, setOpen] = useState(false)

  if (categories.length === 0) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex items-center gap-2 text-base font-bold text-second-text-color"
      >
        Shop categories <ChevronDown size={16} className={open ? 'rotate-180' : ''} />
      </button>
      {open && (
        <div className="flex w-full justify-center px-6">
          <CategoryMenu categories={categories} onNavigate={onNavigate} />
        </div>
      )}
    </>
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
    document.addEventListener('pointerdown', handleClick)
    return () => document.removeEventListener('pointerdown', handleClick)
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
        className="flex items-center gap-1 text-sm font-bold text-primary-color min-[375px]:gap-2 min-[375px]:px-2 md:px-4 md:py-3 lg:py-[9px]"
        aria-expanded={openMenu === 'user'}
      >
        <Gravatar email={user.email} size={28} className="h-7 w-7" />
        <span className="hidden max-w-[140px] truncate sm:inline">{user.name}</span>
        <ChevronDown size={14} />
      </button>
      {openMenu === 'user' && (
        <div className="absolute -right-8 top-full z-50 flex w-48 flex-col rounded-md bg-white py-2 text-sm font-bold text-text-color shadow-xl min-[375px]:right-0">
          <p className="truncate px-4 py-2.5 sm:hidden">{user.name}</p>
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
    <div className="hidden items-center gap-[5px] px-4 py-3 text-sm font-bold text-primary-color lg:flex">
      <UserRound size={16} className="-mr-0.5" />
      <Link to={loginLink} onClick={close} className="hover:underline">Login</Link>
      <span>/</span>
      <Link to={signupLink} onClick={close} className="hover:underline">Register</Link>
    </div>
  )

  return (
    <header ref={headerRef} className="relative z-40 flex w-full flex-col bg-white">
      <div className="hidden w-full bg-dark-background-color text-white lg:flex">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between pb-3.5 pl-9 pr-10 pt-5 text-sm font-bold leading-6 tracking-[0.2px]">
          <div className="flex items-center gap-8">
            <a href={contactInfo.phoneHref} className="flex items-center gap-[5px]">
              <Phone size={16} />
              <span>{contactInfo.phone}</span>
            </a>
            <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-[5px]">
              <Mail size={16} />
              <span>{contactInfo.email}</span>
            </a>
          </div>
          <p className="pl-1">Follow Us&nbsp; and get a chance to win 80% off</p>
          <div className="flex items-center gap-[15px]">
            <span className="mr-0.5">Follow Us&nbsp;:</span>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramIcon /></a>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><YoutubeIcon /></a>
            <a href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><TwitterIcon /></a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between pb-[39px] pl-3 pr-3 pt-[38px] min-[375px]:pl-4 min-[375px]:pr-4 min-[414px]:pl-[37px] min-[414px]:pr-9 md:px-7 md:py-5 lg:pb-3.5 lg:pl-10 lg:pr-[19px] lg:pt-[18px]">
        <Link to="/" onClick={close} className="-mb-[3px] text-2xl font-bold leading-8 tracking-[0.1px] text-text-color md:mb-0 lg:-ml-px lg:mt-1">
          Bandage
        </Link>

        <nav className="hidden items-center lg:ml-[113px] lg:mr-auto lg:flex">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.path} className={`relative flex items-center ${link.navClassName}`}>
                <NavLink
                  to={link.path}
                  onClick={close}
                  className="w-10 text-sm leading-6 tracking-[0.2px] text-text-color"
                >
                  {link.label}
                </NavLink>
                <button type="button" aria-label="Open categories" onClick={() => toggle('shop')} className="flex p-1 text-text-color">
                  <ChevronDown size={16} />
                </button>
                {openMenu === 'shop' && (
                  <div className="absolute -left-1 top-full z-50 flex pt-[25px]">
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
                className={`text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color hover:text-text-color ${link.navClassName}`}
                activeClassName={link.path === '/' ? '' : 'text-text-color'}
              >
                {link.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2 text-text-color min-[375px]:gap-5 md:gap-2 lg:gap-0 lg:text-primary-color">
          {userArea}

          <button type="button" aria-label="Search" onClick={() => { close(); history.push('/shop') }} className="flex p-0 md:p-3.5">
            <Search strokeWidth={1.7} className="h-[29px] w-[29px] md:h-6 md:w-6 lg:h-[18px] lg:w-[18px]" />
          </button>

          <div className="relative flex">
            <button
              type="button"
              aria-label="Shopping cart"
              onClick={() => toggle('cart')}
              className="flex items-center gap-1 p-0 md:p-3.5"
              aria-expanded={openMenu === 'cart'}
            >
              <ShoppingCart strokeWidth={1.3} className="h-[25px] w-[25px] md:h-6 md:w-6 lg:h-4 lg:w-4" />
              <span className={`text-xs ${cartCount === 0 ? 'hidden lg:inline' : ''}`}>{cartCount}</span>
            </button>
            {openMenu === 'cart' && (
              <div className="absolute right-0 top-full z-50 flex">
                <CartDropdown onNavigate={close} />
              </div>
            )}
          </div>

          <button type="button" aria-label="Favorites" onClick={close} className="hidden items-center gap-1 p-3.5 lg:flex">
            <Heart size={16} />
            <span className="text-xs">0</span>
          </button>

          <button
            type="button"
            aria-label="Menu"
            aria-expanded={openMenu === 'mobile'}
            onClick={() => toggle('mobile')}
            className="flex p-0 min-[375px]:ml-2.5 md:ml-0 md:p-2 lg:hidden"
          >
            {openMenu === 'mobile' ? <X className="h-7 w-7 md:h-6 md:w-6" /> : <TextAlignEnd strokeWidth={1.7} className="h-7 w-7 md:h-6 md:w-6" />}
          </button>
        </div>
      </div>

      {openMenu === 'mobile' && (
        <nav className="flex flex-col items-center gap-[30px] pb-24 pt-[59px] md:pt-20 lg:hidden">
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
          <MobileCategories categories={categories} onNavigate={close} />
        </nav>
      )}
    </header>
  )
}

export default Header
