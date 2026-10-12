// Static Home content taken from Figma "ecommerce-desktop-1" (2984:6640) / "ecommerce-mobile-1" (2984:6638)

// Figma shows prev/next arrows and a two-position indicator on the hero, but content for only one slide.
// Both positions therefore render the same canonical Figma slide; no extra copy is invented.
const heroSlide = {
  tag: 'SUMMER 2020',
  title: 'NEW COLLECTION',
  text: 'We know how large objects will act, but things on a small scale.',
  cta: 'SHOP NOW',
}

export const heroSlides = [
  { id: 'hero-1', ...heroSlide },
  { id: 'hero-2', ...heroSlide },
]

export const editorsPick = [
  { id: 'men', label: 'MEN', image: '/images/home/editors-men.png', to: '/shop' },
  { id: 'women', label: 'WOMEN', image: '/images/home/editors-women.png', to: '/shop' },
  { id: 'accessories', label: 'ACCESSORIES', image: '/images/home/editors-accessories.png', to: '/shop' },
  { id: 'kids', label: 'KIDS', image: '/images/home/editors-kids.png', to: '/shop' },
]

// BESTSELLER PRODUCTS: the eight static demo cards of Figma "desktop-product-cards-10" (2984:7008),
// in Figma order (product-1..8.jpg are the Figma images in the same order)
export const bestsellerProducts = Array.from({ length: 8 }, (_, index) => ({
  id: `bestseller-${index + 1}`,
  title: 'Graphic Design',
  department: 'English Department',
  oldPrice: 16.48,
  price: 6.48,
  image: `/images/home/product-${index + 1}.jpg`,
  ...(index >= 4 && { mobileImage: `/images/home/mobile-product-${index + 1}.jpg` }),
}))

// Second carousel: same situation as the hero (arrows + two-position indicator, one canonical slide in Figma)
const vitaSlide = {
  tag: 'SUMMER 2020',
  title: 'Vita Classic Product',
  text: 'We know how large objects will act, We know how are objects will act, We know',
  price: 16.48,
  image: '/images/home/vita-classic.png',
}

export const vitaSlides = [
  { id: 'vita-1', ...vitaSlide },
  { id: 'vita-2', ...vitaSlide },
]

export const featuredPosts = [
  { id: 1, image: '/images/home/blog-1.png', mobileImage: '/images/home/mobile-blog-1.jpg' },
  { id: 2, image: '/images/home/blog-2.png', mobileImage: '/images/home/mobile-blog-2.jpg' },
  { id: 3, image: '/images/home/blog-3.png', mobileImage: '/images/home/mobile-blog-3.jpg' },
].map((post) => ({
  ...post,
  tags: ['Google', 'Trending', 'New'],
  title: "Loudest à la Madison #1 (L'integral)",
  text: "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
  date: '22 April 2021',
  comments: 10,
}))
