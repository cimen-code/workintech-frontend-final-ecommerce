import api from '../../api/axiosInstance.js'

export const SET_CATEGORIES = 'product/SET_CATEGORIES'
export const SET_PRODUCT_LIST = 'product/SET_PRODUCT_LIST'
export const SET_TOTAL = 'product/SET_TOTAL'
export const SET_FETCH_STATE = 'product/SET_FETCH_STATE'
export const SET_LIMIT = 'product/SET_LIMIT'
export const SET_OFFSET = 'product/SET_OFFSET'
export const SET_FILTER = 'product/SET_FILTER'
export const SET_SELECTED_PRODUCT = 'product/SET_SELECTED_PRODUCT'
export const SET_SELECTED_PRODUCT_FETCH_STATE = 'product/SET_SELECTED_PRODUCT_FETCH_STATE'

export const DEFAULT_LIMIT = 25

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

export const fetchCategoriesIfNeeded = () => (dispatch, getState) => {
  if (getState().product.categories.length > 0) return Promise.resolve()

  return api
    .get('/categories')
    .then((res) => dispatch(setCategories(res.data)))
    .catch(() => dispatch(setCategories([])))
}

export const buildProductQuery = ({ category, filter, sort, limit, offset }) => {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (filter) params.set('filter', filter)
  if (sort) params.set('sort', sort)
  if (limit !== DEFAULT_LIMIT || offset > 0) {
    params.set('limit', limit)
    params.set('offset', offset)
  }
  return params.toString().replaceAll('%3A', ':')
}

// only the latest request may update the list (filter typing can start several requests)
let latestProductsRequest = 0

export const fetchProducts = (query = {}) => (dispatch, getState) => {
  const { limit, offset } = getState().product
  const params = { limit, offset, ...query }
  latestProductsRequest += 1
  const requestId = latestProductsRequest

  dispatch(setFetchState(FETCH_STATES.FETCHING))
  if (params.filter !== undefined) dispatch(setFilter(params.filter || ''))

  const queryString = buildProductQuery(params)

  return api
    .get(queryString ? `/products?${queryString}` : '/products')
    .then((res) => {
      if (requestId !== latestProductsRequest) return
      dispatch(setProductList(res.data.products))
      dispatch(setTotal(res.data.total))
      dispatch(setFetchState(FETCH_STATES.FETCHED))
    })
    .catch(() => {
      if (requestId !== latestProductsRequest) return
      dispatch(setProductList([]))
      dispatch(setTotal(0))
      dispatch(setFetchState(FETCH_STATES.FAILED))
      return false
    })
}

let latestProductRequest = 0

export const fetchProduct = (productId) => (dispatch) => {
  latestProductRequest += 1
  const requestId = latestProductRequest

  dispatch(setSelectedProductFetchState(FETCH_STATES.FETCHING))

  return api
    .get(`/products/${productId}`)
    .then((res) => {
      if (requestId !== latestProductRequest) return
      dispatch(setSelectedProduct(res.data))
      dispatch(setSelectedProductFetchState(FETCH_STATES.FETCHED))
    })
    .catch(() => {
      if (requestId !== latestProductRequest) return
      dispatch(setSelectedProduct(null))
      dispatch(setSelectedProductFetchState(FETCH_STATES.FAILED))
    })
}
