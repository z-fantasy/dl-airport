<template>
    <div>
        <h4 class="sqcTitle">{{`${index + 1}.${question}${selectType ? '(多选)' : '(单选)'}`}}</h4>
        <cube-checkbox-group v-model="checkList" :options="options" @checked="checkedFun" @cancel-checked="cancelCheckFun"/>
    </div>
</template>

<script>
    export default {
        name: "survey-question-cmt",
        props: {
            question: {
                type: String,
                default: ''
            },
            selectType: {
                type: Boolean,
                default: () => {
                    return false
                } // 单选多选，默认单选
            },
            answers: {
                type: Array,
                default: () => {
                    return []
                }
            },
            id: {
                type: String,
                default: ''
            },
            index: {
                type: Number,
                default: 0
            }
        },
        data: () => {
            return {
                checkList: [],
                options: []
            }
        },
        created() {
            this.options = this.answers
        },
        methods: {
            checkedFun(val) {
                if (!this.selectType) {
                    setTimeout(() => {
                        this.checkList = [val]
                    }, 50)
                }
            },
            cancelCheckFun(val) {
                // console.log(val)
            }
        },
        watch: {
            answers(n, o) {
                if (n.length) {
                    this.checkList = []
                    this.options = n
                }
            },
            checkList(n) {
                this.$emit('questionSet', {id: this.id, value: n, index: this.index})
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .sqcTitle
        padding: 14px
    >>>.cube-checkbox-wrap
        line-height: 1.3
</style>
