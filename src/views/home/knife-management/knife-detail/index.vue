<template>
    <Page type="knife-detail" ref="page">
        <div class="knife-detail-con">
            <table border="1" class="table-knife">
                <tr>
                    <th>品种</th>
                    <th>型号</th>
                    <th>规格</th>
                    <th>数量</th>
                    <th>编号</th>
                </tr>
                <tr>
                    <td>{{kDetail.varieties}}</td>
                    <td>{{kDetail.model}}</td>
                    <td>{{kDetail.spfas}}</td>
                    <td>{{kDetail.qty}}</td>
                    <td>{{kDetail.toolid}}</td>
                </tr>
            </table>
            <div class="knife-picture-box">
                <div class="imgBox" :class="{noneImg: !knifePic.localId && !knifePic.lineSrc}">
                    <img :src="knifePic.localId || knifePic.lineSrc" alt="" v-show="knifePic.localId || knifePic.lineSrc" @click="previewImg(0)">
                </div>
                <span @click="choiceImg(0)" class="imgBtn">上传文件</span>
            </div>
            <div class="steel-picture-box">
                <div class="imgBox" :class="{noneSteelImg: !steelPic.localId && !steelPic.lineSrc}">
                    <img :src="steelPic.localId || steelPic.lineSrc" alt="" v-show="steelPic.localId || steelPic.lineSrc" @click="previewImg(1)">
                </div>
                <span @click="choiceImg(1)" class="imgBtn">上传文件</span>
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import {getKnifeDetail, upKnifeFile, upLoadFile, getSteelDetail} from 'api/common'
    import wx from 'weixin-js-sdk'
    export default {
        name: 'knife-detail',
        data() {
            return {
                knifePic: {
                    localId: '',
                    lineSrc: ''
                },
                steelPic: {
                    localId: '',
                    lineSrc: ''
                },
                kDetail: {
                    id: '',
                    varieties: '',
                    model: '',
                    spfas: '',
                    qty: '',
                    toolid: '',
                    toolpic: ''
                },
                knifeId: ''
            }
        },
        created() {
          if (this.$route.query.type) {
              this.knifeId = this.$route.query.type
              this.getDetailData()
              this.getSteelImg()
          } else {
              this._reBackErr('未获取到刀具编号！', '提示', () => {
                  this.$router.back()
              })
          }
        },
        methods: {
            getDetailData() {
                this._openToast()
                getKnifeDetail(this.knifeId).then(res => {
                    this._closeToast()
                    if (res['EB_ID']) {
                        this.kDetail = {
                            id: res['EB_ID'],
                            varieties: res['EB_VARIETIES'],
                            model: res['EB_MODEL'],
                            spfas: res['EB_SPECIFICATIONS'],
                            qty: res['EB_QTY'],
                            toolid: res['EB_TOOLID'],
                            toolpic: res['EB_TOOLPIC'] ? this.imgPrefix + res['EB_TOOLPIC'] : ''
                        }
                        this.knifePic = {
                            localId: '',
                            lineSrc: this.kDetail.toolpic
                        }
                        this.$nextTick(() => {
                            setTimeout(() => {
                                this.$refs.page.refresh()
                            }, 1000)
                        })
                    } else {
                        this._openAlert('获取刀具详情返回数据异常！')
                        this.kDetail = {}
                    }
                }).catch(err => this._reBackErr(err))
            },
            getSteelImg() {
                getSteelDetail(this.knifeId).then(res => {
                    this._closeToast()
                    this.steelPic = {
                        localId: '',
                        lineSrc: res['EB_PIC'] ? this.imgPrefix + res['EB_PIC'] : res['EB_PIC']
                    }
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.$refs.page.refresh()
                        }, 1000)
                    })
                }).catch(err => this._reBackErr(err))
            },
            choiceImg(upType) {
                wx.chooseImage({
                    count: 1, // 默认9
                    success: (res) => {
                        const imgId = res.localIds[0] // localId，可以用img标签显示
                        wx.uploadImage({
                            localId: imgId, // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: res => {
                                const serverId = res.serverId // 返回图片的服务器端ID
                                this._openToast()
                                upLoadFile(serverId).then(fileRes => {
                                    upKnifeFile(this.kDetail.id, upType, fileRes).then(upRes => {
                                        if (upRes) {
                                            if (upType) {
                                                this.getSteelImg()
                                            } else {
                                                this._closeToast()
                                                this.getDetailData()
                                            }
                                        } else {
                                            this._openAlert('修改失败')
                                        }
                                    }).catch(err => this._reBackErr(err, '修改详情'))
                                }).catch(err => this._reBackErr(err, '提交图片'))
                            }
                        })
                    }
                })
            },
            previewImg(imgType) {
                const nedShowSrc = imgType ? this.steelPic.lineSrc : this.knifePic.lineSrc
                if (nedShowSrc) {
                    wx.previewImage({
                        current: nedShowSrc, // 当前显示图片的http链接
                        urls: [nedShowSrc] // 需要预览的图片http链接列表
                    })
                }
            }
        },
        components: {
            Page
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/mixin'
    .knife-detail-con
        padding-bottom: 42px
        padding-top: 1px
        .table-knife
            margin: 12px
            tr
                text-align: center
                th, td
                    border: 1px solid #ccc
                    padding: 6px 2px
                    text-align: center
                    font-break()
                    width: 20%
                td
                    font-size: 14px
        .knife-picture-box, .steel-picture-box
            display: flex
            flex-direction : column
            justify-content : center
            align-items : center
            padding-bottom: 14px
            .imgBox
                min-height: 180px
                width: 180px
                position: relative
                img
                    display: block
                    width: 100%
                    height: auto
            .noneImg, .noneSteelImg
                border: 1px solid #ccc
                &::after
                    content: '刀具照片'
                    position: absolute
                    width: 100%
                    height: 100%
                    display: flex
                    justify-content: center
                    align-items: center
            .noneSteelImg
                &::after
                    content: '保险柜照片'
            .imgBtn
                margin-top: 10px
                padding: 3px 4px
                background: #F7F3F7
                border: 1px solid #ccc
                display: inline-block
                border-radius: 3px
</style>
