<template>
    <Page type="study-bank" ref="page" :scrollClick="false">
        <div>
            <v-html-detail :vHtml="vHtml" @vHtmlReady="vHtmlReady"></v-html-detail>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import VHtmlDetail from '@/components/v-html-detail/v-html-detail'
    import {getQuestionDetail} from 'api/common'
    import {joinHtml} from 'common/utils'
    export default {
        name: 'study-detail',
        data() {
            return {
                vHtml: ''
            }
        },
        created() {
            this._openToast()
            getQuestionDetail(this.$route.query.type).then(res => {
                this._closeToast()
                this.vHtml = joinHtml(this.imgPrefix, res['EB_DESCI'])
            }).catch(err => this._reBackErr(err))
        },
        methods: {
            vHtmlReady() {
                this.$nextTick(this.$refs.page.refresh())
            }
        },
        components: {
            Page,
            VHtmlDetail
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
