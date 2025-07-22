const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time: 10,
    timer: null,
    number: 1,
    enterprise_name: '',
    name: '',
    phone: '',
    contactName: '',
    licenseimg: [],
    licenseimgFile: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      number: options.id
    })
  },

  // 输入事件处理函数
  onEnterpriseNameChange(event) {
    this.setData({
      enterprise_name: event.detail
    })
  },

  onNameChange(event) {
    this.setData({
      name: event.detail
    })
  },

  onPhoneChange(event) {
    console.log(event.detail, '!111')
    this.setData({
      phone: event.detail
    })
  },

  // 验证手机号格式
  validatePhone(phone) {
    const phoneReg = /^1[3-9]\d{9}$/
    return phoneReg.test(phone)
  },

  joinAssociation() {
    if (!this.data.enterprise_name) {
      wx.showToast({
        title: '请输入申报企业名称',
        icon: 'none'
      })
      return
    }
    if (!this.data.name) {
      wx.showToast({
        title: '请输入联系人姓名',
        icon: 'none'
      })
      return
    }
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入联系人电话',
        icon: 'none'
      })
      return
    }
    if (!this.validatePhone(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号格式',
        icon: 'none'
      })
      return
    }
    if (this.data.licenseimgFile.length === 0) {
      wx.showToast({
        title: '请上传企业营业执照',
        icon: 'none'
      })
      return
    }
    app
      .request(
        'evaluation.homes.addHome',
        {
          type: 1,
          enterprise_name: this.data.enterprise_name,
          name: this.data.name,
          phone: this.data.phone,
          business_license: JSON.stringify(this.data.licenseimgFile)
        },
        true
      )
      .then(res => {
        console.log('object', res)
        if (res.error == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/vipMenber/qrcode'
            })
          }, 1500)
        }
      })
  },
  /**
   * 启动倒计时
   */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  beforeRead(event) {
    const { file, callback } = event.detail
    if (file.size > 1024 * 1024 * 2) {
      wx.showToast({
        title: '文件大小不能超过2M',
        icon: 'none'
      })
      callback(false)
    } else {
      callback(true)
    }
  },
  afterRead({ detail: { file, index, name } }) {
    console.log(file, 'file')
    this.uploadFiles(file, name)
  },
  uploadFiles(file, name) {
    wx.showToast({
      title: '正在上传图片',
      icon: 'loading',
      duration: 2000,
      mask: true
    })
    const { [name]: key, [name + 'File']: fileList } = this.data
    const dataType = Object.prototype.toString.call(key).slice(8, -1)
    const _this = this
    const openid = wx.getStorageSync('openid')
    let filePath
    if (Array.isArray(file)) {
      // 多选时 file 是数组
      const currentIndex = wx.getStorageSync('currenPushIndex') || 0
      if (file[currentIndex] && file[currentIndex].path) {
        filePath = file[currentIndex].path
      } else {
        wx.showToast({ title: '文件路径不存在', icon: 'none' })
        return
      }
    } else if (file && file.path) {
      // 单选时 file 是对象
      filePath = file.path
    } else {
      wx.showToast({ title: '文件路径不存在', icon: 'none' })
      return
    }

    wx.uploadFile({
      url: BASE_URL + '?r=util.uploader.upload&file=file',
      filePath: filePath,
      name: 'file',
      header: {
        OPENID: openid
      },
      success: res => {
        const ret = JSON.parse(res.data)
        if (ret.error == 0) {
          const data = ret.data.files[0]
          // 始终按数组方式处理，支持多文件上传
          const newKey = Array.isArray(key) ? [...key] : []
          const newFileList = Array.isArray(fileList) ? [...fileList] : []

          newKey.push(data.url)
          newFileList.push({ url: data.url })

          _this.setData({
            [name]: newKey,
            [name + 'File']: newFileList
          })

          wx.showToast({
            title: '上传成功',
            icon: 'success',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: '上传失败，请重试',
            icon: 'none'
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: `${JSON.stringify(err)}`,
          icon: 'none'
        })
        console.log(err)
      }
    })
  },
  removeFile({ detail: { index, name } }) {
    const { [name]: key, [name + 'File']: fileList } = this.data
    // 确保都是数组
    const newKey = Array.isArray(key) ? [...key] : []
    const newFileList = Array.isArray(fileList) ? [...fileList] : []

    // 删除指定索引的文件
    newKey.splice(index, 1)
    newFileList.splice(index, 1)

    this.setData({
      [name]: newKey,
      [name + 'File']: newFileList
    })
  },

  /**
   * 刷新
   */

  /**
   * 获取基本信息
   */
  getInfo() {},
  showMemberPicker(e) {},
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
