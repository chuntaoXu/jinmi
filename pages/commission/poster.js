// pages/commission/poster.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    poster: false,
    reAuth: false,
    shareData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo()
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
    app.request('commission.poster.getimage', {}, true).then(res => {
      if (res.error === 0) {
        this.setData({
          poster: res.data.poster,
          shareData: {
            ...res.sysset
          }
        })
      }
    })
  },

  /**
   * 检查保存图片权限
   */
  checkAuth() {
    const _this = this
    const isFirst = wx.getStorageSync('isFirstWritePhotosAlbum') || 0
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              _this.saveImage()
            },
            fail() {
              if (isFirst === 0) {
                wx.setStorageSync('isFirstWritePhotosAlbum', 1)
              } else {
                _this.setData({
                  reAuth: true
                })
                wx.showToast({
                  title: '用户拒绝访问相册, 请再次点击重新授权',
                  icon: 'none',
                  mask: true
                })
              }
            }
          })
        } else {
          this.setData({
            reAuth: false
          })
          wx.removeStorageSync('isFirstWritePhotosAlbum')
          _this.saveImage()
        }
      }
    })
  },
  checkOpenSetting({
    detail: {
      authSetting
    }
  }) {
    const isFirst = wx.getStorageSync('isFirstWritePhotosAlbum') || 0
    if (!authSetting['scope.writePhotosAlbum']) {
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success() {
          this.saveImage()
        },
        fail() {
          if (isFirst === 0) {
            wx.setStorageSync('isFirstWritePhotosAlbum', 1)
          } else {
            this.setData({
              reAuth: true
            })
            wx.showToast({
              title: '用户拒绝访问相册, 请再次点击重新授权',
              icon: 'none',
              mask: true
            })
          }
        }
      })
    } else {
      this.setData({
        reAuth: false
      })
      wx.removeStorageSync('isFirstWritePhotosAlbum')
      this.saveImage()
    }
  },

  /**
   * 保存图片
   */
  saveImage: UTILS.debounce(function () {
    const {
      poster
    } = this.data

    this.setData({
      reAuth: false
    })

    wx.downloadFile({
      url: poster,
      success(res) {
        if (res.statusCode === 200) {
          const {
            tempFilePath
          } = res
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success(res) {
              wx.showToast({
                title: '保存成功',
                duration: 2000,
                mask: true
              })
            },
            fail(err) {
              wx.showToast({
                title: `保存失败,请联系管理员${JSON.stringify(err)}`,
                icon: "none",
                mask: true
              })
            }
          })
        }
      },
      fail(err) {
        wx.showToast({
          title: `下载失败,请联系管理员${JSON.stringify(err)}`,
          icon: "none",
          mask: true
        })
      }
    })
  }, 500),

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
    const {
      shareData,
      mid
    } = this.data
    return {
      title: shareData.shopname,
      path: `/pages/index/index?mid=${mid}`
    }
  }
})