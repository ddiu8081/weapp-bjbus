// pages/my/index.js
var app = getApp();
var observer = require('../../libs/observer').observer;

Page(observer({
  props: {
    data: require('../../stores/globalData').default,
  },
  data: {
    update: '',
    userVer: ''
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.globalData.headUrl + '/bjbus/app/changelog',
      success: function (res) {
        that.setData({
          update: res.data[0].date
        });
      }
    })
  },
  onReady: function () {
  },
  onShow: function () {
    // console.log(this.props.data.userInfo)
    this.setData({
      userVer: wx.getStorageSync('userVer')
    })
  }
}))