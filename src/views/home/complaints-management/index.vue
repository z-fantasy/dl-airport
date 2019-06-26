<template>
    <Page type="complaints-management" ref="page">
        <div class="complaints-man-con">
            <router-button :linkData="routerList" :large="true"></router-button>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['complaint-content']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {getComplainList} from 'api/common'
    export default {
        name: 'complaints-management',
        data() {
            return {
                routerList: []
            }
        },
        activated() {
            this.getRoutList()
        },
        methods: {
            getRoutList() {
                if (!this.routerList.length) {
                    this._openToast()
                }
                getComplainList().then(res => {
                    this._closeToast()
                    this.routerList = res.map(item => {
                        return {label: item['EB_DESIC'], route: 'complaint-content', value: item['EB_ID']}
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
    .complaints-man-con
        padding: 50px 0
</style>
