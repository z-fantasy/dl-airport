<template>
    <Page type="statement-detail" ref="page">
        <div>
            <div class="searchBox">
                <div class="search-btn-box">
                    <span class="search-btn" @click="searchStem"><i class="cubeic-search iconCb"></i>搜索</span>
                </div>
                <ul>
                    <li class="search-input-box"><span>店铺编号：</span><cube-input class="cube-input-box" v-model="searchCont.id"></cube-input></li>
                    <li class="search-input-box"><span>店铺名称：</span><cube-input class="cube-input-box" v-model="searchCont.storeName"></cube-input></li>
                    <li class="search-input-box"><span>姓名：</span><cube-input class="cube-input-box" v-model="searchCont.name"></cube-input></li>
                    <li class="search-input-box select-li"><span>健康证起始时间：</span><p class="cube-input-box select-date" @click="showDatePicker"><span class="heltTime">{{searchCont.healthStartTime}}</span><span @click.stop.prevent="clearSTime" class="cubeic-wrong mine-wrong-sty" v-show="searchCont.healthStartTime"></span></p></li>
                </ul>
            </div>
            <div class="tableBox">
                <table border="1" class="table-knife" v-show="statementData.length">
                    <tr>
                        <th>店铺编号</th>
                        <th>店铺名称</th>
                        <th>姓名</th>
                        <th>健康证起始时间</th>
                    </tr>
                    <tr v-for="item in statementData" v-bind:key="item.id">
                        <td>{{item.id}}</td>
                        <td>{{item.storeName}}</td>
                        <td>{{item.name}}</td>
                        <td>{{item.healthStartTime}}</td>
                    </tr>
                </table>
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import {searchStatem} from 'api/common'
    export default {
        name: 'statement-detail',
        data() {
            return {
                searchCont: {
                    id: '',
                    storeName: '',
                    name: '',
                    healthStartTime: ''
                },
                statementData: []
            }
        },
        methods: {
            searchStem() {
                const searchCon = this.searchCont
                if (searchCon.id || searchCon.storeName || searchCon.name || searchCon.healthStartTime) {
                    this._openToast()
                    searchStatem(searchCon).then(res => {
                        this._closeToast()
                        if (res.length) {
                            this.statementData = res.map(item => {
                                return {
                                    id: item['STR_MALL_CODE'],
                                    storeName: item['EB_NAME'],
                                    name: item['STR_LOGIN_NAME'],
                                    healthStartTime: item['EB_HEALTHYSTA']
                                }
                            })
                        } else {
                            this.statementData = []
                            this._openAlert('未搜索到相应报表！请核对搜索条件')
                        }
                    }).catch(err => this._reBackErr(err))
                } else {
                    this._openAlert('请先输入要搜索的内容')
                }
            },
            showDatePicker() {
                if (!this.datePicker) {
                    this.datePicker = this.$createDatePicker({
                        title: '选择时间',
                        min: new Date(1970, 7, 8),
                        max: new Date(),
                        value: new Date(),
                        onSelect: this.selectHandle
                    })
                }
                this.datePicker.show()
            },
            selectHandle(date, selectedVal) {
                this.searchCont.healthStartTime = `${selectedVal[0]}-${selectedVal[1] > 9 ? selectedVal[1] : '0' + selectedVal[1]}-${selectedVal[2] > 9 ? selectedVal[2] : '0' + selectedVal[2]}`
            },
            clearSTime() {
                this.searchCont.healthStartTime = ''
            }
        },
        components: {
            Page
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/mixin'
    .searchBox
        margin: 12px
        .search-btn-box
            text-align : right
            .search-btn
                font-size: 18px
                vertical-align: middle
                .iconCb
                    font-size: 26px
        .select-li
            padding: 10px 0
        .search-input-box
            display: flex
            align-items : center
            margin-top: 10px
            .cube-input-box
                flex: 1
            .select-date
                min-height: 16px
                display: flex
                justify-content : space-between
                border-bottom-1px()
                line-height : 22px
                height: 22px
                color: #666
                .heltTime
                    font-size: 16px
                    line-height : 26px
                .mine-wrong-sty
                    width: 22px
    .table-knife
        margin: 12px
        tr
            text-align: center
            th, td
                border: 1px solid #ccc
                padding: 6px 2px
                text-align: center
                font-break()
            td
                font-size: 14px
</style>
