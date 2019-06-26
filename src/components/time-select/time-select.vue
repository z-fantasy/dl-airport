<template>
    <div class="date-select">
        <div class="" :class="{hasValue: value}" @click="showDatePicker">
            {{value ? value : `选择时间`}}
        </div>
        <i class="cubeic-select arrow" v-if="arrow"></i>
    </div>
</template>

<script type="text/ecmascript-6">
    import {formatDate} from 'common/utils'
    export default {
        name: 'time-select',
        props: {
            type: {
                type: String,
                default: 'date'
            },
            timeShowType: {
                type: String,
                default: 'yyyy-MM-dd'
            },
            initDate: {
                type: String || Date,
                default() {
                    return new Date()
                }
            },
            minDate: {
                type: Date,
                default() {
                    return new Date()
                }
            },
            arrow: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                value: ''
            }
        },
        mounted() {
            if (this.initDate && (typeof this.initDate === 'string')) {
                this.value = formatDate(new Date(this.initDate.replace(/\//g, '-')), this.timeShowType)
            } else {
                this.value = formatDate(this.initDate, this.timeShowType)
            }
        },
        watch: {
            initDate(n) {
                if (typeof n === 'string') {
                    this.value = formatDate(new Date(n.replace(/\//g, '-')), this.timeShowType)
                } else {
                    this.value = formatDate(n, this.timeShowType)
                }
            }
        },
        methods: {
            showDatePicker() {
                if (this.disabled) return
                if (!this.dateTimePicker) {
                    this.dateTimePicker = this.$createDatePicker({
                        title: '请选择',
                        min: this.minDate,
                        max: new Date(),
                        value: new Date(),
                        columnCount: 6,
                        onSelect: this.selectHandle,
                        onCancel: this.cancelHandle
                    })
                }
                this.dateTimePicker.show()
            },
            selectHandle(date, selectedVal, selectedText) {
                this.value = formatDate(new Date(date), this.timeShowType)
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

