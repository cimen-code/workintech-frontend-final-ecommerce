import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft, ChevronLeft, ChevronRight, Eye, Heart, ShoppingCart, Star } from 'lucide-react'
import api from '../api/axiosInstance.js'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ClientsLogos from '../components/ClientsLogos.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { FETCH_STATES, fetchProduct } from '../store/actions/productActions.js'
import { addToCart } from '../store/actions/shoppingCartActions.js'
import { categoryPath, formatPrice, productImage, productPath } from '../utils/helpers.js'

// T04: third description column of the Figma product detail frame — two headings whose bullet
// lists hold 4 and 3 identical items (read from review/full-project/figma-raw/product_desktop.png)
const DESCRIPTION_HEADING = 'the quick fox jumps over'
const DESCRIPTION_BULLET = 'the quick fox jumps over the lazy dog'
const DESCRIPTION_LIST_SIZES = [4, 3]

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rating ${rating} of 5`}>
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
    <div className="flex w-full flex-col gap-5 lg:w-1/2">
      <div className="relative flex aspect-[506/450] w-full overflow-hidden rounded-md bg-white">
        <img src={list[active].url} alt={name} className="h-full w-full object-contain" />
        {list.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={() => move(-1)} className="absolute left-4 top-1/2 flex -translate-y-1/2 text-text-color">
              <ChevronLeft size={40} />
            </button>
            <button type="button" aria-label="Next image" onClick={() => move(1)} className="absolute right-4 top-1/2 flex -translate-y-1/2 text-text-color">
              <ChevronRight size={40} />
            </button>
          </>
        )}
      </div>
      <div className="flex gap-5">
        {list.map((image, index) => (
          <button
            key={image.url}
            type="button"
            onClick={() => setActive(index)}
            className={`flex h-[75px] w-[100px] overflow-hidden rounded bg-white ${index === active ? 'opacity-100 ring-2 ring-primary-color' : 'opacity-60'}`}
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
  const [activeTab, setActiveTab] = useState('description')

  // T16: fetch product by thunk and keep it in product reducer
  useEffect(() => {
    dispatch(fetchProduct(productId))
    window.scrollTo(0, 0)
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
    if (history.length > 1) history.goBack()
    else history.push('/shop')
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product))
    toast.success(`${product.name} added to cart`)
  }

  const isLoading = fetchState === FETCH_STATES.FETCHING || fetchState === FETCH_STATES.NOT_FETCHED || (product && String(product.id) !== String(productId) && fetchState !== FETCH_STATES.FAILED)
  const category = categories.find((item) => String(item.id) === String(categoryId))

  return (
    <div className="flex w-full flex-col">
      <section className="flex w-full bg-light-gray-1">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-6 px-8 pb-12 pt-6 lg:px-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 rounded-md border border-primary-color px-4 py-2 text-sm font-bold text-primary-color hover:bg-primary-color hover:text-white"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <Breadcrumb
              items={[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/shop' },
                ...(category ? [{ label: category.title, to: categoryPath(category) }] : []),
                { label: product && !isLoading ? product.name : 'Product' },
              ]}
            />
          </div>

          {isLoading && (
            <div className="flex min-h-[450px] items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}

          {!isLoading && fetchState === FETCH_STATES.FAILED && (
            <p className="py-20 text-center text-danger-color">Product could not be found.</p>
          )}

          {!isLoading && fetchState === FETCH_STATES.FETCHED && product && (
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
              <ImageGallery key={product.id} images={product.images || []} name={product.name} />

              <div className="flex w-full flex-col gap-3 px-2 pt-3 lg:w-1/2">
                <h1 className="text-xl leading-[30px] tracking-[0.2px] text-text-color">{product.name}</h1>
                <div className="flex items-center gap-2.5">
                  <RatingStars rating={product.rating} />
                  <span className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">
                    {product.rating} · {product.sell_count} sold
                  </span>
                </div>
                <p className="pt-2 text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">{formatPrice(product.price)}</p>
                <p className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">
                  Availability :{' '}
                  <span className={product.stock > 0 ? 'text-primary-color' : 'text-danger-color'}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </p>
                <p className="pt-4 text-sm leading-5 tracking-[0.2px] text-[#858585]">{product.description}</p>
                <hr className="my-4 border-[#BDBDBD]" />
                <div className="flex gap-2.5">
                  {['bg-primary-color', 'bg-success-color', 'bg-alert-color', 'bg-dark-background-color'].map((color) => (
                    <span key={color} className={`h-[30px] w-[30px] rounded-full ${color}`} />
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2.5 pt-12">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="rounded-md bg-primary-color px-5 py-2.5 text-sm font-bold leading-6 tracking-[0.2px] text-white hover:opacity-90 disabled:bg-disabled-element-color"
                  >
                    Add to Cart
                  </button>
                  <button type="button" aria-label="Add to favorites" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white">
                    <Heart size={20} />
                  </button>
                  <button type="button" aria-label="Add to cart" onClick={handleAddToCart} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white">
                    <ShoppingCart size={20} />
                  </button>
                  <button type="button" aria-label="Quick view" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E8E8] bg-white">
                    <Eye size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {!isLoading && product && (
        <section className="flex w-full bg-white">
          <div className="mx-auto flex w-full max-w-[1050px] flex-col px-8 lg:px-0">
            <div className="flex justify-center gap-2 border-b border-[#ECECEC] py-6">
              {[
                ['description', 'Description'],
                ['info', 'Additional Information'],
                ['reviews', 'Reviews (0)'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-2 text-sm font-bold leading-6 tracking-[0.2px] ${activeTab === key ? 'text-text-color underline underline-offset-8' : 'text-second-text-color'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-8 py-12 lg:flex-row">
              <img src="/images/product/description.png" alt="Product lifestyle" className="w-full rounded-md object-cover shadow-md lg:w-[316px]" />
              {activeTab === 'description' && (
                <>
                  <div className="flex flex-col gap-6 lg:flex-1">
                    <h3 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">{product.name}</h3>
                    <p className="text-sm leading-5 tracking-[0.2px] text-second-text-color">{product.description}</p>
                    <p className="text-sm leading-5 tracking-[0.2px] text-second-text-color">
                      Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.
                    </p>
                  </div>
                  <div className="flex flex-col gap-8 lg:flex-1">
                    {DESCRIPTION_LIST_SIZES.map((size) => (
                      <div key={size} className="flex flex-col gap-5">
                        <h3 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">{DESCRIPTION_HEADING}</h3>
                        <ul className="flex flex-col gap-2.5">
                          {Array.from({ length: size }, (_, index) => (
                            <li key={index} className="flex items-center gap-2.5 text-sm font-bold leading-5 tracking-[0.2px] text-second-text-color">
                              <ChevronRight size={16} className="shrink-0 text-muted-color" />
                              {DESCRIPTION_BULLET}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {activeTab === 'info' && (
                <ul className="flex flex-col gap-3 text-sm font-bold text-second-text-color lg:w-1/2">
                  <li>Product ID: {product.id}</li>
                  <li>Category ID: {product.category_id}</li>
                  <li>Store ID: {product.store_id}</li>
                  <li>Stock: {product.stock}</li>
                  <li>Sell count: {product.sell_count}</li>
                </ul>
              )}
              {activeTab === 'reviews' && <p className="text-sm text-second-text-color lg:w-1/2">There are no reviews yet.</p>}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="flex w-full bg-light-gray-1">
          <div className="mx-auto flex w-full max-w-[1050px] flex-col gap-6 px-8 py-12 lg:px-0">
            <h3 className="border-b border-[#ECECEC] pb-6 text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">BESTSELLER PRODUCTS</h3>
            <div className="flex flex-col gap-[30px] md:flex-row md:flex-wrap">
              {related
                .filter((item) => String(item.id) !== String(productId))
                .slice(0, 8)
                .map((item) => (
                  <div key={item.id} className="flex w-full md:w-[calc(50%-15px)] lg:w-[calc(25%-23px)]">
                    <ProductCard
                      to={productPath(item, categories)}
                      image={productImage(item)}
                      title={item.name}
                      department={item.description}
                      price={item.price}
                      colors={[]}
                      imageClassName="aspect-[239/280]"
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      <ClientsLogos />
    </div>
  )
}

export default ProductDetailPage
