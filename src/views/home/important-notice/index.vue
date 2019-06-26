<template>
    <page type="important-notice" ref="page">
        <div class="important-notice-con">
            <router-button :linkData="routerList" :large="true" v-if="showBtn"></router-button>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['staff-search', 'staff-info-detail']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {getNoticeList} from 'api/common'
    export default {
        name: 'important-notice',
        data() {
            return {
                routerList: [],
                nedShowNotice: true,
                showBtn: false
            }
        },
        activated() {
            this.getDataList()
        },
        watch: {
            $route(n, o) {
                if (o.name === 'notice-detail') {
                    this.nedShowNotice = false
                    this.showBtn = true
                } else {
                    this.nedShowNotice = true
                    this.showBtn = false
                    this.toImportDesc()
                }
            },
            routerList() {
                this.$nextTick(this.$refs.page.refresh)
            }
        },
        methods: {
            getDataList() {
                if (!this.routerList.length) this._openToast()
                getNoticeList().then(res => {
                    if (!this.routerList.length) this._closeToast()
                    this.toImportDesc(res)
                    this.routerList = res.map(item => {
                        return {
                            label: item['EB_NAME'],
                            route: 'notice-detail',
                            defTitle: item['EB_NAME'],
                            query: {
                                id: item['EB_ID'],
                                type: item['EB_TYPE'],
                                isReady: item['EB_STATE'],
                                strUCode: item['STR_USER_CODE']
                            }
                        }
                    })
                }).catch(err => this._reBackErr(err, '获取规章制度失败'))
            },
            toImportDesc(nData) {
                const filtData = nData ? nData : this.routerList
                const noticeShowD = filtData.filter(item => item['EB_TYPE'] === '0')
                if (noticeShowD.length && this.nedShowNotice) {
                    this.$store.commit('DEFINE_TITLE', noticeShowD[0]['EB_NAME'])
                    this.$router.push({
                        name: 'notice-detail',
                        query: {
                            id: noticeShowD[0]['EB_ID'],
                            type: noticeShowD[0]['EB_TYPE'],
                            isReady: noticeShowD[0]['EB_STATE'],
                            strUCode: noticeShowD[0]['STR_USER_CODE']
                        }
                    })
                } else {
                    this.nedShowNotice = false
                    this.showBtn = true
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
    .important-notice-con
        padding: 50px 0
</style>
