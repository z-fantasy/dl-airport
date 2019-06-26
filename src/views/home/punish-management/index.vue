<template>
    <Page type="punish-management" ref="page">
        <div class="punish-man-con">
            <check-radio :radioData="options" @checkRadio="checkRad($event)" :defaultSec="choiceType"></check-radio>
            <div class="punish-form">
                <div class="chioseArea">
                    <div>
                        违规商户名称：
                    </div>
                    <div class="sec-cube">
                        <cube-select
                                v-model="secValue"
                                :options="secOptions">
                        </cube-select>
                    </div>
                </div>
                <div class="matterDes">
                    <p>违规事项描述：</p>
                    <div>
                        <cube-textarea
                                v-model="taValue"
                                :indicator="false"
                                :maxlength="500"
                                placeholder="请输入违规事项描述"
                                class="textAreaInput"
                        ></cube-textarea>
                    </div>
                </div>
                <div class="checkImg">
                    <div class="imgBox" :class="{noneImg: !hasChoiceImg}">
                        <img :src="choicePicture" alt="" v-show="hasChoiceImg">
                    </div>
                    <div class="choiceImg">
                        <span @click="choiceImg" class="imgBtn">选择文件</span>
                        <small>{{hasChoiceImg ? '' : '未选择照片'}}</small>
                    </div>
                </div>
                <div class="inputRea">
                    <ul>
                        <li class="mine-input-li">
                            <span>违规条例：</span>
                            <cube-input v-model="inputReason.rules"></cube-input>
                        </li>
                        <li class="mine-input-li">
                            <span>扣分：</span>
                            <cube-input v-model="inputReason.bonus"></cube-input>
                        </li>
                        <li class="mine-input-li">
                            <span>扣款金额：</span>
                            <cube-input v-model="inputReason.money" type="tel"></cube-input>
                        </li>
                        <li class="mine-input-li">
                            <span>责任人：</span>
                            <cube-input v-model="inputReason.people"></cube-input>
                        </li>
                    </ul>
                </div>
                <div class="submitBtn">
                    <cube-button :light="true" class="cubeBtn" @click="submitForm">提交</cube-button>
                </div>
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import CheckRadio from '@/components/check-radio/check-radio'
    import wx from 'weixin-js-sdk'
    import {getMallNo, punishAdd, upLoadFile} from 'api/common'

    export default {
        name: 'punish-management',
        data() {
            return {
                taValue: '',
                secOptions: [],
                secValue: '',
                options: [],
                choiceType: 0,
                choicePicture: '',
                localImgId: '',
                hasChoiceImg: false,
                inputReason: {
                    rules: '',
                    bonus: '',
                    people: '',
                    money: ''
                },
                mallData: []
            }
        },
        created() {
            this.options = ['安全类', '服务类', '规范经营类', '员工管理类', '食品安全类', '投诉类', '环境卫生类', '其他类'].map((item, index) => {
                return {label: item, value: index}
            })
            if (!this.mallData.length) {
                this._openToast()
                getMallNo().then(res => {
                    this._closeToast()
                    if (res && res.length) {
                        this.mallData = res
                        this.secOptions = res.map(item => item['EB_NAME'])
                        this.secValue = res[0]['EB_NAME']
                    } else {
                        console.log('商场号获取返回有误！')
                    }
                }).catch(errs => this._reBackErr(errs))
            }
        },
        methods: {
            checkRad(n) {
                this.choiceType = n
            },
            choiceImg() {
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: (res) => {
                        const imgId = res.localIds[0] // localId，可以用img标签显示
                        this.localImgId = imgId
//                        this.hasChoiceImg = true
//                        this.$nextTick(this.$refs.page.refresh)
                        wx.getLocalImgData({
                            localId: imgId, // 图片的localID
                            success: (baseImg) => {
                                const localData = baseImg.localData // localData是图片的base64数据，可以用img标签显示
                                this.hasChoiceImg = true
                                if (localData.indexOf('base64,') === -1) {
                                    this.choicePicture = `data:image/jpeg;base64,${localData}`
                                } else {
                                    this.choicePicture = localData
                                }
                                this.$nextTick(this.$refs.page.refresh)
                            }
                        })
                    }
                })
            },
            submitForm() {
                const storeId = this.mallData.filter(item => item['EB_NAME'] === this.secValue)[0]['EB_STOREID']
                if (!storeId) {
                    this._openAlert('未选择店铺')
                }
                const punishCon = {
                    type: this.choiceType,
                    storeId: storeId,
                    desc: this.taValue.trim(),
                    ruleAtions: this.inputReason.rules.trim(),
                    bonus: this.inputReason.bonus,
                    dutyOfer: this.inputReason.people.trim(),
                    picUrl: '',
                    money: this.inputReason.money.trim(),
                }
                const isCanSub = punishCon.desc ? punishCon.ruleAtions ? (!/\D/.test(punishCon.bonus) && punishCon.bonus) ? punishCon.money ? punishCon.dutyOfer ? this.localImgId ? '通过' : '请上传图片' : '请填写责任人' : '请填写扣款金额' : '请检查扣分' : '请填写违规条例' : '请填写违规事项描述'
                if (isCanSub !== '通过') {
                    this._openAlert(isCanSub)
                    return
                }
                if (this.hasChoiceImg && this.localImgId) {
                    // 上传图片
                    wx.uploadImage({
                        localId: this.localImgId, // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: res => {
                            const serverId = res.serverId // 返回图片的服务器端ID
                            this._openToast()
                            upLoadFile(serverId).then(fileRes => {
                                punishCon.picUrl = fileRes
                                this.subPunishAdd(punishCon)
                            }).catch(err => this._reBackErr(err))
                        }
                    })
                } else {
                    this._openToast()
                    this.subPunishAdd(punishCon)
                }
            },
            subPunishAdd(punishCon) {
                punishAdd(punishCon).then(res => {
                    this._closeToast()
                    if (res) {
                        this._openAlert('提交成功！')
                        this.initRecover()
                    } else {
                        this._openAlert('提交失败：' + res)
                    }
                }).catch(err => this._reBackErr(err))
            },
            initRecover() {
                this.inputReason = {
                    rules: '',
                    bonus: '',
                    people: ''
                }
                this.hasChoiceImg = false
                this.localImgId = ''
                this.choicePicture = ''
            }
        },
        components: {
            Page,
            CheckRadio
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .punish-man-con
        padding-bottom: 50px
        .punish-form
            padding: 0 14px
            > div
                margin-top: 14px
            .chioseArea
                display: flex
                align-items: center
                .sec-cube
                    flex: 1
            .matterDes
                .textAreaInput
                    width: 80%
                    border: 1px solid #ccc
                    outline: none
                    min-height: 200px
                    margin-top: 12px
                .cube-textarea_active
                    &::after
                        border: none
            .checkImg
                .imgBox
                    min-height: 180px
                    width: 180px
                    position: relative
                    img
                        display: block
                        width: 100%
                        height: auto
                .noneImg
                    border: 1px solid #ccc
                    &::after
                        content: '照片'
                        position: absolute
                        width: 100%
                        height: 100%
                        display: flex
                        justify-content: center
                        align-items: center
                .choiceImg
                    margin-top: 10px
                    small
                        font-size: 14px
                        color: #666
                        margin-left: 10px
                    .imgBtn
                        padding: 3px 4px
                        background: #F7F3F7
                        border: 1px solid #ccc
                        display: inline-block
                        border-radius: 3px
</style>
