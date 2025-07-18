// pages/index/index.js

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
    // 表单数据
    profession: '会员',
    title: '个人会员',
    name: '',
    // 详情信息
    selectedName: '徐长权',
    selectedGender: '男',
    selectedWorkUnit: '天津金蚂蚁装饰工程有限公司天津金蚂蚁装饰工程有限公司',
    selectedCertificateLevel: '中级',
    selectedCertificateNumber: 'SH2070047Y',
    selectedIssueDate: '2007.08.26-2019.08.26',
    loopArray: new Array(10)
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
    console.log(e, '111')
    this.setData({
      twoOption: e.detail == '会员' ? this.data.titleOptions : e.detail == '专业会员' ? this.data.titleOptions1 : this.data.titleOptions2,
      title: e.detail == '会员' ? this.data.titleOptions[0].text : e.detail == '专业会员' ? this.data.titleOptions1[0].text : this.data.titleOptions2[0].text,
      profession: e.detail
    })

    console.log(this.data.twoOption, 'twoOption')
  },
  onTitleChange(e) {
    this.setData({
      title: e.detail
    })
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
  onReachBottom: function () {}
})
