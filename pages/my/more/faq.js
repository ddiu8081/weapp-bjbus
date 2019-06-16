// pages/my/more/faq.js
var app = getApp();

Page({
  data: {
    faq: []
  },
  onLoad: function (options) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: app.globalData.headUrl + '/app/faq',
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          faq: res.data
        });
      }
    })
  }
})