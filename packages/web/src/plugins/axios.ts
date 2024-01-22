import Axios from 'axios'

const axios = Axios.create({
  baseURL: import.meta.env.DEV ? 'http://127.0.0.1:3033/api' : '/api',
})

export default axios
