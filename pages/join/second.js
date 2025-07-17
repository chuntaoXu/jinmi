// pages/join/second.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL

import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    licenseimg: '',
    licenseimgFile: [],
    brandlogo: '',
    brandlogoFile: [],
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const stepOne = wx.getStorageSync('stepOne')
    const {
      groupid
    } = stepOne
    const oldData = wx.getStorageSync('stepTwo')

    this.setData({
      ...oldData,
      groupid
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
      licenseimgFile,
      brandlogoFile,
      authcertimgFile,
      storeimgFile,
      honorcertimgFile,
      quacertimgsFile,
      factoryimgsFile,
    } = this.data

    app.request('merch.residence', {}, true).then(res => {
      if (res.error === 0) {
        let {
          applydata: {
            licenseimg = '',
            brandlogo = '',
            authcertimg = '',
            storeimg = '',
            honorcertimg = '',
            quacertimgs = [],
            factoryimgs = []
          }
        } = res.data
        if (licenseimg) {
          this.setData({
            licenseimgFile: [{
              url: licenseimg
            }]
          })
        } else {
          licenseimg = licenseimgFile.length != 0 ? licenseimgFile[0].url : ''
        }
        if (brandlogo) {
          this.setData({
            brandlogoFile: [{
              url: brandlogo
            }]
          })
        } else {
          brandlogo = brandlogoFile.length != 0 ? brandlogoFile[0].url : ''
        }
        if (authcertimg) {
          this.setData({
            authcertimgFile: [{
              url: authcertimg
            }]
          })
        } else {
          authcertimg = authcertimgFile.length != 0 ? authcertimgFile[0].url : ''
        }
        if (storeimg) {
          this.setData({
            storeimgFile: [{
              url: storeimg
            }]
          })
        } else {
          storeimg = storeimgFile.length != 0 ? storeimgFile[0].url : ''
        }
        if (honorcertimg) {
          this.setData({
            honorcertimgFile: [{
              url: honorcertimg
            }]
          })
        } else {
          honorcertimg = honorcertimgFile.length != 0 ? honorcertimgFile[0].url : ''
        }
        if (quacertimgs.length > 0) {
          const quacertimgsFile = quacertimgs.map(v => {
            return {
              url: v
            }
          })
          this.setData({
            quacertimgsFile: quacertimgsFile
          })
        } else {
          quacertimgs = quacertimgsFile.map(v => v.url)
        }
        if (factoryimgs.length > 0) {
          const factoryimgsFile = factoryimgs.map(v => {
            return {
              url: v
            }
          })
          this.setData({
            factoryimgsFile: factoryimgsFile
          })
        } else {
          factoryimgs = factoryimgsFile.map(v => v.url)
        }
        this.setData({
          licenseimg,
          brandlogo,
          authcertimg,
          storeimg,
          honorcertimg,
          quacertimgs,
          factoryimgs
        }), this.setStorage()
      }
    })
  },

  /**
   * 上传图片
   */
  afterRead({
    detail: {
      file,
      index,
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

    const dataType = Object.prototype.toString.call(key).slice(8, -1)
    const isMultiple = Object.prototype.toString.call(key).slice(8, -1) === 'Array' ? true : false

    const _this = this
    const openid = wx.getStorageSync('openid')

    let filePath
    if (isMultiple) {
      const currentIndex = wx.getStorageSync('currenPushIndex') || 0
      wx.setStorageSync('pushLen', file.length)

      // 资质证书可能是对象
      if (Object.prototype.toString.call(file).slice(8, -1) === 'Object') {
        filePath = file.path
      } else {
        filePath = file[currentIndex].path
      }
    } else {
      filePath = file.path
    }

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
          if (dataType === 'String') {
            _this.setData({
              [name]: data.url,
              [name + 'File']: [{
                url: data.url
              }]
            })
          } else {
            key.push(data.url)
            fileList.push({
              url: data.url
            })
            _this.setData({
              [name]: key,
              [name + 'File']: fileList
            })
          }
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

        if (isMultiple) {
          const currentIndex = wx.getStorageSync('currenPushIndex') || 0
          const pushLen = wx.getStorageSync('pushLen')

          if (currentIndex + 1 < pushLen) {
            wx.setStorageSync('currenPushIndex', currentIndex + 1)
            this.uploadFiles(file, name)
          } else {
            wx.removeStorageSync('currenPushIndex')
            wx.removeStorageSync('pushLen')
          }
        }

        this.setStorage()
      }
    })
  },
  removeFile({
    detail: {
      index,
      name
    }
  }) {
    const {
      [name]: key,
      [name + 'File']: fileList
    } = this.data

    const dataType = Object.prototype.toString.call(key).slice(8, -1)

    if (dataType === 'String') {
      this.setData({
        [name]: '',
        [name + 'File']: []
      })
    } else {
      key.splice(index, 1)
      fileList.splice(index, 1)
      this.setData({
        [name]: key,
        [name + 'File']: fileList
      })
    }

    this.setStorage()

  },

  /**
   * 本地存储
   */
  setStorage() {
    wx.setStorageSync('stepTwo', this.data)
  },

  /**
   * 提交信息
   */
  submit: UTILS.debounce(function () {

    const {
      licenseimg,
      brandlogo,
      authcertimg,
      storeimg,
      quacertimgs,
      groupid
    } = this.data

    if (groupid == '1' && (!licenseimg || !authcertimg || !brandlogo)) {
      Notify({
        type: 'warning',
        message: '请上传必填的资质信息！'
      })
      return
    }

    if (groupid == '2' && (!licenseimg || !authcertimg || !storeimg)) {
      Notify({
        type: 'warning',
        message: '请上传必填的资质信息！'
      })
      return
    }

    if ((groupid == '3' || groupid == '4') && (!licenseimg || quacertimgs.length == 0 || !storeimg || !brandlogo)) {
      Notify({
        type: 'warning',
        message: '请上传必填的资质信息！'
      })
      return
    }

    if (groupid == '5' && (!licenseimg || !storeimg || !brandlogo)) {
      Notify({
        type: 'warning',
        message: '请上传必填的资质信息！'
      })
      return
    }

    if (groupid == '6' && (!licenseimg || !storeimg || !brandlogo)) {
      Notify({
        type: 'warning',
        message: '请上传必填的资质信息！'
      })
      return
    }

    const stepOne = wx.getStorageSync('stepOne')
    const stepTwo = wx.getStorageSync('stepTwo')

    const params = UTILS.objectMerge(stepOne, stepTwo)

    app.request('merch.residence.submit', {
      brandname: params.brandname,
      merchname: params.merchname,
      represent: params.represent,
      province: params.province,
      city: params.city,
      area: params.area,
      address: params.address,
      realname: params.realname,
      mobile: params.mobile,
      licenseimg: params.licenseimg,
      brandlogo: params.brandlogo,
      authcertimg: params.authcertimg,
      storeimg: params.storeimg,
      quacertimgs: JSON.stringify(params.quacertimgs),
      honorcertimg: params.honorcertimg,
      factoryimgs: JSON.stringify(params.factoryimgs),
      groupid: params.groupid
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '提交成功',
          mask: true
        }), wx.removeStorageSync('stepOne'), wx.removeStorageSync('stepTwo')
        if (res.data.servicepay == '0') {
          wx.redirectTo({
            url: `/pages/pay/index?regid=${res.data.regid}`
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
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