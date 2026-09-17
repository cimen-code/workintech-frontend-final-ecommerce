// Static Home content taken from Figma "ecommerce-desktop-1" (2984:6640) / "ecommerce-mobile-1" (2984:6638)

export const heroSlides = [
  {
    id: 'hero-1',
    tag: 'SUMMER 2020',
    title: 'NEW COLLECTION',
    text: 'We know how large objects will act, but things on a small scale.',
    cta: 'SHOP NOW',
    image: '/images/home/hero-new-collection.jpg',
  },
  {
    id: 'hero-2',
    tag: 'WINTER 2021',
    title: 'NEW SEASON',
    text: 'We know how large objects will act, but things on a small scale.',
    cta: 'SHOP NOW',
    image: '/images/home/hero-new-collection.jpg',
  },
]

export const editorsPick = [
  { id: 'men', label: 'MEN', image: '/images/home/editors-men.png', to: '/shop' },
  { id: 'women', label: 'WOMEN', image: '/images/home/editors-women.png', to: '/shop' },
  { id: 'accessories', label: 'ACCESSORIES', image: '/images/home/editors-accessories.png', to: '/shop' },
  { id: 'kids', label: 'KIDS', image: '/images/home/editors-kids.png', to: '/shop' },
]

// Fallback product cards when the API is not reachable
export const fallbackProducts = Array.from({ length: 8 }, (_, index) => ({
  id: `figma-${index + 1}`,
  title: 'Graphic Design',
  department: 'English Department',
  oldPrice: 16.48,
  price: 6.48,
  image: `/images/home/product-${index + 1}.jpg`,
}))

export const vitaSlides = [
  {
    id: 'vita-1',
    tag: 'SUMMER 2020',
    title: 'Vita Classic Product',
    text: 'We know how large objects will act, We know how are objects will act, We know',
    price: 16.48,
    image: '/images/home/vita-classic.png',
  },
  {
    id: 'vita-2',
    tag: 'WINTER 2021',
    title: 'Vita Classic Product',
    text: 'We know how large objects will act, We know how are objects will act, We know',
    price: 24.9,
    image: '/images/home/vita-classic.png',
  },
]

export const featuredPosts = [
  { id: 1, image: '/images/home/blog-1.png' },
  { id: 2, image: '/images/home/blog-2.png' },
  { id: 3, image: '/images/home/blog-3.png' },
].map((post) => ({
  ...post,
  tags: ['Google', 'Trending', 'New'],
  title: "Loudest à la Madison #1 (L'integral)",
  text: "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
  date: '22 April 2021',
  comments: 10,
}))
