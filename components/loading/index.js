// components/empty/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: {
      type: Boolean,
      value: true
    },
    more: {
      type: Boolean,
      value: true
    },
    len: {
      type: Number,
      value: 0
    },
    type: {
      type: String,
      value: 'normal'
    },
    text: {
      type: String,
      value: ""
    },
    urlText: {
      type: String,
      value: ""
    },
    url: {
      type: String,
      value: ""
    },
    urlType: {
      type: String,
      value: "switchTab"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})