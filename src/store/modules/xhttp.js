import axios from 'axios'
import app from '../../main'

export default {
  actions: {
    xhttp ({ commit }, payload) {
      app.$Progress.start()
      const httpRequest = {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json'
        },
        url: null,
        method: null,
        data: null,
        params: null,
        baseURL: '/api',
        responseType: 'json',
        responseEncoding: 'utf8'
      }
      httpRequest.url = (payload.url ? payload.url : null)
      httpRequest.method = (payload.method ? payload.method : null)
      httpRequest.data = (payload.data ? payload.data : null)
      httpRequest.params = (payload.params ? payload.params : null)
      httpRequest.headers = (payload.headers ? payload.headers : httpRequest.headers)
      const resp = axios(httpRequest)
      resp.catch((error) => {
        if (error.response.status === 401) {
          app.$Progress.fail()

          // 즉시 로그인-폼으로 이동하기 위해 window 객체 사용
          window.location.href = '/user/login'
        }
      })

      return resp
    }
  }
}
