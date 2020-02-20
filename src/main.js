import Vue from 'vue'
import App from './App'

// BootstrapVue add
import BootstrapVue from 'bootstrap-vue'
// Router & Store add
import router from './router'
import { store } from './store'
// Multi Language Add
import en from './locales/en.json'
import es from './locales/es.json'
import ko from './locales/ko.json'
import VueI18n from 'vue-i18n'
import { defaultLocale, localeOptions, firebaseConfig } from '@/constants/config'
// Notification Component Add
import Notifications from '@/components/Common/Notification'
// Breadcrumb Component Add
import Breadcrumb from '@/components/Common/Breadcrumb'
// RefreshButton Component Add
import RefreshButton from '@/components/Common/RefreshButton'
// Colxx Component Add
import Colxx from '@/components/Common/Colxx'
// Perfect Scrollbar Add
import vuePerfectScrollbar from 'vue-perfect-scrollbar'
import contentmenu from 'v-contextmenu'
import lineClamp from 'vue-line-clamp'
import VCalendar from 'v-calendar'
import 'v-calendar/lib/v-calendar.min.css'
import VueScrollTo from 'vue-scrollto'
import firebase from 'firebase/app'
import 'firebase/auth'
import Vuelidate from 'vuelidate'
import VueProgressBar from 'vue-progressbar'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import vueVimeoPlayer from 'vue-vimeo-player'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

Vue.use(BootstrapVue)
Vue.use(VueI18n)
Vue.use(Vuelidate)
Vue.use(VueMomentJS, moment)
/*
  ajax 통신을 하기 위해 axios와 vue-axios 활성화
 */
const messages = { ko: ko, en: en, es: es }
const locale = (localStorage.getItem('currentLanguage') && localeOptions.filter(x => x.id === localStorage.getItem('currentLanguage')).length > 0) ? localStorage.getItem('currentLanguage') : defaultLocale
const i18n = new VueI18n({
  locale: locale,
  fallbackLocale: 'ko',
  messages
})
const options = {
  color: '#658eff',
  failedColor: '#ea2016',
  thickness: '5px',
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(Notifications)
Vue.component('piaf-breadcrumb', Breadcrumb)
Vue.component('b-refresh-button', RefreshButton)
Vue.component('b-colxx', Colxx)
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar)
Vue.use(require('vue-shortkey'))
Vue.use(contentmenu)
Vue.use(lineClamp, { /* plugin options */})
Vue.use(VCalendar, {
  firstDayOfWeek: 2, // ...other defaults,
  formats: {
    title: 'MMM YY',
    weekdays: 'WW',
    navMonths: 'MMMM',
    input: ['L', 'YYYY-MM-DD', 'YYYY/MM/DD'],
    dayPopover: 'L'
  },
  datePickerShowDayPopover: false,
  popoverExpanded: true,
  popoverDirection: 'bottom'
})
Vue.use(VueScrollTo)
firebase.initializeApp(firebaseConfig)
Vue.use(VueProgressBar, options)
Vue.use(vueVimeoPlayer)
Vue.use(VueAwesomeSwiper)

export default new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})

// 기본 옵션  값
const _configs = {
  notify: {
    short: { duration: 1500, permanent: false },
    long: { duration: 3000, permanent: false }
  }
}
Vue.prototype.$_configs = _configs

// 공통 함수
Vue.prototype.$_funcs = {
  addNotification: (type, title, message = '', options = null) => {
    if (options === null) {
      options = _configs.notify.short
    }
    Vue.$notify(type, title, message, options)
  },
  getMessageByHttpStatusCode: (statusCode, defaultMessage = '') => {
    let message = '알 수 없는 오류입니다.'
    if (defaultMessage !== '') {
      message = defaultMessage
    }

    // HTTP STATUS 코드별 기본 메시지
    switch (statusCode) {
      case 200: // OK
      case 201: // Created
      case 202: // Accpeted
      case 204: // No-Content
        message = '처리가 완료되었습니다.'
        break

      case 401: // Unauthorized
        message = '사용자 인증이 필요합니다.'
        break
      case 403: // Forbidden
        message = '권한이 없습니다.'
        break
      case 400: // Bad Request
        message = '잘못된 요청입니다.'
        break
      case 422: // Unprocessable Entity
        message = '사용자 입력이 잘못 되었습니다.'
        break

      case 500: // Internal Server Error
      case 502: // Bad Gateway
        message = '서버에서 요청 처리 중 에러가 발생하였습니다.'
        break
      case 501: // Not Implemented
        message = '구현되지 않은 기능입니다.'
        break
      case 503: // Service Unavailable
        message = '서버 유지 보수 등으로 정상적으로 서비스가 불가능합니다.\n잠시 후 다시 이용해주세요.'
        break
    }
    return message
  }
}
