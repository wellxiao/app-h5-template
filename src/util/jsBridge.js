/*
 * @Author: chengfei
 * @Date: 2018-07-11 14:36:15
 * @Description: jsBridge
 */

/* eslint-disable */
;(function(win) {
  const self = win
  self.setupWebViewJavascriptBridge = callback => {
      if (window.WebViewJavascriptBridge) {
          return callback(window.WebViewJavascriptBridge)
      }
      if (window.WVJBCallbacks) {
          return window.WVJBCallbacks.push(callback)
      }
      window.WVJBCallbacks = [callback]
      const WVJBIframe = document.createElement('iframe')
      WVJBIframe.style.display = 'none'
      WVJBIframe.src = 'https://__bridge_loaded__'
      document.documentElement.appendChild(WVJBIframe)
      setTimeout(() => {
          document.documentElement.removeChild(WVJBIframe)
      }, 0)
  }
  /**
   *  Js与Native之间相互调用必先注册
   */
  self.XmJsToNativeMethods = [
      'getUserInfo',
      'getLocationInfo',
      'closeWebview',
      'getTitle',
      'getUrl',
      'getTel',
      'reLogin',
      'onlineService',
      'agreeProvision',
      'goback',
      'newview',
      'cameraPermissions',
      'openCameraPermissions',
      'userShare',
      'toast',
      'simpleToast',
      'getBuildVersion',
  ]
  /**
   *  提前注册方法
   */
  self.setupWebViewJavascriptBridge(bridge => {
      self.XmJsToNativeMethods.map(m => {
          bridge.registerHandler(m, (data, responseCallback) => {
              responseCallback()
          })
      })
  })
  /**
   *  jsToNactive methods
   *  @param method : 方法名
   *  @param params : 参数
   *  @param callback : 回调
   */
  self.mgoNativeClient = (method, params, callback) => {
      window.WebViewJavascriptBridge.callHandler(
          method,
          params == null ? null : JSON.stringify(params),
          res => {
              typeof callback === 'function' && callback(JSON.parse(res))
          },
      )
  }
  /**
   *  jsToNactive methods 拿回调
   *  @param method : 方法名
   *  @param params : 参数
   *  @param callback : 回调
   */
  self.mgoNativeClientCallback = (method, params, callback) => {
      window.WebViewJavascriptBridge.callHandler(
          method,
          params == null ? null : JSON.stringify(params),
          res => {
              typeof callback === 'function' &&
                  callback(typeof res === 'object' ? res : JSON.parse(res))
          },
      )
  }
  /**
   *   注册SDK调用JS的方法
   *  @param method : 方法名
   *  @param params : 传给SDK的方法
   *  @param callback : 回调
   */
  self.mgoNativeInitMethod = (method, params, callback) => {
      self.setupWebViewJavascriptBridge(bridge => {
          bridge.registerHandler(method, (data, responseCallback) => {
              // TODO: data为空时，callback不能执行
              if (data) {
                  typeof callback === 'function' && callback(JSON.parse(data))
              } else {
                  typeof callback === 'function' && callback()
              }
              responseCallback(params == null ? null : JSON.stringify(params))
          })
      })
  }
})(window)
