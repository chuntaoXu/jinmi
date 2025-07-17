//app.js
const request = require('/utils/request.js')
const towxml = require('/towxml/index')

const QQMapWX = require('/utils/qqmap-wx-jssdk.min.js')
var qqmapsdk = new QQMapWX({
  key: 'DAWBZ-JBL3S-CPWOX-6YNKJ-BH2G7-PNBKU'
})

App({
  onLaunch: function () {
    this.getLocation()
  },
  getLocation(isPage = false) {
    const _this = this
    wx.getLocation({
      success(res) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (ret) {
            if (ret.status === 0) {
              const {
                address_component: {
                  city
                }
              } = ret.result

              wx.setStorageSync('city', city)
              wx.setStorageSync('location', {
                lat: res.latitude,
                lng: res.longitude
              })

              if (isPage) {
                const pages = getCurrentPages()
                const currentPage = pages[pages.length - 1]

                currentPage.Refresh()
              }

            } else {
              wx.showToast({
                title: ret.message,
                icon: "none"
              })
            }
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '用户拒绝了位置授权',
          icon: "none"
        })
      }
    })
  },
  getUserInfo(callBack) {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //     res.userInfo && callBack(res.userInfo)

          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //       callBack(res.userInfo)
          //     }
          //   }
          // })
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              // 可以将 res 发送给后台解码出 unionId
              res.userInfo && callBack(res.userInfo)
              wx.setStorageSync('userInfo', res.userInfo);
                
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
                callBack(res.userInfo)
              }
            }
          })
        } else {
          callBack(false)
        }
      }
    })
  },
  checkAuth(authSetting) {
    if (!authSetting['scope.userInfo']) {
      wx.showToast({
        title: '用户取消了授权, 将影响功能使用',
        icon: "none",
        mask: true
      }), wx.clearStorageSync()
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1000)
      return
    }

    if (!authSetting['scope.userLocation']) {
      wx.showToast({
        title: '用户未开启位置授权',
        icon: "none"
      })
    } else {
      this.getLocation(true)
    }
  },
  requirejs: function (fileName) {
    return require(`./utils/${fileName}.js`);
  },
  qqmapsdk,
  towxml,
  ...request,
  globalData: {
    BASE_URL: 'https://jmwq.jiancedaojia.com/app/index.php',
    userInfo: null
  }
})