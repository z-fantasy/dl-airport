import storage from 'good-storage'
import {KEY_USER_INFO, USER_INFO_SECRET_KEY, KEY_LOGIN_ACCOUNT} from './config'
import {User} from './models/User'
import {AESEncode, AESDecode} from './utils'

export function loadUser() {
  let userInfo = storage.get(KEY_USER_INFO, false)
  if (userInfo) {
    return JSON.parse(AESDecode(userInfo, USER_INFO_SECRET_KEY))
  }
  return false
}

export function saveUser(data, compute = true) {
  // 配合后台数据，可自定义
  let userData = {}
  let user = {}
  if (compute) {
    userData = data.VipDis && data.VipDis.length ? data.VipDis[0] : data.length && typeof data !== 'string' ? data[0] : JSON.parse(data)[0]
    user = new User(userData)
  } else {
    user = data
  }
  let encodeUserData = AESEncode(JSON.stringify(user), USER_INFO_SECRET_KEY)
  storage.set(KEY_USER_INFO, encodeUserData)
  let userInfo = storage.get(KEY_USER_INFO, false)
  if (userInfo) {
    return JSON.parse(AESDecode(userInfo, USER_INFO_SECRET_KEY))
  }
  return false
}

export function clearUser() {
  storage.remove(KEY_USER_INFO)
}
// 登录账户信息相关
export function saveLoginAccount(data) {
    if (data) {
        storage.set(KEY_LOGIN_ACCOUNT, AESEncode(JSON.stringify(data)))
    }
}
export function loadAccount() {
    let accountInfo = storage.get(KEY_LOGIN_ACCOUNT, false)
    if (accountInfo) {
        return JSON.parse(AESDecode(accountInfo))
    }
    return false
}
export function clearAct() {
    storage.remove(KEY_LOGIN_ACCOUNT)
}