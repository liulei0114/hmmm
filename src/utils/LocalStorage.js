export function getToken () {
  let token = localStorage.getItem('token')
  return token || null
}

export function saveToken (token) {
  localStorage.setItem('token', token)
}

export function removeToken () {
  localStorage.removeItem('token')
}
