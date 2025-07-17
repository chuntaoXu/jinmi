// pages/member/favorites.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    hasMore: true,
    isLoading: true,
    type: '0',
    merch1_show: false,
    merch2_show: false,
    merch3_show: false,
    merch4_show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo(), this.Refresh()
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
   * 获取收藏信息
   */
  getInfo() {
    app.request('member.info.merchshow', {}, true).then(res => {
      if (res.error === 0) {
        let {
          merch1_show,
          merch2_show,
          merch3_show,
          merch4_show
        } = res.data
        this.setData({
          merch1_show: !!+merch1_show,
          merch2_show: !!+merch2_show,
          merch3_show: !!+merch3_show,
          merch4_show: !!+merch4_show
        })
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
      type
    } = this.data

    if (!hasMore) return

    this.setData({
      isLoading: true
    })

    app.request('member.favorite.get_list', {
      page,
      type
    }, loading).then(res => {
      if (res.error === 0) {
        const {
          list: newList,
          total,
          pagesize
        } = res.data

        newList.forEach(v => {
          if (type == '0') {
            v.url = `/pages/goods/detail?id=${v.goodsid}`
          } else if (type == '5') {
            v.url = `/pages/company/detail?id=${v.merchid}`
          } else if (type == '3' || type == '4') {
            v.url = `/pages/agency/detail?type=${type}id=${v.merchid}`
          }
        })

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
      type: name
    }), this.Refresh()
  },

  /**
   * 切换收藏权限
   */
  onChangeSwitch({
    detail
  }) {
    const {
      type
    } = this.data
    const keyMap = {
      '0': '1',
      '3': '2',
      '4': '3',
      '5': '4'
    }

    app.request('member.info.merchsubmit', {
      type: detail ? '1' : '0',
      merchtype: keyMap[type]
    }, type).then(res => {
      if (res.error === 0) {
        this.getInfo()
      }
    })
  },

  /**
   * 取消收藏
   */
  onClose({
    target: {
      id
    }
  }) {
    const {
      list
    } = this.data

    const item = list[id]

    app.request('member.favorite.remove', {
      id: item.id
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '操作成功',
        })
        list.splice(id, 1)
        this.setData({
          list
        })
      }
    })
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