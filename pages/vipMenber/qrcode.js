const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    type: 2,
    url: '',
    typeGo: '',
    title: '',
    titleTrue: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options, 'options')
    this.setData({
      type: options.type,
      typeGo: options.typeGo || ''
    })
  },
  /**
   * 启动倒计时
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo()
    if (this.data.typeGo == 1) {
      app
        .request(
          'evaluation.homes.checkSubmits',
          {
            type: this.data.type
          },
          true
        )
        .then(res => {
          if (res.error == 0) {
            if (res.data.is_submit == 1) {
              console.log('!11', this.data.typeGo)
              this.setData({
                titleTrue: true,
                title: this.data.type == 1 ? '单位会员入会已提交资料' : this.data.type == 2 ? '个人会员入会已提交资料' : '会员证书年检已提交资料'
              })
            }
          }
        })
    } else if (this.data.typeGo == 2) {
      app
        .request(
          'evaluation.designer.checkSubmits',
          {
            type: this.data.type
          },
          true
        )
        .then(res => {
          if (res.error == 0) {
            if (res.data.is_submit == 1) {
              this.setData({
                titleTrue: true,
                title: this.data.type == 1 ? '高级设计师已提交资料' : this.data.type == 2 ? '中级设计师已提交资料' : '初级设计师已提交资料'
              })
            }
          }
        })
    } else if (this.data.typeGo == 3) {
      app
        .request(
          'evaluation.evaluating.checkSubmits',
          {
            type: this.data.type
          },
          true
        )
        .then(res => {
          if (res.error == 0) {
            if (res.data.is_submit == 1) {
              this.setData({
                titleTrue: true,
                title: '自测数据已提交资料'
              })
            }
          }
        })
    } else if (this.data.typeGo == 4) {
      app
        .request(
          'evaluation.evaluation.checkSubmits',
          {
            type: this.data.type
          },
          true
        )
        .then(res => {
          if (res.error == 0) {
            if (res.data.is_submit == 1) {
              this.setData({
                titleTrue: true,
                title: this.data.type == 1 ? '室内设计已提交资料' : this.data.type == 2 ? '陈设艺术设计已提交资料' : this.data.type == 3 ? '家装家居服务已提交资料' : this.data.type == 4 ? '绿色环保已提交资料' : this.data.type == 5 ? '企业水平自测已提交资料' : '企业水平评价已提交资料'
              })
            }
          }
        })
    }
  },

  goback() {
    // 指定去首页
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  /**
   * 刷新
   */

  /**
   * 获取基本信息
   */
  getInfo() {
    app.request('evaluation.homes.getQrcode', {}, true).then(res => {
      if (res.error == 0) {
        this.setData({
          url: 'https://jmwq.jiancedaojia.com/attachment/' + res.data.url
        })
      }
    })
  },
  showMemberPicker(e) {},
  /**
   * 扫一扫
   */
  scanCode() {},
  /**
   * 长按保存二维码
   */
  saveQrcode() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.url,
      success: () => {
        wx.showToast({ title: '已保存到相册，可在微信添加客服', icon: 'none' })
      },
      fail: () => {
        wx.showToast({ title: '保存失败，请检查权限', icon: 'none' })
      }
    })
  },
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
