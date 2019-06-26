<template>
    <div class="checkbox-group">
        <ul class="checkbox-group-ul">
            <li class="checkbox-group-li" v-for="(item, index) in checkOption" v-bind:key="index">
                <cube-checkbox v-model="item.checked" :option="item" :shape="shape"/>
            </li>
        </ul>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'checkbox-group',
        props: {
            shape: {
                type: String,
                default: 'square'
            },
            checkOption: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {}
        },
        watch: {
            checkOption: {
                deep: true,
                handler(n, o) {
                    this.$emit('checkGroup', n.filter(item => item.checked))
                }
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .checkbox-group-li
        display: inline-block
</style>
