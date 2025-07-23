const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 2,
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options')
    this.setData({
      type: options.type
    })
  },
  /**
   * 启动倒计时
   */

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

  goback() {
    if (this.data.type == 3) {
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else {
      wx.navigateBack({
        delta: this.data.type == 1 ? 1 : this.data.type
      })
    }
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
        console.log('111', this.data.url)
      }
    })
  },
  showMemberPicker(e) {},
  /**
   * 扫一扫
   */
  scanCode() {},
  /**
   * 长按保存二维码
   */
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
  onUnload: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {}
})
