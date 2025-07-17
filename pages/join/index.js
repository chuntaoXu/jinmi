// pages/join/index.js
const app = getApp()
const UTILS = app.requirejs('util')

const base64 = app.requirejs("base64")['Base64']

import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFirst: false,
    isEdit: false,
    loading: true,
    showPact: false,
    showPact2: false,
    grouplist: false,
    currentGroup: false,
    applystatus: 10,
    applydata: false,
    isAgree: false,
    region: [],
    brandname: '',
    merchname: '',
    represent: '',
    province: '',
    city: '',
    area: '',
    address: '',
    realname: '',
    mobile: '',
    groupid: '0',
    errmobile: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const isFirst = wx.getStorageSync('isFirstJoin') || 1

    // this.setData({
    //   isFirst: isFirst === 1 ? true : false
    // })
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
    this.getInfo()
  },

  /**
   * 获取基本信息
   */
  getInfo() {
    UTILS.checkAuth()

    app.request('merch.residence', {}, true).then(res => {
      if (res.error === 0) {
        res.data.applycontent = base64.decode(res.data.applycontent)
        res.data.applycontent2 = base64.decode(res.data.applycontent2)


        res.data.grouplist.forEach(v => {
          const content = base64.decode(v.applycontent)
          const content2 = base64.decode(v.applycontent2)
          v.applycontent = app.towxml(content, 'html')
          v.applycontent2 = app.towxml(content2, 'html')
        })

        if (!res.data.applydata.length && res.data.applydata.province) {
          this.setData({
            region: [res.data.applydata.province, res.data.applydata.city, res.data.applydata.area]
          })
        } else {
          this.setData({
            region: []
          })
        }
        const oldData = wx.getStorageSync('stepOne')

        if (!res.data.applydata.length && res.data.applydata.groupid > 0) {
          for (let i = 0; i < res.data.grouplist.length; i++) {
            const item = res.data.grouplist[i];
            if (item.id == res.data.applydata.groupid) {
              res.data.applydata.groupname = item.name
              this.setData({
                currentGroup: item
              })
            }
          }
          if (res.data.applydata.licenseimg) {
            this.setData({
              licenseimgFile: [{
                url: res.data.applydata.licenseimg
              }]
            })
          }
          if (res.data.applydata.authcertimg) {
            this.setData({
              authcertimgFile: [{
                url: res.data.applydata.authcertimg
              }]
            })
          }
          if (res.data.applydata.storeimg) {
            this.setData({
              storeimgFile: [{
                url: res.data.applydata.storeimg
              }]
            })
          }
          if (res.data.applydata.honorcertimg) {
            this.setData({
              honorcertimgFile: [{
                url: res.data.applydata.honorcertimg
              }]
            })
          }
          if (res.data.applydata.brandlogo) {
            this.setData({
              brandlogoFile: [{
                url: res.data.applydata.brandlogo
              }]
            })
          }
          if (res.data.applydata.quacertimgs.length > 0) {
            const quacertimgsFile = res.data.applydata.quacertimgs.map(v => {
              return {
                url: v
              }
            })
            this.setData({
              quacertimgsFile: quacertimgsFile
            })
          }
          if (res.data.applydata.factoryimgs.length > 0) {
            const factoryimgsFile = res.data.applydata.factoryimgs.map(v => {
              return {
                url: v
              }
            })
            this.setData({
              factoryimgsFile: factoryimgsFile
            })
          }

        } else {
          res.data.applydata = {}
          if (!oldData.groupid) {
            res.data.applydata.groupid = res.data.grouplist[0].id
          }
        }

        if (res.data.applystatus == '10') {
          const {
            applystatus,
            grouplist,
            applydata,
            signimg
          } = res.data
          this.setData({
            isFirst: true,
            loading: false,
            signimg,
            ...oldData,
            applystatus,
            grouplist,
            applydata,
            currentGroup: grouplist[0],
            groupid: grouplist[0].id,
            isEdit: true
          })
          if (oldData.groupid) {
            this.data.grouplist.map(v => {
              if (v.id == oldData.groupid) {
                this.setData({
                  currentGroup: v,
                  groupid: v.id,
                })
              }
            })
          }
        } else {
          this.setData({
            isFirst: false,
            ...oldData,
            ...res.data,
            isEdit: false,
            loading: false
          })
        }

        this.setStorage()
      }
    })
  },

  /**
   * 开始入驻
   */
  startJoin() {
    // wx.setStorageSync('isFirstJoin', 0)

    this.setData({
      isFirst: false
    })
  },

  /**
   * 选择入驻类型
   */
  onChange({
    detail
  }) {

    let stepTwo = wx.getStorageSync('stepTwo')
    if (stepTwo.groupid != detail) {
      stepTwo = {
        licenseimg: '',
        licenseimgFile: [],
        authcertimg: '',
        authcertimgFile: [],
        storeimg: '',
        storeimgFile: [],
        honorcertimg: '',
        honorcertimgFile: [],
        quacertimgs: [],
        quacertimgsFile: [],
        factoryimgs: [],
        factoryimgsFile: [],
        groupid: 0
      }
      wx.setStorageSync('stepTwo', stepTwo)
    }

    this.data.grouplist.map(v => {
      if (v.id == detail) {
        this.setData({
          currentGroup: v
        })
      }
    })

    this.setData({
      groupid: detail
    })
  },

  /**
   * 协议
   */
  onChangeAgree({
    detail
  }) {
    this.setData({
      isAgree: detail
    })
  },

  /**
   * 打开协议
   */
  openPact() {
    this.setData({
      showPact: true
    })
  },
  openPact2() {
    this.setData({
      showPact2: true
    })
  },
  onClose() {
    this.setData({
      showPact: false
    })
  },
  onClose2() {
    this.setData({
      showPact2: false
    })
  },

  /**
   * 选择地址
   */
  bindRegionChange({
    detail: {
      value
    }
  }) {
    this.setData({
      region: value,
      province: value[0],
      city: value[1],
      area: value[2]
    })
  },

  /**
   * 设置文本
   */
  setInput({
    detail,
    currentTarget: {
      dataset: {
        key
      }
    }
  }) {
    if (key === 'mobile') {
      const regMobile = /^1[1-9]\d{9}$/
      if (!regMobile.test(detail)) {
        this.setData({
          errmobile: '请输入正确的手机号'
        })
      } else {
        this.setData({
          errmobile: ''
        })
      }
    }
    this.setData({
      [key]: detail
    })
  },

  /**
   * 本地存储
   */
  setStorage() {
    const {
      applystatus,
      applydata,
      isAgree,
      region,
      brandname,
      merchname,
      represent,
      province,
      city,
      area,
      address,
      realname,
      mobile,
      groupid
    } = this.data

    wx.setStorageSync('stepOne', {
      applystatus,
      applydata,
      isAgree,
      region,
      brandname,
      merchname,
      represent,
      province,
      city,
      area,
      address,
      realname,
      mobile,
      groupid
    })
  },

  submit: UTILS.debounce(function () {
    const {
      brandname,
      merchname,
      represent,
      province,
      address,
      realname,
      errmobile,
      groupid,
      isAgree
    } = this.data

    if (!isAgree) return

    if (+groupid === 0) {
      Notify({
        type: 'warning',
        message: '请选择入驻类型！'
      })
      return
    }

    if (!merchname || !represent || !province || !address || !realname || errmobile) {
      Notify({
        type: 'warning',
        message: '请填写完整信息！'
      })
      return
    }

    this.setStorage()

    wx.navigateTo({
      url: '/pages/join/second'
    })

  }, 1000),

  /**
   * 编辑信息
   */
  toEdit() {
    this.setData({
      isEdit: true,
      isAgree: true,
      ...this.data.applydata
    })
  },

  /**
   * 预览海报
   */
  previewImage() {
    const {signimg} =this.data
    wx.previewImage({
      current: signimg,
      urls: [signimg]
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