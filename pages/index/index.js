// pages/index/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const base64 = app.requirejs('base64')['Base64']

Page({
  /**
   * 页面的初始数据
   */
  data: {
    city: '',
    banner: false,
    currentBanner: 0,
    navs: false,
    advs: false,
    brandadvs: false,
    topicvideo: false,
    topicarticle: false,
    talk: false,
    loading: true,
    reAuth: false,
    showPopup: false,
    scanCode: '',
    currentTalk: -1,
    list: [],
    page: 1,
    hasMore: true,
    isLoading: true,
    share: '',
    showGo: false,
    showdesigner: false,
    columns: [
      { text: '入会须知', value: '1' },
      { text: '会员查询', value: '2' }
    ],
    columnsdesigner: [
      { text: '设计师证书介绍', value: '1' },
      { text: '设计师自测系统', value: '2' },
      { text: '认证设计师查询', value: '3' }
    ],
    showInter: false,
    interior: [
      { text: '室内装饰企业水平评价-介绍', value: '1' },
      { text: '室内装饰企业水平评价-申报', value: '2' },
      { text: '企业水平评价自测系统', value: '3' },
      { text: '企业水平评价查询', value: '4' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sceneTxt = decodeURIComponent(options.scene)
    if (options.scene && sceneTxt) {
      const _obj = UTILS.str2obj(sceneTxt)
      if (_obj.mid) {
        wx.setStorageSync('mid', _obj.mid)
      }
    } else {
      wx.removeStorageSync('mid')
    }

    const isFirst = wx.getStorageSync('isFirstWriteCamera') || 0
    if (isFirst === 1) {
      this.setData({
        reAuth: true
      })
    }

    if (options && options.mid) {
      wx.setStorageSync('mid', options.mid)
    }
    this.Refresh()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onCancelPicker()
  },

  /**
   * 刷新
   */
  Refresh() {
    const city = wx.getStorageSync('city') || ''

    this.setData({
      city
    })

    this.getInfo()
  },

  /**
   * 获取基本信息
   */
  getInfo() {
    this.setData({
      loading: true
    })
    app.request('shop.index', {}, true).then(res => {
      if (res.error === 0) {
        const data = res.data
        data.banner.forEach(v => {
          return UTILS.checkRoute(v, 'link')
        })
        data.navs.forEach(v => {
          return UTILS.checkRoute(v, 'url')
        })
        data.advs.forEach(v => {
          return UTILS.checkRoute(v, 'link')
        })
        data.brandadvs.forEach(v => {
          return UTILS.checkRoute(v, 'link')
        })
        wx.setStorageSync('share', res.sysset)
        this.setData({
          ...data,
          loading: false,
          currentTalk: data.talk[0].id
        }),
          this.RefreshList()
      }
    })
  },

  /**
   * 刷新
   */
  RefreshList() {
    this.setData({
      list: [],
      page: 1,
      hasMore: true
    }),
      this.getList()
  },

  /**
   * 获取列表
   */
  getList: UTILS.throttle(function (loading = false) {
    const { hasMore, page, list, currentTalk: cateid } = this.data

    if (!hasMore) return

    this.setData({
      isLoading: true
    })

    app
      .request(
        'topic.get_list',
        {
          page,
          cateid,
          types: 1
        },
        loading
      )
      .then(res => {
        if (res.error === 0) {
          const { list: newList, total, pagesize } = res.data

          if (pagesize * page <= +total) {
            this.setData({
              page: page + 1,
              hasMore: true,
              loading: false,
              isLoading: false,
              list: list.concat(newList)
            })
          } else {
            this.setData({
              page: page + 1,
              hasMore: false,
              loading: false,
              isLoading: false,
              list: list.concat(newList)
            })
          }
        }
      })
  }),

  setCurrent({ detail: { current } }) {
    this.setData({
      currentBanner: current
    })
  },

  /**
   * 检查相机权限
   */
  checkAuth() {
    const _this = this
    const isFirst = wx.getStorageSync('isFirstWriteCamera') || 0
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              _this.scanCode()
            },
            fail() {
              _this.setData({
                reAuth: true
              })
              wx.showToast({
                title: '用户拒绝访问摄像头, 请再次点击重新授权',
                icon: 'none',
                mask: true
              })

              if (isFirst === 0) {
                wx.setStorageSync('isFirstWriteCamera', 1)
              }
            }
          })
        } else {
          _this.setData({
            reAuth: false
          })
          wx.removeStorageSync('isFirstWriteCamera')
          wx.showToast({
            title: '授权成功, 请再次点击使用功能',
            mask: true
          })
        }
      }
    })
  },
  checkOpenSetting({ detail: { authSetting } }) {
    const isFirst = wx.getStorageSync('isFirstWriteCamera') || 0

    if (!authSetting['scope.camera']) {
      this.setData({
        reAuth: true
      })

      wx.showToast({
        title: '用户拒绝访问摄像头, 请再次点击重新授权',
        icon: 'none',
        mask: true
      })

      if (isFirst === 0) {
        wx.setStorageSync('isFirstWriteCamera', 1)
      }
    } else {
      _this.setData({
        reAuth: false
      })
      wx.removeStorageSync('isFirstWriteCamera')
      wx.showToast({
        title: '授权成功, 请再次点击使用功能',
        mask: true
      })
    }
  },
  // 会员之家
  showMemberPicker(e) {
    if (e.currentTarget.dataset.name == '会员之家') {
      this.setData({
        showGo: true
      })
    } else if (e.currentTarget.dataset.name == '室内设计师') {
      this.setData({
        showdesigner: true
      })
    } else if (e.currentTarget.dataset.name == '室内装饰') {
      this.setData({
        showInter: true
      })
    }
  },
  onCancelPicker() {
    this.setData({
      showGo: false,
      showdesigner: false,
      showInter: false
    })
  },
  // 会员之家跳转
  onConfirmPicker(e) {
    if (e.detail.index == 0) {
      wx.navigateTo({
        url: '/pages/vipMenber/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/vipMenber/member'
      })
    }
    this.setData({
      showGo: false
    })
  },
  //室内设计师
  onCancelDesigner(e) {
    // if (e.detail.index == 1) {
    //   app.request('evaluation.evaluating.checkSubmits', {}, true).then(res => {
    //     console.log('object', res)
    //     if (res.error == 0) {
    //       if (res.data.is_submit == 1) {
    //         wx.showToast({
    //           title: '您已提交过申请',
    //           icon: 'none'
    //         })
    //         setTimeout(() => {
    //           wx.navigateTo({
    //             url: '/pages/vipMenber/qrcode?type=1'
    //           })
    //         }, 1500)
    //       } else {
    //         wx.navigateTo({
    //           url: `/pages/designer/chose`
    //         })
    //       }
    //     }
    //   })
    // } else {
    // }
    wx.navigateTo({
      url: e.detail.index == 0 ? '/pages/designer/unit' : e.detail.index == 1 ? '/pages/designer/chose' : '/pages/designer/check'
    })
    this.setData({
      showdesigner: false
    })
  },
  onCancelInter(e) {
    let obj = {
      0: '/pages/interior/unit',
      1: '/pages/interior/index',
      2: '/pages/interior/addform?id=5&typeGo=4',
      3: '/pages/interior/check'
    }
    wx.navigateTo({
      url: obj[e.detail.index]
    })
    this.setData({
      showInter: false
    })
  },

  /**
   * 扫一扫
   */
  scanCode() {
    const _this = this

    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        const { result } = res
        _this.setData({
          showPopup: true,
          scanCode: result
        })
      }
    })
  },
  /**
   * 跳转小程序
   */
  navToMp: UTILS.debounce(function () {
    const { scanCode: qrCode } = this.data

    const _this = this

    wx.navigateToMiniProgram({
      appId: 'wx438760012de48d74',
      path: 'pages/scan/verify_v2/index',
      extraData: {
        qrCode
      },
      envVersion: 'develop',
      success(res) {
        // 打开成功
        console.log('success', res)
        _this.setData({
          showPopup: false,
          scanCode: ''
        })
      },
      fail(err) {
        console.log('err', err)
      }
    })
  }, 800),

  onClose() {
    this.setData({
      showPopup: false
    })
  },

  /**
   * 获取授权设置
   */
  getSetting({ detail: { authSetting } }) {
    app.checkAuth(authSetting)
  },

  /**
   * 切换名人说
   */
  onChangeTalk({ detail: { name } }) {
    this.setData({
      currentTalk: name
    }),
      this.RefreshList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getInfo()

    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.hasMore && this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareTimeline(res) {
    let share = wx.getStorageSync('share')
    return {
      title: share.shopname,
      path: '/pages/index/index',
      imageUrl: share.shoplogo
    }
  },
  onShareAppMessage: function (ops) {
    let share = wx.getStorageSync('share')
    return {
      title: share.shopname,
      path: '/pages/index/index',
      imageUrl: share.shoplogo
    }
  }
})
