// pages/category/index.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nohcho: 0,
    loading: true,
    categories: [],
    currentCate: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    }),(options && options.nohcho == '1' ? wx.setNavigationBarTitle({
      title: '无醛家居'
    }) : ''), this.getInfo()
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
    app.request('shop.get_category').then(res => {
      if (res.error === 0) {
        this.setData({
          loading: false,
          categories: res.data
        })
      }
    })
  },

  /**
   * 选择分类
   */
  onSelected({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    this.setData({
      currentCate: index
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
    this.setData({
      currentCate: 0,
    }), this.getInfo()

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