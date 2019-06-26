<template>
    <Page type="polling-management" ref="page">
        <div class="polling-man-cont">
            <div class="polling-con">
                <div class="chioseArea">
                    <div>
                        巡检地点：
                    </div>
                    <div class="sec-cube">
                        <cube-select
                                v-model="secValue"
                                :options="secOptions">
                        </cube-select>
                    </div>
                </div>
                <div class="matterDes">
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
                <div class="submitBtn">
                    <cube-button :light="true" class="cubeBtn" @click="submitForm">提交</cube-button>
                </div>
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import wx from 'weixin-js-sdk'
    import {inspecAdresList, inspecAdd, upLoadFile} from 'api/common'

    export default {
        name: 'polling-management',
        data() {
            return {
                taValue: '',
                secOptions: [],
                secValue: '',
                choicePicture: '',
                localImgId: '',
                hasChoiceImg: false,
                addressList: []
            }
        },
        created() {
            if (!this.addressList.length) {
                inspecAdresList().then(res => {
                    this.secOptions = res.map(item => item['EB_NAME'])
                    this.secValue = this.secOptions[0]
                    this.addressList = res
                })
            }
        },
        methods: {
            choiceImg() {
                wx.chooseImage({
                    count: 1, // 默认9
                    success: (res) => {
                        console.log('=======>')
                        const imgId = res.localIds[0] // localId，可以用img标签显示
                        this.localImgId = imgId
                        console.log(this.localImgId)
                        this.hasChoiceImg = true
                        this.$nextTick(this.$refs.page.refresh)
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
                const inspecCon = {
                    address: this.addressList.filter(item => item['EB_NAME'] === this.secValue)[0]['EB_ID'],
                    desc: this.taValue.trim(),
                    picUrl: ''
                }
                const isCanSub = inspecCon.address ? inspecCon.desc ? this.localImgId ? '通过' : '请上传图片' : '请填写事项描述' : '请选择巡检地址'
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
                                inspecCon.picUrl = fileRes
                                this.pollSubAdd(inspecCon)
                            }).catch(err => this._reBackErr(err))
                        }
                    })
                } else {
                    this._openToast()
                    this.pollSubAdd(inspecCon)
                }
            },
            pollSubAdd(inspecCon) {
                inspecAdd(inspecCon).then(res => {
                    this._closeToast()
                    if (res) {
                        this._openAlert('提交成功！')
                        this.initRecover()
                    } else {
                        this._openAlert('提交失败:' + res)
                    }
                }).catch(err => this._reBackErr(err))
            },
            initRecover() {
                this.taValue = ''
                this.hasChoiceImg = false
                this.localImgId = ''
                this.choicePicture = ''
            }
        },
        components: {
            Page
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .polling-man-cont
        padding-bottom: 50px
        .polling-con
            padding:14px 14px
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
            .cubeBtn
                border-radius: 20px
</style>
