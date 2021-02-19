
const getters = {
  userProfile (state) { return state.loginModule.userProfile },
  token (state) { return state.loginModule.token },
  routerTag (state) { return state.loginModule.routerTag }
}
export default getters
