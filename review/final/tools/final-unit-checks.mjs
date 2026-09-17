// Final strict repair — non-network unit checks. Run from repo root:
//   node review/final/tools/final-unit-checks.mjs
const storage = new Map([['cart', JSON.stringify([{ count: 5, checked: true, product: { id: 1, price: 10 } }])]])
globalThis.localStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
}

const { applyMiddleware, combineReducers, createStore } = await import('redux')
const thunkModule = await import('redux-thunk')
// Node loads redux-thunk 2.4.2 as CommonJS: the default export is nested
const thunk = typeof thunkModule.default === 'function' ? thunkModule.default : thunkModule.default.default
const { default: api } = await import('../../../src/api/axiosInstance.js')
const { default: shoppingCartReducer } = await import('../../../src/store/reducers/shoppingCartReducer.js')
const { default: productReducer } = await import('../../../src/store/reducers/productReducer.js')
const { default: clientReducer } = await import('../../../src/store/reducers/clientReducer.js')
const { addToCart, createOrder, setCart } = await import('../../../src/store/actions/shoppingCartActions.js')
const { fetchProducts } = await import('../../../src/store/actions/productActions.js')
const { calculateOrderSummary } = await import('../../../src/utils/helpers.js')
const { bestsellerProducts, heroSlides, vitaSlides } = await import('../../../src/data/homeData.js')
const { teamMembers } = await import('../../../src/data/teamData.js')

let failures = 0
const check = (name, ok, details = '') => {
  if (!ok) failures += 1
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${details ? ` — ${details}` : ''}`)
}
const makeStore = () =>
  createStore(combineReducers({ client: clientReducer, product: productReducer, shoppingCart: shoppingCartReducer }), applyMiddleware(thunk))

// ---- 4.5 T17: no cart persistence ----
const store = makeStore()
check('T17.1 cart initial state is [] even when localStorage has a "cart" key', Array.isArray(store.getState().shoppingCart.cart) && store.getState().shoppingCart.cart.length === 0)
storage.delete('cart')
store.dispatch(addToCart({ id: 322, price: 461.99 }))
store.dispatch(addToCart({ id: 322, price: 461.99 }))
check('T17.2 adding to cart does not write localStorage', !storage.has('cart'))
check('T17.3 same product increments count, item has checked flag', JSON.stringify(store.getState().shoppingCart.cart.map((i) => [i.product.id, i.count, i.checked])) === '[[322,2,true]]')

// ---- 4.9 T22: reset cart after successful order ----
store.dispatch(setCart([
  { count: 1, checked: true, product: { id: 1, price: 10 } },
  { count: 2, checked: false, product: { id: 2, price: 20 } },
]))
let posted = null
api.post = async (url, body) => {
  posted = { url, body }
  return { data: {} }
}
await store.dispatch(createOrder({ address_id: 1, products: [{ product_id: 1, count: 1, detail: 'x' }] }))
check('T22.1 POST /order called with the given payload', posted?.url === '/order' && posted.body.products.length === 1)
check('T22.2 whole cart reset after success (unchecked items too)', store.getState().shoppingCart.cart.length === 0)
check('T22.3 payment and address reset after success', Object.keys(store.getState().shoppingCart.payment).length === 0 && Object.keys(store.getState().shoppingCart.address).length === 0)

store.dispatch(setCart([{ count: 1, checked: true, product: { id: 1, price: 10 } }]))
api.post = async () => {
  throw Object.assign(new Error('500'), { response: { status: 500 } })
}
await store.dispatch(createOrder({})).catch(() => {})
check('T22.4 failed order keeps the cart', store.getState().shoppingCart.cart.length === 1)

// ---- 4.10 T14: only the latest product request updates the list ----
const calls = []
api.get = (url) => {
  calls.push(url)
  const isFirst = calls.length === 1
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: { products: [{ id: isFirst ? 'stale' : 'latest' }], total: isFirst ? 1 : 2 } }), isFirst ? 80 : 5),
  )
}
const p1 = store.dispatch(fetchProducts({ category: '2', filter: 'siy', sort: 'price:desc', limit: 25, offset: 0 }))
const p2 = store.dispatch(fetchProducts({ category: '2', filter: 'siyah', sort: 'price:desc', limit: 25, offset: 0 }))
await Promise.all([p1, p2])
check('T14.1 slow earlier response does not overwrite the latest result', store.getState().product.productList[0]?.id === 'latest' && store.getState().product.total === 2)
check('T14.2 request keeps category + filter + sort', calls[1] === '/products?category=2&filter=siyah&sort=price%3Adesc&limit=25&offset=0', calls[1])
check('T14.3 filter stored in product reducer', store.getState().product.filter === 'siyah')

// ---- 4.6 T19: formula with values from the T19 sample image ----
const sample = calculateOrderSummary([{ count: 1, checked: true, product: { price: 8448.99 } }])
check('T19.1 sample 8448.99: shipping 29.99, discount 29.99, grand total 8448.99', sample.shipping === 29.99 && sample.discount === 29.99 && Math.abs(sample.grandTotal - 8448.99) < 1e-9, JSON.stringify(sample))
const small = calculateOrderSummary([{ count: 2, checked: true, product: { price: 50 } }])
check('T19.2 below 150: products + shipping − 0 = grand total', small.productsTotal === 100 && small.shipping === 29.99 && small.discount === 0 && Math.abs(small.grandTotal - 129.99) < 1e-9)
check('T19.3 nothing selected: all zero', JSON.stringify(calculateOrderSummary([{ count: 1, checked: false, product: { price: 99 } }])) === JSON.stringify({ productsTotal: 0, shipping: 0, discount: 0, grandTotal: 0 }))

// ---- 4.2 / 4.3 T02 static data, 4.1 T06 ----
check('T02.1 eight static Figma bestseller cards', bestsellerProducts.length === 8 && bestsellerProducts.every((p) => p.title === 'Graphic Design' && p.department === 'English Department' && p.oldPrice === 16.48 && p.price === 6.48))
check('T02.2 no invented slide copy (only canonical hero + Vita content)', [...heroSlides, ...vitaSlides].every((s) => s.tag === 'SUMMER 2020') && heroSlides.every((s) => s.title === 'NEW COLLECTION') && vitaSlides.every((s) => s.price === 16.48))
check('T06.1 team is exactly Gökhan Özdemir (PM) + Hakan Çimen (Full Stack Developer)', JSON.stringify(teamMembers.map((m) => [m.name, m.role])) === JSON.stringify([['Gökhan Özdemir', 'Project Manager'], ['Hakan Çimen', 'Full Stack Developer']]))

console.log(failures ? `${failures} FAILED` : 'ALL PASS')
process.exit(failures ? 1 : 0)
