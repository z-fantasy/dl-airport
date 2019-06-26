<template>
    <Page type="study-bank" ref="page">
        <div>
            <router-button :linkData="routerList" :medium="true"></router-button>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['study-detail']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {isWXEnv} from 'common/wx-utils'
    import {deviceInfo, devBrowser} from 'common/utils'
    import {getQuestionList} from 'api/common'
    const PAGE_NAME = 'study-bank'
    export default {
        name: 'study-bank',
        data() {
            return {
                routerList: []
            }
        },
        created() {
            this.getRouterList()
        },
        beforeRouteUpdate(to, from, next) {
            if (to.name === PAGE_NAME) {
                setTimeout(this.getRouterList, 100)
            }
            next()
        },
        methods: {
            getRouterList() {
                this._openToast()
                getQuestionList(this.$route.query.type).then(res => {
                    this._closeToast()
                    this.routerList = res.map(item => {
                        return {label: item.EB_NAME, route: 'study-detail', value: item['EB_ID'], defTitle: item.EB_NAME}
                    })
                    console.log()
                    this.$nextTick(() => {
                        this.$refs.page.refresh()
                    })
                }).catch(err => this._reBackErr(err))
            }
        },
        components: {
            Page,
            PageView,
            RouterButton
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .xiaz
        display: block
        height: 20px
</style>
