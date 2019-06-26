<template>
    <div class="no-data">
        <div class="no-data-con">
            <img src="./noData.png" alt="">
        </div>
        <div class="no-data-text">暂无相关内容</div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'no-data',
        data() {
            return {}
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .no-data-text
        text-align : center
        font-size: 22px
        color: #666
    .no-data-con
        img
            display: block
            width: auto
            height: auto
            margin: auto
</style>
