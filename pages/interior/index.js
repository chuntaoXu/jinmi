// pages/index/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    interior: [
      { text: '设计师证书介绍', value: '1' },
      { text: '填写资料', value: '2' }
    ],
    title: '室内设计水平',
    number: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 刷新
   */

  /**
   * 获取基本信息
   */
  getInfo() {},
  showMemberPicker(e) {
    let obj = {
      1: '室内设计水平',
      2: '陈设艺术设计水平',
      3: '家装家居服务水平',
      4: '绿色环保服务水平'
    }
    this.setData({
      number: e.currentTarget.dataset.id,
      show: true,
      title: obj[e.currentTarget.dataset.id],
      ['interior[0].text']: obj[e.currentTarget.dataset.id] + '介绍'
    })
  },
  onCancelPicker() {
    this.setData({
      show: false
    })
  },
  onCancelInter(e) {
    if (e.detail.index == 0) {
      wx.navigateTo({
        url: '/pages/interior/unitder?id=' + this.data.number + '&typeGo=4'
      })
    } else {
      wx.navigateTo({
        url: '/pages/interior/addform?id=' + this.data.number + '&typeGo=4'
      })
    }
    this.setData({
      show: false
    })
  },
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
  onUnload: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {}
})
