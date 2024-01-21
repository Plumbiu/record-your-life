import axios from 'axios'

export const REQUEST_URL = import.meta.env.DEV
  ? 'http://localhost:3033/api'
  : '/api'

const request = axios.create({
  baseURL: REQUEST_URL,
})

export default request
