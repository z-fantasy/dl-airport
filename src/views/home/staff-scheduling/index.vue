<template>
    <Page type="staff-scheduling" ref="page">
        <div class="staff-scheduling-con">
            <router-button :linkData="routerList" :medium="true"></router-button>
        </div>
        <div slot="children-view">
            <!--:excludePages="['staff-schedule-detail']"-->
            <page-view />
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {getRankList} from 'api/common'
    export default {
        name: 'staff-scheduling',
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
                getRankList().then(res => {
                    if (!this.routerList.length) this._closeToast()
                    this.routerList = res.map(item => {
                        return {
                            label: item['EB_NAME'],
                            route: 'staff-schedule-detail',
                            value: item['EB_ID'],
                            defTitle: item['EB_NAME']
                        }
                    })
                }).catch(err => {
                    this._reBackErr(err, '获取排班列表失败')
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
    .staff-scheduling-con
        padding: 50px 0
</style>
