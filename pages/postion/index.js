// pages/postion/index.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    indexList: [],
    scrollTop: 0,
    city: false,
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const city = wx.getStorageSync('city')

    this.setData({
      city
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
    this.getInfo()
  },

  Refresh() {
    const city = wx.getStorageSync('city')

    this.setData({
      city
    })

    this.getInfo()
  },

  /**
   * 获取基本信息
   */
  getInfo() {
    this.setData({
      isLoading: true
    })
    app.request('shop.get_areas').then(res => {
      if (res.error === 0) {
        const data = res.data
        const indexList = []
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const element = data[key];
            indexList.push({
              key: key,
              list: element
            })
          }
        }

        this.setData({
          indexList: indexList,
          isLoading: false
        })
      }
    })
  },

  /**
   * 选择地址
   */
  onSelect({
    currentTarget: {
      dataset: {
        id,
        name
      }
    }
  }) {

    this.setData({
      city: name
    })

    wx.setStorageSync('city', name)

    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    prevPage.Refresh()
    
    wx.navigateBack()
  },

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.scrollTop
    });
  },

  /**
   * 获取授权设置
   */
  getSetting({
    detail: {
      authSetting
    }
  }) {
    app.checkAuth(authSetting)
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