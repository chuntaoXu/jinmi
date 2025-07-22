// pages/index/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 表单数据
    profession: '会员',
    title: '个人会员',
    name: '',
    // 详情信息
    selectedName: '徐长权',
    selectedGender: '男',
    selectedWorkUnit: '天津金蚂蚁装饰工程有限公司天津金蚂蚁装饰工程有限公司',
    selectedCertificateLevel: '中级',
    selectedCertificateNumber: 'SH2070047Y',
    selectedIssueDate: '2007.08.26-2019.08.26',
    loopArray: new Array(10),
    number: 2,
    cert_no: '',
    id_number: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      number: options.id || 2
    })
    // 页面加载时请求证书记录
    this.getCertRecord()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  onEnterpriseNameChange(e) {
    this.setData({
      id_number: e.detail
    })
  },
  onCertNoChange(e) {
    this.setData({
      cert_no: e.detail
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  comeGo() {
    wx.navigateTo({
      url: '/pages/interior/index'
    })
  },
  /**
   * 刷新
   */

  /**
   * 获取证书记录
   */
  getCertRecord() {
    this.setData({
      loopArray: []
    })
    if (!this.data.cert_no && !this.data.id_number) {
      wx.showToast({
        title: '请填写证件编号或证书编号',
        icon: 'none'
      })
      return
    }
    app
      .request(
        'evaluation.homes.getRecord',
        {
          cert_no: this.data.cert_no,
          id_number: this.data.id_number
        },
        true
      )
      .then(res => {
        if (res.error == 0) {
          this.setData({
            loopArray: res.data
          })
        }
      })
    // const cert_no = this.data.number
    // wx.request({
    //   url: `https://zhrccp-api.cecctm.com/c/orders/certs/record?id_number=${cert_no}`,
    //   method: 'GET',
    //   success: res => {
    //     console.log('证书记录:', res.data)
    //     // 这里可以 setData 到页面上
    //     // this.setData({ certRecord: res.data })
    //   },
    //   fail: err => {
    //     wx.showToast({ title: '请求失败', icon: 'none' })
    //     console.error('证书记录请求失败', err)
    //   }
    // })
  },

  /**
   * 扫一扫
   */
  scanCode() {},
  /**
   * 跳转小程序
   */

  onClose() {},

  /**
   * 获取授权设置
   */

  /**
   * 切换名人说
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {}
})
