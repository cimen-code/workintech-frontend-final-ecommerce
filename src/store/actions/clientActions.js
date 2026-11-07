import api, { setAuthToken, TOKEN_KEY } from '../../api/axiosInstance.js'

export const SET_USER = 'client/SET_USER'
export const SET_ROLES = 'client/SET_ROLES'
export const SET_THEME = 'client/SET_THEME'
export const SET_LANGUAGE = 'client/SET_LANGUAGE'
export const SET_ADDRESS_LIST = 'client/SET_ADDRESS_LIST'
export const SET_CREDIT_CARDS = 'client/SET_CREDIT_CARDS'

export const setUser = (user) => ({ type: SET_USER, payload: user })
export const setRoles = (roles) => ({ type: SET_ROLES, payload: roles })
export const setTheme = (theme) => ({ type: SET_THEME, payload: theme })
export const setLanguage = (language) => ({ type: SET_LANGUAGE, payload: language })
export const setAddressList = (addressList) => ({ type: SET_ADDRESS_LIST, payload: addressList })
export const setCreditCards = (creditCards) => ({ type: SET_CREDIT_CARDS, payload: creditCards })

export const fetchRolesIfNeeded = () => (dispatch, getState) => {
  const { roles } = getState().client
  if (roles.length > 0) return Promise.resolve(roles)

  return api.get('/roles').then((res) => {
    dispatch(setRoles(res.data))
    return res.data
  })
}

export const storeToken = (token, remember) => {
  setAuthToken(token)
  if (remember) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export const loginUser = ({ email, password, rememberMe }) => (dispatch) =>
  api.post('/login', { email, password }).then((res) => {
    const { token, ...user } = res.data
    storeToken(token, rememberMe)
    dispatch(setUser(user))
    return user
  })

export const verifyToken = () => (dispatch) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return Promise.resolve(null)

  setAuthToken(token)
  return api
    .get('/verify')
    .then((res) => {
      const { token: renewedToken, ...user } = res.data
      const nextToken = renewedToken || token
      localStorage.setItem(TOKEN_KEY, nextToken)
      setAuthToken(nextToken)
      dispatch(setUser(user))
      return user
    })
    .catch((error) => {
      if ([401, 403].includes(error.response?.status)) {
        localStorage.removeItem(TOKEN_KEY)
        setAuthToken(null)
      }
      return null
    })
}

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem(TOKEN_KEY)
  setAuthToken(null)
  dispatch(setUser({}))
  dispatch(setAddressList([]))
  dispatch(setCreditCards([]))
}

export const fetchAddressList = () => (dispatch) =>
  api.get('/user/address').then((res) => {
    dispatch(setAddressList(res.data))
    return res.data
  })

export const addAddress = (address) => (dispatch) =>
  api.post('/user/address', address).then(() => dispatch(fetchAddressList()))

export const updateAddress = (address) => (dispatch) =>
  api.put('/user/address', address).then(() => dispatch(fetchAddressList()))

export const deleteAddress = (addressId) => (dispatch) =>
  api.delete(`/user/address/${addressId}`).then(() => dispatch(fetchAddressList()))

export const fetchCreditCards = () => (dispatch) =>
  api.get('/user/card').then((res) => {
    dispatch(setCreditCards(res.data))
    return res.data
  })

export const addCreditCard = (card) => (dispatch) =>
  api.post('/user/card', card).then(() => dispatch(fetchCreditCards()))

export const updateCreditCard = (card) => (dispatch) =>
  api.put('/user/card', card).then(() => dispatch(fetchCreditCards()))

export const deleteCreditCard = (cardId) => (dispatch) =>
  api.delete(`/user/card/${cardId}`).then(() => dispatch(fetchCreditCards()))
