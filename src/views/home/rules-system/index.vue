<template>
    <Page type="rules-system" ref="page">
        <div class="rule-system-con">
            <router-button :linkData="routerList" :large="true"></router-button>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['rule-system']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {getRuleList} from 'api/common'
    export default {
        name: 'rules-system',
        data() {
            return {
                routerList: []
            }
        },
        activated() {
            this.getDataList()
        },
        watch: {
            routerList() {
                this.$nextTick(this.$refs.page.refresh)
            }
        },
        methods: {
            getDataList() {
                if (!this.routerList.length) this._openToast()
                getRuleList().then(res => {
                    if (!this.routerList.length) this._closeToast()
                    this.routerList = res.map(item => {
                        return {
                            label: item['EB_TYPE'],
                            route: 'rules-detail',
                            value: item['EB_ID'],
                            defTitle: item['EB_TYPE']
                        }
                    })
                }).catch(err => {
                    this._reBackErr(err, '获取规章制度失败')
                })
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
    .handUi
        padding: 50px 0
</style>
