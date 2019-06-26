<template>
    <div class="staff-info-content">
        <div class="staff-main-info">
            <ul>
                <li>
                    <span class="info-tit">姓名：</span><span class="info-desc">{{staffInfo.name}}</span>
                </li>
                <li>
                    <span class="info-tit">性别：</span><span class="info-desc">{{staffInfo.name}}</span>
                </li>
                <li>
                    <span class="info-tit">年龄：</span><span class="info-desc">{{staffInfo.years}}</span>
                </li>
                <li>
                    <span class="info-tit">职务/岗位：</span><span class="info-desc">{{staffInfo.job}}</span>
                </li>
                <li>
                    <span class="info-tit">手机号：</span><span class="info-desc">{{staffInfo.mobile}}</span>
                </li>
                <li class="sort">
                    <span class="info-tit">身份证号码：</span><span class="info-desc">{{staffInfo.idCard}}</span>
                </li>
                <li>
                    <span class="info-tit">户籍所在地：</span><span class="info-desc">{{staffInfo.censusReg}}</span>
                </li>
                <li>
                    <span class="info-tit">现住址：</span><span class="info-desc">{{staffInfo.address}}</span>
                </li>
                <li>
                    <span class="info-tit">入职时间：</span><span class="info-desc">{{staffInfo.inJob.split(' ')[0].replace(/\//g, '-')}}</span>
                </li>
                <li>
                    <span class="info-tit">离职时间：</span><span class="info-desc">{{staffInfo.outJob.split(' ')[0].replace(/\//g, '-')}}</span>
                </li>
                <li>
                    <span class="info-tit">健康证编号：</span><span class="info-desc">{{staffInfo.healthNo}}</span>
                </li>
                <li>
                    <span class="info-tit">健康证开始时间：</span><span class="info-desc">{{staffInfo.healthStar.split(' ')[0].replace(/\//g, '-')}}</span>
                </li>
                <li>
                    <span class="info-tit">健康证结束时间：</span><span class="info-desc">{{staffInfo.healthEnd.split(' ')[0].replace(/\//g, '-')}}</span>
                </li>
                <li>
                    <span class="info-tit">隔离区证件编号：</span><span class="info-desc">{{staffInfo.glqId}}</span>
                </li>
                <li>
                    <span class="info-tit">工作商铺编号：</span><span class="info-desc">{{staffInfo.jobShopId}}</span>
                </li>
                <li>
                    <span class="info-tit">工作商铺名称：</span><span class="info-desc">{{staffInfo.jobShopName}}</span>
                </li>
            </ul>
        </div>
        <!--v-if="searchType"-->
        <div class="staff-main-img">
            <div class="staff-add-img" :class="{noImg: searchType && !staffInfo.picture && !localImgId}" @click="imgHandler">
                <img :src="choicePicture || staffInfo.picture" alt="暂无图片" class="staff-hander-img">
            </div>
        </div>
        <div class="sureBtn" v-if="searchType && !staffInfo.picture" @click="addMinePicture"> 确 定 </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {fetchUserInfo} from 'api/user'
    import {mapGetters} from 'vuex'
    import {changeUserImg} from 'api/user'
    import wx from 'weixin-js-sdk'
    export default {
        name: 'staff-info',
        data() {
            return {
                searchType: 0,
                staffInfo: {
                    name: '',
                    sex: '',
                    years: '',
                    job: '',
                    mobile: '',
                    idCard: '',
                    censusReg: '',
                    address: '',
                    inJob: '',
                    outJob: '',
                    healthNo: '',
                    healthStar: '',
                    healthEnd: '',
                    glqId: '',
                    jobShopId: '',
                    jobShopName: '',
                    staffNo: '',
                    picture: ''
                },
                hasChoiceImg: false,
                choicePicture: '',
                localImgId: ''
            }
        },
        mounted() {
            const searchType = this.$route.query
            console.log(searchType)
            if (searchType && searchType.type) {
                this.searchType = ~~searchType.type
                this._openToast()
                if (this.$route.query.type === '0') {
                    this.getStaffInfoms({loginName: searchType.name, shopName: searchType.shopName})
                } else {
                    this.getStaffInfoms({loginName: this.loginAccount.loginName})
                }
            } else {
                this._reBackErr('未获取到查询参数！', '提示', () => {
                    this.$router.back()
                })
            }
        },
        methods: {
            getStaffInfoms(data) {
                fetchUserInfo(data).then(res => {
                    console.log(res)
                    this._closeToast()
                    this.setStaffData(res)
                }).catch(err => this._reBackErr(err))
            },
            addMinePicture() {
                wx.uploadImage({
                    localId: this.localImgId, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: (res) => {
                        const serverId = res.serverId; // 返回图片的服务器端ID
                        this._openToast()
                        changeUserImg(serverId).then(saveRes => {
                            this._closeToast()
                            if (saveRes) {
                                this.getStaffInfoms({loginName: this.loginAccount.loginName})
                                this._openAlert('图片保存成功！')
                            } else {
                                console.log(saveRes)
                                this._openAlert('图片报错失败')
                            }
                        }).catch(err => this._reBackErr(err, '保存图片失败'))
                    }
                })
            },
            setStaffData(res) {
                if (!res || !res['STR_USER_CODE']) {
                    this._openAlert('未查询到信息！')
                    return
                }
                this.staffInfo = {
                    name: res['STR_LOGIN_NAME'],
                    sex: res['STR_SEX'],
                    years: res['EB_AGE'] || '暂无',
                    job: res['EB_BUSINESS'] || '暂无',
                    mobile: res['STR_MOBILEPHONE'] || '暂无',
                    idCard: res['STR_IDENTIYCARD'] || '暂无',
                    censusReg: res['STR_ADDRESS'] || '暂无',
                    address: res['STR_ADDRESS2'] || '暂无',
                    inJob: res['STR_ENTRY_DATE'] || '暂无',
                    outJob: res['STR_LEAVEDATE'] || '暂无',
                    healthNo: res['EB_HEALTHY'] || '暂无',
                    healthStar: res['EB_HEALTHYSTA'] || '暂无',
                    healthEnd: res['EB_HEALTHYEND'] || '暂无',
                    glqId: res['EB_QUARANTINE'] || '暂无',
                    jobShopId: res['STR_MALL_CODE'] || '暂无',
                    jobShopName: res['EB_NAME'] || '暂无',
                    staffNo: res['STR_USER_CODE'],
                    picture: res['STR_TEXT'] ? this.imgPrefix + res['STR_TEXT'] : ''
                }
                console.log(this.staffInfo.picture)
                this.$emit('searchOver', true)
            },
            imgHandler() {
                if (this.staffInfo.picture) {
                    // 有图片
                    this.zoomImg()
                } else if (this.searchType) {
                    wx.chooseImage({
                        count: 1, // 默认9
                        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                        success: (res) => {
                            const imgId = res.localIds[0] // localId，可以用img标签显示
                            this.localImgId = imgId
//                                this.hasChoiceImg = true
//                                this.$nextTick(this.$refs.page.refresh)
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
                }
            },
            zoomImg() {
                if (this.staffInfo.picture) {
                    const pictureUrl = this.imgPrefix + this.staffInfo.picture
                    wx.previewImage({
                        current: pictureUrl, // 当前显示图片的http链接
                        urls: [pictureUrl] // 需要预览的图片http链接列表
                    })
                }
            }
        },
        computed: {
            ...mapGetters([
                'loginAccount'
            ])
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .staff-info-content
        position: relative
        margin: 0 12px
        padding: 12px 0
        font-size: 14px
        .staff-main-info
            ul li
                padding: 8px 0
        .staff-main-img
            position: absolute
            top: 12px
            right: 0px
            width: 120px
            border: 1px solid #ccc
            min-height: 146px
            height: auto
            .staff-add-img
                width: 100%
                min-height: 146px
                img
                    width: 100%
                    height: auto
                    position: relative
            .noImg
                position: relative
                &::after
                    content: '添 加 照 片'
                    position: absolute
                    left: 50%
                    top: 50%
                    margin-left: -35px
                    margin-top: -10px
        .sureBtn
            width: 100px
            height: 40px
            line-height: 40px
            margin: 0 auto
            border: 1px solid #ccc
            border-radius: 14px
            font-size: 16px
            text-align: center
</style>
