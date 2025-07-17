// pages/pay/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    regitem: false,
    wechat: false,
    list: [],
    current: -1,
    showOffline: false,
    offlineInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    }), this.getInfo()
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
      regid
    } = this.data
    app.request('member.authpay', {
      regid
    }, true).then(res => {
      if (res.error === 0) {
        this.setData({
          ...res.data
        })
      }
    })
  },

  /**
   * 选择服务费
   */
  onChangeFee: UTILS.debounce(function ({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    this.setData({
      current: index
    }), this.getPayInfo()
  }, 500),

  /**
   * 获取支付信息
   */
  getPayInfo() {
    const {
      regitem: {
        id: regid
      },
      current,
      list
    } = this.data

    app.request('member.authpay.wechatpay', {
      regid,
      cateitemid: list[current].id
    }, true).then(res => {
      if (res.error === 0) {
        this.setData({
          ...res.data
        })
      }
    })
  },

  /**
   * 线下支付
   */
  openPayInfo: UTILS.debounce(function () {
    app.request('shop.receiptinfo', {}, true).then(res => {
      if (res.error === 0) {
        this.setData({
          offlineInfo: {
            ...res.data
          },
          showOffline: true
        })
      }
    })
  }, 1000),

  /**
   * 确认打款
   */
  confirm() {
    const {
      regitem: {
        id: regid
      },
      current,
      list,
      payimg
    } = this.data

    if (current < 0) {
      wx.showToast({
        title: '请先选择入驻费用',
        icon: "none"
      })
      this.setData({
        showOffline: false
      })
      return
    }

    // Tips: 确认前先判断是否上传打款凭证
    if (!payimg) {
      wx.showToast({
        title: '请上传打款凭证',
        icon: "none"
      })
      return
    }

    Dialog.confirm({
        title: '提示',
        message: '确认已经完成线下打款了吗？',
        asyncClose: true
      })
      .then(() => {
        app.request('member.authpay.transferpay', {
          regid,
          cateitemid: list[current].id,
          payimg
        }, true).then(res => {
          if (res.error === 0) {
            Dialog.close()
            wx.removeStorageSync('stepOne'), wx.removeStorageSync('stepTwo')
            wx.reLaunch({
              url: '/pages/pay/success'
            })
          }
        })
      })
      .catch(() => {
        Dialog.close()
      })
  },

  onClose() {
    this.setData({
      showOffline: false
    })
  },

  /**
   * 支付
   */
  submit: UTILS.debounce(function () {
    const {
      wechat
    } = this.data
    const _this = this

    wx.requestPayment({
      ...wechat.payinfo,
      success(res) {
        _this.complete()
      },
      fail(res) {
        wx.showToast({
          title: '支付失败',
          icon: "none",
          mask: true
        })
      }
    })
  }, 1000),

  /**
   * 支付成功回调
   */
  complete() {
    const {
      regitem: {
        id
      }
    } = this.data
    app.request('member.authpay.wechat_complete', {
      regid: id
    }, true).then(res => {
      if (res.error === 0) {
        wx.removeStorageSync('stepOne'), wx.removeStorageSync('stepTwo')
        wx.reLaunch({
          url: '/pages/pay/success'
        })
      }
    })
  },

  /**
   * 上传图片
   */
  afterRead({
    detail: {
      file,
      name
    }
  }) {
    this.uploadFiles(file, name)
  },
  uploadFiles(file, name) {
    wx.showToast({
      title: '正在上传图片',
      icon: 'loading',
      duration: 2000,
      mask: true
    })

    const {
      [name]: key,
      [name + 'File']: fileList
    } = this.data

    const _this = this
    const openid = wx.getStorageSync('openid')

    const filePath = file.path

    wx.uploadFile({
      url: BASE_URL + '?r=util.uploader.upload&file=file',
      filePath: filePath,
      name: 'file',
      header: {
        'OPENID': openid
      },
      success: res => {
        const ret = JSON.parse(res.data)
        if (ret.error == 0) {
          const data = ret.data.files[0]
          _this.setData({
            [name]: data.url,
            [name + 'File']: [{
              url: data.url
            }]
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: `${JSON.stringify(err)}`,
          icon: "none"
        })
        console.log(err)
      },
      complete: () => {
        wx.hideToast()
      }
    })
  },
  removeFile({
    detail: {
      name
    }
  }) {

    this.setData({
      [name]: '',
      [name + 'File']: []
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

  }
})