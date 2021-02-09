import { getToken } from '../utils/LocalStorage'

const getters = {
  userProfile (state) { return state.loginModule.userProfile },
  token (state) { return state.loginModule.token }
}
export default getters
