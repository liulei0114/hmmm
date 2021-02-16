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

//! 后台管理-权限-角色列表
export function getPermissionRoleListApi (params) {
  return service({
    url: '/permissions',
    method: 'GET',
    params
  })
}

//! 后台管理-权限-删除角色
export function deletePermissionRoleApi (id) {
  return service({
    url: '/permissions/' + id,
    method: 'DELETE'
  })
}

//! 后台管理-权限-编辑权限组
export function editPermissionRoleApi (id, data) {
  return service({
    url: '/permissions/' + id,
    method: 'PUT',
    data
  })
}

//! 后台管理-权限-新增权限组
export function addPermissionRoleApi (data) {
  return service({
    url: '/permissions',
    method: 'POST',
    data
  })
}

//! 后台管理-权限-格局角色获取对应权限
export function selectPermissionByRoleApi (id) {
  return service({
    url: '/permissions/' + id,
    method: 'GET'
  })
}

//! 后台管理-企业管理-企业列表
export function getCompanyListApi (params) {
  return service({
    url: '/companys',
    method: 'GET',
    params
  })
}

//! 后台管理-企业管理-修改企业状态
export function editCompanyStateApi (id, state) {
  return service({
    url: '/companys/' + id + '/' + state,
    method: 'POST'
  })
}

//! 后台管理-企业管理-删除企业信息
export function deleteCompanyApi (id) {
  return service({
    url: '/companys/' + id,
    method: 'DELETE'
  })
}

//! 后台管理-企业管理-新增企业信息
export function addCompanyInfoApi (data) {
  return service({
    url: '/companys',
    method: 'POST',
    data
  })
}

//! 后台管理-企业管理-新增企业信息
export function editCompanyInfoApi (id, data) {
  return service({
    url: '/companys/' + id,
    method: 'PUT',
    data
  })
}

//! 后台管理-题库管理-基础题库-学科类别
export function getSubjectTypeListApi () {
  return service({
    url: '/subjects/simple',
    method: 'GET'
  })
}

//! 后台管理-题库管理-基础题库-根据学科id获取学科二级目录分类
export function getSubjectDirectorysListApi (params) {
  return service({
    url: '/directorys/simple',
    method: 'GET',
    params
  })
}

//! 后台管理-题库管理-基础题库-根据学科id获取学科标签
export function getSubjectTagListApi (params) {
  return service({
    url: '/tags/simple',
    method: 'GET',
    params
  })
}

//! 后台管理-题库管理-基础题库列表
export function getQuestionListApi (params) {
  return service({
    url: '/questions',
    method: 'GET',
    params
  })
}

//! 后台管理-题库管理-基础题库列表
export function joinQuestionChoiceApi (id, status) {
  return service({
    url: '/questions/choice/' + id + '/' + status,
    method: 'PATCH'
  })
}

//! 后台管理-题库管理-删除基础题
export function deleteQuestionApi (id) {
  return service({
    url: '/questions/' + id,
    method: 'DELETE'
  })
}

//! 后台管理-题库管理-题目详情
export function getQuestionDetailApi (id) {
  return service({
    url: '/questions/' + id,
    method: 'GET'
  })
}

//! 后台管理-题库管理-精选题库
export function getQuestionChoiceListApi (params) {
  return service({
    url: '/questions/choice',
    method: 'GET',
    params
  })
}

//! 后台管理-题库管理-精选题库-修改发布状态
export function editQuestionChoicePublishStateApi (id, state) {
  return service({
    url: '/questions/choice/' + id + '/' + state,
    method: 'POST'
  })
}

//! 后台管理-题库管理-精选题库-修改审核状态
export function editQuestionChoiceCheckStateApi (id, data) {
  return service({
    url: '/questions/check/' + id,
    method: 'POST',
    data
  })
}

//! 后台管理-题库管理-试题录入
export function enterQuestionApi (data) {
  return service({
    url: '/questions',
    method: 'POST',
    data
  })
}

//! 后台管理-题库管理-修改试题
export function editQuestionApi (id, data) {
  return service({
    url: '/questions/' + id,
    method: 'PUT',
    data
  })
}
