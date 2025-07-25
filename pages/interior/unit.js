// pages/index/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: 5,
    timer: null,
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.startCountdown()
  },
  /**
   * 启动倒计时
   */
  startCountdown() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    let t = this.data.time
    this.setData({ time: t })
    const timer = setInterval(() => {
      t--
      this.setData({ time: t })
      if (t <= 0) {
        clearInterval(timer)
        this.setData({ timer: null })
        // 倒计时结束后可在这里处理跳转或其他逻辑
      }
    }, 1000)
    this.setData({ timer })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo()
  },

  /**
   * 刷新
   */

  /**
   * 获取基本信息
   */
  getInfo() {
    app.request('evaluation.homes.getQrcode', {}, true).then(res => {
      if (res.error == 0) {
        console.log('object', res)
        this.setData({
          url: 'https://jmwq.jiancedaojia.com/attachment/' + res.data.url
        })
      }
    })
  },
  showMemberPicker(e) {},
  /**
   * 扫一扫
   */
  scanCode() {},
  /**
   * 跳转小程序
   */

  onClose() {},

  /**
   * 获取授权设置
   */

  /**
   * 切换名人说
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },
  saveQrcode() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.url,
      success: () => {
        wx.showToast({ title: '已保存到相册，可在微信添加客服', icon: 'none' })
      },
      fail: () => {
        wx.showToast({ title: '保存失败，请检查权限', icon: 'none' })
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {}
})
