import {WX_URL, METHOD_POST} from './config'
import {parseQuery} from '../common/utils'
import fetchData from '../common/fetch-data'
import {IS_PRODUCTION} from '../common/config'

// 获取系统相关的配置信息
export function fetchConfigInfo(configUrl = window.location.href.split('#')[0]) {
    // WX_URL
    const wxurl = WX_URL
    const url = parseQuery(wxurl, {method: 'GetConfigInfo'}, false)
    return fetchData(url, METHOD_POST, {
        data: {
            url: configUrl
        },
        runtimeData: {
            EB_ACTION: 'GetConfigInfo'
        }
    })
}
