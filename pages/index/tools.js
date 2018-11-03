// pages/index/tools.js
var app = getApp();

Page({
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
  },
  showSubwayMap: function () {
    wx.previewImage({
      urls: ["https://www.bjsubway.com/subway/images/subway_map.jpg"]
    });
  }
})