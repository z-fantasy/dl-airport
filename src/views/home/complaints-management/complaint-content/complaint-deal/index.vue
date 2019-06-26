<template>
    <Page type="complaint-deal" ref="page">
        <div class="complaint-deal-con">
            <p class="subTit">{{subType ? '改善措施：' : '商家处理：'}}</p>
            <cube-textarea
                    v-model="value"
                    class="cube-textarea-con"
                    :maxlength="textAreaOpa.maxlength"
                    :placeholder="textAreaOpa.placeholder"
                    :indicator="textAreaOpa.indicator"
            ></cube-textarea>
            <div class="submitBtn">
                <cube-button :light="true" class="cubeBtn" @click="editComp">提交</cube-button>
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import {editComplaintDet} from 'api/common'
    export default {
        name: 'complaint-deal',
        data() {
            return {
                value: '',
                subType: '',
                subId: '',
                textAreaOpa: {
                    indicator: false,
                    maxlength: 1000,
                    placeholder: '请输入内容'
                }
            }
        },
        created() {
            this.subType = ~~this.$route.query.type
            this.subId = this.$route.query.valId
        },
        methods: {
            editComp() {
                if (this.value.trim()) {
                    this._openToast()
                    editComplaintDet({
                        text: this.value,
                        type: this.subType,
                        id: this.subId
                    }).then(res => {
                        this._closeToast()
                        if (res) {
                            this._reBackErr('提交成功！', '提示', () => {
                                this.$router.back()
                            })
                        } else {
                            this._reBackErr('提交失败！')
                        }
                    }).catch(err => this._reBackErr(err))
                } else {
                    this._openAlert('请输入需提交的内容！')
                }
            }
        },
        components: {
            Page
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .complaint-deal-con
        padding: 20px
        .subTit
            padding: 20px 0
        .cube-textarea-con
            border-radius : 12px
            min-height: 250px
</style>
