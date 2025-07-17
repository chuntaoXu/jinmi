// pages/live/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    id: null,
    result:null,
    autoplay: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
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
  statechange(e){
    console.log(e);
  },
  errore(e){
    console.log(e);
  },
  toH5(e){
    let type = e.currentTarget.dataset.type
    wx.navigateTo({
      url: `./h5/h5?type=${type}`,
    })
  },
  getUrl(code){
    let _this = this
    wx.request({
      url: 'https://a.tmzxzb.com/enterpriseAPI/api/get_live_url',
      data: {
        appId: '3d0477eba248c18f3df025282c595b2b',
        code: code
      },
      method: 'get',
      success: function (res) {
        _this.setData({
          result: res.data.result
        })
      },
      fail: function (err) {
        console.log(err);
      },
    })
  },
  getData(){
    app.request('live.get_detail', {
      id: this.data.id
    }, true).then(res => {
      if (res.error === 0) {
        this.setData({
          list: res.data
        })
        this.getUrl(res.data.video)
      }
    })
  }
})