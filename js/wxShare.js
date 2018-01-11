/*
* author： guo5283796@163.com
* 用法： wxShare.init(options)
* options = {
  title： 分享的标题，String
  desc： 分享的描述，String
  thumb： 分享的缩略图，String
}
* options 可为空
*/
'use strict'
function inWechat() {
  var ua = navigator.userAgent.toLowerCase()
  if (ua.indexOf('micromessenger') != -1) {
    return true
  } else {
    return false
  }
}
if (inWechat()) { // 判断是否引入调用jsapi
  document.write(unescape("%3Cscript src='https://res.wx.qq.com/open/js/jweixin-1.2.0.js' type='text/javascript'%3E%3C/script%3E"))
}
;(function(global) {
  var wxShare = {}
  // url是页面完整的url(请在当前页面alert(location.href.split('#')[0])确认)，包括'http(s)://'部分，以及'？'后面的GET参数部分,但不包括'#'hash后面的部分
  var url = location.href.split('#')[0] // 不包括'#'hash后面的部分，给后台用于计算签名用
  var oriUrl = location.href  // 页面完整链接，包含所有数据
  // 定义默认值
  var dTitle = '胖胖猪'
  var dDesc = '胖胖猪'
  var dThumb = 'https://www.pangpangpig.com/static_m/images/common/logo-wx.png'
  
  var init = function(options) {
    // options: Object
    var title = dTitle,
      desc = dDesc,
      thumb = dThumb
    if (options) {
      title = options.title ||dTitle
      desc = options.desc || dDesc
      thumb = options.thumb || dThumb
    }
    $.get('/weixin/wechatJS', { url: url }, function(res) {
      wx.config({
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。生产环境必须设为false
        appId: res.appid, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.noncestr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名，见附录1
        jsApiList: [
          // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          'onMenuShareAppMessage', // 好友
          'onMenuShareTimeline', // 朋友圈
          'onMenuShareQQ', // QQ
          'onMenuShareQZone' // 朋友圈
        ]
      })
      wx.ready(function() {
        wx.onMenuShareAppMessage({
          title: title, // 分享标题
          desc: desc, // 分享描述
          link: oriUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: thumb, // 分享图标
          type: '', // 分享类型,music、video或link，不填默认为link
          dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
          success: function() {
            // 用户确认分享后执行的回调函数
            console.log('分享成功')
          },
          cancel: function() {
            // 用户取消分享后执行的回调函数
            console.log('取消')
          }
        })
        wx.onMenuShareTimeline({
          title: title,
          link: oriUrl,
          imgUrl: thumb
        })
        wx.onMenuShareQQ({
          title: title,
          desc: desc,
          link: oriUrl,
          imgUrl: thumb
        })
        wx.onMenuShareQZone({
          title: title,
          desc: desc,
          link: oriUrl,
          imgUrl: thumb
        })
      })
    })
  }
  wxShare.init = init
  global.wxShare = wxShare
})(window)
