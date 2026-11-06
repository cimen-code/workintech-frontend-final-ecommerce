import axios from 'axios'

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://workintech-fe-ecommerce.onrender.com'
export const TOKEN_KEY = 'token'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// T11: the backend expects the raw token, WITHOUT a "Bearer" prefix.
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = token
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export default api
