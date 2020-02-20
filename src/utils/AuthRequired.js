import axios from 'axios'

export default (to, from, next) => {
  if (localStorage.getItem('user') != null && localStorage.getItem('user').length > 0) {
    axios.post('/api/user/auth', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then((response) => {
      next()
    }).catch(function () {
      localStorage.removeItem('user')
      next('/user/login')
    })
  } else {
    localStorage.removeItem('user')
    next('/user/login')
  }
}
