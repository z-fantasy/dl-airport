<template>
    <Page type="train-management" ref="page">
        <div class="train-man-con">
            <router-button :linkData="routerList" :large="true"></router-button>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['training-appraisal，training-center-list']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    export default {
        name: 'train-management',
        data() {
            return {
                routerList: [
                    {label: '新员工岗前培训考核', route: 'training-appraisal', value: 0},
                    {label: '员工岗中培训考核', route: 'training-center-list', value: 1}
                ]
            }
        },
        methods: {
        },
        components: {
            Page,
            PageView,
            RouterButton
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .train-man-con
        padding: 50px 0
</style>
