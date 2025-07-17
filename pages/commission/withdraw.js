// pages/commission/withdraw.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    credit: '0',
    isDisabled: true,
    money: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
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
   * 获取基本信息
   */
  getInfo() {
    app.request('member.withdraw', {}, true).then(res => {
      if (res.error === 0) {
        res.data.credit = res.data.credit + ''
        this.setData({
          ...res.data
        })
      }
    })
  },

  /**
   * 设置价格
   */
  setAmount({
    detail: {
      value
    }
  }) {
    const {
      credit
    } = this.data
    this.setData({
      money: value,
      isDisabled: value.length === 0 || +value > +credit
    })
  },

  /**
   * 提交
   */
  submit: UTILS.debounce(function () {
    const {
      isDisabled,
      money,
      credit
    } = this.data

    if (isDisabled) return

    if (!money || isNaN(money)) {
      wx.showToast({
        title: '请填写正确的充值金额!',
        icon: "none",
        mask: true
      })
      return
    }

    if (+money > +credit) {
      wx.showToast({
        title: `您最多可提现${credit}元`,
        icon: "none",
        mask: true
      })

      return
    }

    app.request('member.withdraw.submit', {
      type: 'wechat',
      money: money
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '提交成功！'
        }), this.getInfo()
      }
    })

  }),

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