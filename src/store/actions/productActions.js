import api from '../../api/axiosInstance.js'

export const SET_CATEGORIES = 'product/SET_CATEGORIES'
export const SET_PRODUCT_LIST = 'product/SET_PRODUCT_LIST'
export const SET_TOTAL = 'product/SET_TOTAL'
export const SET_FETCH_STATE = 'product/SET_FETCH_STATE'
export const SET_LIMIT = 'product/SET_LIMIT'
export const SET_OFFSET = 'product/SET_OFFSET'
export const SET_FILTER = 'product/SET_FILTER'
// T16 extension: the selected product for the detail page
export const SET_SELECTED_PRODUCT = 'product/SET_SELECTED_PRODUCT'
export const SET_SELECTED_PRODUCT_FETCH_STATE = 'product/SET_SELECTED_PRODUCT_FETCH_STATE'

export const FETCH_STATES = {
  NOT_FETCHED: 'NOT_FETCHED',
  FETCHING: 'FETCHING',
  FETCHED: 'FETCHED',
  FAILED: 'FAILED',
}

export const setCategories = (categories) => ({ type: SET_CATEGORIES, payload: categories })
export const setProductList = (productList) => ({ type: SET_PRODUCT_LIST, payload: productList })
export const setTotal = (total) => ({ type: SET_TOTAL, payload: total })
export const setFetchState = (fetchState) => ({ type: SET_FETCH_STATE, payload: fetchState })
export const setLimit = (limit) => ({ type: SET_LIMIT, payload: limit })
export const setOffset = (offset) => ({ type: SET_OFFSET, payload: offset })
export const setFilter = (filter) => ({ type: SET_FILTER, payload: filter })
export const setSelectedProduct = (product) => ({ type: SET_SELECTED_PRODUCT, payload: product })
export const setSelectedProductFetchState = (fetchState) => ({
  type: SET_SELECTED_PRODUCT_FETCH_STATE,
  payload: fetchState,
})

// T12: categories are fetched once and kept in the store
export const fetchCategoriesIfNeeded = () => (dispatch, getState) => {
  if (getState().product.categories.length > 0) return Promise.resolve()

  return api
    .get('/categories')
    .then((res) => dispatch(setCategories(res.data)))
    .catch(() => dispatch(setCategories([])))
}

// T13/T14/T15: builds the query string from the active params, keeping all of them
export const buildProductQuery = ({ category, filter, sort, limit, offset }) => {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (filter) params.set('filter', filter)
  if (sort) params.set('sort', sort)
  if (limit !== undefined) params.set('limit', limit)
  if (offset !== undefined) params.set('offset', offset)
  return params.toString()
}

export const fetchProducts = (query = {}) => (dispatch, getState) => {
  const { limit, offset } = getState().product
  const params = { limit, offset, ...query }

  dispatch(setFetchState(FETCH_STATES.FETCHING))
  if (params.filter !== undefined) dispatch(setFilter(params.filter || ''))

  return api
    .get(`/products?${buildProductQuery(params)}`)
    .then((res) => {
      dispatch(setProductList(res.data.products))
      dispatch(setTotal(res.data.total))
      dispatch(setFetchState(FETCH_STATES.FETCHED))
    })
    .catch(() => {
      dispatch(setProductList([]))
      dispatch(setTotal(0))
      dispatch(setFetchState(FETCH_STATES.FAILED))
    })
}

// T16: single product
export const fetchProduct = (productId) => (dispatch) => {
  dispatch(setSelectedProductFetchState(FETCH_STATES.FETCHING))

  return api
    .get(`/products/${productId}`)
    .then((res) => {
      dispatch(setSelectedProduct(res.data))
      dispatch(setSelectedProductFetchState(FETCH_STATES.FETCHED))
    })
    .catch(() => {
      dispatch(setSelectedProduct(null))
      dispatch(setSelectedProductFetchState(FETCH_STATES.FAILED))
    })
}
