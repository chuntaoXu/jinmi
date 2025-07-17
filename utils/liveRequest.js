const BASE_URL = 'https://api.morecanai.com/client/v1/'
let access_token = wx.getStorageSync('access_token')
let token_type = wx.getStorageSync('token_type')

let getLiveToken = function(){
  console.log('获取直播token');
  wx.request({
    url: BASE_URL+'obtain-access-token',
    method:'post',
    data:{
      "client_id": '',
      "client_secret": '',
    },
    success: function (res) {
      access_token = res.access_token
      token_type = res.token_type
    }
  })
}


const request = ({
  url,
  params,
  loading,
  ...args
}) => {

  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL+url,
      data: params,
      header: getHeader(),
      method: 'POST',
      ...args,
      success: function (res) {
        if (loading) {
          wx.hideLoading()
        }
        const ret = res.data
        resolve(ret)
      },
      fail: function (res) {
        if (loading) {
          wx.hideLoading()
        }
        wx.removeStorageSync('access_token')
        wx.removeStorageSync('token_type')
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

const getHeader = () => {
  let header = {
    "content-type": "application/json; charset=UTF-8;"
  }
  if(access_token){
    header.Authorization = token_type +' '+ access_token
  }else{
    getLiveToken()
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