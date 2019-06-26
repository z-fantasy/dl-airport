<template>
    <page type="change-passwrod" ref="page">
        <div class="change-password-content">
            <ul>
                <li class="mine-input-li">
                    <span>旧密码：</span>
                    <cube-input
                            v-model="oldPs"
                            placeholder="请输入旧密码"
                            type="text"
                    ></cube-input>
                </li>
                <li class="mine-input-li">
                    <span>新密码：</span>
                    <cube-input
                            v-model="nowPS.value"
                            :placeholder="nowPS.placeholder"
                            :type="nowPS.type"
                            :maxlength="nowPS.maxlength"
                            :readonly="nowPS.readonly"
                            :disabled="nowPS.disabled"
                            :autofocus="nowPS.autofocus"
                            :autocomplete="nowPS.autocomplete"
                            :eye="nowPS.eye"
                    ></cube-input>
                </li>
                <li class="mine-input-li">
                    <span>确认新密码：</span>
                    <cube-input
                            v-model="repetitionPS.value"
                            :placeholder="repetitionPS.placeholder"
                            :type="repetitionPS.type"
                            :maxlength="repetitionPS.maxlength"
                            :readonly="repetitionPS.readonly"
                            :disabled="repetitionPS.disabled"
                            :autofocus="repetitionPS.autofocus"
                            :autocomplete="repetitionPS.autocomplete"
                            :eye="repetitionPS.eye"
                    ></cube-input>
                </li>
            </ul>
            <div class="submitBtn">
                <cube-button :light="true" class="cubeBtn" @click="submitForm">提交</cube-button>
            </div>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import {userMixin} from '@/common/mixins/user'
    import {changePassword} from '@/api/common'
    export default {
        mixins: [userMixin],
        name: 'change-password',
        data() {
            return {
                oldPs: '',
                nowPS: {
                    value: '',
                    placeholder: '请输入新密码',
                    type: 'password',
                    readonly: false,
                    maxlength: 100,
                    disabled: false,
                    autofocus: true,
                    autocomplete: true,
                    eye: {
                        open: true,
                        reverse: false
                    }
                },
                repetitionPS: {
                    value: '',
                    placeholder: '确认新密码',
                    type: 'password',
                    readonly: false,
                    maxlength: 100,
                    disabled: false,
                    autofocus: true,
                    autocomplete: true,
                    eye: {
                        open: true,
                        reverse: false
                    }
                }
            }
        },
        methods: {
            submitForm() {
                const warnText = this.oldPs ? this.nowPS.value ? this.repetitionPS.value ? this.repetitionPS.value === this.nowPS.value ? '通过' : '确认密码不同于新密码！' : '请确认密码！' : '请填写新密码！' : '请填写旧密码！'
                if (warnText === '通过') {
                    this._openToast('请稍等')
                    changePassword({oldPw: this.oldPs, newPw: this.nowPS.value}).then(res => {
                        this._closeToast()
                        if (res) {
                            this._changeAcoPw()
                            this.$router.go(-2)
                            // this.clearUserInfo()
                            // this.clearAccount()
                            // setTimeout(() => {
                            //     this.$router.push({
                            //         path: '/?goLogin=1'
                            //     })
                            // }, 20)
                        } else {
                            this._openAlert('密码修改失败！')
                        }
                    }).catch(err => this._reBackErr(err))
                } else {
                    this._openAlert(warnText)
                }
            }
        },
        components: {
            Page
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .change-password-content {
        padding: 30px 20px;
        .submitBtn {
            margin-top: 50px;
        }
    }
</style>
