import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { LayoutGrid, List } from 'lucide-react'
import Breadcrumb from '../components/Breadcrumb.jsx'
import ClientsLogos from '../components/ClientsLogos.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductCard from '../components/ProductCard.jsx'
import Spinner from '../components/Spinner.jsx'
import { FETCH_STATES, fetchProducts, setOffset } from '../store/actions/productActions.js'
import { categoryPath, genderLabel, productImage, productPath } from '../utils/helpers.js'

const SORT_OPTIONS = [
  { value: 'price:asc', label: 'Price: Low to High' },
  { value: 'price:desc', label: 'Price: High to Low' },
  { value: 'rating:asc', label: 'Rating: Low to High' },
  { value: 'rating:desc', label: 'Rating: High to Low' },
]

// T14: typing in the filter input changes the filter state immediately (→ GET);
// the sort value is applied with the Filter button (→ sort state → GET). Other params are kept.
function ShopFilterForm({ filter, onFilterChange, initialSort, onApplySort }) {
  const [sort, setSort] = useState(initialSort)

  const handleSubmit = (event) => {
    event.preventDefault()
    onApplySort(sort)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center gap-3.5">
      <label htmlFor="shop-filter" className="sr-only">Filter products</label>
      <input
        id="shop-filter"
        type="search"
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="Search products"
        className="w-44 rounded-md border border-[#DDDDDD] bg-light-gray-1 px-4 py-3 text-sm text-text-color outline-none focus:border-primary-color"
      />
      <label htmlFor="shop-sort" className="sr-only">Sort products</label>
      <select
        id="shop-sort"
        value={sort}
        onChange={(event) => setSort(event.target.value)}
        className="rounded-md border border-[#DDDDDD] bg-light-gray-1 px-4 py-3 text-sm text-second-text-color outline-none focus:border-primary-color"
      >
        <option value="">Popularity</option>
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <button type="submit" className="rounded-md bg-primary-color px-5 py-3 text-sm font-bold leading-7 tracking-[0.2px] text-white hover:opacity-90">
        Filter
      </button>
    </form>
  )
}

function ShopPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const { categoryId } = useParams()
  const { categories, productList, total, limit, fetchState } = useSelector((state) => state.product)
  const [view, setView] = useState('grid')

  const searchParams = new URLSearchParams(location.search)
  const sort = searchParams.get('sort') || ''
  const filter = searchParams.get('filter') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const offset = (page - 1) * limit
  const pageCount = Math.ceil(total / limit)

  // T13/T14/T15: any change of category, filter, sort or page re-fetches while keeping the others
  useEffect(() => {
    dispatch(setOffset(offset))
    dispatch(fetchProducts({ category: categoryId, filter, sort, limit, offset }))
  }, [dispatch, categoryId, filter, sort, limit, offset])

  const updateQuery = (changes, { replace = false } = {}) => {
    const params = new URLSearchParams(location.search)
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    const query = params.toString()
    const url = `${location.pathname}${query ? `?${query}` : ''}`
    if (replace) history.replace(url)
    else history.push(url)
  }

  // replace (not push) while typing, so each keystroke does not add a history entry
  const changeFilter = (nextFilter) => updateQuery({ filter: nextFilter, page: '' }, { replace: true })
  const applySort = (nextSort) => updateQuery({ sort: nextSort, page: '' })

  const changePage = (nextPage) => {
    updateQuery({ page: nextPage > 1 ? String(nextPage) : '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const topCategories = [...categories].sort((a, b) => b.rating - a.rating).slice(0, 5)
  const activeCategory = categories.find((category) => String(category.id) === String(categoryId))
  const preservedSearch = new URLSearchParams({ ...(filter && { filter }), ...(sort && { sort }) }).toString()

  return (
    <div className="flex w-full flex-col">
      {/* Shop header */}
      <section className="flex w-full bg-light-gray-1">
        <div className="mx-auto flex w-full max-w-[1088px] flex-col gap-6 px-8 py-6 lg:px-4">
          <div className="flex flex-col items-center gap-4 py-6 md:flex-row md:justify-between">
            <h1 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">
              {activeCategory ? `${genderLabel(activeCategory.gender)} · ${activeCategory.title}` : 'Shop'}
            </h1>
            <Breadcrumb
              items={[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/shop' },
                ...(activeCategory ? [{ label: activeCategory.title }] : []),
              ]}
            />
          </div>

          <div className="flex flex-col gap-4 pb-12 md:flex-row md:flex-wrap md:justify-center lg:flex-nowrap lg:gap-4">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={{ pathname: categoryPath(category), search: preservedSearch }}
                className={`group relative flex h-[300px] w-full overflow-hidden md:w-[calc(50%-8px)] lg:h-[223px] lg:w-1/5 ${String(category.id) === String(categoryId) ? 'ring-4 ring-primary-color' : ''}`}
              >
                <img src={category.img} alt={category.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/25 text-white">
                  <h3 className="text-base font-bold uppercase leading-6 tracking-[0.1px]">{category.title}</h3>
                  <p className="text-sm leading-5 tracking-[0.2px]">{genderLabel(category.gender)} · ★ {category.rating}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter row */}
      <section className="flex w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1050px] flex-col items-center gap-6 px-8 py-6 lg:flex-row lg:justify-between lg:px-0">
          <p className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">
            Showing {productList.length} of {total} results
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">Views:</span>
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => setView('grid')}
              className={`flex rounded-md border border-[#ECECEC] p-3.5 ${view === 'grid' ? 'text-text-color' : 'text-second-text-color'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => setView('list')}
              className={`flex rounded-md border border-[#ECECEC] p-3.5 ${view === 'list' ? 'text-text-color' : 'text-second-text-color'}`}
            >
              <List size={16} />
            </button>
          </div>
          <ShopFilterForm key={sort} filter={filter} onFilterChange={changeFilter} initialSort={sort} onApplySort={applySort} />
        </div>
      </section>

      {/* Product list */}
      <section className="flex w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1124px] flex-col items-center gap-12 px-8 py-12 lg:px-0">
          {fetchState === FETCH_STATES.FETCHING && (
            <div className="flex min-h-[400px] items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}

          {fetchState === FETCH_STATES.FAILED && (
            <p className="py-20 text-center text-danger-color">Products could not be loaded. Please try again.</p>
          )}

          {fetchState === FETCH_STATES.FETCHED && productList.length === 0 && (
            <p className="py-20 text-center text-second-text-color">No products found for these filters.</p>
          )}

          {fetchState === FETCH_STATES.FETCHED && productList.length > 0 && (
            <div className={`flex w-full flex-col gap-[30px] ${view === 'grid' ? 'md:flex-row md:flex-wrap' : ''}`}>
              {productList.map((product) => (
                <div key={product.id} className={`flex w-full ${view === 'grid' ? 'md:w-[calc(50%-15px)] lg:w-[calc(25%-23px)]' : ''}`}>
                  <ProductCard
                    to={productPath(product, categories)}
                    image={productImage(product)}
                    title={product.name}
                    department={product.description}
                    price={product.price}
                    imageClassName={view === 'grid' ? 'aspect-[239/300]' : 'aspect-[16/9] md:aspect-[3/1]'}
                  />
                </div>
              ))}
            </div>
          )}

          {fetchState === FETCH_STATES.FETCHED && <Pagination page={page} pageCount={pageCount} onChange={changePage} />}
        </div>
      </section>

      <ClientsLogos />
    </div>
  )
}

export default ShopPage
