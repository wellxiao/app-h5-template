/*
 * @Author: wellxiao
 * @Date: 2019-09-10
 */
// import Vue from 'vue'
import '@/util/jsBridge'
// import { staticUrl } from '@/config'
import instance from './instance'
import cookie from './cookie'
import { updateUrl, environment } from './methods'

// const { $toast } = Vue.prototype
const { isApp } = environment()
const showLoading = commit => {
    commit('showLoading', null, { root: true })
}

const finishLoading = commit => {
    commit('finishLoading', null, { root: true })
}

const fetch = options => {
    const { method = 'get', url, data, timeout, responseType, headers = {} } = options
    /**
     *  此处注释掉 因为有些项目不是用token去验证
     */
    // 当cookie中有token时塞入token
    // const openId = cookie.getCookie('openid')
    // const Token = cookie.getCookie('centerToken') || cookie.getCookie('X-AuthToken-With') || ''
    // if (openId && Token) {
    //     headers['X-AuthToken-With'] = Token
    //     headers.openId = openId
    // }
    switch (method.toLowerCase()) {
        case 'get':
            return instance.get(url, {
                params: data,
                headers,
                responseType,
                timeout,
            })
        case 'delete':
            return instance.delete(url, {
                params: data,
                headers,
                responseType,
                timeout,
            })
        case 'post':
            return instance.post(url, data, { headers, responseType, timeout })
        case 'put':
            return instance.put(url, data, { headers, responseType, timeout })
        case 'patch':
            return instance.patch(url, data, { headers, timeout })
        default:
            return instance(options)
    }
}
/**
 * http
 * @param {*} method
 * @param {*} url
 * @param {*} obj
 * @returns {*} obj 返回参数  { message: '', statusCode: 0, result }
 */
export const request = async ({ commit, responseType, ...config }) => {
    if (commit) showLoading(commit)
    try {
        /* eslint-disable camelcase */
        const { data, headers } = await fetch({ ...config, responseType })
        if (commit) finishLoading(commit)
        // 兼容下载
        if (responseType && responseType === 'blob') {
            return Promise.resolve({ result: data, headers })
        }
        //  -4是token过期的情况
        if (data.error_code === -4) {
            // $toast('token过期，1秒后重新登录')
            if (isApp) {
                // mgoNativeClient('reLogin', {})
                window.mgoNativeClientCallback('getUserInfo', {}, res => {
                    cookie.setCookieAndTime('openid', res.openid, 24 * 3600)
                    cookie.setCookieAndTime('centerToken', res.centerToken, 24 * 3600)
                    const openId = res.openid
                    const Token = res.centerToken
                    if (openId && Token) {
                        headers['X-AuthToken-With'] = Token
                        headers.openId = openId
                    }
                })
            } else {
                // window.location.href = updateUrl(staticUrl)
            }
        }
        const { error_code, err_msg } = data
        if (error_code !== null && error_code !== 0) {
            return Promise.reject({ message: err_msg, statusCode: error_code })
        }
        return Promise.resolve({
            message: err_msg || '',
            statusCode: error_code || 0,
            result: data.data,
        })
    } catch (error) {
        if (commit) finishLoading(commit)
        const { response } = error
        let msg
        let statusCode
        if (response && response instanceof Object) {
            const { data, statusText } = response
            statusCode = response.status
            msg = data.message || statusText
        } else {
            statusCode = 600
            msg = error.message || 'Network Error'
        }
        return Promise.reject({ statusCode, message: msg })
    }
}
