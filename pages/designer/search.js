// pages/index/index.js

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
    number: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options')
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  comeGo() {
    wx.navigateTo({
      url: this.data.number === 2 ? '/pages/designer/index' : '/pages/interior/index'
    })
  },
  /**
   * 刷新
   */

  /**
   * 获取证书记录
   */
  getCertRecord() {
    const cert_no = this.data.number
    wx.request({
      url: `https://zhrccp-api.cecctm.com/c/orders/certs/record?cert_no=${cert_no}`,
      method: 'GET',
      success: res => {
        console.log('证书记录:', res.data)
        // 这里可以 setData 到页面上
        // this.setData({ certRecord: res.data })
      },
      fail: err => {
        wx.showToast({ title: '请求失败', icon: 'none' })
        console.error('证书记录请求失败', err)
      }
    })
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
