// pages/index/index.js
const app = getApp()
const UTILS = app.requirejs('util')
const BASE_URL = app.globalData.BASE_URL
Page({
  /**
   * 页面的初始数据
   */
  data: {
    answers: {
      q1: '', // 第1题答案
      q2: '', // 第2题答案
      q3: '', // 第3题答案
      q4: '', // 第4题答案
      q5: '', // 第5题答案
      q6: '' // 第6题答案
    },
    canSubmit: false
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
  onShow: function () {},
  onQuestionChange(e) {
    console.log(e.currentTarget.dataset.question, ' e.currentTarget.dataset.question')
    console.log(e.detail, ' e.detail')
    const questionId = e.currentTarget.dataset.question
    const answer = e.detail
    // 更新答案
    this.setData({
      [`answers.${questionId}`]: answer
    })
    console.log(this.data.answers, ' this.data.answers')
    // 检查是否所有问题都已回答
    this.checkAllAnswered()
  },

  // 检查是否所有问题都已回答
  checkAllAnswered() {
    const { answers } = this.data
    const isAllAnswered = Object.values(answers).every(answer => answer !== '')
    this.setData({
      canSubmit: isAllAnswered
    })
  },
  submitEvaluation() {
    const contentd = {
      content: [
        {
          name: '获得室内设计相关专业本科及以上学历；',
          choose: this.data.answers.q1
        },
        {
          name: '在室内设计领域工作满5年；',
          choose: this.data.answers.q2
        },
        {
          name: '获得室内设计相关的全国性比赛奖项；',
          choose: this.data.answers.q3
        },
        {
          name: '出版过室内设计相关书籍；',
          choose: this.data.answers.q4
        },
        {
          name: '独立主持过设计项目；',
          choose: this.data.answers.q5
        },
        {
          name: '参加室内设计师中级考试且以“优秀”成绩通过考试；',
          choose: this.data.answers.q6
        }
      ]
    }
    app
      .request(
        'evaluation.evaluating.addEvaluating',
        {
          content: JSON.stringify(contentd.content)
        },
        true
      )
      .then(res => {
        if (res.error == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1500
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/vipMenber/qrcode?typeGo=3'
            })
          }, 1500)
        }
      })
      .catch(err => {
        console.error('提交失败:', err)
      })

    return
    if (this.data.canSubmit) {
      // 跳转到结果页面（微信二维码展示页）
      wx.navigateTo({
        url: '/pages/vipMenber/qrcode', // 根据实际路径修改
        success: () => {
          console.log('跳转到结果页面成功')
        },
        fail: err => {
          console.error('跳转失败:', err)
          wx.showToast({
            title: '跳转失败，请重试',
            icon: 'none'
          })
        }
      })
    } else {
      // 提示用户还有问题未回答
      wx.showToast({
        title: '请回答所有问题',
        icon: 'none'
      })
    }
  },

  /**
   * 刷新
   */

  /**
   * 获取基本信息
   */
  getInfo() {},
  showMemberPicker(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/designer/info?id=${id}`
    })
  },
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
