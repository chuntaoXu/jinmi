// pages/member/index.js
const app = getApp()
const UTILS = app.requirejs('util')

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    openid: false,
    phoneNumber: false,
    member: false,
    userInfo: false,
    loginCode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  onShow: function () {
    const _this = this
    const openid = wx.getStorageSync('openid') || false
    const phoneNumber = wx.getStorageSync('phoneNumber') || false
    if (openid && phoneNumber) {
      this.getInfo()
    } else {
      app.getUserInfo(userInfo => {
        console.log(userInfo)
        _this.setData({
          loading: false,
          userInfo: userInfo,
          openid,
          phoneNumber
        })
      })
      _this.setData({
        loading: false
      })
    }
  },

  /**
   * 获取基本信息
   */
  getInfo() {
    app.request('member.index', {}, true).then(res => {
      if (res.error === 0) {
        wx.setStorageSync('member', res.data)
        this.setData({
          loading: false,
          phoneNumber: res.data.mobile,
          member: {
            ...res.data
          }
        })
      }
    })
  },

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
      wx.checkSession({
        success() {
          //session_key 未过期，并且在本生命周期一直有效
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
        code,
        ...userInfo
      })
      .then(res => {
        if (res.error === 0) {
          _this.setData({
            phoneNumber: res.data.mobile
          })
          wx.setStorageSync('openid', res.data.openid)
          wx.setStorageSync('phoneNumber', res.data.mobile)
          this.getInfo()
        }
      })
  },

  /**
   * 联系客服
   */
  talkPhone() {
    const {
      member: { customerPhone }
    } = this.data
    wx.makePhoneCall({
      phoneNumber: customerPhone
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
  onPullDownRefresh: function () {
    this.getInfo()

    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
