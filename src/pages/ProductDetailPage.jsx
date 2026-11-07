import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Heart, ShoppingCart, Star } from 'lucide-react'
import api from '../api/axiosInstance.js'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ClientsLogos from '../components/ClientsLogos.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { FETCH_STATES, fetchProduct } from '../store/actions/productActions.js'
import { addToCart } from '../store/actions/shoppingCartActions.js'
import { formatPrice, productImage, productPath } from '../utils/helpers.js'

const DESCRIPTION_HEADING = 'the quick fox jumps over'
const DESCRIPTION_BULLET = 'the quick fox jumps over the lazy dog'
const DESCRIPTION_LIST_SIZES = [4, 3]

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-[5px]" aria-label={`Rating ${rating} of 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          size={22}
          className="text-[#F3CD03]"
          fill={rating >= value - 0.5 ? '#F3CD03' : 'none'}
        />
      ))}
    </div>
  )
}

function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0)
  const list = images.length ? images : [{ url: '/images/product/main.png', index: 0 }]
  const move = (delta) => setActive((current) => (current + delta + list.length) % list.length)

  return (
    <div className="flex w-full flex-col gap-[42px] px-px lg:w-[506px] lg:shrink-0 lg:gap-[21px] lg:px-0">
      <div className="relative flex aspect-[348/277] w-full overflow-hidden bg-white lg:aspect-[506/450]">
        <img src={list[active].url} alt={name} className="h-full w-full object-cover object-top" />
        <button type="button" aria-label="Previous image" onClick={() => move(-1)} className="absolute left-3 top-[97px] flex text-white lg:left-[11px] lg:top-[241px]">
          <ChevronLeft size={80} strokeWidth={0.9} />
        </button>
        <button type="button" aria-label="Next image" onClick={() => move(1)} className="absolute right-[6px] top-[97px] flex text-white lg:top-[241px]">
          <ChevronRight size={80} strokeWidth={0.9} />
        </button>
      </div>
      <div className="flex gap-[19px]">
        {list.map((image, index) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setActive(index)}
            className={`flex h-[75px] w-[100px] overflow-hidden bg-white ${index === active ? 'opacity-100' : 'opacity-60'}`}
          >
            <img src={image.url} alt={`${name} ${index + 1}`} className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}

function ProductDetailPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { productId, categoryId } = useParams()
  const { selectedProduct: product, selectedProductFetchState: fetchState, categories } = useSelector((state) => state.product)
  const [related, setRelated] = useState([])

  useEffect(() => {
    dispatch(fetchProduct(productId))
  }, [dispatch, productId])

  useEffect(() => {
    let active = true
    api
      .get(`/products?category=${categoryId}&sort=rating:desc&limit=9`)
      .then((res) => {
        if (active) setRelated(res.data.products)
      })
      .catch(() => {
        if (active) setRelated([])
      })
    return () => {
      active = false
    }
  }, [categoryId])

  const handleBack = () => {
    if (history.location.key) history.goBack()
    else history.push('/shop')
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product))
  }

  const isLoading = fetchState === FETCH_STATES.FETCHING || fetchState === FETCH_STATES.NOT_FETCHED || (product && String(product.id) !== String(productId) && fetchState !== FETCH_STATES.FAILED)

  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full bg-light-gray-1">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-[72px] px-8 pb-[72px] pt-6 lg:gap-6 lg:px-0 lg:pb-[52px]">
          <div className="relative flex justify-end min-[375px]:justify-center lg:justify-start">
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-0 top-0 flex items-center gap-2 rounded-md border border-primary-color px-3 py-2 text-sm font-bold text-primary-color hover:bg-primary-color hover:text-white min-[414px]:px-4 lg:left-auto lg:right-0"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div className="flex lg:pl-[9px]">
              <Breadcrumb
                gapClassName="gap-4 lg:gap-[13px]"
                lastClassName="text-second-text-color lg:text-muted-color"
                items={[
                  { label: 'Home', to: '/' },
                  { label: 'Shop', to: '/shop' },
                ]}
              />
            </div>
          </div>

          {isLoading && (
            <div className="flex min-h-[450px] items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && fetchState === FETCH_STATES.FAILED && (
            <p className="py-20 text-center text-danger-color">Product could not be loaded.</p>
          )}

          {!isLoading && fetchState === FETCH_STATES.FETCHED && product && (
            <div className="flex flex-col gap-10 lg:flex-row lg:gap-[50px]">
              <ImageGallery key={product.id} images={product.images || []} name={product.name} />

              <div className="flex w-full flex-col gap-3 px-[25px] lg:flex-1 lg:px-2 lg:pt-2.5">
                <h1 className="text-xl leading-[30px] tracking-[0.2px] text-text-color">{product.name}</h1>
                <div className="flex items-center gap-2.5">
                  <RatingStars rating={product.rating} />
                  <span className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">
                    {product.rating} · {product.sell_count} sold
                  </span>
                </div>
                <p className="pt-[11px] text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">{formatPrice(product.price)}</p>
                <p className="-mt-2 text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">
                  Availability&nbsp; :{' '}
                  <span className="text-primary-color">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </p>
                <p className="min-h-[119px] pt-[19px] text-sm leading-5 tracking-[0.2px] text-[#858585] lg:min-h-[79px]">{product.description}</p>
                <hr className="ml-[5px] mt-1 w-[283px] border-[#BDBDBD] max-[374px]:ml-0 max-[374px]:w-full lg:ml-0 lg:mt-[15px] lg:w-[446px]" />
                <div className="mt-1.5 flex gap-2.5 lg:mt-4">
                  {['bg-primary-color', 'bg-success-color', 'bg-alert-color', 'bg-dark-background-color'].map((color) => (
                    <span key={color} className={`h-[30px] w-[30px] rounded-full ${color}`} />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2.5 pt-9 lg:pt-[55px]">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="mr-px h-11 w-[148px] rounded-[5px] bg-primary-color text-sm font-bold leading-6 tracking-[0.2px] text-white hover:opacity-90"
                  >
                    Add to Cart
                  </button>
                  <button type="button" aria-label="Add to favorites" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white">
                    <Heart size={20} strokeWidth={1.5} />
                  </button>
                  <button type="button" aria-label="Add to cart" onClick={handleAddToCart} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white">
                    <ShoppingCart size={20} strokeWidth={1.5} />
                  </button>
                  <button type="button" aria-label="Quick view" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white">
                    <Eye size={20} fill="currentColor" className="text-black [&>circle]:fill-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {!isLoading && product && (
        <section className="flex w-full bg-white">
          <div className="mx-auto flex w-full max-w-[1050px] flex-col px-[41px] lg:px-0">
            <div className="-ml-3.5 -mr-10 flex flex-wrap pt-[35px] text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color lg:mx-0 lg:justify-center lg:border-b lg:border-[#ECECEC] lg:pb-[26px] lg:pr-1">
              <span className="pr-2 underline underline-offset-4 lg:px-6 lg:no-underline">Description</span>
              <span className="pr-4 lg:px-6">Additional Information</span>
              <span className="lg:-ml-1 lg:px-6">Reviews&nbsp; <span className="text-secondary-color-1">(0)</span></span>
            </div>
            <div className="flex flex-col gap-[77px] pb-[21px] pt-14 lg:flex-row lg:gap-8 lg:pb-[39px] lg:pt-[46px] xl:gap-0">
              <picture className="flex w-full max-w-[321px] lg:max-w-none lg:w-[316px] lg:shrink-0 xl:-ml-[3px]">
                <source media="(max-width: 1023px)" srcSet="/images/product/mobile-description.jpg" />
                <img src="/images/product/description-desktop.jpg" alt="Product lifestyle" className="w-full rounded-[5px] object-cover shadow-[5px_9px_0_2px_#F3F3F3] lg:h-[372px] lg:shadow-[10px_8px_0_2px_#F3F3F3]" />
              </picture>
              <div className="flex flex-col gap-5 lg:flex-1 xl:ml-[46px] xl:w-[332px] xl:flex-none">
                <h3 className="mb-[9px] text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">{product.name}</h3>
                <p className="min-h-[100px] text-sm leading-5 tracking-[0.2px] text-second-text-color">{product.description}</p>
                {[0, 1].map((key) => (
                  <p key={key} className="text-sm leading-5 tracking-[0.2px] text-second-text-color">
                    Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.
                  </p>
                ))}
              </div>
              <div className="-mt-[19px] flex flex-col gap-[29px] lg:mt-0 lg:flex-1 xl:ml-[30px]">
                {DESCRIPTION_LIST_SIZES.map((size) => (
                  <div key={size} className="flex flex-col gap-[30px] lg:gap-[31px]">
                    <h3 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">{DESCRIPTION_HEADING}</h3>
                    <ul className="flex flex-col gap-3.5">
                      {Array.from({ length: size }, (_, index) => (
                        <li key={index} className="flex items-center gap-5 text-sm font-bold leading-5 tracking-[0.2px] text-second-text-color">
                          <ChevronRight strokeWidth={1.1} className="-mx-[10.5px] -my-[5px] h-[30px] w-[30px] shrink-0 -translate-y-[5px] text-muted-color" />
                          {DESCRIPTION_BULLET}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="flex w-full bg-light-gray-1 xl:pl-[73px]">
          <div className="mx-auto flex w-full max-w-[1049px] flex-col gap-[23px] px-[41px] pb-12 pt-[49px] lg:gap-6 lg:px-0 lg:pb-[49px]">
            <h3 className="border-b-2 border-[#ECECEC] pb-[22px] pl-[18px] text-2xl font-bold leading-8 tracking-[0.1px] text-text-color lg:pb-[23px] lg:pl-0 xl:ml-1 xl:mr-[3px] xl:pl-[3px]">BESTSELLER PRODUCTS</h3>
            <div className="flex flex-col gap-[30px] md:flex-row md:flex-wrap lg:gap-y-6 xl:gap-x-[31px]">
              {related
                .filter((item) => String(item.id) !== String(productId))
                .slice(0, 8)
                .map((item, index) => (
                  <div key={item.id} className={`w-full md:flex md:w-[calc(50%-15px)] lg:w-[calc(25%-23px)] xl:w-[239px] ${index < 4 ? 'flex' : 'hidden'}`}>
                    <ProductCard
                      to={productPath(item, categories)}
                      image={productImage(item)}
                      title={item.name}
                      department={item.description}
                      price={item.price}
                      colors={[]}
                      alignLeft
                      imageClassName="aspect-[332/427] lg:aspect-[239/280]"
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      <ClientsLogos className="pb-[161px] pt-40 md:py-[50px]" />
    </div>
  )
}

export default ProductDetailPage
