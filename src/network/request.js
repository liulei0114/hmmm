import axios from 'axios'
import { getToken } from '@/utils/LocalStorage'
import { Message } from 'element-ui'
// 创建axios实例
export const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL, // api的base_url
  timeout: 15000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  let token = getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, error => {
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return Promise.resolve(res)
  },
  error => { // 非2XX
    Message.error(error.message)
    if (error && error.response && error.response.status) {
      return Promise.reject(error.response.data)
    }
  }
)

export const createFormAPI = (url, method, data) => {
  const config = {}
  config.data = data
  config.headers = {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  config.responseType = 'json'
  config.transformRequest = [
    function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }
  ]
  return service({
    url,
    method,
    ...config
  })
}
