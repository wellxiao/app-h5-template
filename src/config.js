/*
 * @Author: wellxiao
 * @Date: 2019-09-10
 * @Description: 配置
 */
/*eslint-disable */
const ENV = process.env.NODE_ENV
let  baseURL,routerBase,preUrlPath
if (ENV === 'test') {
    console.log('1111111'+ENV)
    baseURL = 'https://test-api.mobilemart.cn'
    routerBase = '/app-h5-test'
    preUrlPath=''
} else if (ENV === 'production') {
    console.log('2222'+ENV)
    baseURL = 'https://api.mobilemart.cn'
    routerBase = '/app-h5'
    preUrlPath=''
} else if (ENV === 'development') {
    console.log('0000000'+ENV)
    baseURL = 'https://dev-api.mobilemart.cn'
    routerBase = '/app-h5-dev'
    preUrlPath=''
} else {
    baseURL = 'https://dev-api.mobilemart.cn'
    routerBase = ''
    preUrlPath=''
}
module.exports = {
    // 基础路径
    baseURL,
    routerBase,
    preUrlPath,
}
