<template>
    <page type="login">
        <div class="top-rainbow"></div>
        <div class="login-wrapper">
            <div class="logo"></div>
            <!--<title-tabs :tabs="[messages.login.txt_verify_code_login, messages.login.txt_password_login]" v-model="activeTabIndex"/>-->
            <div class="tabs-wrapper" @click.stop.prevent>
                <div class="tab-content" v-if="activeTabIndex===0">
                    <verify-code
                            @validate-success="validateSuccessHandler"
                            key="1"
                            ref="codeVerifyCode"
                            store-key="loginCode"
                            v-model="verifyCodeLoginResult[0]"
                            @click="onSendCode"/>
                    <verify-input
                            placeholder="请输入验证码"
                            key="3"
                            type="number"
                            ref="verifyCodeInput"
                            :label="messages.login.txt_label_verify_code" :maxlength="6"
                            :rules="{len: 6,required: true}"
                            v-model="verifyCodeLoginResult[1]"
                            :len="6"/>
                </div>
                <div class="tab-content" v-else>
                    <!--@validate-success="validateSuccessHandler"-->
                    <verify-input
                            placeholder="账号"
                            key="2"
                            :label="messages.login.txt_label_phone"
                            ref="passwordVerifyCode"
                            store-key="loginCode"
                            :rules="{required: true}"
                            v-model="passwordLoginResult[0]"/>
                    <verify-input
                            placeholder="密码"
                            key="4"
                            :label="messages.login.txt_label_password"
                            type="password"
                            ref="passwordVerifyInput"
                            :rules="{pattern: pwdRegex,required: true}"
                            v-model="passwordLoginResult[1]"/>
                </div>
            </div>

            <div class="operations">
                <base-button @click="checkLoginData" :active="true">{{messages.login.txt_btn_login}}</base-button>
                <!--<router-link tag="span" class="go-register" :to="{name: 'register'}">-->
                    <!--{{messages.login.txt_go_register}}-->
                <!--</router-link>-->
            </div>
        </div>
    </page>
</template>

<script>
    import Page from '../../components/page/page'
    import VerifyCode from '../../base/verify-code/verify-code'
    import VerifyInput from '../../base/verify-input/verify-input'
    import BaseButton from '../../base/base-button/base-button'
    import TitleTabs from '../../components/title-tabs/title-tabs'
    import {
        REGEX_NORMAL_PASSWORD,
        KEY_OTHER_USER_BASIC_INFO,
        IS_NOT_SYSTEM_USER,
        NOT_REGISTER,
        KEY_LOGIN_ACCOUNT,
        KEY_DEFAULT_MALL,
        KEY_DEFAULT_MALL_INFO
    } from '../../common/config'
    import {MALL_INFO} from '../../store/common/mutation-types'
    import {fetchPhoneVCode, fetchLogin, bindOpenid, getMallNo} from '../../api/common'
    import {fetchUserInfoByPhone, fetchUserInfo} from '../../api/user'
    import {mapActions} from 'vuex'
    import storage from 'good-storage'
    import {AESEncode} from '../../common/utils'
    import {userMixin} from '../../common/mixins/user'

    const PAGE_NAME = 'login'

    export default {
        name: PAGE_NAME,
        mixins: [userMixin],
        data() {
            return {
                verifyCodeLoginResult: ['', ''],
                passwordLoginResult: ['', ''],
                activeTabIndex: 1,
                isSendCode: false,
                allMallid : []
            }
        },
        created() {
            this.pwdRegex = REGEX_NORMAL_PASSWORD
//            if (!this.allMallid.length) {
//                this.getAllMall()
//            }
        },
        methods: {
            onSendCode() {
                this._openToast(messages.common.txt_send_sms, {mask: true})
                fetchPhoneVCode(this.verifyCodeLoginResult[0]).then(flag => {
                    this._closeToast()
                    if (flag) {
                        this.isSendCode = true
                        this.$refs.codeVerifyCode.sendSuccess()
                    } else {
                        this.isSendCode = false
                    }
                }).catch(e => {
                    this.isSendCode = false
                    this._closeToast()
                    this.$refs.codeVerifyCode.stop()
                    this._openAlert(e.message)
                })
            },
            checkLoginData() {
                if (this.activeTabIndex === 0) {
                    let checkPhone = this.$refs.codeVerifyCode.validate()
                    let checkVerifyCode = this.$refs.verifyCodeInput.validate()
                    Promise.all([checkPhone, checkVerifyCode]).then(rs => {
                        rs.every(item => item) && this.login(this.verifyCodeLoginResult, 0)
                    })
                } else {
                    let checkPhone = this.$refs.passwordVerifyCode.validate()
                    let checkVerifyCode = this.$refs.passwordVerifyInput.validate()
                    Promise.all([checkPhone, checkVerifyCode]).then(rs => {
                        rs.every(item => item) && this.login(this.passwordLoginResult, 1)
                    })
                }
            },
            getAllMall() {
                this._openToast('加载中', {mask: true})
                getMallNo().then(res => {
                    this._closeToast()
                    if (res && res[0] && res[0].EB_MALLID) {
                        this.allMallid = res.map(item => {
                            return {
                                text: item['EB_NAME'],
                                value: item['EB_STOREID'],
                                EB_MALLID: item['EB_MALLID'],
                                EB_STOREID: item['EB_STOREID']
                            }
                        })
                    } else {
                        this._openAlert(`商场号获取返回格式有误！${res}`)
                    }
                }).catch(errs => {
                    this._closeToast()
                    this._openAlert(`获取商场号失败：${errs}`)
                })
            },
            showPicker() {
                if (!this.allMallid.length) {
                    this._openAlert('未获取到商场号！')
                    return
                }
                if (!this.picker) {
                    this.picker = this.$createPicker({
                        title: '选择商场号',
                        data: [this.allMallid],
                        maskClosable: false,
                        onSelect: this.selectHandle,
                        onCancel: this.cancelHandle
                    })
                }
                this.picker.show()
            },
            selectHandle(selectedVal, selectedIndex, selectedText) {
                const choiseMall = this.allMallid[selectedIndex[0]]
                storage.session.set(KEY_DEFAULT_MALL, selectedVal[0])
                storage.set(KEY_DEFAULT_MALL_INFO, choiseMall)
                this.$store.commit(MALL_INFO, choiseMall)
                this.loginAndGetInfo(selectedText[0])
            },
            cancelHandle() {
            },
            loginAndGetInfo(shopName) {
                this._openToast(messages.login.txt_login_tip, {time: 0, mask: true})
                const params = {
                    'STR_USER_CODE': this.passwordLoginResult[0],
                    'STR_LOGIN_PWD': this.passwordLoginResult[1],
                }
                fetchLogin(params).then(userInfo => {
                    // 登录成功就储存登录密码
                    // 登录成功返回了用户权限
                    const userJurdic = userInfo
                    if (userInfo) {
                        this.saveAccount({loginName: userJurdic['STR_LOGIN_NAME'], shopName: userJurdic['EB_NAME'], storeId: userJurdic['STR_MALL_CODE']})
                        this.getPersonInfo({loginName: userJurdic['STR_LOGIN_NAME'], shopName: userJurdic['EB_NAME']}, userJurdic)
                    } else {
                        this._closeToast()
                        this._openAlert('登录失败，请仔细检查账号密码和商场！')
//                        if (type === 0) {
//                            this._openAlert(messages.login.txt_verify_code_error)
//                        } else {
//                            this._openAlert('登录失败，请仔细检查账号密码！')
//                        }
                    }
                }).catch(e => {
                    this._closeToast()
                    this._openAlert(e.message)
                })
            },
            login(validArray, type) {
                let params = {}
                if (type === 0) {
                    let [phone, verifyCode] = validArray
                    params.phone = phone
                    params.code = verifyCode
                } else {
                    let [phone, password] = validArray
                    params['STR_USER_CODE'] = phone
                    params['STR_LOGIN_PWD'] = password
                }
//                this.showPicker()
                this.loginAndGetInfo()
            },
            getPersonInfo(logName, gradeInfo) {
                fetchUserInfo({loginName: logName.loginName, shopName: logName.shopName}).then(flag => {
                    this._closeToast()
                    if (flag && flag.STR_USER_CODE) {
                        flag.code = flag.STR_USER_CODE
                        flag.loginerGrade = gradeInfo['EB_PARENT']
                        this.saveUserInfo(flag)
                        this.$router.push({name: 'home'})
                    } else {
                        this._openAlert(`获取用户信息异常，未获取到登录编号，或请检查选择的商场！`)
                    }
                }).catch(e => {
                    this._closeToast()
                    this._openAlert(e.message)
                })
            },
            validateSuccessHandler() {
                this._openToast(messages.login.txt_phone_checked, {mask: true})
                let phone = this.passwordLoginResult[0] || this.verifyCodeLoginResult[0]
                fetchUserInfoByPhone(phone).then(res => {
                    this._closeToast()
                    let flag = parseInt(res.IsWhether)
                    if (flag === NOT_REGISTER) {
                        this._openConfirm(messages.login.txt_not_mall_user, {
                            onConfirm: () => {
                                this.$router.push({
                                    name: 'register'
                                })
                            }
                        })
                    } else if (flag === IS_NOT_SYSTEM_USER) {
                        if (res.VipCode) {
                            this._openConfirm(messages.login.txt_user_info_exist, {
                                onConfirm: () => {
                                    let {Birthday, Mobile, Name, Sex, VipCode} = res
                                    storage.set(KEY_OTHER_USER_BASIC_INFO, {
                                        birthday: Birthday,
                                        phone: Mobile,
                                        name: Name,
                                        sex: Sex,
                                        code: VipCode
                                    })
                                    this.$router.push({
                                        name: 'register',
                                        query: {
                                            prev_user: VipCode
                                        }
                                    })
                                }
                            })
                        } else {
                            this._openAlert(messages.login.txt_user_info_not_exist)
                        }
                    }
                }).catch(e => {
                    this._closeToast()
                    this._openAlert(e.message)
                })
            }
        },
        watch: {
            activeTabIndex(val) {
                if (val === 0) {
                    this.passwordLoginResult.splice(0, 1, '')
                    this.passwordLoginResult.splice(1, 1, '')
                } else {
                    this.verifyCodeLoginResult.splice(0, 1, '')
                    this.verifyCodeLoginResult.splice(1, 1, '')
                }
            }
        },
        components: {
            Page,
            VerifyCode,
            VerifyInput,
            BaseButton
//            TitleTabs
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/variables'
    @require '~common/stylus/mixin'

    .login-page
        .logo
            width: 80px
            height: 80px
            margin: 40px auto
            background-size: 100% auto
            background-position: center
    // bg-image('./logo')
        .tabs-wrapper
            margin-top: 20px
        .operations
            margin: 20px 16px
            text-align: center
            .go-register
                color: #666
                font-size: 16px
</style>
