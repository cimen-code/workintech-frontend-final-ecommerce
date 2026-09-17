import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import clientReducer from './reducers/clientReducer.js'
import productReducer from './reducers/productReducer.js'
import shoppingCartReducer, { CART_STORAGE_KEY } from './reducers/shoppingCartReducer.js'

const rootReducer = combineReducers({
  client: clientReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
})

const middlewares = [thunk]
if (import.meta.env.DEV) {
  middlewares.push(createLogger({ collapsed: true }))
}

const store = createStore(rootReducer, applyMiddleware(...middlewares))

// keep the cart after a page refresh
let lastCart = store.getState().shoppingCart.cart
store.subscribe(() => {
  const { cart } = store.getState().shoppingCart
  if (cart !== lastCart) {
    lastCart = cart
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }
})

export default store
