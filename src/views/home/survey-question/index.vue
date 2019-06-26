<template>
    <Page type="survey-question" ref="page" bgColor="#efeff4">
        <div class="statementfCon">
<!--            <router-button :linkData="routerList" :large="true"></router-button>-->
            <ul class="question-survey-content">
                <li class="question-survey" v-for="item in routerList" v-bind:key="item.value" @click="toDetailPage(item)">
                    <h3>{{item.label}}</h3>
                    <div class="qcc">
                        <p>{{item.time}}</p>
                    </div>
                </li>
            </ul>
            <div class="noData" v-if="!(routerList.length)">
                <no-data></no-data>
            </div>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['survey-detail']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import NoData from '@/components/no-data/no-data'
    import {getSurveyList, isAnswered} from '@/api/common'
    // import RouterButton from '@/components/router-button/router-button'
    const PAGE_NAME = 'survey-question'
    export default {
        name: PAGE_NAME,
        data() {
            return {
                routerList: [
                    // {label: '人员信息报表', route: 'survey-detail', value:'0', defTitle: '人员信息报表'}
                    // {label: '问卷调查名称', time: '2019年6月21日', route: 'survey-detail', value:'0', defTitle: '问卷调查名称'}
                ]
            }
        },
        created() {
            this.getRouterList(1)
        },
        methods: {
            getRouterList(loadSta) {
                if (loadSta) {
                    this._openToast()
                }
                getSurveyList().then(res => {
                    this.routerList = res.map(item =>{
                        return {
                            label: item.Title,
                            time: item.CreateDate,
                            route: 'survey-detail',
                            value: item.PaperCode,
                            defTitle: item.Title
                        }
                    })
                    if (loadSta) {
                       this._closeToast()
                    }
                    setTimeout(() => {
                        this.$refs.page.refresh()
                    }, 30)
                }).catch(err => this._reBackErr(err, '调查问卷'))
            },
            toDetailPage(item) {
                // 查询是否回答过
                this._openToast('查询中')
                isAnswered(item.value).then(res => {
                    this._closeToast()
                    if (res) {
                        this._openAlert('您已回答过该问卷！')
                    } else {
                        this.ruleDetail(item)
                    }
                }).catch(err => this._reBackErr(err, '查询回答'))
            },
            ruleDetail(clify) {
                let queryRou = {}
                if (clify.value || clify.value === 0) {
                    queryRou.type = clify.value
                }
                if (clify.query) {
                    queryRou = clify.query
                }
                if (clify.defTitle) {
                    this.$store.commit('DEFINE_TITLE', clify.defTitle)
                }
                this.$router.push({
                    name: clify.route,
                    query: queryRou
                })
            }
        },
        beforeRouteUpdate(to, form, next) {
            if (to.name === PAGE_NAME) {
                this.getRouterList()
            }
            next()
        },
        components: {
            Page,
            // RouterButton,
            PageView,
            NoData
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .statementfCon
        padding-top: 20px
        padding-bottom: 44px
        .question-survey-content
            margin: 0 20px
            .question-survey
                padding: 12px
                background: #ffffff
                margin-bottom: 14px
                border: 1px solid #ccc
                h3
                    font-size: 18px
                .qcc
                    margin-top: 16px
                    p
                        color: #666
                        font-sze: 14px

</style>
