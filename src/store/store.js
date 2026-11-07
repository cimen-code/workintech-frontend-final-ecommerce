import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import clientReducer from './reducers/clientReducer.js'
import productReducer from './reducers/productReducer.js'
import shoppingCartReducer from './reducers/shoppingCartReducer.js'

const rootReducer = combineReducers({
  client: clientReducer,
  product: productReducer,
  shoppingCart: shoppingCartReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk, createLogger({ collapsed: true })))

export default store
