// pages/member/invoice.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isRefuse: true,
    authprice: '0.00',
    company: '',
    bankname: '',
    account: '',
    contacts: '',
    telephone: '',
    address: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
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
    app.request('member.invoice').then(res => {
      if (res.error === 0) {
        this.setData({
          isRefuse: false,
          ...res.data
        })
      }
    })
  },

  /**
   * 提交
   */
  submit: UTILS.debounce(function () {
    const {
      id: regid,
      isRefuse,
      company,
      taxpayer,
      bankname,
      account,
      contacts,
      telephone,
      address
    } = this.data

    if (isRefuse) return

    if (!company || !taxpayer || !bankname || !account || !contacts || !telephone || !address) {
      wx.showToast({
        title: '请填写完整的开票信息',
        icon: "none",
        mask: true
      })

      return
    }

    app.request('member.invoicesub', {
      regid,
      company,
      taxpayer,
      bankname,
      account,
      contacts,
      telephone,
      address
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '提交成功！'
        })

        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    })

  }),

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