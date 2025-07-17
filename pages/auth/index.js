// pages/auth/index.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: false,
    phoneNumber: false,
    loginCode: false,
    userInfo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.clearStorageSync()

    const _this = this
    wx.login({
      success(res) {
        if (res.code) {
          _this.setData({
            loginCode: res.code
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
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
   * 获取授权
   */
  getUserinfo({ detail }) {
    if (detail.errMsg === 'getUserInfo:ok') {
      const { userInfo } = detail
      this.setData({
        userInfo: userInfo
      })
    } else {
      Toast.fail('用户拒绝授权')
    }
  },
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: res => {
        console.log(res)
        if (res.errMsg === 'getUserProfile:ok') {
          this.setData({
            userInfo: res.userInfo
          })
        } else {
          Toast.fail('用户拒绝授权')
        }
      }
    })
  },
  /**
   * 获取手机号授权
   */
  getPhoneNumber({ detail }) {
    const _this = this
    if (detail.errMsg === 'getPhoneNumber:ok') {
      console.log('!', 111)
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
          console.log(detail, 'detail')
          _this.toAuth(detail)
        },
        fail() {
          // session_key 已经失效，需要重新执行登录流程
          wx.login({
            success(res) {
              if (res.code) {
                _this.setData({
                  loginCode: res.code
                })
                _this.toAuth(detail)
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
      })
    } else {
      Toast.fail('用户拒绝授权')
    }
  },

  /**
   * 完成登录
   */
  toAuth({ encryptedData, iv }) {
    const _this = this
    const { userInfo, loginCode: code } = this.data
    app
      .request('wxapp.auth', {
        encryptedData: encryptedData,
        iv: iv,
        title: '1',
        code,
        ...userInfo
      })
      .then(res => {
        console.log('res', res)
        if (res.error === 0) {
          _this.setData({
            phoneNumber: res.data.mobile
          })
          console.log(res.data.openid, 'res.data.openid')
          wx.setStorageSync('openid', res.data.openid)
          wx.setStorageSync('phoneNumber', res.data.mobile)
          _this.getInfo()

          const pages = getCurrentPages()
          const prevPage = pages[pages.length - 2]

          prevPage.onLoad(), wx.navigateBack()
        }
      })
  },
  getInfo() {
    app.request('member.index', {}, true).then(res => {
      if (res.error === 0) {
        wx.setStorageSync('member', res.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
