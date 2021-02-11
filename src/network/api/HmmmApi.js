import { service, createFormAPI } from '../request.js'

// ! 登录接口
export function loginApi (data) {
  return createFormAPI('/frame/login', 'POST', data)
}

// ! 用户信息
export function getProfileApi () {
  return service({
    url: '/frame/profile',
    method: 'POST'
  })
}

//! 后台管理-用户-列表
export function getUserListApi (params) {
  return service({
    url: '/users',
    method: 'GET',
    params
  })
}

//! 后台管理-用户-权限组列表
export function getPermissionListApi () {
  return service({
    url: '/permissions/simple',
    method: 'GET'
  })
}

//! 后台管理-用户-编辑用户
export function editUserInfoApi (id, data) {
  return service({
    url: '/users/' + id,
    method: 'PUT',
    data
  })
}

//! 后台管理-用户-删除用户
export function deleteUserInfoApi (id) {
  return service({
    url: '/users/' + id,
    method: 'DELETE'
  })
}

//! 后台管理-用户-新增用户
export function addUserInfoApi (data) {
  return service({
    url: '/users',
    method: 'POST',
    data
  })
}

//! 后台管理-菜单-菜单列表
export function getMenuListApi () {
  return service({
    url: '/menus',
    method: 'GET'
  })
}

//! 后台管理-菜单-编辑菜单
export function editMenuApi (id, data) {
  return service({
    url: '/menus/' + id,
    method: 'PUT',
    data
  })
}

//! 后台管理-菜单-添加菜单
export function addMenuApi (data) {
  return service({
    url: '/menus',
    method: 'POST',
    data
  })
}

//! 后台管理-菜单-删除菜单
export function deleteMenuInfoApi (id) {
  return service({
    url: '/menus/' + id,
    method: 'DELETE'
  })
}

//! 后台管理-权限-列表
export function getPermissonListApi (params) {
  return service({
    url: '/permissions',
    method: 'GET',
    params
  })
}
