<template>
    <div>
        <div class="activatedCaleader">
            <div class="calendar">
                <!-- 年份 月份 -->
                <div class="month">
                    <ul>
                        <!--点击会触发pickpre函数，重新刷新当前日期 @click(vue v-on:click缩写) -->
                        <li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
                        <li class="year-month" @click="pickYear(currentYear,currentMonth)">
                            <span class="choose-year">{{ currentYear }}</span>
                            <span class="choose-month">{{ currentMonth }}月</span>
                        </li>
                        <li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
                    </ul>
                </div>
                <!-- 星期 -->
                <ul class="weekdays">
                    <li :class="{isTaday: showTadyaWek === 0}">S</li>
                    <li :class="{isTaday: showTadyaWek === 1}">M</li>
                    <li :class="{isTaday: showTadyaWek === 2}">T</li>
                    <li :class="{isTaday: showTadyaWek === 3}">W</li>
                    <li :class="{isTaday: showTadyaWek === 4}">T</li>
                    <li :class="{isTaday: showTadyaWek === 5}">F</li>
                    <li :class="{isTaday: showTadyaWek === 6}">S</li>
                </ul>
                <!-- 日期 -->
                <ul class="days">
                    <!-- 核心 v-for循环 每一次循环用<li>标签创建一天 -->
                    <li v-for="(item, index) in days" v-bind:key="index">
                        <!--本月-->
                        <!--如果不是本月  改变类名加灰色-->
                        <div class="gistOutside">
                            <span
                                    v-if="item.day.getMonth()+1 != currentMonth"
                                    class="other-month"
                            >
                                {{ item.day.getDate()}}
                            </span>
                            <!--如果是本月  还需要判断是不是这一天-->
                            <span
                                    :class="{circle: signDay(item.day.getDate())}"
                                    v-else
                            >
                                <!--今天  同年同月同日-->
                                <span
                                        v-if="item.isSign===true"
                                        :class="{isWeekend: (item.day.getDay() === 0 || item.day.getDay() === 6)}"
                                >
                                    {{ item.day.getDate()}}
                                </span>
                                <span
                                        :class="{isWeekend: (item.day.getDay() === 0 || item.day.getDay() === 6)}"
                                        v-else
                                >
                                    {{ item.day.getDate() }}
                                </span>
                            </span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
        name: 'calendar-sign-in',
        props: {
            allSignData: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                currentDay: 1,
                currentMonth: 1,
                currentYear: 2019,
                currentWeek: 1,
                days: [],
                arrDate: [],
                rows: 34,
                showTadyaWek: '',
                taDayWeek: [new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getDay()], // 今天的年月日周几
                activDatas: [] // 所有签到日期
            }
        },
        created() {
            this.initData(null)
            if (this.allSignData.length) {
                this.activDatas = this.allSignData
                this.mounChange()
            }
        },
        methods: {
            initData(cur) {
                let date
                if (cur) {
                    date = new Date(cur)
                    const ys = new Date(cur.substring(0, cur.length - 2) + '01').getDay()
                    if (ys === 1) {
                        this.rows = 34
                    } else {
                        const mons = cur.substring(cur.length - 5, cur.length - 3)
                        const isMaxMoun = this.maxMinMou(mons)
                        if (isMaxMoun && ys >= 5) {
                            this.rows = 41
                        } else {
                            if ((~~mons !== 2) && ys === 6) {
                                this.rows = 41
                            } else {
                                this.rows = 34
                            }
                        }
                    }
                } else {
                    let now = new Date()
                    const nowDayNum = new Date(this.formatDate(now.getFullYear(), now.getMonth() + 1, 1)).getDay()
                    if (nowDayNum === 1) {
                        this.rows = 34
                    } else {
                        const mons = now.getMonth() + 1 + ''
                        const isMaxMouns = this.maxMinMou(mons)
                        if (isMaxMouns && nowDayNum >= 5) {
                            this.rows = 41
                        } else {
                            if (((now.getMonth() + 1) !== 2) && nowDayNum === 6) {
                                this.rows = 41
                            } else {
                                this.rows = 34
                            }
                        }
                    }
                    let d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1))
                    d.setDate(this.rows)
                    date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
                }
                this.currentDay = date.getDate()
                this.currentYear = date.getFullYear()
                this.currentMonth = date.getMonth() + 1

                this.currentWeek = date.getDay() // 1...6,0
//        if (this.currentWeek === 0) {
//          this.currentWeek = 7
//        }
                let str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)
                this.days.length = 0
                // 初始化本周
                // 今天是周日，放在第一行第7个位置，前面6个 let i = this.currentWeek - 1; i >= 0; i--
                // 今天是周日，放在第一行第1个位置，前面6个 let i = this.currentWeek; i >= 0; i--
                for (let i = this.currentWeek; i >= 0; i--) {
                    let d = new Date(str)
                    d.setDate(d.getDate() - i)
                    let dayobject = {} // 用一个对象包装Date对象  以便为以后预定功能添加属性
                    dayobject.day = d
                    this.days.push(dayobject) // 将日期放入data 中的days数组 供页面渲染使用
                }
                // 其他周
                for (let i = 1; i <= this.rows - this.currentWeek; i++) {
                    let d = new Date(str)
                    d.setDate(d.getDate() + i)
                    let dayobject = {}
                    dayobject = {day: d, isSign: this.isVerDate(d.getDate())}
                    this.days.push(dayobject)
                }
            },
            pickPre(year, month) {
                // setDate(0); 上月最后一天
                // setDate(-1); 上月倒数第二天
                // setDate(dx) 参数dx为 上月最后一天的前后dx天
                let d = new Date(this.formatDate(year, month, 1))
                d.setDate(0)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
                this.mounChange()
            },
            pickYear(year, month) {
//        alert(year + ',' + month)
            },
            pickNext(year, month) {
                let d = new Date(this.formatDate(year, month, 1))
                d.setDate(this.rows)
                this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
                this.mounChange()
            },
            mounChange() {
                let years = this.currentYear
                let mouns = this.currentMonth
                const ite = this.activDatas
                let actDay = []
                for (let i = 0; i < ite.length; i++) {
                    let signDay = ite[i].split('-')
                    if ((years === ~~signDay[0]) && (mouns === ~~signDay[1])) {
                        actDay.push(~~signDay[2])
                    }
                }
                this.arrDate = actDay
                this.$emit('changeMonth')
            },
            maxMinMou(mons) {
                let iOa = false
                const mounts = mons
                switch (mounts) {
                    case '01':
                        iOa = true
                        break
                    case '03':
                        iOa = true
                        break
                    case '05':
                        iOa = true
                        break
                    case '07':
                        iOa = true
                        break
                    case '08':
                        iOa = true
                        break
                    case '10':
                        iOa = true
                        break
                    case '12':
                        iOa = true
                        break
                }
                return iOa
            },
            signDay(days) {
                if (this.arrDate.includes(days)) {
                    return true
                } else {
                    return false
                }
            },
            isTadayWek(n) {
                const taDayWeek = this.taDayWeek
                if (this.currentYear === taDayWeek[0] && n === taDayWeek[1]) {
                    this.showTadyaWek = taDayWeek[3]
                } else {
                    this.showTadyaWek = ''
                }
            },
            formatDate(year, month, day) {
                let y = year
                let m = month
                if (!m) {
                    y -= 1
                }
                if (m < 10 && m !== 0) {
                    m = '0' + m
                } else if (m < 10 && m === 0) {
                    m = '12'
                }
                let d = day
                if (d < 10) d = '0' + d
                return y + '-' + m + '-' + d
            },
            isVerDate(v) {
                return this.arrDate.includes(v)
            }
        },
        watch: {
            currentMonth(n) {
                if (n === this.taDayWeek[1] && this.currentYear === this.taDayWeek[0]) {
                    this.isTadayWek(n)
                } else {
                    this.showTadyaWek = ''
                }
            },
            allSignData(n) {
                if (n.length) {
                    this.activDatas = n
                    this.mounChange()
                } else {
                    this.arrDate = []
                }
            }
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .activatedCaleader
        margin-top: 10px
        padding: 0 20px
        .calendar
            width: 100%
            margin: 0 auto
            /*box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.12)*/
            .month
                width: 100%
                /*background: #00B8EC*/
                ul
                    margin: 0
                    padding: 0
                    display: flex
                    justify-content: space-between
                    li
                        font-size: 20px
                        text-transform: uppercase
                    .arrow
                        padding: 20px
                    /*&::hover
                        background: rgba(100, 2, 12, 0.1)*/
                    .year-month
                        display: flex
                        /*flex-direction: column;*/
                        align-items: center
                        justify-content: space-around /*&::hover
                            background: rgba(150, 2, 12, 0.1)*/
                        .choose-year
                            padding-left: 20px
                            padding-right: 20px
                        .choose-month
                            text-align: center
                            font-size: 32px

            .weekdays
                margin: 0
                padding: 10px 10px
                border-bottom: 1px solid #94A263
                /*background-color: #00B8EC;*/
                display: flex
                flex-wrap: wrap
                justify-content: space-around
                li
                    display: inline-block
                    width: 13.6%
                    text-align: center
                    font-weight: bold
                    position: relative
                    font-size: 14px
                .isTaday
                    &::after
                        content: ''
                        position: absolute
                        left: 30%
                        bottom: -12px
                        width: 40%
                        height: 3px
                        border-radius: 2px
                        background: #94A263
                        z-index: 10

            .days
                background: #FFFFFF;
                margin: 0;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-around;
                white-space-collapse: discard
                padding: 0 10px
                li
                    list-style-type: none;
                    display: inline-block;
                    width: 14.28%;
                    /*height: 70px;*/
                    text-align: center;
                    padding-bottom: 12px;
                    padding-top: 12px;
                    font-size: 14px;
                    font-weight: bold
                    color: #000;
                    /*position: relative*/
                    .gistOutside
                        z-index: 3
                        position: relative
                        span
                            z-index: 3
                            line-height: 23px
                        .siChageBgCor
                            position: absolute
                            top: -12px
                            width: 100%
                            height: 48px
                            z-index: -1
                            background: #efe3d6
                        .isClickBGCor
                            position: absolute
                            top: -12px
                            width: 100%
                            height: 48px
                            z-index: -1
                            background: #C69E52
                    .active
                        &::after
                            /*content: '√';*/
                            position: absolute
                            top: 50%
                            left: 50%
                            font-size: 21px
                            margin-left: -6px
                            margin-top: -2px
                            font-weight: bold
                    /*color: #00B8EC;*/
                    .other-month
                        padding: 5px
                        color: gainsboro
                    .circle
                        border: 1px solid #CEA65A
                        width: 24px
                        height: 24px
                        text-align: center
                        display: inline-block
                        border-radius: 50%
                        position: relative
                        &::after
                            content: '' //\2714
                            position: absolute
                            bottom: -2px
                            right: -4px
                            color: #CEA65A
                            background: transparent url('./gou.png') no-repeat right bottom
                            background-position-x: 2px
                            background-size: 14px
                            width: 16px
                            height: 16px
</style>
