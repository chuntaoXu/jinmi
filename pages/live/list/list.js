// pages/live/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:'https://kimmy.shop.wohomo.com/addons/manage/data/live/1.0.1.png',
    list: [],
    page: 1,
    totalPage: 1,
  },
  onLoad: function (options) {
    this.getData()
  },
  onShow: function () {

  },
  onReachBottom: function () {
    let {page, totalPage} = this.data
    if(page < totalPage){
      this.getData(true)
      this.setData({
        page: page + 1
      })
    }
  },
  toLive(e){
    let item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../index?id=${item.id}`
    })
  },
  getData(isPage){
    app.request('live.get_list', {
      page: this.data.page
    }, true).then(res => {
      console.log(res);
      if (res.error === 0) {
        if(isPage){
          this.setData({
            list: this.data.list.concat(res.data.list)
          })
        }else{
          this.setData({
            list: res.data.list
          })
        }
        this.setData({
          totalPage: res.total
        })
      }
    })
  }
})