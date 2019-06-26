<template>
    <Page type="survey-detail" ref="page">
        <div class="survey-content">
            <div v-if="questionArray.length">
                <h3></h3>
                <ul>
                    <li v-for="(item, index) in questionArray" v-bind:key="item.id">
                        <survey-question-cmt :index="index" :id="item.id" :question="item.question" :answers="item.answers" :selectType="item.selectType ? true : false" @questionSet="questionSetFun"></survey-question-cmt>
                    </li>
                </ul>
                <div class="sureBtn" @click="submitForm"> 提 交 </div>
            </div>
            <div class="noData" v-else>
                <no-data></no-data>
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import SurveyQuestionCmt from '@/components/survey-question-cmt/survey-question-cmt'
    import NoData from '@/components/no-data/no-data'
    import {getSurveyData, submitSurQue} from '@/api/common'
    import {uuid} from '@/api/config'
    import {userMixin} from '@/common/mixins/user'
    export default {
        name: 'survey-detail',
        mixins:[userMixin],
        components: {
            Page,
            SurveyQuestionCmt,
            NoData
        },
        data: () => {
            return {
                questionArray: [],
                answers: []
            }
        },
        created() {
            this.getSurveyDetail()
        },
        methods: {
            getSurveyDetail() {
                this._openToast()
                getSurveyData(this.$route.query.type).then(res => {
                    const surveyData = res.QuestionList
                    this.questionArray = surveyData.map(item => {
                        return {
                            question: item.QuestionContent,
                            id: item.QuestionCode,
                            answers: item.OptionList.map(ansItem => {
                                return {
                                    label: ansItem.OptionContent,
                                    value: ansItem.OptionCode
                                    // disabled: true
                                }
                            }),
                            selectType: item.Type === '单选' ? false : true
                        }
                    });
                    this.answers = surveyData.map(item => {
                        return {
                            id: item.QuestionCode,
                            question: item.QuestionContent,
                            answer: [],
                            checked: false
                        }
                    });
                    setTimeout(() => {
                        this.$refs.page.refresh()
                    }, 30)
                    this._closeToast()
                }).catch(err => this._reBackErr(err, '问卷详情'))
            },
            submitForm() {
                let eheckAll = ''
                const ansArr = this.answers
                for (let i = 0; i < ansArr.length; i++) {
                    if (!ansArr[i]['checked']) {
                        eheckAll += eheckAll ? `,${i + 1}` : (i + 1)
                    }
                }
                if (eheckAll) {
                    this._openAlert(`请完善表问卷第${eheckAll}题后提交！`)
                } else {
                    this._openToast('提交中')
                    let subData = []
                    for (let i = 0; i < ansArr.length; i++) {
                        for (let x = 0; x < ansArr[i]['answer'].length; x++) {
                            subData.push({
                                "EB_PAPER_CODE": this.$route.query.type,
                                "EB_QUESTION_CODE": ansArr[i]['id'],
                                "EB_OPTION_CODE": ansArr[i]['answer'][x],
                                "EB_CREATEBY": this.userInfo.code,
                                "EB_LASTMODIFYBY": this.userInfo.code,
                                "EB_VIP_PAPER_CODE": new Date().getTime() + uuid(10, 10),
                                "XF_VIPCODE": this.userInfo.code
                            })
                        }
                    }
                    // {
                    // "EB_PAPER_CODE":"问卷编号",
                    //     "EB_QUESTION_CODE":"题目编号",
                    //     "EB_OPTION_CODE":"选项编号",
                    //     "EB_CREATEBY":"员工编号",
                    //     "EB_LASTMODIFYBY":"员工编号",
                    //     "EB_VIP_PAPER_CODE":"给个不重复的值就行",
                    //     "XF_VIPCODE":"员工编号"
                    // }
                    submitSurQue(subData).then(res => {
                        this._closeToast()
                        this._openAlert('提交成功！', {
                            onConfirm: () => {
                                this.$router.back()
                            }
                        })
                    }).catch(err => this._reBackErr(err, '问卷提交'))
                }
            },
            questionSetFun(evt) {
                this.answers[evt.index]['answer'] = evt.value
                this.answers[evt.index]['checked'] = evt.value.length ? true : false
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .survey-content
        padding: 14px 44px 14px 14px
        .sureBtn
            width: 100px
            height: 40px
            line-height: 40px
            margin: 40px auto
            border: 1px solid #ccc
            border-radius: 14px
            font-size: 16px
            text-align: center
</style>
