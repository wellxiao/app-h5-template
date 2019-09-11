// notation: js file can only use this kind of comments
// since comments will cause error when use in webview.loadurl,
// comments will be remove by java use regexp
/* eslint-disable */

;(function() {
  if (window.WebViewJavascriptBridge) {
      return
  }

  let messagingIframe
  let bizMessagingIframe
  let sendMessageQueue = []
  let receiveMessageQueue = []
  const messageHandlers = {}

  const CUSTOM_PROTOCOL_SCHEME = 'yy'
  const QUEUE_HAS_MESSAGE = '__QUEUE_MESSAGE__/'

  const responseCallbacks = {}
  let uniqueId = 1

  // 创建消息index队列iframe
  function _createQueueReadyIframe(doc) {
      messagingIframe = doc.createElement('iframe')
      messagingIframe.style.display = 'none'
      doc.documentElement.appendChild(messagingIframe)
  }
  // 创建消息体队列iframe
  function _createQueueReadyIframe4biz(doc) {
      bizMessagingIframe = doc.createElement('iframe')
      bizMessagingIframe.style.display = 'none'
      doc.documentElement.appendChild(bizMessagingIframe)
  }
  // set default messageHandler  初始化默认的消息线程
  function init(messageHandler) {
      if (WebViewJavascriptBridge._messageHandler) {
          throw new Error('WebViewJavascriptBridge.init called twice')
      }
      WebViewJavascriptBridge._messageHandler = messageHandler
      const receivedMessages = receiveMessageQueue
      receiveMessageQueue = null
      for (let i = 0; i < receivedMessages.length; i++) {
          _dispatchMessageFromNative(receivedMessages[i])
      }
  }

  // 发送
  function send(data, responseCallback) {
      _doSend(
          {
              data,
          },
          responseCallback,
      )
  }

  // 注册线程 往数组里面添加值
  function registerHandler(handlerName, handler) {
      messageHandlers[handlerName] = handler
  }
  // 调用线程
  function callHandler(handlerName, data, responseCallback) {
      _doSend(
          {
              handlerName,
              data,
          },
          responseCallback,
      )
  }

  // sendMessage add message, 触发native处理 sendMessage
  function _doSend(message, responseCallback) {
      if (responseCallback) {
          const callbackId = `cb_${uniqueId++}_${new Date().getTime()}`
          responseCallbacks[callbackId] = responseCallback
          message.callbackId = callbackId
      }

      sendMessageQueue.push(message)
      messagingIframe.src = `${CUSTOM_PROTOCOL_SCHEME}://${QUEUE_HAS_MESSAGE}`
  }

  // 提供给native调用,该函数作用:获取sendMessageQueue返回给native,由于android不能直接获取返回的内容,所以使用url shouldOverrideUrlLoading 的方式返回内容
  function _fetchQueue() {
      const messageQueueString = JSON.stringify(sendMessageQueue)
      sendMessageQueue = []
      // android can't read directly the return data, so we can reload iframe src to communicate with java
      if (messageQueueString !== '[]') {
          bizMessagingIframe.src = `${CUSTOM_PROTOCOL_SCHEME}://return/_fetchQueue/${encodeURIComponent(
              messageQueueString,
          )}`
      }
  }

  // 提供给native使用,
  function _dispatchMessageFromNative(messageJSON) {
      setTimeout(() => {
          const message = JSON.parse(messageJSON)
          let responseCallback
          // java call finished, now need to call js callback function
          if (message.responseId) {
              responseCallback = responseCallbacks[message.responseId]
              if (!responseCallback) {
                  return
              }
              responseCallback(message.responseData)
              delete responseCallbacks[message.responseId]
          } else {
              // 直接发送
              if (message.callbackId) {
                  const callbackResponseId = message.callbackId
                  responseCallback = function(responseData) {
                      _doSend({
                          responseId: callbackResponseId,
                          responseData,
                      })
                  }
              }

              let handler = WebViewJavascriptBridge._messageHandler
              if (message.handlerName) {
                  handler = messageHandlers[message.handlerName]
              }
              // 查找指定handler
              try {
                  handler(message.data, responseCallback)
              } catch (exception) {
                  if (typeof console !== 'undefined') {
                      console.log(
                          'WebViewJavascriptBridge: WARNING: javascript handler threw.',
                          message,
                          exception,
                      )
                  }
              }
          }
      })
  }

  // 提供给native调用,receiveMessageQueue 在会在页面加载完后赋值为null,所以
  function _handleMessageFromNative(messageJSON) {
      console.log(messageJSON)
      if (receiveMessageQueue) {
          receiveMessageQueue.push(messageJSON)
      }
      _dispatchMessageFromNative(messageJSON)
  }

  var WebViewJavascriptBridge = (window.WebViewJavascriptBridge = {
      init,
      send,
      registerHandler,
      callHandler,
      _fetchQueue,
      _handleMessageFromNative,
  })

  const doc = document
  _createQueueReadyIframe(doc)
  _createQueueReadyIframe4biz(doc)
  const readyEvent = doc.createEvent('Events')
  readyEvent.initEvent('WebViewJavascriptBridgeReady')
  readyEvent.bridge = WebViewJavascriptBridge
  doc.dispatchEvent(readyEvent)
})()
/* eslint-enable */
