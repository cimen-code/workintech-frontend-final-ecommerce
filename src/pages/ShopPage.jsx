import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { ChevronDown, LayoutGrid, List } from 'lucide-react'
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
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center justify-center -mt-px mr-0.5 gap-x-[15px] gap-y-3.5 lg:ml-auto lg:mr-0 lg:mt-0 lg:flex-nowrap lg:gap-x-3.5">
      <label htmlFor="shop-filter" className="sr-only">Filter products</label>
      <input
        id="shop-filter"
        type="search"
        value={filter}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="Search products"
        className="order-last w-[250px] rounded-md border border-[#DDDDDD] bg-light-gray-1 px-4 py-3 text-sm text-text-color outline-none focus:border-primary-color lg:order-none lg:w-44"
      />
      <label htmlFor="shop-sort" className="sr-only">Sort products</label>
      <div className="relative flex">
        <select
          id="shop-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          className="h-[50px] min-w-[141px] appearance-none rounded-[5px] border border-[#DDDDDD] bg-[#F9F9F9] pl-3 pr-9 text-sm min-[414px]:pl-[19px] min-[414px]:pr-[46px] tracking-[0.2px] text-second-text-color outline-none [field-sizing:content] focus:border-primary-color lg:min-w-[142px]"
        >
          <option value="">Popularity</option>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={20} className="pointer-events-none absolute right-[25px] top-[15px] text-second-text-color" />
      </div>
      <button type="submit" className="h-[50px] w-[94px] rounded-[5px] bg-primary-color pb-1.5 text-sm font-bold leading-7 tracking-[0.2px] text-white hover:opacity-90 lg:w-[95px]">
        Filter
      </button>
    </form>
  )
}

// Query of the list now in the store, so Back from a product can keep it and its scroll position
let lastListQuery = ''

function ShopPage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const { categoryId } = useParams()
  const filterRowRef = useRef(null)
  const { categories, productList, total, limit, fetchState } = useSelector((state) => state.product)

  const searchParams = new URLSearchParams(location.search)
  const sort = searchParams.get('sort') || ''
  const filter = searchParams.get('filter') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const offset = (page - 1) * limit
  const pageCount = Math.ceil(total / limit)

  // T13/T14/T15: any change of category, filter, sort or page re-fetches while keeping the others
  useEffect(() => {
    dispatch(setOffset(offset))
    const query = JSON.stringify({ categoryId, filter, sort, limit, offset })
    if (history.action === 'POP' && query === lastListQuery) return
    lastListQuery = query
    dispatch(fetchProducts({ category: categoryId, filter, sort, limit, offset }))
  }, [dispatch, history, categoryId, filter, sort, limit, offset])

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
    filterRowRef.current?.scrollIntoView()
  }

  const topCategories = [...categories].sort((a, b) => b.rating - a.rating).slice(0, 5)
  const preservedSearch = new URLSearchParams({ ...(filter && { filter }), ...(sort && { sort }) }).toString()

  return (
    <div className="flex w-full flex-col">
      {/* Shop header */}
      <section className="flex w-full bg-light-gray-1">
        <div className="mx-auto flex w-full max-w-[1088px] flex-col px-[41px] pb-10 pt-[50px] md:gap-6 md:px-8 md:py-6 lg:pb-12 lg:px-4 xl:px-0">
          <div className="flex flex-col items-center gap-[54px] pb-[46px] md:flex-row md:justify-between md:gap-4 md:py-6 lg:py-0 xl:pl-[21px] xl:pr-5">
            <h1 className="text-2xl font-bold leading-8 tracking-[0.1px] text-text-color">Shop</h1>
            <Breadcrumb
              gapClassName="gap-4 lg:gap-[14px]"
              lastClassName="text-second-text-color lg:text-muted-color"
              items={[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/shop' },
              ]}
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center md:pb-12 lg:flex-nowrap lg:gap-4 lg:pb-0">
            {topCategories.map((category) => (
              <Link
                key={category.id}
                to={{ pathname: categoryPath(category), search: preservedSearch }}
                className="relative flex h-[300px] w-full overflow-hidden md:w-[calc(50%-8px)] lg:h-[223px] lg:w-1/5"
              >
                <img src={category.img} alt={category.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/25 text-white">
                  <h3 lang="tr" className="text-base font-bold uppercase leading-6 tracking-[0.1px]">{category.title}</h3>
                  <p className="text-sm leading-5 tracking-[0.2px]">{genderLabel(category.gender)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter row */}
      <section ref={filterRowRef} className="flex w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1048px] flex-col items-center gap-6 px-8 pt-[25px] lg:flex-row lg:gap-0 lg:px-0 lg:pb-6 lg:pt-6">
          <p className="text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color lg:w-[395px]">
            Showing {productList.length} of {total} results
          </p>
          <div className="flex items-center gap-[15px]">
            <span className="mr-[3px] text-sm font-bold leading-6 tracking-[0.2px] text-second-text-color">Views:</span>
            <span role="img" aria-label="Grid view" className="flex rounded-md border border-[#ECECEC] p-3.5 text-text-color">
              <LayoutGrid size={16} fill="currentColor" />
            </span>
            <span role="img" aria-label="List view" className="flex rounded-md border border-[#ECECEC] p-3.5 text-second-text-color">
              <List size={16} />
            </span>
          </div>
          <ShopFilterForm key={sort} filter={filter} onFilterChange={changeFilter} initialSort={sort} onApplySort={applySort} />
        </div>
      </section>

      {/* Product list */}
      <section className="flex w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1048px] flex-col items-center gap-12 px-[43px] pb-20 pt-11 lg:px-0 lg:pb-[46px] lg:pt-12">
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
            <div className="flex w-full flex-col gap-[30px] md:flex-row md:flex-wrap lg:gap-x-[30.33px] lg:gap-y-12">
              {productList.map((product) => (
                <div key={product.id} className="flex w-full md:w-[calc(50%-15px)] lg:w-[calc(25%-23px)]">
                  <ProductCard
                    to={productPath(product, categories)}
                    image={productImage(product)}
                    title={product.name}
                    department={product.description}
                    price={product.price}
                    imageClassName="aspect-[328/427] lg:aspect-[239/300]"
                  />
                </div>
              ))}
            </div>
          )}

          {fetchState === FETCH_STATES.FETCHED && <Pagination page={page} pageCount={pageCount} onChange={changePage} />}
        </div>
      </section>

      <ClientsLogos className="pb-[161px] pt-40 md:pb-[51px] md:pt-[50px]" />
    </div>
  )
}

export default ShopPage
