import { loginApi, getProfileApi } from '@/network/api/HmmmApi'
import { getToken, saveToken, removeToken } from '@/utils/LocalStorage'
import { Message } from 'element-ui'
const loginModule = {
  namespaced: true,
  state: {
    token: getToken(),
    userProfile: null
  },
  mutations: {
    SET_USER_TOKEN (state, data) {
      state.token = data
    },
    SET_USER_PROFILE (state, data) {
      state.userProfile = data
    }
  },
  actions: {
    async loginUsername ({ state, commit, dispatch }, params) {
      try {
        let result = await loginApi(params)
        let token = 'Bearer ' + result.token
        commit('SET_USER_TOKEN', token)
        // 存入localstorage
        saveToken(token)
        // 保存用户信息
        await dispatch('userProfile')
        return true
      } catch (error) {
        Message({
          type: 'error',
          message: error.message,
          center: true
        })
        return false
      }
    },
    async userProfile ({ state, commit, dispatch }, params) {
      let result = await getProfileApi()
      commit('SET_USER_PROFILE', result)
    },

    loginOut ({ commit }) {
      commit('SET_USER_TOKEN', null)
      commit('SET_USER_PROFILE', {})
      removeToken()
    }
  }
}

export default loginModule
