import {API_URL, MALL_ID, OPERATOR_USER, utilParm} from './config'
import {parseQuery} from '../common/utils'
import {KEY_DEFAULT_MALL_INFO} from '../common/config'
import fetchData from '../common/fetch-data'
import store from '../store'
import storage from 'good-storage'
import {openidUtils} from '../common/wx-utils'

// 根据openid判断是否会员
export function isVipByOpenid() {
    // IsVipByOpenid
    const url = parseQuery(API_URL, {
        method: 'DM.IsVipByOpenid'
    }, false)
    return fetchData(url, {
        data: [{key: '@openid', value: openidUtils.get()}],
        runtimeData: {
            EB_ACTION: 'DM.IsVipByOpenid'
        }
    })
}

// 获取用户信息
export function fetchUserInfo(condition) {
    const url = parseQuery(API_URL, {
        method: 'DM.GetPersonInfo'
    }, false)
    let queryParams = [
        {
            key: '@STR_LOGIN_NAME',
            value: (condition && condition.loginName) || store.getters.loginAccount.loginName
        },
        {
            key: '@EB_NAME',
            value: (condition && condition.shopName) || store.getters.loginAccount.shopName
        }
    ]
    // const userInfo = store.getters.userInfo
    //     {
    //     MallId: MALL_ID(),
    //     CardNo: '', // userInfo.cardNo || '',
    //     VipCode: code || userInfo.code,
    //     SurName: userInfo.name || userInfo.SurName || '',
    //     Mobile: '',
    //     VipId: '',
    //     IsThisCircle: true,
    //     openid: openidUtils.get()
    // }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetPersonInfo', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetPersonInfo'
        }
    })
}
// 修改用户头像
export function changeUserImg(id){
    const url = parseQuery(API_URL, {
        method: 'UpdatePerPic'
    }, false)
    let queryParams = {
        WXPicUrl: id,
        STR_USER_CODE: store.getters.userInfo.code
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('UpdatePerPic', queryParams),
        runtimeData: {
            EB_ACTION: 'UpdatePerPic'
        }
    })
}
// 根据手机号码获取会员信息
export function fetchUserInfoByPhone(phone) {
    const url = parseQuery(API_URL, {
        method: 'GetVipBaseInfoByMobile'
    }, false)
    const queryParams = {
        Mobile: phone,
        Mallid: MALL_ID()
    }
    return fetchData(url, {
        data: queryParams,
        runtimeData: {
            EB_ACTION: 'GetVipBaseInfoByMobile'
        }
    })
}

// 修改用户信息（目前只允许修改姓名和车牌号和地址）
export function updateUserInfo(username, carNo, province, city, area, addressArray, mobile) {
    const url = parseQuery(API_URL, {
        method: 'VipUpdate_WebService'
    }, false)
    const userInfo = store.getters.userInfo
    const queryParams = {
        VipUpdateData: {
            VipCode: userInfo.code,
            MallId: MALL_ID(),
            User: OPERATOR_USER,
            SurName: username,
            CarNumber: carNo,
            Sheng: province,
            Shi: city,
            Qu: area,
            Group20: addressArray,
            Mobile: mobile
        }
    }
    console.log(queryParams)
    return fetchData(url, {
        data: queryParams,
        runtimeData: {
            EB_ACTION: 'VipUpdate_WebService'
        }
    })
}

// 修改用户密码
export function updateUserPassword(password, verifyCode, mobile) {
    const url = parseQuery(API_URL, {
        method: 'WechatSite.VipDataModifyPwd'
    }, false)
    const userInfo = store.getters.userInfo
    const queryParams = {
        objPwd: {
            vipcode: userInfo.code,
            mallid: MALL_ID(),
            User: OPERATOR_USER,
            newmobile: mobile,
            Pwd: password,
            ConfirmPwd: password,
            Captcha: verifyCode
        }
    }
    return fetchData(url, {
        data: queryParams,
        runtimeData: {
            EB_ACTION: 'WechatSite.VipDataModifyPwd'
        }
    })
}

// 获取用户头像
export function getUserAvatar() {
    const url = parseQuery(API_URL, {
        method: 'WechatSite.GetPhoto'
    }, false)
    return fetchData(url, {
        data: {openid: openidUtils.get()},
        runtimeData: {
            EB_ACTION: 'WechatSite.GetPhoto'
        }
    })
}

// 获取微信用户基本信息的接口
export function wxUserInfo() {
    const url = parseQuery(API_URL, {
        method: 'WechatSite.GetUserInfoByOpenid'
    }, false)
    return fetchData(url, {
        data: {openid: openidUtils.get()},
        runtimeData: {
            EB_ACTION: 'WechatSite.GetUserInfoByOpenid'
        }
    })
}
