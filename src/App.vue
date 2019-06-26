<template>
    <div id="app" @touchmove.prevent>
        <keep-alive :exclude="[]">
            <router-view/>
        </keep-alive>
        <div class="pre-loader" v-show="isLoading">
            <div class="spinner" v-wechat-title="defTitle"></div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'
    import {fetchConfigInfo} from './api/wx'
    import {isDevTool, isWXEnv, openidUtils} from './common/wx-utils'
    import wx from 'weixin-js-sdk'
    import storage from 'good-storage'
    import {
        PROJECT_NAME,
        KEY_APP_INIT,
        KEY_APP_ID,
        KEY_HAS_SUBSCRIBED,
        KEY_VIP_LOCATION,
        KEY_LOCATION_TEXT
    } from './common/config'
    import {userMixin} from './common/mixins/user'
    import {checkSubscribed} from './api/common'
    import {HOME_URL, ROOT_PATH} from './api/config'

    const defTitleWhite = ['资料', '通知', '排班', '改善处理', '问卷详情']
    export default {
        name: 'app',
        mixins: [userMixin],
        data() {
            return {
                routePath: '',
                routeTitle: '',
                defTitle: '大连机场商户服务监督平台'
            }
        },
        created() {
            // 用户首次进入网站后的标识符
            if (!storage.session.get(KEY_APP_INIT, false)) {
                storage.session.set(KEY_APP_INIT, 1)
            }
            this.wxConfig()
        },
        mounted() {
            setTimeout(() => {
                document.getElementById('preLoader') && (document.getElementById('preLoader').style.display = 'none')
            }, 20)
        },
        computed: {
            ...mapGetters({
                isLoading: 'loadingStatus',
                defTitleVuex: 'defineTitle'
            })
        },
        methods: {
            wxConfig() {
//                const openid = openidUtils.get()
                if (isWXEnv()) {
                    fetchConfigInfo().then(res => {
                        storage.session.set(KEY_APP_ID, res.appId)
                        wx.config({
                            debug: false,
                            appId: res.appId,
                            timestamp: res.timestamp,
                            nonceStr: res.nonceStr,
                            signature: res.signature,
                            jsApiList: [
                                'scanQRCode',
                                'chooseImage',
                                'uploadImage',
                                'getLocalImgData',
                                'addCard',
                                'openCard',
                                'getLocation',
                                'onMenuShareQZone',
                                'onMenuShareWeibo',
                                'onMenuShareQQ',
                                'onMenuShareAppMessage',
                                'onMenuShareTimeline'
                            ]
                        })
                    }).catch(err => {
                        this._openAlert('获取微信config配置参数失败！' + err)
                    })
                } else {
                    this._openAlert('获取微信config配置参数失败！可能会影响图片选择上传功能。')
                }
            },
            // 每过5s去检测有无获取到地理位置
            getUserLocation() {
                function check() {
                    // 判断经纬度是否获取到，没有获取到则一直轮询
                    const locationInfo = storage.session.get(KEY_VIP_LOCATION, false)
                    if (!locationInfo) {
                        _getVIPLocation()
                    }
                }

                function _getVIPLocation() {
                    let lon = 0
                    let lat = 0
                    wx.getLocation({
                        type: 'wgs84',
                        success: res => {
                            lat = res.latitude
                            lon = res.longitude
                            // console.log(lat + ',' + lon)
                            getLocationName(lon, lat)
                            storage.session.set(KEY_VIP_LOCATION, {lat, lon})
                        },
                        complete: res => {
                            res.errMsg && console.warn(res.errMsg)
                        }
                        //            fail: () => next.call(this),
//            cancel: () => next.call(this),
                    })
                }

                // 逆地址解析
                function getLocationName(nowLon, nowLat) {
                    let point = new BMap.Point(nowLon, nowLat)
                    let geoc = new BMap.Geocoder()
                    let name = ''
                    geoc.getLocation(point, (rs) => {
                        let addComp = rs.addressComponents
                        name = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber
                        storage.session.set(KEY_LOCATION_TEXT, name)
                    })
                }

                function next() {
                    setTimeout(() => check.call(this), 5000)
                }

                next.call(this)
            },
            initShareActions() {
//                const imgUrl = ROOT_PATH + require('views/login/logo@2x.png')
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: this.routeTitle,
                    link: this.routePath,
//                    imgUrl,
                    success: () => {
                        this._openAlert('分享到朋友圈成功！')
                    },
                    cancel: () => {
                        this._openAlert('分享到朋友圈失败')
                    }
                })
                // 分享到微信
                wx.onMenuShareAppMessage({
                    title: this.routeTitle, // 分享标题
                    desc: `${PROJECT_NAME}期待您的光临!`, // 分享描述
                    link: this.routePath, // 分享链接，该链接域名必须与当前企业的可信域名一致
//                    imgUrl, // 分享图标
                    type: '', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: () => {
                        this._openAlert('分享到微信成功！')
                    },
                    cancel: () => {
                        this._openAlert('分享到微信失败')
                    }
                })
                // 分享到QQ
                wx.onMenuShareQQ({
                    title: this.routeTitle, // 分享标题
                    desc: `${PROJECT_NAME}期待您的光临!`, // 分享描述
                    link: this.routePath, // 分享链接
//                    imgUrl, // 分享图标
                    success: () => {
                        this._openAlert('分享到QQ成功！')
                    },
                    cancel: () => {
                        this._openAlert('分享到QQ失败')
                    }
                })
                // 分享到腾讯微博
                wx.onMenuShareWeibo({
                    title: this.routeTitle, // 分享标题
                    desc: `${PROJECT_NAME}期待您的光临!`, // 分享描述
                    link: this.routePath, // 分享链接
//                    imgUrl, // 分享图标
                    success: () => {
                        this._openAlert('分享到腾讯微博成功！')
                    },
                    cancel: () => {
                        this._openAlert('分享到腾讯微博失败')
                    }
                })
                // 分享到QQ空间
                wx.onMenuShareQZone({
                    title: this.routeTitle, // 分享标题
                    desc: `${PROJECT_NAME}期待您的光临!`, // 分享描述
                    link: this.routePath, // 分享链接
//                    imgUrl, // 分享图标
                    success: () => {
                        this._openAlert('分享到QQ空间成功！')
                    },
                    cancel: () => {
                        this._openAlert('分享到QQ空间失败')
                    }
                })
            }
        },
        watch: {
            $route: {
                handler(route, o) {
                    if (route && route.meta) {
                        if (defTitleWhite.indexOf(route.meta.title) > -1) {
                            // 使用的时候：this.$store.commit('DEFINE_TITLE', 'title名称')
                            this.defTitle = this.defTitleVuex
                        } else {
                            this.defTitle = route.meta.title
                        }
                    } else {
                        this.defTitle = '大连机场商户服务监督平台'
                    }
                    if (route.name === 'home') {
                        this.routeTitle = PROJECT_NAME
                        this.routePath = `${HOME_URL}/#/`
                        if (this.changeAccountPw) {
                            this.clearUserInfo()
                            this.clearAccount()
                            this._changeAcoPw()
                            setTimeout(() => {
                                this.$router.push({
                                    name: 'login'
                                })
                            }, 310)
                        }
                    } else if (route.name === 'my-invite-code') {
                        this.routeTitle = '邀请码'
                        this.routePath = `${HOME_URL}/#/register?invite_code=${this.userInfo.code}&invite_user=${encodeURIComponent(this.userInfo.name)}`
                    } else {
                        this.routeTitle = route.meta.title
                        this.routePath = `${HOME_URL}/#${route.path}`
                    }
                    this.isReady = false
                    wx.ready(() => {
                        this.isReady = true
                        this.initShareActions()
                        // TODO 获取地址信息开关
                        this.getUserLocation()
                    })
                    if (this.isReady) {
                        this.initShareActions()
                    }
//          console.log('===当前路由:' + this.routePath)
                },
                immediate: true
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus">
    @require '~common/stylus/variables'
    @require '~common/stylus/mixin'
    html, body, #app
        height: 100%
        width: 100%
        overflow: hidden
        .pre-loader
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: 10000;
            @keyframes spinner
                to
                    transform: rotate(360deg)
            .spinner
                position: relative;
                border: 1px solid transparent;
                border-radius: 5px;
                height: 100%;
                &::before
                    content: '';
                    box-sizing: border-box;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 30px;
                    height: 30px;
                    margin-left: -15px;
                    margin-top: -15px;
                    border-radius: 50%;
                    border: 2px solid $color-purple;
                    border-top-color: #f9f9f9;
                    animation: spinner .6s linear infinite;

    .mine-input-li
        display: flex
        margin-bottom: 10px
        align-items : center
        >div
            flex: 1
            display: flex
        .cube-input
            &::after
                border-top:none
                border-left:none
                border-right:none
                border-bottom: 1px solid #ccc
        .cube-input_active
            &::after
                border:none
                border-bottom: 1px solid #ccc
    .submitBtn
        margin: 10px 20%
        .cubeBtn
            box-shadow : 0px 1px 1px 2px #ccc
    .fileUrl
        display: block
        margin: 12px auto
        border-radius : 12px
        padding: 10px 0
        width: 80%
        text-align : center
        background: #298EFF
        color: #fff
        font-size: $fontsize-large-x
    .cube-dialog-content {
        max-height: 300px !important
        overflow: auto
    }
</style>
