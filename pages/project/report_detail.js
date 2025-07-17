// pages/project/report_detail.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'jcbg',
    id: 0,
    source: 'normal',
    windowWidth: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      windowWidth
    } = wx.getSystemInfoSync()


    this.setData({
      windowWidth,
      ...options
    }), (options.type == 'zlbg' ? wx.setNavigationBarTitle({
      title: '治理报告',
    }) : wx.setNavigationBarTitle({
      title: '检测报告',
    })), this.getInfo()
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

  getInfo() {
    const {
      type,
      id,
      source
    } = this.data

    let url = 'member.report.checkdetails'

    if (type == 'zlbg') {
      url = 'member.report.runredetails'
    }

    if (source === 'goods') {
      url = 'product.checkreport'
    }

    app.request(url, {
      id
    }, true).then(res => {
      if (res.error === 0) {
        const {
          thumbs
        } = res.data
        const newThumbs = []
        thumbs.forEach(v => {
          const item = {
            src: v
          }
          newThumbs.push(item)
        })

        this.setData({
          thumbs: newThumbs
        })
      }
    })
  },

  /**
   * 设置图片高度
   */
  setImage({
    detail: {
      width,
      height
    },
    currentTarget: {
      id
    }
  }) {
    const {
      thumbs,
      windowWidth
    } = this.data

    const imgHeight = parseInt(height * windowWidth / width)

    this.setData({
      ['thumbs[' + id + '].height']: imgHeight
    })

  },

  /**
   * 预览图
   */
  previewImage({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    const {
      thumbs
    } = this.data

    wx.previewImage({
      current: thumbs[index].src,
      urls: thumbs.map(v => v.src)
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