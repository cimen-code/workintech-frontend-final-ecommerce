// Single source of truth for the site menu (desktop + mobile header, footer)
export const navLinks = [
  { label: 'Home', path: '/', navClassName: 'w-[63px]' },
  { label: 'Shop', path: '/shop', hasDropdown: true, navClassName: 'w-[72px]' },
  { label: 'About', path: '/about', navClassName: 'w-[57px]' },
  { label: 'Team', path: '/team', navClassName: 'w-[51px]' },
  { label: 'Contact', path: '/contact', navClassName: '' },
]

export const contactInfo = {
  phone: '(225) 555-0118',
  phoneHref: 'tel:+12255550118',
  email: 'michelle.rivera@example.com',
}

export const footerColumns = [
  {
    title: 'Company Info',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Carrier', path: '/about' },
      { label: 'We are hiring', path: '/team' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Carrier', path: '/about' },
      { label: 'We are hiring', path: '/team' },
      { label: 'Contact', path: '/contact' },
    ],
  },
  {
    title: 'Features',
    links: [
      { label: 'Business Marketing', path: '/shop' },
      { label: 'User Analytic', path: '/shop' },
      { label: 'Live Chat', path: '/contact' },
      { label: 'Unlimited Support', path: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'IOS & Android', path: '/' },
      { label: 'Watch a Demo', path: '/about' },
      { label: 'Customers', path: '/team' },
      { label: 'API', path: '/shop' },
    ],
  },
]
