<template>
    <Page type="staff-search" ref="page">
        <div class="staff-search-con">
            <ul class="staff-search-ul">
                <li class="mine-input-li">
                    <span>姓名：</span>
                    <cube-input v-model="searchStaff.name"></cube-input>
                </li>
                <li class="mine-input-li">
                    <span>工作商铺名称：</span>
                    <div class="selectValBox">
                        <cube-input v-model="shopName" @focus="inputFocus" @blur="inputBlur"></cube-input>
                        <div class="selectVal" v-show="showSlect">
                            <ul>
                                <li v-for="(item, index) in showShopName" v-bind:key="index" @click="selectStore(item)">
                                    {{item}}
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
            <div class="searchBtnArea">
                <div class="searchBtn" @click="searchInfo">查 找</div>
            </div>
        </div>
        <div slot="children-view">
            <page-view :excludePages="['staff-detail']"/>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import PageView from '@/components/page-view/page-view'
    import {getMallNo} from 'api/common'
    import {debounce} from 'common/utils'

    export default {
        name: 'staff-search',
        data() {
            return {
                searchStaff: {
                    name: '',
                    shopName: ''
                },
                allShopName: [],
                showShopName: [],
                shopName: '',
                showSlect: true,
                isFocus: false
            }
        },
        activated() {
            this.shopName = ''
            this.searchStaff = {
                name: '',
                shopName: ''
            }
            if (!this.allShopName.length) {
                this._openToast()
                getMallNo().then(res => {
                    this._closeToast()
                    if (res && res[0] && res[0].EB_MALLID) {
                        this.allShopName = res.map(item => item.EB_NAME)
                    } else {
                        this._openAlert(`商场号获取返回有误：${res}`)
                    }
                }).catch(errs => {
                    this._closeToast()
                    this._openAlert(`請求商城号出错：${errs}`)
                    console.log(`請求商城号出错：${errs}`)
                })
            }
        },
        watch: {
            shopName(n) {
                this.searchStaff.shopName = n
                this.isShowSearch()
            }
        },
        methods: {
            isShowSearch: debounce(function () {
                if (!this.isFocus) return
                if (this.shopName.trim()) {
                    const nowInputVal = this.shopName.trim()
                    this.showShopName = this.allShopName.filter(item => item.indexOf(nowInputVal) > -1)
                    if (this.showShopName.length) this.showSlect = true
                    else this.showSlect = false
                } else {
                    this.showSlect = false
                }
            }, 500),
            selectStore(selVal) {
                this.showSlect = false
//                this.isFocus = false
                this.shopName = selVal
                this.searchStaff.shopName = selVal
            },
            inputFocus() {
                this.isFocus = true
                this.isShowSearch()
            },
            inputBlur() {
                this.isFocus = false
            },
            searchInfo() {
                const canSearch = this.searchStaff.name ? this.searchStaff.shopName ? '通过' : '请填入查询员工工作店铺名称!' : '请填入查询员工名称!'
                if (canSearch === '通过') {
                    this.$router.push({
                        name: 'staff-detail',
                        query: {
                            name: this.searchStaff.name,
                            shopName: this.searchStaff.shopName,
                            type: this.$route.query.type
                        }
                    })
                } else {
                    this._openAlert(canSearch)
                }
            }
        },
        components: {
            Page,
            PageView
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .staff-search-con
        padding: 50px 0
        .staff-search-ul
            padding: 0 12px 50px
            .mine-input-li
                position: relative
                .selectVal
                    position: absolute
                    top: 46px
                    width: 100%
                    background: #fff
                    ul
                        li
                            padding: 6px 0
                            border-bottom-1px()
        .searchBtnArea
            .searchBtn
                height: 44px
                line-height: 44px
                border-radius: 16px
                width: 50%
                margin: 0 auto
                text-align: center
                background: #42519c
                color: #fff
</style>
