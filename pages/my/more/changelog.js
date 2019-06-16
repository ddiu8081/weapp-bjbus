// pages/my/more/changelog.js
var app = getApp();

Page({
  data: {
    changeLog: []
  },
  onLoad: function (options) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.pro.request({
      url: app.globalData.headUrl + '/app/changelog',
    }).then(res => {
      wx.hideNavigationBarLoading();
      console.log(res.data);
      that.setData({
        changeLog: res.data
      });
      wx.setStorage({
        key: "userVer",
        data: res.data[0].date
      })
    })
  }
})