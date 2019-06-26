<template>
    <Page type="staff-detail" ref="page">
        <div>
            <staff-info></staff-info>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import StaffInfo from '@/components/staff-info/staff-info'
    export default {
        name: 'staff-detail',
        data() {
            return {}
        },
        components: {
            Page,
            StaffInfo
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">

</style>
