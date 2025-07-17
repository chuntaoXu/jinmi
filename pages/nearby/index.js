// pages/nearby/index.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList: [],
    groupid: 0,
    city: '',
    list: [],
    page: 1,
    hasMore: true,
    isLoading: true,
    showFilter: false
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
    // this.Refresh()
  },

  /**
   * 获取基本信息
   */
  getInfo() {
    app.request('merch.screen').then(res => {
      if (res.error === 0) {
        this.setData({
          groupList: res.data
        }), this.Refresh()
      }
    })
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
      groupid
    } = this.data

    if (!hasMore) return

    const city = wx.getStorageSync('city') || ''
    const location = wx.getStorageSync('location') || {}

    this.setData({
      city,
      isLoading: true
    })

    app.request('merch.lists', {
      page,
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
          url: `/pages/firm/detail?id=${_item.id}`
        })
        break;
      case 1:
        wx.navigateTo({
          url: `/pages/firm/detail?id=${_item.id}`
        })
        break;

      default:
        break;
    }
  },

  /**
   * 打开筛选
   */
  openFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  /**
   * 关闭筛选
   */
  onClose() {
    this.setData({
      showFilter: false
    })
  },

  /**
   * 切换筛选
   */
  onChangeFilter({
    target: {
      dataset: {
        id
      }
    }
  }) {
    this.setData({
      groupid: id,
      showFilter: false
    }), this.Refresh()
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