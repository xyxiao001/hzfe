// pages/show/show.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    login: false,
    type: '',
    obj: {
    },
    all: 0
  },

  // 选择
  chooseVote (e) {
    var index = e.target.dataset.index
    var obj = this.data.obj
    // 判断这个选项是否投票了的
    var choose = false
    var del = 0
    obj.lists[index].voteList.forEach((v, i) => {
      if (v.nickName === this.data.userInfo.nickName) {
        choose = true
        del = i
      }
    })
    if (choose) {
      obj.lists[index].vote -= 1
      obj.lists[index].voteList.splice(del, 1)
    } else {
      if (this.data.type === 'dan') {
        // 单选
        // 判断其他选项是否有 有则移除
        var choose2 = false
        var del2 = 0
        obj.lists.forEach((val, index2) => {
          if (index2 !== index) {
            val.voteList.forEach((v, i) => {
              if (v.nickName === this.data.userInfo.nickName) {
                choose2 = true
                del2 = i
              }
            })
            
            if (choose2) {
              val.vote -= 1
              val.voteList.splice(del2, 1)
            }
          }
        })
      }
      obj.lists[index].vote += 1
      obj.lists[index].voteList.push(this.data.userInfo)
      
    }
    this.saveData(obj)
    
  },

  //存数据
  saveData (obj) {
    var that = this
    //每次操作把数据保存在本地
    wx.getStorage({
      key: 'votes',
      success: function(res) {
        var data = JSON.parse(res.data)
        data[that.data.type].forEach((val, index) => {
          if (val.id === that.data.id) {
            val.lists = obj.lists
          }
        })
        wx.setStorage({
          key: 'votes',
          data: JSON.stringify(data),
          success: function () {
            that.getVoteData()
          }
        })
      },
    })
    
  },

  // 读取数据
  getVoteData () {
    var that = this
    wx.getStorage({
      key: 'votes',
      success: function (res) {
        var data = JSON.parse(res.data)
        data[that.data.type].forEach((val, index) => {
          if (val.id === that.data.id) {
            var all = 0
            val.lists.forEach((v, i) => {
              all += v.vote
            })
            val.lists.forEach((v, i) => {
              v.prop = all === 0 ? 0 : ((v.vote / all) * 100).toFixed(1)
            })
            that.setData({
              obj: val,
              all: all
            })
            wx.hideToast()
          }
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showToast({
      title: '数据读取中...',
      type: 'loading',
      mask: true
    })
    this.setData({
      type: options.type,
      id: Number(options.id)
    })
    // 读取本地数据
    this.getVoteData()
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        login: app.globalData.login
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})