import { Link } from 'react-router-dom'
import { AlarmClock, ChartArea, ChevronRight } from 'lucide-react'
import Slider from '../components/Slider.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { bestsellerProducts, editorsPick, featuredPosts, heroSlides, vitaSlides } from '../data/homeData.js'
import { formatPrice } from '../utils/helpers.js'

function SectionTitle({ tag, title, text }) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      {tag && <h6 className="text-sm font-bold leading-6 tracking-[0.2px] text-primary-color">{tag}</h6>}
      <h2 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">{title}</h2>
      {text && <p className="max-w-[347px] text-sm leading-5 tracking-[0.2px] text-second-text-color">{text}</p>}
    </div>
  )
}

function HomePage() {
  return (
    <div className="flex w-full flex-col">
      {/* Hero slider */}
      <Slider
        slides={heroSlides}
        renderSlide={(slide) => (
          <div
            className="flex min-h-[753px] w-full items-center bg-[#00B5E2] bg-[url('/images/home/hero-new-collection.jpg')] bg-cover bg-[70%_center] lg:min-h-[716px] lg:bg-center"
          >
            <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-9 px-10 py-20 text-center text-white lg:items-start lg:text-left">
              <h5 className="text-base font-bold leading-6 tracking-[0.1px]">{slide.tag}</h5>
              <h1 className="max-w-[300px] text-[40px] font-bold leading-[50px] tracking-[0.2px] lg:max-w-none lg:text-[58px] lg:leading-[80px]">
                {slide.title}
              </h1>
              <p className="max-w-[291px] text-xl leading-[30px] tracking-[0.2px] lg:max-w-[376px]">{slide.text}</p>
              <Link
                to="/shop"
                className="rounded-md bg-success-color px-10 py-4 text-2xl font-bold leading-8 tracking-[0.1px] hover:opacity-90"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        )}
      />

      {/* Editor's pick */}
      <section className="flex w-full bg-light-gray-1 py-20">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-12 px-11 lg:px-0">
          <SectionTitle title="EDITOR'S PICK" text="Problems trying to resolve the conflict between" />
          <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-[30px]">
            {[editorsPick[0], editorsPick[1]].map((item, index) => (
              <Link
                key={item.id}
                to={item.to}
                className={`group flex h-[500px] w-full overflow-hidden ${index === 0 ? 'lg:w-[510px]' : 'lg:w-[240px]'}`}
              >
                <img src={item.image} alt={item.label} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                <span className="sr-only">{item.label}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4 lg:w-[240px]">
              {[editorsPick[2], editorsPick[3]].map((item) => (
                <Link key={item.id} to={item.to} className="group flex h-[242px] w-full overflow-hidden">
                  <img src={item.image} alt={item.label} className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller products */}
      <section className="flex w-full bg-white py-20">
        <div className="mx-auto flex w-full max-w-[1124px] flex-col items-center gap-20 px-11 lg:px-0">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h4 className="text-xl leading-[30px] tracking-[0.2px] text-second-text-color">Featured Products</h4>
            <SectionTitle title="BESTSELLER PRODUCTS" text="Problems trying to resolve the conflict between" />
          </div>
          <div className="flex w-full flex-col gap-[30px] md:flex-row md:flex-wrap">
            {bestsellerProducts.map((product) => (
              <div key={product.id} className="flex w-full md:w-[calc(50%-15px)] lg:w-[calc(25%-23px)]">
                <ProductCard to="/shop" {...product} imageClassName="aspect-[239/427]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second carousel */}
      <Slider
        slides={vitaSlides}
        autoPlayMs={8000}
        renderSlide={(slide) => (
          <div className="flex w-full bg-secondary-color-1">
            <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-8 px-10 pt-28 text-center text-white lg:flex-row lg:items-end lg:justify-between lg:pt-0 lg:text-left">
              <div className="flex flex-col items-center gap-8 lg:items-start lg:self-center lg:py-28">
                <h5 className="text-xl leading-[30px] tracking-[0.2px]">{slide.tag}</h5>
                <h2 className="max-w-[300px] text-[40px] font-bold leading-[50px] tracking-[0.2px] lg:max-w-[510px] lg:text-[58px] lg:leading-[80px]">
                  {slide.title}
                </h2>
                <p className="max-w-[341px] text-sm leading-5 tracking-[0.2px]">{slide.text}</p>
                <div className="flex flex-col items-center gap-6 lg:flex-row">
                  <span className="text-2xl font-bold leading-8 tracking-[0.1px]">{formatPrice(slide.price)}</span>
                  <Link to="/shop" className="rounded-md bg-success-color px-10 py-3.5 text-sm font-bold leading-[22px] tracking-[0.2px] hover:opacity-90">
                    ADD TO CART
                  </Link>
                </div>
              </div>
              <img src={slide.image} alt={slide.title} className="w-full max-w-[443px] object-contain lg:max-w-[510px]" />
            </div>
          </div>
        )}
      />

      {/* Part of the Neural Universe */}
      <section className="flex w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col-reverse items-center gap-10 px-10 py-20 lg:flex-row lg:gap-20 lg:px-10 lg:py-0">
          <img src="/images/home/neural-universe.png" alt="Couple wearing winter clothes" className="w-full max-w-[400px] object-contain lg:max-w-[632px] lg:py-28" />
          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
            <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-muted-color">SUMMER 2020</h5>
            <h2 className="max-w-[375px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">Part of the Neural Universe</h2>
            <p className="max-w-[376px] text-xl leading-[30px] tracking-[0.2px] text-second-text-color">
              We know how large objects will act, but things on a small scale.
            </p>
            <div className="flex flex-col items-center gap-2.5 sm:flex-row">
              <Link to="/shop" className="rounded-md bg-success-color px-10 py-4 text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90">
                BUY NOW
              </Link>
              <Link to="/about" className="rounded-md border border-success-color px-10 py-4 text-sm font-bold leading-[22px] tracking-[0.2px] text-success-color hover:bg-success-color hover:text-white">
                READ MORE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured posts */}
      <section className="flex w-full bg-white py-20 lg:py-28">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-20 px-11 lg:px-0">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h6 className="text-sm font-bold leading-6 tracking-[0.2px] text-primary-color">Practice Advice</h6>
            <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">Featured Posts</h2>
            <p className="max-w-[469px] text-sm leading-5 tracking-[0.2px] text-second-text-color">
              Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics
            </p>
          </div>

          <div className="flex w-full flex-col gap-8 lg:flex-row lg:gap-[30px]">
            {featuredPosts.map((post) => (
              <article key={post.id} className="flex w-full flex-col bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] lg:w-1/3">
                <div className="relative flex h-[300px] w-full overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                  <span className="absolute left-5 top-5 rounded-[3px] bg-danger-color px-2.5 text-sm font-bold leading-6 tracking-[0.2px] text-white">NEW</span>
                </div>
                <div className="flex flex-col gap-2.5 px-6 pb-9 pt-6">
                  <div className="flex gap-4 text-xs leading-4 tracking-[0.2px]">
                    {post.tags.map((tag, index) => (
                      <span key={tag} className={index === 0 ? 'text-[#8EC2F2]' : 'text-second-text-color'}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="text-xl leading-[30px] tracking-[0.2px] text-text-color">{post.title}</h4>
                  <p className="text-sm leading-5 tracking-[0.2px] text-second-text-color">{post.text}</p>
                  <div className="flex items-center justify-between py-4 text-xs leading-4 tracking-[0.2px] text-second-text-color">
                    <span className="flex items-center gap-1.5"><AlarmClock size={16} className="text-primary-color" />{post.date}</span>
                    <span className="flex items-center gap-1.5"><ChartArea size={16} className="text-secondary-color-1" />{post.comments} comments</span>
                  </div>
                  <Link to="/about" className="flex items-center gap-2.5 text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color hover:text-primary-color">
                    Learn More <ChevronRight size={16} className="text-primary-color" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
