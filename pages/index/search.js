// pages/index/search.js
Page({
  data: {
    location: '我的位置'
  },
  onLoad: function (options) {
  
  },
  onReady: function () {
  
  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  setLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          location: res.address
        });
      }
    });
  }
})