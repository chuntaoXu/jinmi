// pages/agency/index.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    typeName: '',
    oldKeywords: '',
    keywords: '',
    city: '',
    list: [],
    page: 1,
    hasMore: true,
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    })

    switch (options.type) {
      case 'zcjjc':
        this.setData({
          typeName: '建材家具城'
        })
        wx.setNavigationBarTitle({
          title: '建材家具城'
        })
        break;
      case 'zsgs':
        this.setData({
          typeName: '装饰公司'
        })
        wx.setNavigationBarTitle({
          title: '装饰公司'
        })
        break;
      case 'zljg':
        this.setData({
          typeName: '治理机构'
        })
        wx.setNavigationBarTitle({
          title: '治理机构'
        })
        break;
      case 'jcjg':
        this.setData({
          typeName: '检测机构'
        })
        wx.setNavigationBarTitle({
          title: '检测机构'
        })
        break;
      case 'jxs':
        this.setData({
          typeName: '经销商'
        })
        wx.setNavigationBarTitle({
          title: '经销商'
        })
        break;

      default:
        this.setData({
          typeName: '建材/检测/治理机构'
        })
        wx.setNavigationBarTitle({
          title: '搜索'
        })
        break;
    }

    this.Refresh()
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
   * 刷新
   */
  Refresh() {
    this.setData({
      list: [],
      page: 1,
      hasMore: true
    }), this.getList(true)
  },

  /**
   * 获取列表
   */
  getList: UTILS.throttle(function (loading = false) {
    const {
      hasMore,
      page,
      list,
      keywords,
      type
    } = this.data

    if (!hasMore) return

    const city = wx.getStorageSync('city') || ''
    const location = wx.getStorageSync('location') || {}

    this.setData({
      city,
      isLoading: true
    })

    let groupid = 0
    switch (type) {
      case 'jcjjc':
        groupid = 6
        break;
      case 'zsgs':
        groupid = 5
        break;
      case 'zljg':
        groupid = 4
        break;
      case 'jcjg':
        groupid = 3
        break;
      case 'jxs':
        groupid = 2
        break;

      default:
        groupid = 0
        break;
    }

    app.request('merch.lists', {
      page,
      keywords,
      city,
      groupid,
      ...location
    }, loading).then(res => {
      if (res.error === 0) {
        const {
          list: newList,
          total,
          pagesize
        } = res.data

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

  /**
   * 搜索
   */
  blurSearch({
    detail: {
      value
    }
  }) {
    const {
      oldKeywords,
      keywords
    } = this.data

    this.setData({
      keywords: oldKeywords
    })

    if (value) {
      this.Refresh()
    }
  },
  setSearch({
    detail: {
      value
    }
  }) {
    this.setData({
      oldKeywords: value,
      keywords: value
    })
  },

  /**
   * 跳转
   */
  linkTo({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    const {
      list
    } = this.data

    const _item = list[index]

    switch (+_item.groupid) {
      case 6:
        wx.navigateTo({
          url: `/pages/material/index?id=${_item.id}`
        })
        break;
      case 5:
        wx.navigateTo({
          url: `/pages/company/detail?id=${_item.id}`
        })
        break;
      case 4:
        wx.navigateTo({
          url: `/pages/agency/detail?id=${_item.id}&type=zljg`
        })
        break;
      case 3:
        wx.navigateTo({
          url: `/pages/agency/detail?id=${_item.id}&type=jcjg`
        })
        break;
      case 2:
        wx.navigateTo({
          url: `/pages/goods/list?mid=${_item.id}`
        })
        break;

      default:
        break;
    }
  },

  /**
   * 获取授权设置
   */
  getSetting({
    detail: {
      authSetting
    }
  }) {
    app.checkAuth(authSetting)
  },

  /**
   * 打电话
   */
  makeCall({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    const {
      list
    } = this.data
    const item = list[index]

    if (!item.tel) {
      wx.showToast({
        title: '暂未电话信息',
        icon: "none",
        mask: true
      })
      return
    }

    wx.makePhoneCall({
      phoneNumber: item.tel
    })
  },

  /**
   * 导航
   */
  getLocation({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    const {
      list
    } = this.data
    const item = list[index]

    if (!item.lat || !item.lng) {
      wx.showToast({
        title: '暂未位置信息',
        icon: "none",
        mask: true
      })
      return
    }

    wx.openLocation({
      latitude: +item.lat,
      longitude: +item.lng,
      scale: 10,
      name: item.merchname,
      address: item.province + item.city + item.area + item.address
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
    this.Refresh()

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
  onShareAppMessage: function () {

  }
})