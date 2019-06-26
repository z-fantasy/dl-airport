<template>
    <Page type="notice-detail" ref="page">
        <div>
            <v-html-detail :vHtml="vHtml" @vHtmlReady="vHtmlReady"></v-html-detail>
            <div class="isReady" :class="{actived: isReady}" @click="setReady">
                已读
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import VHtmlDetail from '@/components/v-html-detail/v-html-detail'
    import {getNoticeDetail, setReadyed} from 'api/common'
    import {userMixin} from 'common/mixins/user'
    import {htmlDecode} from 'common/utils'

    export default {
        name: 'notice-detail',
        mixins: [userMixin],
        data() {
            return {
                noticeId: '',
                vHtml: '',
                isReady: false
            }
        },
        activated() {
            if (this.$route.query.isReady) {
                if (this.$route.query.isReady === '1') {
                    this.isReady = true
                } else {
                    this.isReady = false
                }
            } else {
                this.isReady = false
            }
            if (this.$route.query.id) {
                if (this.$route.query.id === this.noticeId) return
                this.noticeId = this.$route.query.id
                this.getDetail()
            } else {
                this._reBackErr('未获取到消息参数！', '提示', () => {
                    this.$router.back()
                })
            }
        },
        methods: {
            setReady() {
                if (!this.isReady) {
                    this._openToast()
                    setReadyed({id: this.noticeId, type: this.$route.query.type}).then(res => {
                        this._closeToast()
                        if (res) {
                            this.isReady = !this.isReady
                        } else {
                            this._openAlert('设置已读失败！')
                        }
                    }).catch(err => this._reBackErr(err))
                }
            },
            getDetail() {
                this._openToast()
                getNoticeDetail({id: this.noticeId, type: this.$route.query.type}).then(res => {
                    this._closeToast()
                    this.vHtml = htmlDecode(res)
                }).catch(err => this._reBackErr(err))
            },
            vHtmlReady() {
                setTimeout(() => {
                    this.$refs.page.refresh()
                }, 300)
            }
        },
        components: {
            Page,
            VHtmlDetail
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .isReady {
        position: fixed
        top: 460px
        right: 20px
        width: 50px
        height: 50px
        border-radius: 50%
        text-align: center
        background: #0062cc
        color: #fff
        display: flex
        justify-content: center
        align-items: center
    }

    .actived {
        background: rgba(0.0 .0 .0 .5)
    }
</style>
