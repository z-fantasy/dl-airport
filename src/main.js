import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'amfe-flexible';
import './cube-ui';
import wx from 'weixin-js-sdk';
import WechatTitle from 'vue-wechat-title';
import storage from 'good-storage';
import Es6Promise from 'es6-promise';
import VueLazyLoad from 'vue-lazyload'
import FastClick from 'common/libs/fastclick';
import VConsole from 'vconsole';
import {IS_PRODUCTION} from 'common/config';
import {WX_URL} from './api/config';
import {isWXEnv, openidUtils} from './common/wx-utils';
import {fetchSourceHost, checkSubscribed, getMallNo} from './api/common';
import {KEY_ASSETS_PREFIX, KEY_DEFAULT_MALL, KEY_DEFAULT_MALL_INFO, NETWORK_ERROR_CODE, NETWORK_ERROR_TEXT, TIME_OUT_ERROR_CODE} from './common/config';
import {MALL_INFO} from './store/common/mutation-types'
import {deviceInfo, isNumber, parseQuery} from './common/utils';
import {utilMixin} from './common/mixins/util'


Es6Promise.polyfill()
FastClick.attach(document.body)
Vue.use(VueLazyLoad)
Vue.use(WechatTitle)
Vue.mixin(utilMixin)
Vue.config.productionTip = false
Vue.prototype.messages = window.messages

const MUTATION_TYPE_LOADING_STATUS = 'SET_LOADING_STATUS'

const whiteModuleList = []
const MUTATION_TYPE_SET_IMG_HOST = 'SET_IMG_HOST'
let i = 0
/*
* 本地localStorage里如果没有openid，则发送请求去拉取，如果本地有且和数据库里
* 用户信息里存储的openid一致的话，就不做处理，否则先删去本地openid，然后再去服
* 务器拉取最新的openid保存到本地这之后开启两个轮训（为了兼容android上的坑），
* 如果openid成功从本地取到了，才开始渲染页面
* todo:
* 如果本地没有openid，重新拉取，如果本地有，去调用验证是否关注的接口，判断是true
* 还是false，如果为false，删去当前openid，去重新拉取，拉取回来后，如果还为false，
* 那就是真没关注了，叫他关注下，就行了
* */
if (isWXEnv()) {
    // const cacheTime = storage.get('__cache_time__', false)
    if (openidUtils.has()) {
        checkSubscribed().then((flag) => {
            const isSubscribed = storage.get('__checked_subscribe__', false)
            if (isSubscribed && !flag) {
                window.alert('您尚未关注此公众号，请关注后再试！')
                loadApp()
                return
            }
            if (!flag) {
                fetchOpenid()
                checkOpenidIsSaved()
            } else {
                loadApp()
            }
        }).catch(() => loadApp()).finally(() => {
            storage.set('__checked_subscribe__', true)
        })
    } else {
        // openidUtils.remove()
        fetchOpenid()
        checkOpenidIsSaved()
    }
} else {
    initApp()
}

function loadApp() {
    const isCompared = storage.session.get('__is_compared__', false)
    if (!isCompared) {
        storage.session.set('__is_compared__', true)
        initApp()
        /** 这里暂时不做openid的检验了, 进入速度太慢了
         const localOpenid = openidUtils.get()
         const userInfo = store.getters.userInfo
         if (userInfo && userInfo.code) {
      fetchUserInfo().then(res => {
        if ((!res.length || !res[0].OpenId || res[0].OpenId !== localOpenid)) {
          // 重新拉取openid
          openidUtils.remove()
          checkOpenidIsSaved()
          fetchOpenid()
        } else {
          initApp()
        }
      }).catch(e => {
        if (parseInt(e.message) === NETWORK_ERROR_CODE ||
          parseInt(e.message) === TIME_OUT_ERROR_CODE) {
          window.alert(NETWORK_ERROR_TEXT)
          return
        }
        openidUtils.remove()
        checkOpenidIsSaved()
        fetchOpenid()
      })
      // 如果本地不存在用户信息但是有openid，则直接初始化页面
    } else {
      initApp()
    }
         */
    } else {
        initApp()
    }
}

function initApp() {
    function check() {
        init()
        // 若需要获取openid， 将下面注释部分开启
        // const openid = openidUtils.get()
        // if (openid && !window.application) {
        //     init()
        // } else {
        //     next.call(this)
        // }
    }

    function next() {
        setTimeout(() => check.call(this), 200)
    }

    function init() {
        // 获取静态资源前缀
        getSourceUrl()
        // 初始化vue-router
        initInterceptor()
        // 初始化vue实例
        if (!window.application) {
            window.application = new Vue({
                router,
                store,
                render: h => h(App)
            }).$mount("#app");
        }
        // 初始化vconsole
        if (!IS_PRODUCTION) {
            new VConsole()
        }
    }

    if (isWXEnv()) {
        next.call(this)
    } else {
        init()
    }
}

// 初始化vue-router拦截器
function initInterceptor() {
    const searchParamIdx = location.hash.indexOf('?')
    let hash
    if (searchParamIdx > -1) {
        hash = location.hash.substring(2, location.hash.indexOf('?'))
    } else {
        hash = location.hash.substring(2)
    }
    // 兼容android6以下的多按钮入口点击两次才会退的问题
    if (deviceInfo().android && parseInt(deviceInfo().osVersion) < 6) {
        // 解决后退需要点击两次的问题
        if ([].indexOf(hash) > -1 || !hash.length) {
            router.back()
        }
    }
    router.beforeEach((to, from, next) => mainAuthDispatcher(to, from, next))
    router.afterEach(() => store.commit(MUTATION_TYPE_LOADING_STATUS, false))

    function mainAuthDispatcher(to, from, next) {
        console.log('***路由Start***')
        console.log(`入路由：${from.name}`)
        console.log(`出路由：${to.name}`)
        console.log(`历史:${window.history.length}`)
        console.log('***路由End***')
        const userInfo = store.getters.userInfo
        // 判断何时需要关闭窗口
        if (isWXEnv()) {
            if (
                (from.name === 'login' && to.name === 'home' && (!userInfo || !userInfo.code)) ||
                (from.name === 'home' && to.name === 'login' && (userInfo && userInfo.code)) ||
                (from.name === 'home' && to.name === 'register') ||
                (from.name === 'home' && to.name === 'home') ||
                (from.name === 'register' && to.name === 'register')
            ) {
                wx.closeWindow()
                return
            }
        }
        store.commit(MUTATION_TYPE_LOADING_STATUS, true)
        if (whiteModuleList.indexOf(to.name) > -1) {
            return next()
        } else {
            // 一般验权
            if (to.matched.some(item => item.meta.requireAuth)) {
                if (!userInfo || !userInfo.code) {
                    return next({
                        name: 'login'
                    })
                } else {
                    return next()
                }
            } else {
                if (!userInfo || !userInfo.code) {
                    return next()
                } else {
                    if (to.name === 'login' || to.name === 'register') {
                        return next({
                            name: 'home'
                        })
                    } else {
                        return next()
                    }
                }
            }
        }
    }
}

// 开启轮训，一旦链接中包含了最新的openid就保存到本地，然后终止轮训
function checkOpenidIsSaved() {
    function checkOpenid() {
        initApp()
        // 若需要获取openid 则开启下面代码
        // let href = window.location.href
        // let openidPos = href.lastIndexOf('openid=')
        // if (openidPos > -1 && !openidUtils.has()) {
        //     let href = window.location.href
        //     const openid = href.substr(openidPos + 7, 28)
        //     // 保存localStorage完毕后渲染页面
        //     openidUtils.set(openid)
        //     // storage.set('__cache_time__', +new Date() + (2 * 60 * 60 * 1000))
        //     initApp()
        // } else {
        //     start.call(this)
        // }
    }

    function start() {
        setTimeout(() => checkOpenid.call(this), 500)
    }

    start.call(this)
}

function fetchOpenidFromUrl() {
    let href = window.location.href
    // 解决iOS分享链接的参数被破坏问题
    const fromIdx = href.indexOf('?from=')
    const anchorIdx = href.indexOf('#/')
    let dispatcherUrl = ''
    if (fromIdx > -1) {
        dispatcherUrl = `${href.substring(0, fromIdx)}${href.substring(anchorIdx)}`.replace(/&/, '?')
    } else {
        dispatcherUrl = href
    }
    window.location.href = parseQuery(WX_URL, {
        method: 'getopenid',
        url: dispatcherUrl
    })
}

function fetchOpenid() {
    storage.session.set('__fetching_openid__', true)
    // 若需要获取openid 则开启下面代码，去掉上面这行代码
    // storage.session.set('__fetching_openid__', false)
    // const flag = storage.session.get('__fetching_openid__', true)
    // if (!flag) {
    //     storage.session.set('__fetching_openid__', true)
    //     fetchOpenidFromUrl()
    // }
}


function getSourceUrl() {
    let sourceUrl = storage.session.get(KEY_ASSETS_PREFIX, false)
    if (!sourceUrl && i < 3) {
        // 若需要获取商城号，则开启下面注释代码
        // if (!storage.session.get(KEY_DEFAULT_MALL, false)) {
        //     getMallNo().then(res => {
        //         if (res && res[0] && res[0].EB_MALLID) {
        //             storage.session.set(KEY_DEFAULT_MALL, res[0].EB_MALLID)
        //             storage.session.set(KEY_DEFAULT_MALL_INFO, res[0])
        //             store.commit(MALL_INFO, res[0])
        //         } else {
        //             console.log('商场号获取返回有误！')
        //         }
        //     }).catch(errs => {
        //         console.log(`請求商城號出錯：${errs}`)
        //     })
        // }
        fetchSourceHost().then(res => {
            if (res) {
                let prefixUrl = res
                // let result = prefixUrl[prefixUrl.length - 1] === '/' ? prefixUrl : `${prefixUrl}/`
                storage.session.set(KEY_ASSETS_PREFIX, prefixUrl)
                store.commit(MUTATION_TYPE_SET_IMG_HOST, prefixUrl)
            } else {
                console.log(`请求成功，返回图片地址无效：${res}`)
            }
        }).catch(e => {
            i++
            if (isNumber(e.message)) {
                getSourceUrl()
            }
        })
    }
}

document.body.addEventListener('focusin', () => {
    if (window.bounceBugTimer) {
        clearTimeout(window.bounceBugTimer)
    }
}, false)
document.body.addEventListener('focusout', () => {
    window.bounceBugTimer = setTimeout(() => {
        let h = window.innerHeight
        document.body.style.height = `${h + 1}px`
        setTimeout(() => {
            document.body.style.height = '100%'
        }, 50)
    }, 400)
}, false)

console.log(`当前打包环境：${process.env.NODE_ENV},当前运行build环境：${process.env.VUE_APP_BUILD_ENV}`)
