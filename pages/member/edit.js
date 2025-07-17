// pages/member/edit.js
const app = getApp()
const UTILS = app.requirejs('util')

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    member: false,
    realname: ''
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
    app.request('member.info', {}, true).then(res => {
      if (res.error === 0) {
        this.setData({
          realname: res.data.member.realname,
          member: res.data.member
        })
      }
    })
  },

  onChange({
    detail
  }) {
    this.setData({
      realname: detail
    })
  },

  /**
   * 保存
   */
  submit: UTILS.debounce(function () {
    const {
      realname
    } = this.data

    if (!realname) {
      Toast('请输入用户名')
      return false
    }

    app.request('member.info.submit', {
      realname
    }, true).then(res => {
      if (res.error === 0) {
        Toast.success('提交成功')
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
  onShareAppMessage: function () {

  }
})