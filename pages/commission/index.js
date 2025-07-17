// pages/commission/index.js
const app = getApp()
const UTILS = app.requirejs('util')

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_credit2: 0,
    credit2: 0
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
    this.getInfo()
  },

  /**
   * 获取基本信息
   */
  getInfo() {
    app.request('commission', {}, true).then(res => {
      if (res.error === 0) {
        this.setData({
          ...res.data
        })
      }
    })
  },

  /**
   * 打开绑卡提示
   */
  showDialog() {
    Dialog.confirm({
        title: '绑卡提示',
        message: '您还未绑定银行卡，请先绑定银行卡',
        confirmButtonText: '立即绑卡',
        confirmButtonColor: '#40BC5E'
      })
      .then(() => {
        wx.navigateTo({
          url: '/pages/member/bind',
        })
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
    this.getInfo()

    wx.stopPullDownRefresh()
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