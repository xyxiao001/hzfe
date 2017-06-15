//app.js
App({
  onLaunch: function (ops) {
    this.globalData.opsCode = ops.scene
    if (this.globalData.opsCode === 1044) {
      this.globalData.shareTicket = ops.shareTicket
    }
  },
  // 获取分享的群id
  getId: function (cb) {
    var that = this
    wx.getShareInfo({
      shareTicket: that.globalData.shareTicket,
      success (res) {
        wx.request({
          url: 'https://www.novafuse.cn/Share/decryptData',
          data: {
            dr_session: wx.getStorageSync("dr_session"),
            iv: res.iv,
            encryptedData: res.encryptedData
          },
          method: 'GET',
          success: function (res) {
            // console.log(res.data.info.openGId)
            typeof cb == "function" && cb(res.data.info.openGId);  
          }
        })
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (res) {
          //获取session_key
          wx.request({
            url: 'https://www.novafuse.cn/login/getSessionKey',
            data: {
              code: res.code
            },
            dataType: 'json',
            success: function (res) {
              wx.setStorage({
                key: "dr_session",
                data: res.data.dr_session
              });
              if (res.status == 0) {
                conlose.log('获取session_key失败' + res.data.msg);
              }

              //获取用户信息
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo
                  that.globalData.login = true
                  typeof cb == "function" && cb(that.globalData.userInfo);
                  that.globalData.encryptedData = res.encryptedData
                  that.globalData.iv = res.iv
                  // 解密参数
                  wx.request({
                    url: 'https://www.novafuse.cn/login/doLogin',
                    data: {
                      dr_session: wx.getStorageSync("dr_session"),
                      encryptedData: res.encryptedData,
                      iv: res.iv
                    },
                    success: function (res) {
                      //console.log(res);
                    }
                  });
                }
              });
            }
          });
        }
      })
    }
  },
  globalData:{
    login: false,
    userInfo: null,
    opsCode: 0,
    shareTicket: null
  }
})