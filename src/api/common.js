import storage from 'good-storage'
import {API_URL, MALL_ID, OPERATOR_USER, QUERY_SCORE_RECORD_START_TIME, METHOD_POST, utilParm} from './config'
import {parseQuery, formatDate} from '../common/utils'
import fetchData from '../common/fetch-data'
import store from '../store'
import {KEY_APP_ID} from '../common/config'
import {openidUtils} from '../common/wx-utils'
import {MD5Encode} from '../common/utils'

// 注册
export function fetchRegister(info) {
    const url = parseQuery(API_URL, {
        method: 'VipCreate_WebService' // WechatSite.WctRegisterVip
    }, false)
    return fetchData(url, {
        data: info,
        runtimeData: {
            EB_ACTION: 'VipCreate_WebService'
        }
    })
}
// 修改密码
export function changePassword(info) {
    const url = parseQuery(API_URL, {
        method: 'UpdatePWD' // WechatSite.WctRegisterVip
    }, false)
    const data = {
        STR_USER_CODE: store.getters.userInfo.code,
        STR_LOGIN_PWD: MD5Encode(info['oldPw']),
        NEW_PWD: MD5Encode(info['newPw'])
    }
    return fetchData(url, {
        data: data,
        ...utilParm('UpdatePWD', data),
        runtimeData: {
            EB_ACTION: 'UpdatePWD'
        }
    })
}
// 用户登录
export function fetchLogin(info) {
    const url = parseQuery(API_URL, {method: 'APPLogin'}, false)
    const data = {
        'STR_USER_CODE': info['STR_USER_CODE'],
        'STR_LOGIN_PWD': MD5Encode(info['STR_LOGIN_PWD'])
    }
    return fetchData(url, {
        data: data,
        ...utilParm('APPLogin', data),
        runtimeData: {
            EB_ACTION: 'APPLogin'
        }
    })
}

// 根据用户手机号获取验证码
export function fetchPhoneVCode(phone, pageName = 'Login') {
    const url = parseQuery(API_URL, {method: 'WechatSite.sendSMS'}, false)
    return fetchData(url, {
        data: {phone, VerifyingVip: pageName},
        runtimeData: {
            EB_ACTION: 'WechatSite.sendSMS'
        }
    })
}

// 轮播图
export function getBanner() {
    // API_URL
    const url = parseQuery(API_URL, {
        method: 'GetAPPPic'
    }, false)
    return fetchData(url, {
        ...utilParm('GetAPPPic'),
        runtimeData: {
            EB_ACTION: 'GetAPPPic'
        }
    })
}

// 绑定openid
export function bindOpenid(vipCode) {
    const url = parseQuery(API_URL, {
        ext: 1,
        method: 'Wct_BindOpenId'
    }, false)
    const openid = openidUtils.get()
    const appId = storage.session.get(KEY_APP_ID, 'wx164fb9899ab02ec0')
    const data = {
        XF_VIPMEDIALIST: {
            XF_VIPCODE: vipCode,
            XF_TYPE: 'WX',
            XF_REMARK: '备注',
            XF_MEDIABUSINESSID: appId,
            EB_MEDIAID: openid
        }
    }
    return fetchData(url, {
        data,
        runtimeData: {
            EB_ACTION: 'Wct_BindOpenId'
        }
    })
}

// 解绑openid
export function unbindOpenid() {
    const url = parseQuery(API_URL, {
        ext: 1,
        method: 'Wct_DelOpenIdMedia'
    }, false)
    const openid = openidUtils.get()
    const userInfo = store.getters.userInfo
    const queryParams = {
        XF_TYPE: 'WX',
        XF_VIPCODE: userInfo.code,
        EB_MEDIAID: openid
    }
    return fetchData(url, {
        data: queryParams,
        runtimeData: {
            EB_ACTION: 'Wct_DelOpenIdMedia'
        }
    })
}

// 获取资源地址
export function fetchSourceHost() {
    const url = parseQuery(API_URL, {
        method: 'GetPicUrlPrefix'
    }, false)
    return fetchData(url, {
        ...utilParm('GetPicUrlPrefix'),
        runtimeData: {
            EB_ACTION: 'GetPicUrlPrefix'
        }
    })
}

// 獲取商城號
export function getMallNo() {
    const url = parseQuery(API_URL, {
        method: 'DM.GetStore'
    }, false)
    return fetchData(url, {
        ...utilParm('DM.GetStore'),
        runtimeData: {
            EB_ACTION: 'DM.GetStore'
        }
    })
}

// 检测是否可以关注了此公众号
export function checkSubscribed() {
    const url = parseQuery(API_URL, {
        method: 'Wechat.IsFans'
    }, false)
    const openid = openidUtils.get()
    return fetchData(url, {
        data: {openid},
        runtimeData: {
            EB_ACTION: 'Wechat.IsFans'
        }
    })
}

// 获取所有地址
export function fetchAllAddress() {
    const url = parseQuery(API_URL, {
        method: 'DM.Wct_ProvincialArea'
    }, false)
    return fetchData(url, {
        ...utilParm('DM.GetNoticeList'),
        runtimeData: {
            EB_ACTION: 'DM.Wct_ProvincialArea'
        }
    })
}

/**
 * 消息通知相关
 */
// 获取消息通知列表
export function getNoticeList() {
    const url = parseQuery(API_URL, {
        method: 'GetNoticeList'
    }, false)
    const queryParams = {
        STR_USER_CODE: store.getters.userInfo.code,
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('GetNoticeList', queryParams),
        runtimeData: {
            EB_ACTION: 'GetNoticeList'
        }
    })
}

// 通知详情
export function getNoticeDetail(notice) {
    const url = parseQuery(API_URL, {
        method: 'GetNoticeDesci'
    }, false)
    const queryParams = {
        EB_ID: notice.id,
        EB_TYPE: notice.type
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('GetNoticeDesci', queryParams),
        runtimeData: {
            EB_ACTION: 'GetNoticeDesci'
        }
    })
}

/**
 * 规章制度相关
 */
// 获取规章制度列表
export function getRuleList() {
    const url = parseQuery(API_URL, {
        method: 'DM.GetRuleList'
    }, false)
    return fetchData(url, {
        ...utilParm('DM.GetRuleList'),
        runtimeData: {
            EB_ACTION: 'DM.GetRuleList'
        }
    })
}

// 通知详情
export function getRuleDetail(id) {
    const url = parseQuery(API_URL, {
        method: 'DM.GetRuleDesci'
    }, false)
    const queryParams = [
        {
            key: '@EB_ID',
            value: id
        }
    ]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetRuleDesci', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetRuleDesci'
        }
    })
}

// 设置已读维度
export function setReadyed(data) {
    const url = parseQuery(API_URL, {
        method: 'SetNotice'
    }, false)
    const queryParams = {
        EB_ID: data.id,
        EB_TYPE: data.type,
        STR_USER_CODE: store.getters.userInfo.code
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('SetNotice', queryParams),
        runtimeData: {
            EB_ACTION: 'SetNotice'
        }
    })
}

/**
 * 员工排班相关
 */
// 获取员工排班列表
export function getRankList() {
    const url = parseQuery(API_URL, {
        method: 'DM.GetWorktimeList'
    }, false)
    return fetchData(url, {
        ...utilParm('DM.GetWorktimeList'),
        runtimeData: {
            EB_ACTION: 'DM.GetWorktimeList'
        }
    })
}

// 获取排班明细详情
export function getRankDetail(id) {
    const url = parseQuery(API_URL, {
        method: 'DM.GetWorktimeDesci'
    }, false)
    const queryParams = [
        {
            key: '@EB_ID',
            value: id
        }
    ]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetWorktimeDesci', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetWorktimeDesci'
        }
    })
}

/**
 * 培训管理相关
 */
// 获取培训管理信息
export function getPstrainDesc(ways = 0, ebId) {
    // ways 0 =》 新员工 1 =》 老员工（岗中培训）
    const pQName = ways ? 'DM.GetTrainDesci' : 'DM.GetPstrainDesci'
    const url = parseQuery(API_URL, {
        method: pQName
    }, false)
    const data = ways ? [
        {
            'key': '@EB_ID',
            'value': ebId
        }
    ] : [
        {
            'key': '@name',
            'value': store.getters.loginAccount.loginName
        },
        {
            'key': '@storeid',
            'value': store.getters.loginAccount.storeId
        }
    ]
    return fetchData(url, {
        data: data,
        ...utilParm(pQName, data),
        runtimeData: {
            EB_ACTION: pQName
        }
    })
}
// 获取培训管理岗中培训列表
export function getPstCenterList(ways = 0) {
    const pQName = 'DM.GetTrainList'
    const url = parseQuery(API_URL, {
        method: pQName
    }, false)
    const data = [
        {
            'key': '@eb_storeid',
            'value': store.getters.loginAccount.storeId
        }
    ]
    return fetchData(url, {
        data: data,
        ...utilParm(pQName, data),
        runtimeData: {
            EB_ACTION: pQName
        }
    })
}
// 培训添加
export function pstrainAdd(data, ways = 0) {
    // ways 0 =》 新员工 1 =》 老员工
    const pQName = ways ? 'PstrainAdd' : 'TrainAdd'
    const url = parseQuery(API_URL, {
        method: pQName
    }, false)
    let queryParams = {
        'EB_STOREID': data.store,
        'EB_NAME': data.name,
        'EB_SEX': data.sex,
        'EB_AGE': data.ages || '',
        'EB_STATION': data.job || '',
        'EB_TRAINDATE': data.time,
        'EB_RESULT': data.checkValue
    }
    if (ways) {
        queryParams['EB_CHECKTYPE'] = data.way
        queryParams['EB_TEACHER'] = data.teacher
        queryParams['EB_CHECKER'] = data.tester
        queryParams['EB_DESCI'] = data.testCon
    } else {
        queryParams['EB_SAFE'] = data.safety
        queryParams['EB_SERVICE'] = data.serves
        queryParams['EB_FOODSAFE'] = data.sanitation
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm(pQName, queryParams),
        runtimeData: {
            EB_ACTION: pQName
        }
    })
}

/**
 * 处罚管理相关
 */
// 处罚管理提交
export function punishAdd(data) {
    const url = parseQuery(API_URL, {
        method: 'PunishAdd'
    }, false)
    const queryParams = {
        'EB_TYPE': data.type,
        'EB_STOREID': data.storeId,
        'EB_DESCI': data.desc,
        'EB_REGULATIONS': data.ruleAtions,
        'EB_BONUS': data.bonus,
        'EB_RESPONSIBILITY': data.dutyOfer,
        'EB_PIC': data.picUrl,
        'EB_CREATEBY': store.getters.userInfo.code,
        'EB_AMOUNT': data.money
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('PunishAdd', queryParams),
        runtimeData: {
            EB_ACTION: 'PunishAdd'
        }
    })
}

/**
 * 巡检管理相关
 */
// 获取巡检地点
export function inspecAdresList() {
    const url = parseQuery(API_URL, {
        method: 'InspectionAdressList'
    }, false)
    return fetchData(url, {
        ...utilParm('InspectionAdressList'),
        runtimeData: {
            EB_ACTION: 'InspectionAdressList'
        }
    })
}

// 增加巡检信息
export function inspecAdd(data) {
    const url = parseQuery(API_URL, {
        method: 'InspectingAdd'
    }, false)
    const queryParams = {
        'EB_ADRESS': data.address,
        'EB_DESCI': data.desc,
        'EB_CREATEBY': store.getters.userInfo.code,
        'EB_PIC': data.picUrl
    }
    return fetchData(url, {
        ...utilParm('InspectingAdd', queryParams),
        runtimeData: {
            EB_ACTION: 'InspectingAdd'
        }
    })
}

/**
 *  签到
 */
// 签到
export function signDdd() {
    const url = parseQuery(API_URL, {
        method: 'SignAdd'
    }, false)
    const queryParams = {
        'STR_USER_CODE': store.getters.userInfo.code
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('SignAdd', queryParams),
        runtimeData: {
            EB_ACTION: 'SignAdd'
        }
    })
}

/**
 * 题库资料
 */
// 获取题库资料列表
export function getQuestionList(type) {
    const url = parseQuery(API_URL, {
        method: 'DM.GetQuestionList'
    }, false)
    const queryParams = [{
        key: '@EB_TYPE',
        value: type
    }]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetQuestionList', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetQuestionList'
        }
    })
}

// 获取题库资料详情
export function getQuestionDetail(id) {
    const url = parseQuery(API_URL, {
        method: 'DM.GetQuestionDesci'
    }, false)
    const queryParams = [{
        key: '@EB_ID',
        value: id
    }]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetQuestionDesci', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetQuestionDesci'
        }
    })
}

/**
 * 刀具管理
 */
// 刀具列表
export function knifeTypeList() {
    const url = parseQuery(API_URL, {
        method: 'DM.GetToolList'
    }, false)
    const queryParams = [{
        key: '@eb_storeid',
        value: store.getters.loginAccount.storeId
    }]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetToolList', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetToolList'
        }
    })
}

// 刀具详情
export function getKnifeDetail(id) {
    const url = parseQuery(API_URL, {
        method: 'DM.GetToolDesci'
    }, false)
    const queryParams = [{
        key: '@eb_id',
        value: id
    }]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetToolDesci', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetToolDesci'
        }
    })
}

// 获取最新保险柜照片
export function getSteelDetail(id) {
    const url = parseQuery(API_URL, {
        method: 'DM.GetToolSaffPic'
    }, false)
    const queryParams = [{
        key: '@eb_id',
        value: id
    }]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.GetToolSaffPic', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.GetToolSaffPic'
        }
    })
}

// 修改刀具相关信息
export function upKnifeFile(id, kType, imgSrc) {
    const url = parseQuery(API_URL, {
        method: 'ToolUpdate'
    }, false)
    const queryParams = {
        EB_ID: id,
        EB_PIC: kType ? imgSrc : '',
        EB_TOOLPIC: kType ? '' : imgSrc
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('ToolUpdate', queryParams),
        runtimeData: {
            EB_ACTION: 'ToolUpdate'
        }
    })
}
/**
 * 投诉管理相关
 */
// 获取投诉列表
export function getComplainList() {
    const url = parseQuery(API_URL, {
        method: 'GetComplaintList'
    }, false)
    const queryParams = {
        STR_USER_CODE: store.getters.userInfo.code
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('GetComplaintList', queryParams),
        runtimeData: {
            EB_ACTION: 'GetComplaintList'
        }
    })
}
// 获取投诉详情
export function getComplainDetail(ebId) {
    const url = parseQuery(API_URL, {
        method: 'GetComplaintDesci'
    }, false)
    const queryParams = {
        EB_ID: ebId
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('GetComplaintDesci', queryParams),
        runtimeData: {
            EB_ACTION: 'GetComplaintDesci'
        }
    })
}
// 修改投诉信息
export function editComplaintDet(data) {
    const url = parseQuery(API_URL, {
        method: 'UpdateComplaint'
    }, false)
    const queryParams = {
        'EB_ID': data.id,
        'EB_MERCHANT': data.type ? '' : data.text, // 商家处理
        'EB_MEASURES': data.type ? data.text : '', // 改善措施
        'EB_DESIC': '' // 投诉内容
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('UpdateComplaint', queryParams),
        runtimeData: {
            EB_ACTION: 'UpdateComplaint'
        }
    })
}
/**
 * 报表相关
 */
// 搜索报表详情
export function searchStatem(statemCon) {
    const url = parseQuery(API_URL, {
        method: 'DM.UserReport'
    }, false)
    const queryParams = [
        {
        'key': '@STR_LOGIN_NAME',
        'value': statemCon.name
        },
        {
            'key': '@EB_NAME',
            'value': statemCon.storeName
        },
        {
            'key': '@STR_MALL_CODE',
            'value': statemCon.id
        },
        {
            'key': '@EB_HEALTHYSTA',
            'value': statemCon.healthStartTime
        },
        {
            'key': '@EB_HEALTHYSTAend',
            'value': ''
        }]
    return fetchData(url, {
        data: queryParams,
        ...utilParm('DM.UserReport', queryParams),
        runtimeData: {
            EB_ACTION: 'DM.UserReport'
        }
    })
}
/**
 * 获取首页显示模块按钮
 */
export function getModuleList() {
    const url = parseQuery(API_URL, {
        method: 'GetModuleList'
    }, false)
    const queryParams = {
        EB_PARENT: store.getters.userInfo.loginerGrade
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('GetModuleList', queryParams),
        runtimeData: {
            EB_ACTION: 'GetModuleList'
        }
    })
}
/**
 * 上传图片
 */
export function upLoadFile(id) {
    const url = parseQuery(API_URL, {
        method: 'GetImageUrl'
    }, false)
    const queryParams = {
        imageurl: id,
        foldername: '' // 巡检相关的：巡检管理。刀具相关的：刀具管理
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('GetImageUrl', queryParams),
        runtimeData: {
            EB_ACTION: 'GetImageUrl'
        }
    })
}
/**
 * 获取调查问卷列表
 */
export function getSurveyList() {
    const url = parseQuery(API_URL, {
        method: 'GetPaperList'
    }, false)
    return fetchData(url, {
        ...utilParm('GetPaperList'),
        runtimeData: {
            EB_ACTION: 'GetPaperList'
        }
    })
}

/**
 * 查询是否回答过某问券
 */
export function isAnswered(id) {
    const url = parseQuery(API_URL, {
        method: 'CheckQuestion'
    }, false)
    const queryParams = {
        PaperCode: id,
        STR_USER_CODE: store.getters.userInfo.code
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('CheckQuestion', queryParams),
        runtimeData: {
            EB_ACTION: 'CheckQuestion'
        }
    })
}
/**
 * 获取调查问卷详情
 */
export function getSurveyData(id) {
    const url = parseQuery(API_URL, {
        method: 'GetQuestion'
    }, false)
    const queryParams = {
        PaperCode: id
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('GetQuestion', queryParams),
        runtimeData: {
            EB_ACTION: 'GetQuestion'
        }
    })
}
/**
 * 提交调查问卷
 */
export function submitSurQue(data) {
    const url = parseQuery(API_URL, {
        method: 'VipPaper.Insert'
    }, false)
    const queryParams = {
        obj: data
    }
    return fetchData(url, {
        data: queryParams,
        ...utilParm('VipPaper.Insert', queryParams),
        runtimeData: {
            EB_ACTION: 'VipPaper.Insert'
        }
    })
}
