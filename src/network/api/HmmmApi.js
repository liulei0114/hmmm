import { service, createFormAPI } from '../request.js'

// ! 登录接口

export function loginApi (data) {
  return createFormAPI('/frame/login', 'POST', data)
}

export function getProfileApi () {
  return service({
    url: '/frame/profile',
    method: 'POST'
  })
}
