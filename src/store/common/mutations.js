import * as types from './mutation-types'

const mutations = {
    [types.SET_LOADING_STATUS](state, loadingStatus) {
        state.loadingStatus = loadingStatus
    },
    [types.DEFINE_TITLE](state, title) {
        state.defineTitle = title
    },
    [types.SET_IMG_HOST](state, imgHost) {
        state.imgHost = imgHost
    },
    [types.MALL_INFO](state, mallInfo) {
        state.mallInfo = mallInfo
    }
}

export default mutations
