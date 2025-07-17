// pages/member/auth.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    mobile: '',
    industry: '',
    remark: '',
    errmobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 设置文本
   */
  setInput({
    detail,
    currentTarget: {
      dataset: {
        key
      }
    }
  }) {
    UTILS.checkAuth()

    if (key === 'mobile') {
      const regMobile = /^1[1-9]\d{9}$/
      if (!regMobile.test(detail)) {
        this.setData({
          errmobile: '请输入正确的手机号'
        })
      } else {
        this.setData({
          errmobile: ''
        })
      }
    }
    this.setData({
      [key]: detail
    })
  },

  submit: UTILS.debounce(function () {
    UTILS.checkAuth()

    const {
      name,
      mobile,
      industry,
      remark,
      errmobile
    } = this.data

    if (!name || !mobile || errmobile) {
      Notify({
        type: 'warning',
        message: '请填写完整信息！'
      })
      return
    }

    app.request('member.checkApply', {
      name,
      mobile,
      industry,
      remark,
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '提交成功',
          mask: true
        })
        
        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      }
    })

  }, 1000),

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
  onShareTimeline(res){
    let share = wx.getStorageSync('share')
    return {
      title: share.shopname,
      path: '/pages/index/index',
      imageUrl: share.shoplogo
    }

  },
  onShareAppMessage: function(ops) {
    let share = wx.getStorageSync('share')
    return {
      title: share.shopname,
      path: '/pages/index/index',
      imageUrl: share.shoplogo
    }
  }
})