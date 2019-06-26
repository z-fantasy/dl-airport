'use strict'

const path = require('path')
function resolve (dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    devServer: {
        // 返回当前平台类型（'darwin', 'freebsd', 'linux', 'sunos' 或者 'win32'）：
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 7777,
        https: false,
        hotOnly: false,
        // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        proxy: null, // string | Object
        before: app => {}
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('common', resolve('src/common'))
            .set('api', resolve('src/api'))
            .set('components', resolve('src/components'))
            .set('base', resolve('src/base'))
            .set('assets', resolve('src/assets'))
            .set('views', resolve('src/views'))
        // ie报错无效字符 添加该配置项解决
        config.module
            .rule('iview')
            .test(/iview.src.*?js$/)
            .use('babel')
            .loader('babel-loader')
            .end()
    },
    productionSourceMap: false,
    css: {
        // extract: true,
        extract: process.env.NODE_ENV !== 'production',
        sourceMap: false,
        loaderOptions: {
            stylus: {
                'resolve url': true,
                'import': [
                    './src/theme'
                ]
            }
        }
    },
    pluginOptions: {
        'cube-ui': {
            postCompile: true,
            theme: true
        }
    }
}
