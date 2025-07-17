// pages/company/detail.js
const app = getApp()
const UTILS = app.requirejs('util')
const base64 = app.requirejs("base64")['Base64']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    active: 0,
    detail: false,
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
    }), this.getInfo()
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
    const {
      id
    } = this.data
    app.request('merch.get_detail', {
      id
    }, true).then(res => {
      if (res.error === 0) {
        this.setData({
          detail: {
            ...res.data
          }
        })
        setTimeout(() => {
          res.data.desc = base64.decode(res.data.desc)
          res.data.desc = app.towxml(res.data.desc, 'html')

          res.data.desc2 = base64.decode(res.data.desc2)
          res.data.desc2 = app.towxml(res.data.desc2, 'html')

          this.setData({
            detail: {
              ...res.data
            }
          })
        }, 500);
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
      id: merchid,
      active
    } = this.data

    if (!hasMore) return

    this.setData({
      isLoading: true
    })

    let _url = 'merch.notice.get_list'

    app.request(_url, {
      page,
      merchid
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
   * 切换列表
   */
  onChange({
    detail: {
      name
    }
  }) {
    this.setData({
      active: name
    })
    if (name == '2') {
      this.Refresh()
    }
  },

  /**
   * 打电话
   */
  makeCall() {
    const {
      detail
    } = this.data

    if (!detail.tel) {
      wx.showToast({
        title: '暂未电话信息',
        icon: "none",
        mask: true
      })
      return
    }

    wx.makePhoneCall({
      phoneNumber: detail.tel
    })
  },

  /**
   * 导航
   */
  getLocation() {
    const {
      detail
    } = this.data

    if (!detail.lat || !detail.lng) {
      wx.showToast({
        title: '暂未位置信息',
        icon: "none",
        mask: true
      })
      return
    }

    wx.openLocation({
      latitude: +detail.lat,
      longitude: +detail.lng,
      scale: 10,
      name: detail.merchname,
      address: detail.province + detail.city + detail.area + detail.address
    })

  },

  /**
   * 收藏
   */
  onChangeFavorite: UTILS.debounce(function () {
    const {
      detail
    } = this.data

    app.request('member.favorite.toggle', {
      merchid: detail.id,
      isfavorite: detail.favorite == 0 ? 1 : 0
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '操作成功'
        }), this.setData({
          'detail.favorite': detail.favorite == 0 ? 1 : 0
        })
      }
    })
  }),

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
    const {
      active
    } = this.data
    if (active == '2') {
      this.getInfo()
      this.Refresh()
    } else {
      this.getInfo()
    }

    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const {
      active
    } = this.data
    if (active == '2') {
      this.data.hasMore && this.getList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})