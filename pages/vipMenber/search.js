// pages/index/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
import drawQrcode from '../../utils/map'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    professionOptions: [
      { text: '会员', value: '会员' },
      { text: '专业会员', value: '专业会员' },
      { text: '企业评价', value: '企业评价' }
    ],
    twoOption: [],
    titleOptions: [
      { text: '个人会员', value: '个人会员' },
      { text: '单位会员', value: '单位会员' },
      { text: 'IFI会员', value: 'IFI会员' }
    ],
    titleOptions1: [
      { text: '装饰材料师专业会员', value: '装饰材料师专业会员' },
      { text: '室内装饰预算师专业会员', value: '室内装饰预算师专业会员' },
      { text: '数字可视化设计师专业会员', value: '数字可视化设计师专业会员' },
      { text: '中国室内设计师专业会员', value: '中国室内设计师专业会员' },
      { text: '项目经理专业会员', value: '项目经理专业会员' },
      { text: '监理师专业会员', value: '监理师专业会员' },
      { text: '陈设艺术设计师专业会员', value: '陈设艺术设计师专业会员' }
    ],
    titleOptions2: [
      { text: '室内设计、施工企业', value: '室内设计、施工企业' },
      { text: '室内装饰监理企业', value: '室内装饰监理企业' }
    ],
    type: '',
    nameOrNo: '',
    // 表单数据
    profession: '会员',
    title: '个人会员',
    name: '',
    // 详情信息
    loopArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      twoOption: this.data.titleOptions,
      title: this.data.titleOptions[0].text
    })
  },
  onProfessionChange(e) {
    // 清空现有数据，避免Canvas ID冲突
    this.setData({
      loopArray: []
    })
    setTimeout(() => {
      this.setData({
        twoOption: e.detail == '会员' ? this.data.titleOptions : e.detail == '专业会员' ? this.data.titleOptions1 : this.data.titleOptions2,
        title: e.detail == '会员' ? this.data.titleOptions[0].text : e.detail == '专业会员' ? this.data.titleOptions1[0].text : this.data.titleOptions2[0].text,
        profession: e.detail
      })
    }, 100)
    this.onSearch()
  },
  onTitleChange(e) {
    // 清空现有数据，避免Canvas ID冲突
    this.setData({
      loopArray: []
    })
    setTimeout(() => {
      this.setData({
        title: e.detail
      })
    }, 100)
    this.onSearch()
  },
  onNameChange(event) {
    this.setData({
      nameOrNo: event.detail
    })
  },
  onSearch() {
    if (!this.data.nameOrNo) {
      wx.showToast({
        title: '请输入姓名/企业名称/证书编号',
        icon: 'none'
      })
      return
    }
    app
      .request(
        'evaluation.homes.getMember',
        {
          type: this.data.title,
          nameOrNo: this.data.profession == '企业评价' ? '' : this.data.nameOrNo,
          legalOrNameOrNo: this.data.profession !== '企业评价' ? '' : this.data.nameOrNo
        },
        true
      )
      .then(res => {
        console.log('object', res)
        if (res.error == 0) {
          // 为每个项目添加唯一的canvas ID
          const timestamp = Date.now()
          res.data.forEach((item, index) => {
            item.canvasId = `qrcode-${timestamp}-${index}`
            item.qrIndex = index
          })

          // 先设置数据
          this.setData({
            loopArray: res.data
          })

          // 延迟生成二维码，确保DOM渲染完成
          setTimeout(() => {
            res.data.forEach((item, index) => {
              this.generateQRCode(item.memberNo, item.canvasId)
            })
          }, 200)
        }
      })
  },

  /**
   * 生成并显示二维码
   */
  generateQRCode(memberNo, canvasId) {
    if (!memberNo || !canvasId) {
      return
    }
    const qrUrl = `https://www.cida.org.cn/hycx?sid=${memberNo}`
    console.log('生成二维码，Canvas ID:', canvasId)
    // 确保DOM已渲染完成后再绘制二维码
    setTimeout(() => {
      try {
        drawQrcode({
          width: 100,
          height: 100,
          canvasId: canvasId,
          text: qrUrl,
          callback(e) {
            console.log('二维码生成完成:', canvasId)
          }
        })
      } catch (error) {
        console.error('二维码生成失败:', error, canvasId)
      }
    }, 100)
  },

  /**
   * 刷新
   */

  /**
   * 获取基本信息
   */
  getInfo() {},

  /**
   * 扫一扫
   */
  scanCode() {},
  /**
   * 跳转小程序
   */

  onClose() {},

  /**
   * 获取授权设置
   */

  /**
   * 切换名人说
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 预览二维码
   */
  previewQRCode: function (e) {
    const url = e.currentTarget.dataset.url
    if (url) {
      wx.previewImage({
        current: url,
        urls: [url]
      })
    }
  }
})
