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
        arrowClassName="top-[343px] min-[414px]:top-[333px] lg:top-[265px]"
        renderSlide={(slide, isActive) => (
          <div
            className="flex min-h-[753px] w-full items-start bg-[#00B5E2] bg-[url('/images/home/hero-new-collection.jpg')] bg-cover bg-center lg:min-h-[716px]"
          >
            <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[35px] px-10 pb-20 pt-[208px] text-center text-white lg:items-start lg:px-20 lg:text-left xl:px-1">
              <h5 className="text-base font-bold leading-6 tracking-[0.1px]">{slide.tag}</h5>
              <h1 className="max-w-[300px] text-[40px] font-bold leading-[50px] tracking-[0.2px] lg:max-w-none lg:text-[58px] lg:leading-[80px]">
                {slide.title}
              </h1>
              <p className="max-w-[291px] text-xl leading-[30px] tracking-[0.2px] lg:max-w-[376px]">{slide.text}</p>
              <Link
                to="/shop"
                tabIndex={isActive ? undefined : -1}
                className="flex h-[62px] w-[220px] items-center justify-center rounded-md bg-success-color text-2xl font-bold leading-8 tracking-[0.1px] hover:opacity-90"
              >
                {slide.cta}
              </Link>
            </div>
          </div>
        )}
      />

      {/* Editor's pick */}
      <section className="flex w-full bg-light-gray-1 py-20">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-12 md:px-11 lg:px-0">
          <div className="max-w-[210px] md:max-w-none">
            <SectionTitle title="EDITOR’S PICK" text="Problems trying to resolve the conflict between" />
          </div>
          <div className="flex w-full max-w-[414px] flex-col gap-[30px] pl-[41px] pr-[49px] md:max-w-none md:flex-row md:flex-wrap md:justify-center md:gap-8 md:px-0 lg:flex-nowrap lg:gap-[30px]">
            {[editorsPick[0], editorsPick[1]].map((item, index) => (
              <Link
                key={item.id}
                to={item.to}
                className={`flex aspect-[324/500] w-full overflow-hidden md:w-[324px] lg:aspect-auto lg:h-[500px] ${index === 0 ? 'lg:w-[510px]' : 'lg:w-[240px]'}`}
              >
                <picture className="flex h-full w-full">
                  <source media="(max-width: 1023px)" srcSet={item.mobileImage} />
                  <img src={item.image} alt={item.label} className="h-full w-full object-cover object-top" />
                </picture>
                <span className="sr-only">{item.label}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4 md:flex-row md:justify-center md:gap-8 lg:w-[240px] lg:flex-col lg:gap-4">
              {[editorsPick[2], editorsPick[3]].map((item) => (
                <Link key={item.id} to={item.to} className="flex aspect-[324/242] w-full overflow-hidden md:w-[324px] lg:aspect-auto lg:h-[242px] lg:w-full">
                  <picture className="flex h-full w-full">
                    <source media="(max-width: 1023px)" srcSet={item.mobileImage} />
                    <img src={item.image} alt={item.label} className="h-full w-full object-cover object-top" />
                  </picture>
                  <span className="sr-only">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bestseller products */}
      <section className="flex w-full bg-white py-20 xl:pl-[73px]">
        <div className="mx-auto flex w-full max-w-[1049px] flex-col items-center gap-12 px-[43px] lg:gap-20 lg:px-0">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h4 className="text-xl leading-[30px] tracking-[0.2px] text-second-text-color">Featured Products</h4>
            <div className="max-w-[240px] lg:max-w-none">
              <SectionTitle title="BESTSELLER PRODUCTS" text="Problems trying to resolve the conflict between" />
            </div>
          </div>
          <div className="flex w-full flex-col gap-[30px] md:flex-row md:flex-wrap lg:gap-y-20 xl:gap-x-[31px]">
            {bestsellerProducts.map((product) => (
              <div key={product.id} className="flex w-full md:w-[calc(50%-15px)] lg:w-[calc(25%-23px)] xl:w-[239px]">
                <ProductCard {...product} imageLoading="eager" imageClassName="aspect-[328/427] lg:aspect-[239/427]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second carousel */}
      <Slider
        slides={vitaSlides}
        arrowClassName="top-[571px] lg:top-[383px]"
        renderSlide={(slide, isActive) => (
          <div className="flex w-full overflow-hidden bg-secondary-color-1">
            <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-[29px] px-10 pt-[208px] text-center text-white lg:h-[709px] lg:flex-row lg:items-end lg:justify-between lg:gap-8 lg:px-20 lg:pt-0 lg:text-left xl:pl-[15px] xl:pr-5">
              <div className="flex flex-col items-center gap-9 lg:items-start lg:gap-8 lg:self-start lg:pt-[171px]">
                <h5 className="text-xl leading-[30px] tracking-[0.2px]">{slide.tag}</h5>
                <h2 className="max-w-[300px] text-[40px] font-bold leading-[50px] tracking-[0.2px] lg:max-w-[510px] lg:text-[58px] lg:leading-[80px]">
                  {slide.title}
                </h2>
                <p className="-mt-0.5 max-w-[291px] text-xl leading-[30px] tracking-[0.2px] lg:-mt-[3px] lg:max-w-[341px] lg:text-sm lg:leading-5">
                  <span className="lg:hidden">We know how large objects will act, but things on a small scale.</span>
                  <span className="hidden lg:inline">{slide.text}</span>
                </p>
                <div className="flex flex-col items-center gap-[19px] lg:-mt-0.5 lg:flex-row lg:gap-[30px]">
                  <span className="text-2xl font-bold leading-8 tracking-[0.1px]">{formatPrice(slide.price)}</span>
                  <Link to="/shop" tabIndex={isActive ? undefined : -1} className="flex h-[52px] w-[180px] items-center justify-center rounded-md bg-success-color text-sm font-bold leading-[22px] tracking-[0.2px] hover:opacity-90 lg:w-[181px]">
                    ADD TO CART
                  </Link>
                </div>
              </div>
              <img src={slide.image} alt={slide.title} className="aspect-[422/565] w-[calc(100%+88px)] max-w-none object-cover object-top lg:h-[598px] lg:w-[444px]" />
            </div>
          </div>
        )}
      />

      {/* Part of the Neural Universe */}
      <section className="flex w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col-reverse items-center gap-[34px] px-[13px] pt-[120px] lg:max-w-[1176px] lg:flex-row lg:gap-10 lg:px-10 lg:py-0 xl:gap-[111px] xl:px-0">
          <picture className="mr-[9px] flex w-full max-w-[379px] lg:mr-0 lg:w-1/2 lg:max-w-none xl:w-[624px] xl:shrink-0">
            <source media="(min-width: 1024px)" srcSet="/images/home/neural-universe-desktop.jpg" />
            <img src="/images/home/mobile-neural.jpg" alt="Couple wearing winter clothes" className="w-full object-contain lg:h-[680px] lg:object-cover" />
          </picture>
          <div className="flex flex-col items-center gap-8 text-center lg:items-start lg:gap-[30px] lg:text-left">
            <h5 className="text-base font-bold leading-6 tracking-[0.1px] text-muted-color">SUMMER 2020</h5>
            <h2 className="max-w-[300px] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color lg:max-w-[400px]">Part of the Neural Universe</h2>
            <p className="-mb-[5px] -mt-2.5 max-w-[250px] text-xl leading-[30px] tracking-[0.2px] text-second-text-color lg:my-0 lg:max-w-[376px]">
              We know how large objects will act, but things on a small scale.
            </p>
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-2.5">
              <Link to="/shop" className="flex h-[53px] w-[152px] items-center justify-center rounded-md bg-primary-color text-sm font-bold leading-[22px] tracking-[0.2px] text-white hover:opacity-90 lg:h-[52px] lg:w-[151px] lg:bg-success-color">
                BUY NOW
              </Link>
              <Link to="/about" className="flex h-[53px] w-[162px] items-center justify-center rounded-md border border-primary-color text-sm font-bold leading-[22px] tracking-[0.2px] text-primary-color hover:bg-primary-color hover:text-white lg:h-[52px] lg:w-[171px] lg:border-success-color lg:text-success-color lg:hover:bg-success-color">
                <span className="lg:hidden">Learn More</span>
                <span className="hidden lg:inline">READ MORE</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured posts */}
      <section className="flex w-full bg-white pb-20 pt-[81px] lg:pb-28 lg:pt-[115px]">
        <div className="mx-auto flex w-full max-w-[1066px] flex-col items-center gap-20 px-[41px] lg:px-0">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <h6 className="text-sm font-bold leading-6 tracking-[0.2px] text-primary-color">Practice Advice</h6>
            <h2 className="text-[40px] font-bold leading-[50px] tracking-[0.2px] text-text-color">
              <span className="lg:hidden">Featured Products</span>
              <span className="hidden lg:inline">Featured Posts</span>
            </h2>
            <p className="-mt-px max-w-[250px] text-sm leading-5 tracking-[0.2px] text-second-text-color md:max-w-[469px]">
              Problems trying to resolve the conflict between<br className="hidden lg:inline" /> the two major<span className="hidden md:inline"> realms of Classical physics: Newtonian mechanics</span>
            </p>
          </div>

          <div className="flex w-full flex-col gap-[30px] lg:flex-row xl:justify-between xl:gap-0">
            {featuredPosts.map((post) => (
              <article key={post.id} className="flex w-full flex-col bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] lg:w-1/3 xl:w-[349px]">
                <div className="relative flex h-[300px] w-full overflow-hidden">
                  <picture className="flex h-full w-full">
                    <source media="(max-width: 1023px)" srcSet={post.mobileImage} />
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
                  </picture>
                  <span className="absolute left-5 top-5 rounded-[3px] bg-danger-color px-2.5 text-sm font-bold leading-6 tracking-[0.2px] text-white">NEW</span>
                </div>
                <div className="flex flex-col gap-2.5 px-[26px] pb-[35px] pt-[26px]">
                  <div className="-mb-px flex gap-4 text-xs leading-4 tracking-[0.2px]">
                    {post.tags.map((tag, index) => (
                      <span key={tag} className={index === 0 ? 'text-[#8EC2F2]' : 'text-second-text-color'}>{tag}</span>
                    ))}
                  </div>
                  <h4 className="text-xl leading-[30px] tracking-[0.2px] text-text-color">{post.title}</h4>
                  <p className="max-w-[280px] text-sm leading-5 tracking-[0.2px] text-second-text-color">{post.text}</p>
                  <div className="flex items-center justify-between py-[15px] text-xs leading-4 tracking-[0.2px] text-second-text-color">
                    <span className="flex items-center gap-1.5"><AlarmClock size={16} className="text-primary-color" />{post.date}</span>
                    <span className="flex items-center gap-1.5"><ChartArea size={16} className="text-secondary-color-1 [&>path:last-child]:fill-current" />{post.comments} comments</span>
                  </div>
                  <Link to="/about" className="flex items-center gap-2.5 text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color hover:text-primary-color">
                    Learn More <ChevronRight strokeWidth={1.1} className="-mx-[9.5px] -my-0.5 h-7 w-7 text-primary-color" />
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
