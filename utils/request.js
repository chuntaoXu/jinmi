const BASE_URL = 'https://jmwq.jiancedaojia.com/app/index.php'

const request = ({
  url,
  params,
  loading,
  ...args
}) => {

  const pages = getCurrentPages()
  if (pages.length === 10) {
    wx.showToast({
      title: "打开太多页面啦，请回退关闭几个页面",
      icon: 'none',
      duration: 2000,
      mask: true
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 2000)
  }

  if (loading) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }

  const mid = wx.getStorageSync('mid')
  if (mid) {
    Object.assign(params, {
      mid: mid
    })
  }

  if (url) {
    Object.assign(params, {
      r: url
    })
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL,
      data: params,
      header: getHeader(),
      method: 'POST',
      ...args,
      success: function (res) {
        if (loading) {
          wx.hideLoading()
        }
        const ret = res.data
        if (ret.error === 100001) {
          resolve(ret)
          wx.navigateTo({
            url: '/pages/auth/index'
          })
        } else if (ret.error !== 0) {
          wx.showModal({
            title: '提示',
            content: ret.message,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                resolve(ret)
                console.log('用户点击确认')
              }
            }
          })
        }
        resolve(ret)
      },
      fail: function (res) {
        if (loading) {
          wx.hideLoading()
        }
        reject(res)
      },
      complete: function (res) {
        if (loading) {
          wx.hideLoading()
        }
      },
    })
  })
}

//获取用户openid 设置请求头
const getHeader = () => {
  let header = {
    "content-type": "application/x-www-form-urlencoded"
  }
  const openid = wx.getStorageSync('openid')
  if (openid) {
    header['OPENID'] = openid
  }
  return header
}

module.exports = {
  request: function (url, params = {}, loading = false) {
    return request({
      url,
      params,
      loading
    })
  }
}