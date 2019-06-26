<template>
    <ul class="handUi">
        <li class="handLi" v-for="(item, index) in linkData" v-bind:key="index">
            <div class="routerLinkBtn" :class="{medium, large}">
                <div class="routerLinkText" @click="ruleDetail(item)">
                    {{item.label}}
                </div>
            </div>
        </li>
        <li class="noData" v-if="!(linkData.length)">
            <no-data></no-data>
        </li>
    </ul>
</template>

<script type="text/ecmascript-6">
    import NoData from '@/components/no-data/no-data'
    import {userMixin} from '@/common/mixins/user'
    export default {
        name: 'router-button',
        mixins: [userMixin],
        props: {
            medium: {
                type: Boolean,
                default: false
            },
            large: {
                type: Boolean,
                default: false
            },
            linkData: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {}
        },
        methods: {
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
                if (clify.type) {
                    if (clify.type === 'loginOut') {
                        this.clearUserInfo()
                        this.clearAccount()
                        // this.$router.back(-2)
                        // window.location.href = window.location.href.split('#/')[0]
                        this.$router.push({
                            name: 'staff-management'
                        })
                    }
                } else {
                    this.$router.push({
                        name: clify.route,
                        query: queryRou
                    })
                }
            }
        },
        components: {
            NoData
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/variables'
    @require '~common/stylus/mixin'
    .handUi
        .handLi
            .routerLinkBtn
                text-align : center
                border-radius : 12px
                color: #666
                line-height : 1.3 // 32px
                min-height: 32px
                width: 50%
                margin: 12px auto 0
                background: $color-main
                /*txt-overflow-1()*/
            .medium
                border-radius : 14px
                /*line-height : 36px*/
                min-height: 36px
                color: #333
                background: transparent
                border: 1px solid #ccc
                margin: 14px auto 0
            .large
                margin: 16px auto 0
                color: #333
                border-radius : 16px
                /*line-height : 40px*/
                min-height: 40px
                background: transparent
                border: 1px solid #ccc
            .routerLinkText
                padding: 8px 10px
</style>
