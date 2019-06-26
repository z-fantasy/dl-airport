<template>
    <Page type="training-center-list" ref="page">
        <div class="train-man-con">
<!--            <router-button :linkData="routerList" :large="true"></router-button>-->
            <ul v-if="routerList.length" class="training-list-ui">
                <li class="training-list-li" v-for="item in routerList" v-bind:key="item.value" @click="toDetailPage(item)">
                    <div class="tra-li-content">
                        <p class="tra-li-p">{{item.label}}</p>
                        <p class="tra-li-time">{{item.time}}</p>
                    </div>
                </li>
            </ul>
            <div class="noData" v-else>
                <no-data></no-data>
            </div>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['training-center-detail']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import NoData from '@/components/no-data/no-data'
    import {getPstCenterList} from '@/api/common'
    export default {
        name: 'training-center-list',
        data: () => {
            return {
                routerList: []
            }
        },
        components: {
            Page,
            PageView,
            NoData
        },
        created() {
            this.getRouterList()
        },
        methods: {
            getRouterList() {
                this._openToast()
                getPstCenterList().then(res => {
                    this._closeToast()
                    this.routerList = res.map(item => {
                        return {
                            label: item.EB_AREA,
                            time: item.EB_TRAINDATE,
                            route: 'training-center-detail',
                            value: item.EB_ID,
                            defTitle: item.EB_AREA
                        }
                    })
                    this.$nextTick(() => {
                        this.$refs.page.refresh()
                    })
                }).catch(err => this._reBackErr(err, '培训考核列表'))
            },
            toDetailPage(item) {
                let queryRou = {}
                if (item.value || item.value === 0) {
                    queryRou.type = item.value
                }
                if (item.query) {
                    queryRou = item.query
                }
                if (item.defTitle) {
                    this.$store.commit('DEFINE_TITLE', item.defTitle)
                }
                this.$router.push({
                    name: item.route,
                    query: queryRou
                })
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/mixin.styl'
    .training-list-ui
        padding-bottom: 44px
        .training-list-li
            border-bottom-1px()
            padding: 12px 14px 12px 16px
            .tra-li-content
                background: transparent url("./jt.png") no-repeat right center
                background-size : 16px auto
                .tra-li-p
                    padding-bottom: 6px
                .tra-li-time
                    font-size: 14px
                    color: #666
</style>
