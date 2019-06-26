<template>
    <div class="v-html-detail" ref="actDetImgText">
        <div v-show="!isVideo">
            <div v-html="vHtml"></div>
        </div>
        <div v-show="isVideo">
            <video-player class="video-player vjs-custom-skin needsclick"
                          ref="videoPlayer"
                          :playsinline="true"
                          :options="playerOptions"
                          @play="onPlayerPlay($event)"
                          @pause="onPlayerPause($event)"
            >
            </video-player>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import 'video.js/dist/video-js.css'
    import 'vue-video-player/src/custom-theme.css'
    import wx from 'weixin-js-sdk'
    import {videoPlayer} from 'vue-video-player'
    import {getHtmlSrc} from 'common/utils'

    export default {
        name: 'v-html-detail',
        props: {
            vHtml: {
                type: String,
                defalut: ''
            }
        },
        data() {
            return {
                hasAdS: false,
                isVideo: false,
                playerOptions: {
//        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, // 如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                        type: 'video/mp4',
                        src: 'http://121.8.145.68:1480/CRM31_DaLianJiChang/resource/root/1.mp4' // 你的视频地址（必填）http://121.8.145.68:1480/CRM31_DaLianJiChang/resource/root/1.mp4
                    }],
                    poster: '', // 你的封面地址
                    width: document.documentElement.clientWidth,
                    notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
//                    controlBar: {
//                      timeDivider: true,
//                      durationDisplay: true,
//                      remainingTimeDisplay: false,
//                      fullscreenToggle: true  //全屏按钮
//                    }
                }
            }
        },
        watch: {
            vHtml(n) {
                if (n) {
                    this.addEnvListener()
                } else {
                    this._destoryImgClock()
                }
            }
        },
        mounted() {
            this.addEnvListener()
        },
        methods: {
            testClic() {
                console.log('testClic')
            },
            addEnvListener() {
                if (this.hasAdS) {
                    this._destoryImgClock()
                }
                if (/<img/.test(this.vHtml)) {
                    this.$nextTick(() => {
                        this.$refs.actDetImgText.addEventListener('click', this.imgClock)
                    })
//                    this.$emit('vHtmlReady')
                }
                if (/<video/.test(this.vHtml)) {
                    this.isVideo = true
                    this.playerOptions.sources[0].src = getHtmlSrc(this.vHtml)[0]
                } else {
                    this.isVideo = false
                }
                this.$emit('vHtmlReady')
            },
            imgBig(imgUrl) {
                if (imgUrl) {
                    const imgSrc = imgUrl
                    wx.previewImage({
                        current: imgSrc, // 当前显示图片的http链接
                        urls: [imgSrc] // 需要预览的图片http链接列表
                    })
                }
            },
            imgClock(e) {
                if (e.target && e.target.currentSrc) {
                    this.imgBig(e.target.currentSrc)
                }
            },
            _destoryImgClock() {
                if (this.hasAdS) {
                    this.$refs.actDetImgText.removeEventListener('click', this.imgClock)
                    this.hasAdS = false
                }
            },
            onPlayerPlay(player) {
                console.log('Play')
                return
            },
            onPlayerPause(player){
                console.log('Pause')
                return
            },
        },
        components: {
            videoPlayer
        }
    }
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .v-html-detail
        /deep/ img
            width: 100%
            height: auto
    >>>.video-js .vjs-big-play-button
        height: 2em
        width: 2em
        line-height: 2em
        border-radius: 50%
        margin-left: -0.8em
    >>>.video-js.vjs-fluid{
        width: 100%
        max-width: 100%
        height: 300px
    }
</style>
