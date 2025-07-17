// pages/project/index.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 'jc',
    showSearch: false,
    oldKeywords: '',
    keywords: '',
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
    }), (options.type == 'zl' ? wx.setNavigationBarTitle({
      title: '治理项目'
    }) : wx.setNavigationBarTitle({
      title: '检测项目'
    })), this.Refresh()
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
      keywords
    } = this.data

    if (!hasMore) return

    this.setData({
      isLoading: true
    })

    app.request('merch.project.get_list', {
      page,
      keywords
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
  toSearch() {
    this.setData({
      showSearch: true
    })
  },
  blurSearch() {
    const {
      oldKeywords,
      keywords
    } = this.data

    if (!keywords) {
      this.setData({
        showSearch: false
      })
    } else {
      this.setData({
        keywords: oldKeywords
      })
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