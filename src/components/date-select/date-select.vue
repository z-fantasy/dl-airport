<template>
    <div class="date-select">
        <div class="" :class="{hasValue: value}" @click="showDatePicker">
            {{value ? value : `选择日期`}}
        </div>
        <i class="cubeic-select arrow" v-if="arrow"></i>
    </div>
</template>

<script type="text/ecmascript-6">
    import {formatDate} from 'common/utils'

    const nowDateNum = formatDate(new Date(), 'yyyy-MM-dd').split('-').map(item => ~~item)
    export default {
        name: 'date-select',
        props: {
            type: {
                type: String,
                default: 'date'
            },
            initDate: {
                type: String,
                default: `${nowDateNum[0]}-${nowDateNum[1]}-${nowDateNum[2]}`
            },
            minDate: {
                type: Date,
                default() {
                    return new Date()
                }
            },
            maxDate: {
                type: Date,
                default() {
                    return new Date(nowDateNum[0] + 2, nowDateNum[1], nowDateNum[2])
                }
            },
            arrow: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                value: ''
            }
        },
        created() {
            this.value = formatDate(new Date(), 'yyyy-MM-dd')
        },
        watch: {
            initDate(n) {
                this.value = n
            }
        },
        methods: {
            showDatePicker() {
                if (!this.datePicker) {
                    const nowDateValue = this.initDate.match(/[^\D]+/g)
                    this.datePicker = this.$createDatePicker({
                        title: '请选择',
                        min: this.minDate,
                        max: this.maxDate,
                        value: new Date(~~nowDateValue[0], ~~nowDateValue[1], ~~nowDateValue[2]),
                        onSelect: this.selectHandle,
                        onCancel: this.cancelHandle
                    })
                }
                this.datePicker.show()
            },
            selectHandle(date, selectedVal, selectedText) {
                this.value = formatDate(new Date(date), 'yyyy-MM-dd')
                this.$emit('cTime', {type: this.type, value: selectedVal, text: selectedText})
            },
            cancelHandle() {
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .date-select
        display: flex
        justify-content : space-between
        line-height : 1.3
        .arrow
            color: #999
        .hasValue
            color: #6C6C6C
</style>
