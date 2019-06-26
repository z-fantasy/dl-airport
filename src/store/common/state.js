import storage from 'good-storage'
import {KEY_ASSETS_PREFIX, KEY_DEFAULT_MALL_INFO} from '../../common/config'

const state = {
    loadingStatus: false,
    imgHost: storage.session.get(KEY_ASSETS_PREFIX, ''),
    defineTitle: '',
    mallInfo: storage.get(KEY_DEFAULT_MALL_INFO, false) || storage.session.get(KEY_DEFAULT_MALL_INFO, false)
}

export default state
