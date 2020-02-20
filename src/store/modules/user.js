import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  state: {
    currentUser: localStorage.getItem('user') != null ? JSON.parse(localStorage.getItem('user')) : null,
    loginError: null,
    processing: false
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError
  },
  mutations: {
    setUser (state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout (state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing (state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError (state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    clearError (state) {
      state.loginError = null
    }
  },
  actions: {
    login ({ commit }, payload) {
      if (payload) {
        const item = {
          uid: payload.id,
          id: payload.id,
          title: payload.name,
          img: null,
          date: payload.updated_at,
          level: payload.level,
          role: payload.role,
          cid: payload.company_id
        }
        localStorage.setItem('user', JSON.stringify(item))
        commit('setUser', item)
      } else {
        localStorage.removeItem('user')
        commit('setError', 'fail')
      }
      /*
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const item = { uid: user.user.uid, ...currentUser }
            localStorage.setItem('user', JSON.stringify(item))
            commit('setUser', { uid: user.user.uid, ...currentUser })
          },
          err => {
            sessionStorage.removeItem('user')
            commit('setError', err.message)
          }
        )
        */
    },
    signOut ({ commit }) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          localStorage.removeItem('user')
          commit('setLogout')
        }, _error => {})
    }
  }
}
