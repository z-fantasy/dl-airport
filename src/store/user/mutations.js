import * as types from './mutation-types'

const mutations = {
    [types.SET_USER_INFO](state, userInfo) {
        state.userInfo = userInfo
    },
    [types.LOGIN_ACCOUNT](state, loginAccount) {
        state.loginAccount = loginAccount
    },
    [types.CHANGE_ACCOUNT_PW](state, changeAccountPw) {
        state.changeAccountPw = changeAccountPw
    }
}

export default mutations
