// pages/store/index.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    loading: true,
    categories: [],
    currentCate: 0,
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
      id: merchid
    } = this.data
    app.request('merch.store.catelist', {
      merchid
    }).then(res => {
      if (res.error === 0) {
        this.setData({
          loading: false,
          categories: res.data
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
      keywords,
      id: merchid,
      categories,
      currentCate
    } = this.data

    if (!hasMore) return

    this.setData({
      isLoading: true
    })

    app.request('merch.store.get_list', {
      page,
      keywords,
      category_id: categories[currentCate].id,
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

    if (!value) {
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
   * 选择分类
   */
  onSelected({
    currentTarget: {
      dataset: {
        index
      }
    }
  }) {
    this.setData({
      currentCate: index
    }), this.Refresh()
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
    this.setData({
      currentCate: 0,
    }), this.getInfo()

    wx.stopPullDownRefresh()
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