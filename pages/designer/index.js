// pages/index/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

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
  showMemberPicker(e) {
    app
      .request(
        'evaluation.designer.checkSubmits',
        {
          type: e.currentTarget.dataset.id
        },
        true
      )
      .then(res => {
        if (res.error == 0) {
          if (res.data.is_submit == 1) {
            wx.showToast({
              title: '您已提交过申请',
              icon: 'none'
            })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/vipMenber/qrcode?type=1'
              })
            }, 1500)
          } else {
            wx.navigateTo({
              url: `/pages/designer/info?id=${e.currentTarget.dataset.id}`
            })
          }
        }
      })

    // let id = e.currentTarget.dataset.id
    // wx.navigateTo({
    //   url: `/pages/designer/info?id=${id}`
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
