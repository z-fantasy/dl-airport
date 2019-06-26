<template>
    <Page type="knife-management" ref="page">
        <div class="knife-man-con">
            <ul class="handUi">
                <router-button :linkData="routerList" :large="true"></router-button>
            </ul>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['knife-detail']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {knifeTypeList} from 'api/common'
    export default {
        name: 'knife-management',
        data() {
            return {
                routerList: []
            }
        },
        activated() {
            this.getListData()
        },
        methods: {
            getListData() {
                if (!this.routerList.length) {
                    this._openToast()
                    knifeTypeList().then(res => {
                        this._closeToast()
                        this.routerList = res.map(item => {
                            return {label: item['EB_VARIETIES'], route: 'knife-detail', value: item['EB_ID']}
                        })
                        console.log(res)
                    }).catch(err => this._reBackErr(err))
                }
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

</style>
