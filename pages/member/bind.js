// pages/member/bind.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    currentBank: -1,
    bankList: [],
    realname: '',
    bankcard: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBase()
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
  getBase() {
    app.request('shop.banklist').then(res => {
      if (res.error === 0) {
        this.setData({
          bankList: res.data
        }), this.getInfo()
      }
    })
  },

  /**
   * 获取基本资料
   */
  getInfo() {
    const {
      bankList
    } = this.data
    app.request('member.bank', {}, true).then(res => {
      if (res.error === 0) {
        bankList.map((v, i) => {
          if (v.bankname === res.data.bankname) {
            this.setData({
              currentBank: i
            })
            return
          }
        })
        this.setData({
          loading: false,
          ...res.data
        })
      }
    })
  },

  /**
   * 切换开户行
   */
  bindPickerChange({
    detail: {
      value
    }
  }) {
    this.setData({
      currentBank: value
    })
  },

  /**
   * 提交
   */
  submit: UTILS.debounce(function () {
    const {
      currentBank,
      bankList,
      realname,
      bankcard
    } = this.data

    if (!realname) {
      wx.showToast({
        title: '请填写持卡人姓名',
        icon: "none",
        mask: true
      })
      return
    }

    if (currentBank < 0) {
      wx.showToast({
        title: '请选择开户行!',
        icon: "none",
        mask: true
      })
      return
    }

    if (!bankcard) {
      wx.showToast({
        title: '请填写卡号',
        icon: "none",
        mask: true
      })
      return
    }

    app.request('member.bank.operate', {
      realname,
      bankname: bankList[currentBank].bankname,
      bankcard
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '提交成功！'
        })

        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      }
    })

  }, 1000),


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