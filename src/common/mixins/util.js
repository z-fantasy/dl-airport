import {
    TOAST_NAME,
    ALERT_NAME,
    CONFIRM_NAME,
    TIME_OUT_ERROR_CODE,
    NETWORK_ERROR_CODE,
    REQUEST_TIME_OUT_TEXT,
    REQUEST_FAILED_TEXT
} from '../config'
import {mapGetters} from 'vuex'

export const utilMixin = {
    data() {
        return {
            imgPrefix: ''
        }
    },
    computed: {
        ...mapGetters([
            'imgHost',
            'mallInfo'
        ])
    },
    methods: {
        _reBackMsg (msg) {
            if (typeof msg === 'string') {
                return msg
            } else {
                if (msg && msg.message) {
                    return msg.message
                } else {
                    return msg.toString()
                }
            }
        },
        _reBackErr(errMsg, title = '提示', callBack, closeToast = true) {
            const msg = this._reBackMsg(errMsg)
            const alertOpts = {
                type: 'alert',
                title: title,
                onConfirm: () => {
                    callBack && callBack()
                }
            }
            if (this[TOAST_NAME]) {
                this._closeToast()
            }
            // if (closeToast) {
            //     this._closeToast()
            // }
            this._openAlert(msg, alertOpts, false)
        },
        _openToast(txt = '加载中', options = {}, isSingle = true, name = TOAST_NAME) {
            if (!this[name]) {
                const opts = Object.assign({}, {txt, mask: true, time: 0}, options)
                this[name] = this.$createToast(opts, isSingle)
                this[name].show()
            }
        },
        _closeToast(name = TOAST_NAME) {
            if (name === TOAST_NAME  && this[TOAST_NAME]) {
                this[name].hide()
            }
            if (name !== TOAST_NAME ) {
                this[name].hide()
            }
        },
        _openAlert(content, options = {}, isSingle = true, name = ALERT_NAME) {
            if (~~content === TIME_OUT_ERROR_CODE) {
                content = REQUEST_TIME_OUT_TEXT
            }
            if (~~content === NETWORK_ERROR_CODE) {
                content = REQUEST_FAILED_TEXT
            }
            const opts = Object.assign({}, {content, icon: 'cubeic-alert'}, options)
            this[name] = this.$createDialog(opts, isSingle)
            this[name].show()
        },
        _closeAlert(name = ALERT_NAME) {
            this[name].hide()
        },
        _openConfirm(content, options = {}, isSingle = true, name = CONFIRM_NAME) {
            const opts = Object.assign({}, {type: 'confirm'}, options)
            this._openAlert(content, opts, isSingle, name)
        },
        _closeConfirm(name = CONFIRM_NAME) {
            this[name].hide()
        }
    },
    watch: {
        imgHost: {
            handler(val) {
                this.imgPrefix = val
            },
            immediate: true
        }
    }
}
