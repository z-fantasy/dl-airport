<template>
    <div class="check-radio">
        <cube-radio-group v-model="selected" :options="radioData" class="checkRadio"/>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'check-radio',
        props: {
            defaultSec: {
                type: Number || String,
                default: ''
            },
            radioData: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                selected: ''
            }
        },
        created() {
            this.selected = this.defaultSec
        },
        watch: {
            defaultSec(n, o) {
                console.log('defaultSec:', n)
                this.selected = n
            },
            selected: {
                deep: true,
                handler(n, o) {
                    this.$emit('checkRadio', n)
                }
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    /deep/ .cube-radio
        display: inline-block
    /deep/ .border-bottom-1px
        &::after
            border: none
</style>
