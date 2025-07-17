// pages/goods/list.js
const app = getApp()
const UTILS = app.requirejs('util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nohcho: 0,
    loading: true,
    showSearch: false,
    showOptions: false,
    showFilters: false,
    oldKeywords: '',
    keywords: '',
    cid: 0,
    bid: 0,
    mid: 0,
    brandName: null,
    brandlistIndex: 0,
    brandlist: [],
    labellist: [],
    labelids: [],
    order: '',
    by: 'DESC',
    list: [],
    page: 1,
    hasMore: true,
    isLoading: true,
    iscert: false,
    isinsure: false,
    istracqr: 0, //溯源筛选
    sortList: [
      {name: '甲醛释放量',value: 'fhydea'},
      {name: '检测时间',value: 'fhydeatime'},
      {name: '溯源',value: 'tracqr'}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      ...options
    }),this.getInfo()

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
   * 获取基本信息
   */
  getInfo() {
    const {
      cid: category_id
    } = this.data
    // if (category_id === 0) return
    app.request('product.screen', {
      category_id
    }, true).then(res => {
      if (res.error === 0) {
        let {
          brandlist,
          labellist
        } = res.data
        labellist.forEach(v => {
          v.selected = 0
        })
        brandlist.unshift({
          name: '全部'
        })
        this.setData({
          brandlist,
          labellist
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
      keywords,
      cid: cates,
      bid: brandid,
      mid: merchid,
      labelids,
      order,
      by,
      nohcho,
      iscert,
      isinsure,
      istracqr
    } = this.data

    if (!hasMore) return

    this.setData({
      isLoading: true
    })
    let location = wx.getStorageSync('location')
    app.request('product.index.lists', {
      page,
      keywords,
      cates,
      brandid,
      merchid,
      labelids: JSON.stringify(labelids),
      order: order == 'tracqr'? '':order,
      by,
      nohcho,
      iscert: iscert? '1': '',
      isinsure: isinsure? '1': '',
      istracqr,
      lat: location.lat,
      lng: location.lng
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
   * 打开筛选
   */
  onShowFilter() {
    this.setData({
      showFilters: true
    })
  },
  onClose() {
    this.setData({
      showFilters: false
    })
  },

  /**
   * 打开排序
   */
  openOptions({
    currentTarget: {
      dataset: {
        order
      }
    }
  }) {
    const {
      order: currentOrder,
      by
    } = this.data
    let istracqr = 0;
    if(order == 'fhydea' || order == 'fhydeatime' || order == 'tracqr'){
      if(order == this.data.order){
        order = ''
      }else{
        if(order == 'tracqr'){
          istracqr = 1;
        }
      }
      this.setData({
        order,
        istracqr,
        by: 'DESC'
      })
      return
    }

    if(order == this.data.order){
      order = ''
    }
    if (order == currentOrder) {
      this.setData({
        by: by == 'DESC' ? 'ASC' : 'DESC',
        showFilters: false
      }), this.Refresh()
    } else {
      this.setData({
        order,
        by: 'DESC',
        showFilters: false
      }), this.Refresh()
    }
  },
  screenOptions({
    currentTarget:{
      dataset: {
        name
      }
    }
  }){
    let {iscert,isinsure} = this.data
    switch(name){
      case 'iscert': 
        iscert = !iscert;
        this.setData({
          iscert
        }),this.Refresh()
        break;
      case 'isinsure': 
        isinsure = !isinsure;
        this.setData({
          isinsure
        })
        break;
      default: break;
    }
    
  },
  /**
   * 筛选品牌
   */
  onSelectBrand({
    currentTarget: {
      dataset: {
        id,
        name
      }
    }
  }) {
    const {
      bid
    } = this.data

    this.setData({
      bid: bid == id ? 0 : id,
      brandName: bid == id ? null : name
    }), this.Refresh()
  },
  bindPickerChange(e){
    let value = e.detail.value
    const {brandlist} = this.data
    this.setData({
      brandlistIndex: value,
      bid: brandlist[value].id,
      brandName: brandlist[value].name
    }), this.Refresh()
  },
  /**
   * 筛选标签
   */
  onSelectLabel({
    currentTarget: {
      dataset: {
        index,
        idx
      }
    }
  }) {
    const {
      labellist
    } = this.data

    const currentLabel = labellist[index].selected
    const newLabelId = labellist[index].items[idx].id

    if (currentLabel == newLabelId) {
      this.setData({
        ['labellist[' + index + '].selected']: 0
      })
    } else {
      this.setData({
        ['labellist[' + index + '].selected']: newLabelId
      })
    }
  },

  /**
   * 生成筛选信息
   */
  generateFilter() {
    const {
      labellist
    } = this.data

    const labelids = []
    for (let i = 0; i < labellist.length; i++) {
      const _item = labellist[i]
      if (_item.selected > 0) {
        labelids.push(_item.selected)
      }
    }

    this.setData({
      showFilters: false,
      labelids
    }), this.Refresh()
  },

  /**
   * 重置
   */
  resetFilter() {
    let {
      labellist,
      order
    } = this.data

    labellist.forEach(v => {
      v.selected = 0
    })
    if(order == 'fhydea' || order == 'fhydeatime' || order == 'tracqr'){
      order = ''
    }
    this.setData({
      labellist,
      labelids: [],
      isinsure: '',
      istracqr: 0,
      order
    })
  },

  /**
   * 收藏
   */
  onChangeFavorite: UTILS.debounce(function ({
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

    app.request('member.favorite.toggle', {
      productid: item.id,
      merchid: item.merchid,
      isfavorite: item.favorite == 0 ? 1 : 0
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '操作成功'
        }), this.setData({
          ['list[' + index + '].favorite']: item.favorite == 0 ? 1 : 0
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
  onShareTimeline(res){
    let share = wx.getStorageSync('share')
    return {
      title: share.shopname,
      path: '/pages/index/index',
      imageUrl: share.shoplogo
    }

  },
  onShareAppMessage: function(ops) {
    let share = wx.getStorageSync('share')
    return {
      title: share.shopname,
      path: '/pages/index/index',
      imageUrl: share.shoplogo
    }
  }
})