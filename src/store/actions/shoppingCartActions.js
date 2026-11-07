import api from '../../api/axiosInstance.js'

export const SET_CART = 'shoppingCart/SET_CART'
export const SET_PAYMENT = 'shoppingCart/SET_PAYMENT'
export const SET_ADDRESS = 'shoppingCart/SET_ADDRESS'

export const setCart = (cart) => ({ type: SET_CART, payload: cart })
export const setPayment = (payment) => ({ type: SET_PAYMENT, payload: payment })
export const setAddress = (address) => ({ type: SET_ADDRESS, payload: address })

export const addToCart = (product) => (dispatch, getState) => {
  const { cart } = getState().shoppingCart
  const existing = cart.find((item) => item.product.id === product.id)

  const nextCart = existing
    ? cart.map((item) =>
        item.product.id === product.id ? { ...item, count: item.count + 1 } : item,
      )
    : [...cart, { count: 1, checked: true, product }]

  dispatch(setCart(nextCart))
}

export const changeCartItemCount = (productId, delta) => (dispatch, getState) => {
  const { cart } = getState().shoppingCart
  const nextCart = cart
    .map((item) =>
      item.product.id === productId ? { ...item, count: item.count + delta } : item,
    )
    .filter((item) => item.count > 0)

  dispatch(setCart(nextCart))
}

export const removeFromCart = (productId) => (dispatch, getState) => {
  const { cart } = getState().shoppingCart
  dispatch(setCart(cart.filter((item) => item.product.id !== productId)))
}

export const toggleCartItem = (productId) => (dispatch, getState) => {
  const { cart } = getState().shoppingCart
  dispatch(
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, checked: !item.checked } : item,
      ),
    ),
  )
}

export const createOrder = (orderPayload) => (dispatch) =>
  api.post('/order', orderPayload).then((res) => {
    dispatch(setCart([]))
    dispatch(setPayment({}))
    dispatch(setAddress({}))
    return res.data
  })
