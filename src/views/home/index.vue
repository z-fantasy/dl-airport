<template>
    <page type="home" ref="page">
        <div class="home">
            <div class="inNineBanner">
                <cube-slide class="ytBanner" ref="slide" :data="items" :showDots="true">
                    <cube-slide-item v-for="(item, index) in items" :key="index"
                                     @click.native="clickHandler(item, index)">
                        <div class="cbsImg">
                            <img :src="item.image">
                        </div>
                    </cube-slide-item>
                </cube-slide>
            </div>
            <div class="handerArea">
                <router-button :linkData="routerList"></router-button>
            </div>
            <!--<router-link to="test-page">test-page</router-link>-->
        </div>
        <div slot="children-view">
            <page-view :excludePages="['polling-management', 'punish-management', 'staff-management', 'survey-question']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    // @ is an alias to /src
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {getBanner, getModuleList} from 'api/common'
    import {userMixin} from 'common/mixins/user'
    // EB_RULE：规章制度，EB_QUESTION：题库资料，EB_PSTRAIN：培训管理，EB_COMPLAINT:投诉管理，EB_TOOL：刀具管理，EB_WORKTIME：员工排班，EB_PUNISH：处罚管理，EB_INSPECTING：巡检管理，Report_EB_PERSONNEL：员工信息报表
    const moduleList = [
        {label: '规章制度', route: 'rules-system', moduleName: 'EB_RULE'},
        {label: '题库资料', route: 'question-information', moduleName: 'EB_QUESTION'},
        {label: '培训管理', route: 'train-management', moduleName: 'EB_PSTRAIN'},
        {label: '投诉管理', route: 'complaints-management', moduleName: 'EB_COMPLAINT'},
        {label: '刀具管理', route: 'knife-management', moduleName: 'EB_TOOL'},
        {label: '员工排班', route: 'staff-scheduling', moduleName: 'EB_WORKTIME'},
        {label: '处罚管理', route: 'punish-management', moduleName: 'EB_PUNISH'},
        {label: '巡检管理', route: 'polling-management', moduleName: 'EB_INSPECTING'},
        {label: '报表', route: 'statement', moduleName: 'Report_EB_PERSONNEL'},
        {label: '问卷调查', route: 'survey-question', moduleName: 'question-main'}
    ]
    export default {
        name: "home",
        mixins: [userMixin],
        data() {
            return {
                routerCatch: false,
                routerList: [
                    {label: '重要通知', route: 'important-notice'},
                    {label: '员工管理', route: 'staff-management'},
                    {label: '员工签到', route: 'staff-sign'},
                ],
                items: [],
            }
        },
        activated() {
            if (this.$refs.slide) this.$refs.slide.refresh()
            this.getBans()
            this.getModuleRot()

//            this.$nextTick(() => { if (this.$refs.slide) this.$refs.slide.refresh() })
        },
        methods: {
            linkBtn(rouName) {
                this.$router.push({
                    name: rouName
                })
            },
            getModuleRot() {
                if (this.userInfo.loginerGrade && this.routerList.length <= 3) {
                    this._openToast()
                    getModuleList().then(res => {
                        const moduleString = res
                        const moduleShow = this.routerList
                        for (let i = 0; i < moduleList.length; i++) {
                            if (moduleString.indexOf(moduleList[i]['moduleName']) > -1) {
                                moduleShow.push(moduleList[i])
                            }
                        }
                        moduleShow.push({label: '退出登录', route: '', type: 'loginOut'})
                        this.routerList = moduleShow
                        this.$nextTick(() => {
                            this.$refs.slide.refresh()
                            this.$refs.page.refresh()
                        })
                        this._closeToast()
                    }).catch(err => {
                        this._reBackErr(err)
                    })
                }
            },
            getBans() {
                if (!this.items.length) {
                    getBanner().then(res => {
                        this.items = res.map(item => {
                            return {
                                image: this.imgPrefix + item
//                            EB_CAROUSELID: item.EB_COMETOAWAVEID // EB_CAROUSELID
                            }
                        })
                        console.log('imgPrefix', this.imgPrefix, this.items)
                        this.$nextTick(() => {
                            if (this.$refs.slide) this.$refs.slide.refresh()
                        })
                    }).catch(errs => {
                        this._openAlert(`${errs}`, {title: '轮播图获取失败'})
                    })
                }
            },
            clickHandler(item, index) {
//                this.$router.push({
//                    name: 'introduce',
//                    query: {
//                        advId: item.EB_CAROUSELID
//                    }
//                })
            }
        },
        watch: {
            imgPrefix(n, o) {
                if (/http/.test(n)) {
                    console.log('n', n)
                    this.items = this.items.map(item => n + item.image)
                }
            }
        },
        components: {
            Page,
            PageView,
            RouterButton
        }
    };
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/variables.styl'
    .home
        font-size: 16px
        .handerArea
            padding-bottom: 50px
        .inNineBanner
            height: 170px
            .cbsImg
                height: 100%
                width: 100%
                position : relative
                img
                    position: absolute
                    width: auto
                    height: 100%
                    left: 50%
                    top: 50%
                    transform: translate(-50%, -50%)
            .ytBanner /deep/ .cube-slide-dots
                height: 10px
                bottom: 6px
                overflow: hidden
                > span
                    height: 8px
                    width: 8px
                    border-radius: 50%
                    margin: 0 3px
                .active
                    background:  $color-main
</style>
