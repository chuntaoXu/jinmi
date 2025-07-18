// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: 10,
    timer: null,
    number: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.startCountdown()
    console.log(options, 'options')
    wx.setNavigationBarTitle({
      title: options.id == 1 ? '单位会员入会须知' : options.id == 2 ? '个人会员入会须知' : '会员证书年检须知'
    })
    this.setData({
      number: options.id
    })
  },
  /**
   * 启动倒计时
   */
  startCountdown() {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
    let t = this.data.time
    this.setData({ time: t })
    const timer = setInterval(() => {
      t--
      this.setData({ time: t })
      if (t <= 0) {
        clearInterval(timer)
        this.setData({ timer: null })
        // 倒计时结束后可在这里处理跳转或其他逻辑
      }
    }, 1000)
    this.setData({ timer })
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
   * 刷新
   */

  /**
   * 获取基本信息
   */
  getInfo() {},
  showMemberPicker(e) {},
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
  onUnload: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {}
})
