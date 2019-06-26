<template>
    <Page type="training-center-detail" ref="page">
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
                        <span>地点：</span>
                        <div class="">
                            <cube-input v-model="inputReason.addr" :disabled="true"></cube-input>
                        </div>
                    </li>
                    <!--                    /-->
                    <li class="mine-input-li">
                        <span>培训类型：</span>
                        <div class="">
                            <cube-input v-model="inputReason.type" :disabled="true"></cube-input>
                        </div>
                    </li>
                    <li class="mine-input-li">
                        <span>课题：</span>
                        <div class="">
                            <cube-input v-model="inputReason.object" :disabled="true"></cube-input>
                        </div>
                    </li>
                    <li class="mine-input-li">
                        <span>培训对象：</span>
                        <div class="">
                            <cube-input v-model="inputReason.name" :disabled="true"></cube-input>
                        </div>
                    </li>
                    <!--                    <li class="mine-input-li">-->

                    <!--                        <span>性别：</span>-->
                    <!--                        <check-radio :radioData="sexOptions" @checkRadio="checkRad($event, 'sex')"-->
                    <!--                                     :defaultSec="inputReason.sex" :disabled="true"></check-radio>-->
                    <!--                    </li>-->
                    <!--                    <li class="mine-input-li">-->
                    <!--                        <span>年龄：</span>-->
                    <!--                        <cube-input v-model="inputReason.ages" :disabled="true"></cube-input>-->
                    <!--                    </li>-->
                    <!--                    <li class="mine-input-li">-->
                    <!--                        <span>岗位：</span>-->
                    <!--                        <cube-input v-model="inputReason.job" :disabled="true"></cube-input>-->
                    <!--                    </li>-->
                    <!--老员工-->
                    <li class="mine-input-li">
                        <span>授课人：</span>
                        <cube-input v-model="inputReason.teacher" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>课时：</span>
                        <cube-input v-model="inputReason.teachTime" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>培训方式：</span>
                        <cube-input v-model="inputReason.teachWay" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>培训内容：</span>
                        <cube-input v-model="inputReason.teachCon" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>考核内容：</span>
                        <cube-input v-model="inputReason.testCon" :disabled="true"></cube-input>
                    </li>
                    <li class="mine-input-li">
                        <span>考核方式：</span>
                        <cube-input v-model="inputReason.way" :disabled="true"></cube-input>
                    </li>
                    <!--                    <li class="mine-input-li">-->
                    <!--                        <span>考核人：</span>-->
                    <!--                        <cube-input v-model="inputReason.tester" :disabled="true"></cube-input>-->
                    <!--                    </li>-->
                    <li class="mine-input-li">
                        <span>考核结果：</span>
                        <check-radio :radioData="options" @checkRadio="checkRad($event)"
                                     :defaultSec="inputReason.checkValue"></check-radio>
                    </li>
                    <li class="mine-input-li">
                        <span>培训小结：</span>
                        <div>{{inputReason.remarks}}</div>
                    </li>
                </ul>
            </div>
            <!--            <h3 class="khcj"></h3>-->
            <!--            <check-radio :radioData="options" @checkRadio="checkRad($event)"-->
            <!--                         :defaultSec="inputReason.checkValue"></check-radio>-->
            <!--            <div>-->
            <!--<div class="submitBtn">-->
            <!--<cube-button :light="true" class="cubeBtn" @click="submitForm">提交</cube-button>-->
            <!--</div>-->
        </div>
    </Page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import CheckRadio from '@/components/check-radio/check-radio'
    import TimeSelect from '@/components/time-select/time-select'
    import {formatDate} from 'common/utils'
    import {getPstrainDesc} from 'api/common'

    export default {
        name: 'training-center-detail',
        components: {
            Page,
            CheckRadio
            // TimeSelect
        },
        data: () => {
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
                    sanitation: '',
                    addr: '',
                    remarks: ''
                },
                oldOneMounth: ''
            }
        },
        created() {
            const setDa = new Date()
            this.inputReason.time = formatDate(setDa)
            this.oldOneMounth = new Date(setDa.setDate(-(31 - setDa.getDate())))
            this.getTrainData()
        },
        methods: {
            getTrainData() {
                this._openToast('查询中')
                getPstrainDesc(1, this.$route.query.type).then(res => {
                    this._closeToast()
                    this.inputReason = {
                        store: res['EB_STORENAME'],
                        storeId: res['EB_STOREID'],
                        time: res['EB_TRAINDATE'],
                        addr: res['EB_AREA'] || '',
                        type: res['EB_TRAINTYPE'],
                        object: res['EB_OBJECT'],
                        name: res['EB_MAN'],
                        teacher: res['EB_TEACHER'],
                        teachTime: res['EB_TIME'],
                        teachWay: res['EB_PTYPE'],
                        teachCon: res['EB_DESC'],
                        way: res['EB_CHECKTYPE'],
                        checkValue: res['EB_RESULT'] === '及格' ? 1 : 0,
                        remarks: res['EB_SUM'],
                        sex: res['EB_SEX'] === '男' ? 1 : 0,
                        ages: res['EB_AGE'],
                        job: res['EB_STATION'],
                        tester: res['EB_CHECKER'],
                        testCon: res['EB_DESCI']
                    }
                }).catch(err => this._reBackErr(err, '岗中培训详情'))
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
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    @require '~common/stylus/mixin'
    @require '~common/stylus/variables'
    .train-appr-con
        margin: 20px
        padding-top: 12px
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
