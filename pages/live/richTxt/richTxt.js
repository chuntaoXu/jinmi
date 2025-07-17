// pages/live/richTxt/richTxt.js
const app = getApp()
const base64 = app.requirejs("base64")['Base64']
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,  //1、直播介绍  2、奖项规则
    list:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type
    this.setData({
      type: type
    })
    if(type == 1){
      wx.setNavigationBarTitle({
        title: '直播介绍',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '奖项规则',
      })
    }
    this.getData()
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

  },
  getData(){
    app.request('live.index.base', {
      type: this.data.type
    }, true).then(res => {
      if (res.error === 0) {
        setTimeout(() => {
          res.data.content = base64.decode(res.data.content)
          res.data.content = app.towxml(res.data.content, 'html')
          this.setData({
            list: res.data
          })
        },500)
      }
    })
  }
})