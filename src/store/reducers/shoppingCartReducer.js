import { SET_ADDRESS, SET_CART, SET_PAYMENT } from '../actions/shoppingCartActions.js'

export const CART_STORAGE_KEY = 'cart'

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const initialState = {
  // [{ count: 1, checked: true, product: { id, ... } }]
  cart: loadCart(),
  payment: {},
  address: {},
}

function shoppingCartReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return { ...state, cart: action.payload }
    case SET_PAYMENT:
      return { ...state, payment: action.payload }
    case SET_ADDRESS:
      return { ...state, address: action.payload }
    default:
      return state
  }
}

export default shoppingCartReducer
