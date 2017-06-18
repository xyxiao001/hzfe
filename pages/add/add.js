// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'dan',
    edit: false,
    id: null,
    title: '',
    des: '',
    lists: [
      {
        name: '',
        vote: 0,
        voteList: []
      },
      {
        name: '',
        vote: 0,
        voteList: []
      }
    ],
    date: '',
    time: ''
  },

  // 更新标题
  updateTitle(e) {
    this.setData({
      title: e.detail.value
    })
  },

  // 更新描述
  updateDes(e) {
    this.setData({
      des: e.detail.value
    })
  },

  // 每次改变更新函数
  updateVote(e) {
    var index = e.target.dataset.index
    var arr = this.data.lists
    arr[index].name = e.detail.value
    this.setData({
      lists: arr
    })
  },
  
  // 新增投票函数
  addVote () {
    var arr = this.data.lists.concat([
      {
        name: '',
        vote: 0,
        voteList: []
      }
    ])
    this.setData({
      lists: arr
    })
  },

  // 删除选项函数
  deleteVote (e) {
    var index = e.target.dataset.index
    var arr = this.data.lists
    arr.splice(index, 1)
    this.setData({
      lists: arr
    })
  },

  // 保存函数
  success () {
    if (this.data.title === '') {
      wx.showModal({
        title: '内容错误',
        content: '标题不能为空',
        showCancel: false,
      })
      return false
    }

    if (this.data.lists.length === 0) {
      wx.showModal({
        title: '内容错误',
        content: '选项不能为空',
        showCancel: false,
      })
      return false
    }

    var show = true
    this.data.lists.forEach((val, index) => {
      if (val.name === '' && show) {
        show = false
        wx.showModal({
          title: '内容错误',
          content: '第 '+ (index + 1) +' 个选项名称不能为空',
          showCancel: false,
        })
        return false
      }
    })

    if (show) {
      // 开始储存数据
      wx.showToast({
        title: '数据保存中..',
        type: 'loading',
        mask: true,
        duration: 15000
      })

      //如果是新增， 那么直接添加
      if (this.data.id === null) {
        this.saveVote()
      }
    }
  },

  // 保存到本地
  saveVote() {
    var that = this
    var type = this.data.type
    var time = Date.parse(new Date())
    wx.getStorage({
      key: 'votes',
      success: function (res) {
        var obj = JSON.parse(res.data)
        if (!Array.isArray(obj[type])) {
          obj[type] = []
        }
        obj[type].push({
          id: time,
          title: that.data.title,
          des: that.data.des,
          lists: that.data.lists
        })
        wx.setStorage({
          key: 'votes',
          data: JSON.stringify(obj),
          success: function () {
            wx.showToast({
              title: '数据保存成功.',
              type: 'success',
              mask: true,
              duration: 1500
            })
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/show/show?id=' + time + '&type=' + that.data.type
              })
            }, 1000)
          }
        })
      },
      fail: function (res) {
        var obj = {
          dan: [],
          duo: []
        }
        wx.setStorage({
          key: 'votes',
          data: JSON.stringify(obj),
          success: function () {
            console.log(1)
            that.saveVote()
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    if (options.type === 'dan') {
      wx.setNavigationBarTitle({
        title: '创建单选投票'
      })
    } else if (options.type === "duo") {
      wx.setNavigationBarTitle({
        title: '创建多选投票'
      })
    }
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