<template>
    <Page type="complaint-content" ref="page">
       <div class="complaint-cont">
           <ul class="com-ul">
               <li>
                   <span class="info-tit">投诉信息编号：</span><span class="info-desc">{{complaintData.id}}</span>
               </li>
               <!--<li>-->
                   <!--<span class="info-tit">投诉人：</span><span class="info-desc">{{complaintData.eName}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">投诉电话：</span><span class="info-desc">{{complaintData.ePhone}}</span>-->
               <!--</li>-->
               <li>
                   <span class="info-tit">投诉时间：</span><span class="info-desc">{{complaintData.eTxDate}}</span>
               </li>
               <li>
                   <span class="info-tit">投诉内容：</span><span class="info-desc">{{complaintData.eDesic}}</span>
               </li>
               <!--<li>-->
                   <!--<span class="info-tit">受理来源：</span><span class="info-desc">{{complaintData.eInsource}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">受理时间：</span><span class="info-desc">{{complaintData.eAcceTime}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">受理方式：</span><span class="info-desc">{{complaintData.eAcceType}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">受理人：</span><span class="info-desc">{{complaintData.eAcceCeby}}</span>-->
               <!--</li>-->
               <li>
                   <span class="info-tit">受理状态：</span><span class="info-desc">{{complaintData.eStatus}}</span>
               </li>
               <!--<li>-->
                   <!--<span class="info-tit">商家处理：</span><span class="info-desc">{{complaintData.eMerchant}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">改善措施：</span><span class="info-desc">{{complaintData.eMeasures}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">质检科处理：</span><span class="info-desc">{{complaintData.eQuality}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">完结时间：</span><span class="info-desc">{{complaintData.eEndTime}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">确认人：</span><span class="info-desc">{{complaintData.eCreateby}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">确认时间：</span><span class="info-desc">{{complaintData.eCreateDate}}</span>-->
               <!--</li>-->
               <!--<li>-->
                   <!--<span class="info-tit">投诉店铺编号：</span><span class="info-desc">{{complaintData.eStoreId}}</span>-->
               <!--</li>-->
           </ul>
           <div class="dealArea" v-if="showDealBtn">
               <router-button :linkData="routerList" :large="true"></router-button>
           </div>
       </div>
        <div slot="children-view">
            <page-view :excludePages="['complaint-deal']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import RouterButton from '@/components/router-button/router-button'
    import {getComplainDetail} from 'api/common'
    const PAGE_NAME = 'complaint-content'
    const comDataTem = {
        id: '',
        eName: '暂无',
        ePhone: '暂无',
        eTxDate: '暂无',
        eDesic: '暂无',
        eInsource: '暂无',
        eAcceTime: '暂无',
        eAcceType: '暂无',
        eAcceCeby: '暂无',
        eStatus: '暂无',
        eMerchant: '暂无',
        eMeasures: '暂无',
        eQuality:'暂无',
        eEndTime: '暂无',
        eCreateby: '暂无',
        eCreateDate: '暂无',
        eStoreId: '暂无'
    }
    export default {
        name: 'complaint-content',
        data() {
            return {
                idVal: '',
                complaintData: comDataTem,
                routerList: [],
                showDealBtn: false
            }
        },
        created() {
            this.idVal = this.$route.query.type
            this.getComplaintCon()
        },
        beforeRouteUpdate(to, from, next) {
            if (to.name === PAGE_NAME) {
                this.getComplaintCon()
            }
            next()
        },
        methods: {
            getComplaintCon() {
                if (this.idVal) {
                    this._openToast()
                    getComplainDetail(this.idVal).then(res => {
                        this._closeToast()
                        if (res['EB_ID']) {
                            this.complaintData = Object.assign({}, comDataTem, {
                                id: res['EB_ID'],
                                eName: res['EB_NAME'],
                                ePhone: res['EB_PHONE'],
                                eTxDate: res['EB_TXDATE'] ? res['EB_TXDATE'].split(' ')[0] : '暂无',
                                eDesic: res['EB_DESIC'],
                                eInsource: this.typeDy(1, res['EB_INSOURCE']),
                                eAcceTime: res['EB_ACCEPTANCETIME'] ? res['EB_ACCEPTANCETIME'].split(' ')[0] : '暂无',
                                eAcceType: res['EB_ACCEPTANCETYPE'],
                                eAcceCeby: res['EB_ACCEPTANCEBY'],
                                eStatus: this.typeDy(2, res['EB_STATUS']),
                                eMerchant: res['EB_MERCHANT'],
                                eMeasures: res['EB_MEASURES'],
                                eQuality: res['EB_QUALITY'],
                                eEndTime: res['EB_ENDTIME'] ? res['EB_ENDTIME'].split(' ')[0] : '暂无',
                                eCreateby: res['EB_CREATEBY'],
                                eCreateDate: res['EB_CREATEDATE'] ? res['EB_CREATEDATE'].split(' ')[0] : '暂无',
                                eStoreId: res['EB_STOREID']
                            })
                            if (this.complaintData.id) {
                                this.routerList = [
                                    {
                                        label: '商家处理',
                                        route: 'complaint-deal',
                                        defTitle: '商家处理',
                                        query: {
                                            type: 0,
                                            valId: this.complaintData.id
                                        }
                                    },
                                    {
                                        label: '改善措施',
                                        route: 'complaint-deal',
                                        defTitle: '改善措施',
                                        query: {
                                            type: 1,
                                            valId: this.complaintData.id
                                        }
                                    }
                                ]
                                this.showDealBtn = true
                            }
                            this.$nextTick(() => {this.$refs.page.refresh()})
                        } else {
                            this._openAlert('获取到的信息无效！')
                        }
                    }).catch(err => this._reBackErr(err))
                } else {
                    this._reBackErr('未获取到投诉查询id', '提示', () => {
                        this.$router.back()
                    })
                }
            },
            typeDy(type, con) {
                if (type === 1) {
                    // 受理来源 1：民意网，2：旅客意见表，3：安质部，4：TOC，5：微博，6：商管投诉电话，7：其他
                    switch(con){
                        case '1':
                            return '民意网'
                        case '2':
                            return '旅客意见表'
                        case '3':
                            return '安质部'
                        case '4':
                            return 'TOC'
                        case '5':
                            return '微博'
                        case '6':
                            return '商管投诉电话'
                        case '7':
                            return '其他'
                    }
                }
                if (type === 2) {
                    // 受理状态：0：已受理，1：未受理，2：正在进行
                    switch(con){
                        case '0':
                            return '已受理'
                        case '1':
                            return '未受理'
                        case '2':
                            return '正在进行'
                    }
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
    .complaint-cont
        padding-bottom: 50px
        .com-ul li
            padding: 8px 12px
</style>
