// pages/goods/detail.js
const app = getApp()
const UTILS = app.requirejs('util')
const base64 = app.requirejs("base64")['Base64']

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    goods: false,
    currentBanner: 0,
    showPopup: false,
    popupPosition: 'bottom',
    popupType: 1, //1、分享 2、了解咨询 
    errmobile: '',
    region: [],
    name: '',
    mobile: '',
    gender: '',
    province: '',
    city: '',
    area: '',
    policyList: [], //保险承保图片数组
    //海报参数
    evalatImage:'',
    imagePath:"",
    maskHidden: false,
    qrcode_image:'',
    header_image: '',
    goods_image: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.scene){
      let opt = decodeURIComponent(options.scene)
      let arr = opt.split("=");
      this.setData({
        id: arr[1]
      })
    }else{
      this.setData({
        ...options
      })
    }
    this.getInfo()
    this.getInsurancePolicy()
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
    //设置海报图片信息
    // this.setImage()
  },
  showShare(){
    this.setData({
      showPopup: true,
      popupType: 1,
      popupPosition: 'bottom'
    })
  },
  showFrom(){
    this.setData({
      showPopup: true,
      popupType: 2,
      popupPosition: 'center'
    })
  },
  onClose(){
    this.setData({
      showPopup: false
    })
  },
  radioChange(e){
    console.log(e);
    let gender = e.detail
    this.setData({
      gender
    })
  },
  bindRegionChange({
    detail: {
      value
    }
  }) {
    this.setData({
      region: value,
      province: value[0],
      city: value[1],
      area: value[2]
    })
  },
  setInput({
    detail,
    currentTarget: {
      dataset: {
        key
      }
    }
  }) {
    if (key === 'mobile') {
      const regMobile = /^1[1-9]\d{9}$/
      if (!regMobile.test(detail)) {
        this.setData({
          errmobile: '请输入正确的手机号'
        })
      } else {
        this.setData({
          errmobile: ''
        })
      }
    }
    this.setData({
      [key]: detail
    })
  },
  submit(){
    let {id,name,mobile,gender,province,city,area} = this.data
    if(!name || !mobile || !gender || !province){
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    app.request('product.apply', {
      product_id: id,
      name,
      mobile,
      gender,
      province,
      city,
      area
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '提交成功'
        });
        this.onClose()
      }
    })
  },
  previewImage({
    currentTarget:{
      dataset:{
        type
      }
    }
  }){
    if(type == 1){ //建材证书
      let envpot_cert = this.data.goods.envpot_cert
      if(!envpot_cert){
        wx.showToast({
          title: '该产品暂无证书！',
          icon: 'none'
        })
        return
      }
      wx.previewImage({
        current: envpot_cert,
        urls: [envpot_cert]
      })
    }else{ //保单
      let policyList = this.data.policyList
      if(policyList.length == 0){
        wx.showToast({
          title: '该产品暂无保单！',
          icon: 'none'
        })
        return
      }
      wx.previewImage({
        current: policyList[0],
        urls: policyList
      })
    }
  },
  /* 获取保单信息 */
  getInsurancePolicy(){
    app.request('product.insureimg', {
      id: this.data.id
    }, true).then(res => {
      if (res.error === 0) {
        this.setData({
          policyList: res.data.thumbs
        })
      }
    })
  },
  /* 生成海报 */
  //点击生成海报
  formSubmit: function (e) {
    var that = this;
    this.setData({
      showPopup: false
    })
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 1000
    });
    that.createNewImg();
    setTimeout(function () {
      wx.hideToast()
      that.setData({
        maskHidden: true
      });
    }, 1000);
  },
  cancel(){
    this.setData({
      maskHidden: false
    })
  },
  setImage(){
    // this.getImageInfo('').then( res =>{ //仅支持网络路劲操作
    //   console.log("海报底部背景:" + res);
    //   this.setData({
    //     evalatImage: res
    //   })
    // })
    let member = wx.getStorageSync('member')

    this.getImageInfo(member.avatar).then( res =>{
      // console.log("头像:" + res);
      this.setData({
        header_image: res
      })
    })
    this.getImageInfo(this.data.goods.thumbs[0]).then( res =>{
      // console.log("商品背景图:" + res);
      this.setData({
        goods_image: res
      })
    })
    this.getImageInfo(this.data.goods.qrcode).then( res =>{
      // console.log("二维码:" + res);
      this.setData({
        qrcode_image: res
      })
    })

    // this.qrcode_image();

  },
  getImageInfo(url){
    return new Promise((res,rej)=>{
      wx.getImageInfo({
        src: url,
        success(ret) {
          console.log(ret);
          res(ret.path)
        },
        fail(error){
          rej(error)
        }
      })
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.clearRect(0, 0, 345, 534);
    context.setFillStyle("#fff")
    context.fillRect(0, 0, 345, 534)
    context.save();
 
    // var path = that.data.evalatImage;
    var path = '../../images/bg.png';
    var header_image = that.data.header_image;
    var goods_image = that.data.goods_image;
    var qrcode_image = that.data.qrcode_image;
    
    context.drawImage(path, 0, 0, 350, 534);

    let member = wx.getStorageSync('member')

    context.save();
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.font = 'normal bold 16px sans-serif';
    context.fillText(member.nickname, 92, 26);
    context.stroke();

    context.save();
    context.setFontSize(15);
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.font = 'normal lighter 15px sans-serif';
    context.fillText('金米查甲醛，环保健康家。', 92, 55);
    context.stroke();

    let {goods} = this.data

    context.save(); //保存之前的画布设置
    that.dealWords({
      ctx: context,                     //画布上下文 canvasID
      fontSize: 16,                //字体大小
      font: 'normal bold 16px sans-serif',  //字体样式
      word: goods.title,                  //需要处理的文字
      maxWidth: 300,             //一行文字最大宽度
      x: 20,                    //文字在x轴要显示的位置
      y: 384,                      //文字在y轴要显示的位置
      maxLine: 2              //文字最多显示的行数
    });
    context.stroke();


    context.save();
    context.font = 'normal lighter 13px sans-serif';
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText('远离装修甲醛污染，构筑一个健康的家！', 92, 470);
    context.stroke();

    context.save();
    context.font = 'normal lighter 13px sans-serif';
    context.setFillStyle('#333');
    context.setTextAlign('left');
    context.fillText('更多环保家居产品等您查……', 92, 490);
    context.stroke();

    // context.save();
    // context.font = 'normal lighter 15px sans-serif';
    // context.setFillStyle('#3FBB5D');
    // context.setTextAlign('left');
    // context.fillText('更多品质好货等着你', 10, 420);
    // context.stroke();
 
    context.save(); //保存之前的画布设置
    context.beginPath();
    context.arc(50, 40, 30, 0, 2 * Math.PI);
    context.setStrokeStyle("#3FBB5D");
    context.clip(); //裁剪上面的圆形
    context.drawImage(header_image,20, 10, 60, 60);
    context.restore();
    context.closePath();

    context.save(); //保存之前的画布设置
    // context.beginPath();
    context.drawImage(goods_image,20, 80, 305, 305);
    context.restore();
    context.closePath();


    context.save(); //保存之前的画布设置
    // context.beginPath();
    context.drawImage(qrcode_image,10, 440, 70, 70);
    context.restore();
    context.closePath();

    context.draw(true);//true表示保留之前绘制内容
 
 
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 1000);
  },
  //文本换行
  dealWords(options) {
    options.ctx.setFontSize(options.fontSize);//设置字体大小
    options.ctx.font = options.font;//设置字体样式
    var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);//实际总共能分多少行
    var count = allRow >= options.maxLine ? options.maxLine : allRow;//实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
 
    var endPos = 0;//当前字符串的截断点
    for (var j = 0; j < count; j++) {
      var nowStr = options.word.slice(endPos);//当前剩余的字符串
      var rowWid = 0;//每一行当前宽度    
      if (options.ctx.measureText(nowStr).width > options.maxWidth) {//如果当前的字符串宽度大于最大宽度，然后开始截取
        for (var m = 0; m < nowStr.length; m++) {
          rowWid += options.ctx.measureText(nowStr[m]).width;//当前字符串总宽度
          if (rowWid > options.maxWidth) {
            if (j === options.maxLine - 1) { //如果是最后一行
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 25);    //(j+1)*20这是每一行的高度        
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 25);
            }
            endPos += m;//下次截断点
            break;
          }
        }
      } else {//如果当前的字符串宽度小于最大宽度就直接输出
        options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 25);
      }
    }
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.getSetting({
      success(res) {
          if (res.authSetting['scope.writePhotosAlbum']) {
            that.saveImage()
          } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
              wx.authorize({
                  scope: 'scope.writePhotosAlbum',
                  success() {
                    that.saveImage()
                  },
                  fail(){
                      wx.showToast({
                          title: '您没有授权，无法保存到相册',
                          icon: 'none'
                      })
                  }
              })
          }else {
              wx.openSetting({
                  success(res) {
                      if (res.authSetting['scope.writePhotosAlbum']) {
                        that.saveImage()
                      }else{
                          wx.showToast({
                              title:'您没有授权，无法保存到相册',
                              icon:'none'
                          })                               
                      }
                  }
              })
          }
      }
    })
  },
  saveImage(){
    let _this = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              _this.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  qrcode_image: function () {
    let that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        grant_type: 'client_credential',
        appid: 'wx4f272ea653e0592e', //不能缺少
        secret: '088d543a1833d9e37bfe798ed0540599' //不能缺少
      },
      success: function (res) {
        wx.request({
          url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token,
          data: {
            "page": "pages/goods/detail", 
            "width": 200,
            "scene": "id=" + that.data.id,
            // "is_hyaline": true
          },
          responseType: 'arraybuffer', // 这行很重要,转为二进制数组
          header: {
            'content-type': 'application/json;charset=utf-8'
          },
          method: 'POST',
          success(res) {
            //转为base64
            let bin64 = wx.arrayBufferToBase64(res.data);

            that.setData({
              //base 64设置到页面上
              qrcode_image: "data:image/png;base64," + bin64
            })
          }
        })
      }
    })
  },
  toCompany(){
    let {goods} = this.data
    wx.navigateTo({
      url: `/pages/firm/detail?id=${ goods.merchid }`,
    })
  },
  toStore(){
    let {goods} = this.data
    wx.navigateTo({
      url: `/pages/store/list?id=${ goods.merchid }`,
    })
  },

  /**
   * 获取基本信息
   */
  getInfo() {
    const {
      id
    } = this.data
    app.request('product.get_detail', {
      id
    }, true).then(res => {
      if (res.error === 0) {
        const goods = res.data
        goods.content = base64.decode(goods.content)
        goods.content = app.towxml(goods.content, 'html')

        goods.mainPrice = goods.price.split('.')[0]
        goods.pointPrice = goods.price.split('.')[1]

        this.setData({
          goods
        })
        this.setImage()
      }
    })
  },

  setCurrent({
    detail: {
      current
    }
  }) {
    this.setData({
      currentBanner: current
    })
  },

  onChangeFavorite: UTILS.debounce(function () {
    const { goods } = this.data
    
    app.request('member.favorite.toggle', {
      productid: goods.id,
      merchid: goods.merchid,
      isfavorite: goods.favorite == 0 ? 1 : 0
    }, true).then(res => {
      if (res.error === 0) {
        wx.showToast({
          title: '操作成功'
        }), this.setData({
          ['goods.favorite']: goods.favorite == 0 ? 1 : 0
        })
        // this.changeList()
      }
    })
  }, 1000),

  changeList() {
    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]

    const list = prevPage.data.list

    let mark = -1
    list.forEach((v, idx) => {
      if (v.id == this.data.goods.id) {
        mark = idx
        return
      }
    })

    prevPage.setData({
      ['list[' + mark + '].favorite']: this.data.goods.favorite
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
    onShareTimeline(res){
      let {goods} = this.data
      return {
        title: goods.title,
        path: `pages/goods/detail?id=${goods.id}`,
        imageUrl: goods.thumbs[0]
      }
    },
    onShareAppMessage: function(ops) {
      let {goods} = this.data
      return {
        title: goods.title,
        path: `pages/goods/detail?id=${goods.id}`,
        imageUrl: goods.thumbs[0]
      }
    }
})