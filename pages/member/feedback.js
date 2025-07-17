// pages/member/feedback.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reason: '',
    name: '',
    mobile: '',
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
   * 提交
   */
  submit: UTILS.debounce(function () {
    const {
      reason,
      name,
      mobile,
      errmobile
    } = this.data

    if (!reason || !name || !mobile) {
      wx.showToast({
        title: '请填写完整信息!',
        icon: "none",
        mask: true
      })
      return
    }

    if (errmobile) {
      wx.showToast({
        title: '请填写正确的手机号',
        icon: "none",
        mask: true
      })

      return
    }

    app.request('member.feedback', {
      reason,
      name,
      mobile
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '提交成功！'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 500);
      }
    })

  }),

  /**
   * 设置文本
   */
  setInput({
    detail: {
      value
    },
    currentTarget: {
      dataset: {
        key
      }
    }
  }) {

    if (key === 'mobile') {
      const regMobile = /^1[1-9]\d{9}$/
      if (!regMobile.test(value)) {
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
      [key]: value
    })
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