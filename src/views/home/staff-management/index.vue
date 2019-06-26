<template>
    <Page type="staff-management" ref="page">
        <div class="staff-man-con">
            <router-button :linkData="routerList" :large="true"></router-button>
        </div>
        <div slot="children-view">
            <!--'staff-search'-->
            <page-view :excludePages="['staff-info-detail', 'change-password']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {userMixin} from 'common/mixins/user'

    export default {
        name: 'staff-management',
        mixins:[userMixin],
        data() {
            return {
                catchRou: false,
                routerList: [
                    {label: '员工信息', route: 'staff-info-detail', value: 1},
                    {label: '修改密码', route: 'change-password', value: 2}
                ]
            }
        },
        created(){
            if (this.userInfo.loginerGrade === 'SystemManager' || this.userInfo.loginerGrade === '002') {
                this.routerList.unshift({label: '查找', route: 'staff-search', value: 0})
            }
        },
        methods: {},
        components: {
            Page,
            PageView,
            RouterButton
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .staff-man-con
        padding: 50px 0
</style>
