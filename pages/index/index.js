//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    login: false,
    userInfo: {},
    shareTicket: null,
    group: null
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '快来投票哟',
      path: '/pages/index',
      success: function (res) {
        // 转发成功
        console.log(res.shareTickets)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function () {
    wx.showToast({
      icon: 'loading',
      mask: true,
      title: '登录中..',
    })
    // 显示分享群
    wx.showShareMenu({
      withShareTicket: true
    })
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo,
        login: app.globalData.login
      })
      // wx.hideShowToast()
      wx.showToast({
        icon: 'success',
        title: '登录成功..'
      })

      // 调用获取信息
      if (app.globalData.shareTicket) {
        that.setData({
          shareTicket: app.globalData.shareTicket
        })
        app.getId(function (id) {
          that.setData({
            group: id
          })
        })
      }
    })
  }
})
