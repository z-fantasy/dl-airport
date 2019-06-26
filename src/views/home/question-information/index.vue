<template>
    <Page type="question-information" ref="page">
        <div class="qetInfCon">
            <router-button :linkData="routerList" :large="true"></router-button>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['study-bank']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    export default {
        name: 'question-information',
        data() {
            return {
                routerList: [
                    {label: '视频类', route: 'study-bank', value:'0', defTitle: '视频'},
                    {label: '文档类', route: 'study-bank', value: '1', defTitle: '文档'},
                    {label: '考核类', route: 'study-bank', value: '2', defTitle: '考核'}
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
    .qetInfCon
        padding: 50px 0
</style>
