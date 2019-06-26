<template>
    <Page type="rules-detail" ref="page">
        <div>
            <v-html-detail :vHtml="vHtml" @vHtmlReady="vHtmlReady"></v-html-detail>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import VHtmlDetail from '@/components/v-html-detail/v-html-detail'
    import {getRuleDetail} from 'api/common'
    import {htmlDecode, joinHtml} from 'common/utils'
    export default {
        name: 'rules-detail',
        data() {
            return {
                ruleId: '',
                vHtml: ''
            }
        },
        activated() {
            if (this.$route.query.type) {
                if (this.$route.query.type === this.ruleId) return
                this.ruleId = this.$route.query.type
                this.getDetail()
            } else {
                this._reBackErr('未获取到消息参数！', '提示', () => {
                    this.$router.back()
                })
            }
        },
        methods: {
            getDetail() {
                this._openToast()
                getRuleDetail(this.ruleId).then(res => {
                    this._closeToast()
                    const fileUrl = res['EB_DESCI']
                    this.vHtml = joinHtml(this.imgPrefix, fileUrl)
                }).catch(err => {
                    this.vHtml = ''
                    this._reBackErr(err)
                })
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
    .fileImg
        width: 100%
        height: auto
</style>
