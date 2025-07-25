// pages/live/player/player.js
let liveRequest = require('../../../utils/liveRequest')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    name:null,
    phone:null,
    code:null,
    adress:null,
    needs:null,
    autosize:{
      maxHeight: 100, 
      minHeight: 50
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log(liveRequest);
    liveRequest.request('camera/streaming-address').then( res =>{

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
  showPopup(){
    this.setData({
      show: true
    })
  },
  hidePopup(){
    this.setData({
      show: false
    })
  }
})