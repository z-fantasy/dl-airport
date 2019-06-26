<template>
    <Page type="training-appraisal" ref="page">
        <div class="train-appr-con">
            <div class="inputRea">
                <ul>
                    <li class="mine-input-li">
                        <span>考核时间：</span>
                        <div class="">
<!--                            <time-select @cTime="cTime($event)" :initDate="inputReason.time" :minDate="oldOneMounth" :disabled="true"></time-select>-->
                            <cube-input v-model="inputReason.time" :disabled="true"></cube-input>
                        </div>
                    </li>
                    <li class="mine-input-li">
                        <span>工作商铺编号：</span>
                        <cube-input v-model="inputReason.storeId" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>工作商铺名称：</span>
                        <cube-input v-model="inputReason.store" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>员工姓名：</span>
                        <cube-input v-model="inputReason.name" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>性别：</span>
                        <check-radio :radioData="sexOptions" @checkRadio="checkRad($event, 'sex')"
                                     :defaultSec="inputReason.sex" :disabled="true"></check-radio>
                    </li>
                    <li class="mine-input-li">
                        <span>年龄：</span>
                        <cube-input v-model="inputReason.ages" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>岗位：</span>
                        <cube-input v-model="inputReason.job" :disabled="true"></cube-input>
                    </li>
                    <!--老员工-->
                    <li class="mine-input-li" v-show="testType">
                        <span>考核方式：</span>
                        <cube-input v-model="inputReason.way" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li" v-show="testType">
                        <span>授课人：</span>
                        <cube-input v-model="inputReason.teacher" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li" v-show="testType">
                        <span>考核人：</span>
                        <cube-input v-model="inputReason.tester" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li" v-show="testType">
                        <span>考核内容：</span>
                        <cube-input v-model="inputReason.testCon" :disabled="true"></cube-input>
                    </li>
                    <!--新员工-->
                    <h3 class="khcj" v-show="!testType">考核成绩</h3>
                    <li class="mine-input-li" v-show="!testType">
                        <span>安全：</span>
                        <cube-input v-model="inputReason.safety" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li" v-show="!testType">
                        <span>服务：</span>
                        <cube-input v-model="inputReason.serves" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li" v-show="!testType">
                        <span>食品安全卫生：</span>
                        <cube-input v-model="inputReason.sanitation" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li" v-show="!testType">
                        <span>考核结果：</span>
                        <check-radio :radioData="options" @checkRadio="checkRad($event)"
                                     :defaultSec="inputReason.checkValue"></check-radio>
                    </li>
                </ul>
            </div>
<!--            <h3 class="khcj">考核结果</h3>-->
<!--            <check-radio :radioData="options" @checkRadio="checkRad($event)"-->
<!--                         :defaultSec="inputReason.checkValue"></check-radio>-->
            <!--<div class="submitBtn">-->
                <!--<cube-button :light="true" class="cubeBtn" @click="submitForm">提交</cube-button>-->
            <!--</div>-->
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import CheckRadio from '@/components/check-radio/check-radio'
    // import TimeSelect from '@/components/time-select/time-select'
    import {formatDate} from 'common/utils'
    import {pstrainAdd, getPstrainDesc} from 'api/common'

    export default {
        name: 'training-appraisal',
        data() {
            return {
                options: [
                    {
                        label: '合格',
                        value: 1,
                        disabled: true
                    },
                    {
                        label: '不合格',
                        value: 0,
                        disabled: true
                    }
                ],
                sexOptions: [
                    {
                        label: '男',
                        value: 1,
                        disabled: true
                    },
                    {
                        label: '女',
                        value: 0,
                        disabled: true
                    }
                ],
                inputReason: {
                    store: '',
                    name: '',
                    sex: 1,
                    ages: '',
                    job: '',
                    time: '',
                    way: '',
                    teacher: '',
                    tester: '',
                    testCon: '',
                    checkValue: 0,
                    safety: '',
                    serves: '',
                    sanitation: ''
                },
                testType: 0, // 0新员工
                oldOneMounth: ''
            }
        },
        created() {
            const setDa = new Date()
            this.inputReason.time = formatDate(setDa)
            this.oldOneMounth = new Date(setDa.setDate(-(31 - setDa.getDate())))
            if (this.$route.query.type) this.testType = ~~this.$route.query.type
            this.getTrainData()
        },
        methods: {
            getTrainData() {
                this._openToast()
                getPstrainDesc(this.testType).then(res => {
                    this._closeToast()
                    if (!res['EB_RESULT']) {
                        this._reBackErr('未获取到有效相关考核资料！', '提示', () => {
                            this.$router.back()
                        })
                        console.log(res)
                        return
                    }
                    if (this.testType) {
                        this.inputReason = {
                            store: res['EB_STORENAME'],
                            storeId: res['EB_STOREID'],
                            name: res['EB_NAME'],
                            sex: res['EB_SEX'] === '男' ? 1 : 0,
                            ages: res['EB_AGE'],
                            job: res['EB_STATION'],
                            time: res['EB_TRAINDATE'],
                            way: res['EB_CHECKTYPE'],
                            teacher: res['EB_TEACHER'],
                            tester: res['EB_CHECKER'],
                            testCon: res['EB_DESCI'],
                            checkValue: res['EB_RESULT'] === '及格' ? 1 : 0
                        }
                    } else {
                        this.inputReason = {
                            store: res['EB_STORENAME'],
                            storeId: res['EB_STOREID'],
                            name: res['EB_NAME'],
                            sex: res['EB_SEX'] === '男' ? 1 : 0,
                            ages: res['EB_AGE'],
                            job: res['EB_STATION'],
                            time: res['EB_TRAINDATE'],
                            checkValue: res['EB_RESULT'] === '及格' ? 1 : 0,
                            safety: res['EB_SAFE'],
                            serves: res['EB_SERVICE'],
                            sanitation: res['EB_FOODSAFE']
                        }
                    }
                }).catch(err => this._reBackErr(err))
            },
            clearTestCon() {
                const initInputText = {
                    store: '',
                    name: '',
                    sex: 1,
                    ages: '',
                    job: '',
                    way: '',
                    teacher: '',
                    tester: '',
                    testCon: '',
                    checkValue: 1,
                    safety: '',
                    serves: '',
                    sanitation: ''
                }
                this.inputReason = Object({}, this.inputReason, initInputText)
            },
            cTime(e) {
                this.inputReason.time = e.selectedText
            },
            checkRad(n, isSex) {
                if (isSex && isSex === 'sex') {
                    this.inputReason.sex = n
                } else {
                    this.inputReason.checkValue = n
                }
            },
            submitForm() {
                const subData = this.inputReason
                const canSub = subData.store ? subData.name.trim() ? !(/\D/.test(subData.ages)) ? subData.job.trim() ? '通过' : '工作岗位未填写！' : '请仔细检查核对年龄！' : '员工姓名未填写！' : '工作店铺编号未填写！'
                if (canSub === '通过') {
                    this._openToast()
                    pstrainAdd(subData,this.testType).then(res => {
                        this._closeToast()
                        if (res) {
                            this._openToast('提交成功！', {mask: false, time: 1500, type: 'correct'})
                            this.clearTestCon()
                        } else {
                            this._openAlert(`提交失败：${res}`)
                        }
                    }).catch(err => this._reBackErr(err))
                } else {
                    this._openAlert(canSub)
                }
            }
        },
        components: {
            Page,
            CheckRadio
            // TimeSelect
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/mixin'
    @require '~common/stylus/variables'
    .train-appr-con
        margin: 20px
        padding-bottom: 50px
        .khcj
            line-height: 2
        .time
            padding: 10px 0
            flex: 1
            border-bottom-1px()
    >>> .cube-radio_selected .cube-radio-ui i:before
                background-color: $bdr-color-purple
    >>> .cube-radio-group
        &::before
            border: none
        &::after
            border: none
</style>
