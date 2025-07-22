// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    condition: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      condition: options.id
    })
    wx.setNavigationBarTitle({
      title: options.id == 1 ? '初级设计师' : options.id == 2 ? '中级设计师' : '高级设计师'
    })
  },

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

  comeGo() {
    wx.navigateTo({
      url: '/pages/designer/addform?id=' + this.data.condition
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
