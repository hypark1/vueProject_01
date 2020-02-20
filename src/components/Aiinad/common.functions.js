/**
 * 아인애드 서비스 공통 함수
 */
import app from '../../main'

/**
 * Array 다차원 값 참조 반환
 * @param o
 * @param p
 * @param d
 * @returns {string}
 */
export function arrGet (o, p, d = null) {
  if (typeof p === 'string') {
    p = p.split('.')
  }

  return p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : d, o)
}

/**
 * 화폐 표기
 * @param value
 * @returns {string|number}
 */
export function toMoneyFormat (value) {
  return toNumberFormat(Math.round(value)) + '원'
}

/**
 * 숫자 값 콤마 포멧팅
 * @param value
 * @returns {string|number}
 */
export function toNumberFormat (value) {
  let num = parseFloat(value)
  if (isNaN(num) || num === 0) {
    return 0
  }

  let reg = /(^[+-]?\d+)(\d{3})/
  let n = (num + '')

  while (reg.test(n)) {
    n = n.replace(reg, '$1' + ',' + '$2')
  }

  return n
}

/**
 * 날짜
 * @param value
 * @returns {*}
 */
export function toDateFormat (value) {
  return value.replace('T', ' ')
}

/**
 * 포멧팅된 숫자 값에서 숫자값만 반환
 */
export function toNumberOnly (value, type = 'int') {
  let newValue = value.toString().replace(/,/g, '')
  if (type === 'int') {
    newValue = parseInt(newValue)
  }
  return newValue
}

/**
 * value 가 빈 값인지 여부 반환
 * @param value
 * @returns {boolean}
 */
export function isEmpty (value) {
  let valueType = typeof value
  if (valueType === 'undefined' || value === null) {
    return true
  }

  if (valueType === 'string') {
    return value.trim() === ''
  } else if (valueType === 'object') {
    if (Array.isArray(value)) {
      return value.length === 0
    } else {
      return value === {}
    }
  } else if (valueType === 'number') {
    // integer
    if (Number(value) === value && value % 1 === 0) {
      return value === 0
    }

    // float
    if (Number(value) === value && value % 1 !== 0) {
      return value === 0.0
    }
  }

  return false
}

export function lpad (n, width) {
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
}

/**
 * url이 schema(http or https)로 시작하는지 여부 반환
 */
export function isStartWithSchema (url) {
  let expression = /^(http|https):\/\/(.*)/gi
  let regex = new RegExp(expression)

  if (url.match(regex)) {
    return true
  } else {
    return false
  }
}

/**
 * 사용자 권한 검증
 * @type {{allowAdminOrManager: (function(*=): boolean), allowAdmin: (function(*=): boolean)}}
 */
export const Role = {
  /**
   * currentUser이 관리자 여부 반환
   * @param currentUser
   * @returns {boolean} 관리자인 경우 true, 아니면 false
   */
  allowAdmin: (currentUser) => {
    return ['ADMINISTRATOR'].includes(currentUser.role)
  },
  /**
   * currentUser이 관리자/매니저 여부 반환
   * @param currentUser
   * @returns {boolean} 관리자/매니저인 경우 true, 아니면 false
   */
  allowAdminOrManager: (currentUser) => {
    return ['ADMINISTRATOR', 'MANAGER'].includes(currentUser.role)
  },
  /**
   * currentUser이 대행사/영업자 여부 반환
   * @param currentUser
   * @returns {boolean} 대행사/영업자인 경우 true, 아니면 false
   */
  allowAgencyOrAgent: (currentUser) => {
    return ['AGENCY', 'AGENT'].includes(currentUser.role)
  },
  /**
   * currentUser이 대행사 여부 반환
   * @param currentUser
   * @returns {boolean} 대행사인 경우 true, 아니면 false
   */
  allowAgency: (currentUser) => {
    return ['AGENCY'].includes(currentUser.role)
  },
  /**
   * currentUser이 영업자 여부 반환
   * @param currentUser
   * @returns {boolean} 영업자인 경우 true, 아니면 false
   */
  allowAgent: (currentUser) => {
    return ['AGENCY', 'AGENT'].includes(currentUser.role)
  },
  /**
   * currentUser이 광고주 여부 반환
   * @param currentUser
   * @returns {boolean} 광고주인 경우 true, 아니면 false
   */
  allowAdvertiser: (currentUser) => {
    return ['ADVERTISER'].includes(currentUser.role)
  }
}

/**
 * value를 integer형으로 변환해서 반환
 * 단, value가 유효하지 않으면 defaultValue를 반환
 * @param value
 * @param defaultValue
 * @returns {number|*}
 */
export function intval (value, defaultValue = null) {
  try {
    if (typeof value === 'undefined' || isNaN(value)) {
      return defaultValue
    } else {
      return parseInt(value)
    }
  } catch (e) {
  }
  return defaultValue
}

/**
 * routeName으로 페이지 이동
 * @param routeName
 * @param params
 * @param query
 */
export function redirect (routeName, params = {}, query = {}) {
  app.$router.push({ name: routeName, params: params })
}

/**
 * routeName으로 강제 이동
 * @param routeName
 * @param params
 * @param query
 */
export function redirectForce (routeName, params = {}, query = {}) {
  app.$router.push({ name: routeName, params: params, query: query, hash: '#' + Date.now(), force: true })
}

/**
 * 이전 화면으로 돌아가기
 */
export function routeGoback () {
  app.$router.go(-1)
}
