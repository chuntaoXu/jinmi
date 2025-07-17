// pages/live/advertisement/form.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:null,
    phone:null,
    code:null,
    adress:null,
    needs:null,
    autosize:{
      maxHeight: 100, 
      minHeight: 50
    },
    isGet: false,
    downTime: null
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  submit(){
    const {name,phone,code,adress,needs} = this.data
    app.request('live.apply', {
      name,
      code,
      mobile:phone,
      address:adress,
      remark:needs
    }, true).then(res => {
      console.log(res);
      if (res.error === 0) {
        wx.showToast({
          title: '申请成功'
        })
        setTimeout(() => {
          wx.navigateBack()
        },2000)
      }
    })
  },
  getCode(){
    const {isGet,phone} = this.data
    const isPhone = (/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/).test(phone);
    let num = 60
    this.setData({
      downTime: num
    })
    if(!isPhone){ 
      wx.showToast({
        title: '请填写正确手机号码',
        icon: 'none'
      });
      return
    }
    if(isGet){
      wx.showToast({
        title: '请不要重复点击！',
        icon: 'none'
      });
      return
    }
    this.setData({
      isGet: true
    })
    let int = setInterval(()=>{
      num -=  1
      if(num == 0){
        clearInterval(int)
        this.setData({
          isGet: false
        })
      }
      this.setData({
        downTime: num
      })
    },1000)

    app.request('sms.apply', {
      mobile:phone
    }, true).then(res => {
      console.log(res);
    })
  },
})