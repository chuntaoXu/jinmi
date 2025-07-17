// pages/article/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const base64 = app.requirejs("base64")['Base64']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'normal',
    types: 0,
    id: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    }), (options && options.type === 'project' ? wx.setNavigationBarTitle({
      title: '案例详情'
    }) : options && options.type === 'about' ? wx.setNavigationBarTitle({
      title: '关于我们'
    }) : '文章详情'), this.getInfo()
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
    const {
      id,
      type,
      types
    } = this.data

    let url = 'topic.detail'
    if (type === 'project') {
      url = 'merch.notice.detail'
    } else if (type === 'about') {
      url = 'shop.about'
    }

    app.request(url, {
      id,
      types
    }, true).then(res => {
      if (res.error === 0) {
        if (type === 'project') {
          res.data.content = base64.decode(res.data.detail)
          res.data.content = app.towxml(res.data.content, 'html')
        } else {
          res.data.content = base64.decode(res.data.content)
          res.data.content = app.towxml(res.data.content, 'html')
        }
        this.setData({
          ...res.data
        })
      }
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