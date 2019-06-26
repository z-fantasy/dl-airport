<template>
    <Page type="staff-sign" ref="page">
        <div>
            <div class="submitBtn ">
                <div class="cubeBtn signBtn" @click="signWay">
                    {{isSigned ? '已 签 到' : '签 到'}}
                </div>
            </div>
            <calendar-sign-in :allSignData="signDays" v-show="false"></calendar-sign-in>
        </div>
    </page>
</template>

<script type="text/ecmascript-6">
    import Page from '@/components/page/page'
    import CalendarSignIn from '@/components/calendar-sign-in/calendar-sign-in'
    import {signDdd} from 'api/common'
    export default {
        name: 'staff-sign',
        data() {
            return {
                signDays: ['2019-01-10'],
                isSigned: false
            }
        },
        created() {
            setTimeout(() => {
                const nowDay = new Date()
                const times = `${nowDay.getFullYear()}-${nowDay.getMonth() + 1}-${nowDay.getDate()}`
                this.signDays.push(times)
            }, 3000)
        },
        methods: {
          signWay() {
              if (this.isSigned) return
              this._openToast()
              signDdd().then(res => {
                  this._closeToast()
                  if (res) {
                      this.isSigned = true
                      this._openToast('签到成功！', {type: 'correct', time: 1500, mask: false})
                  } else {
                      this._openAlert('签到失败：' + res)
                  }
              }).catch(err => this._reBackErr(err))
          }
        },
        components: {
            Page,
            CalendarSignIn
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .signBtn
        margin: 150px auto
        text-align : center
        width: 100px
        border-radius : 20px
        height: 44px
        line-height 44px
</style>
