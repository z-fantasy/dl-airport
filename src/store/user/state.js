import {loadUser, loadAccount} from '../../common/cache'

const state = {
    userInfo: loadUser(),
    loginAccount: loadAccount(),
    changeAccountPw: false
}

export default state
