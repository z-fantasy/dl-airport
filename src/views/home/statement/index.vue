<template>
    <Page type="statement" ref="page">
        <div class="statementfCon">
            <router-button :linkData="routerList" :large="true"></router-button>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['statement-detail']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'

    export default {
        name: 'statement',
        data() {
            return {
                routerList: [
                    {label: '人员信息报表', route: 'statement-detail', value:'0', defTitle: '人员信息报表'}
                ]
            }
        },
        components: {
            Page,
            RouterButton,
            PageView
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .statementfCon
        padding-top: 20px
</style>
