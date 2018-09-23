// pages/my/more/support.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onReady: function () {

  },
  onShow: function () {

  },
  onShareAppMessage: function (res) {
    return {
      title: '北京公交出行',
      path: '/pages/index/index'
    }
  },
  showDonateImage: function () {
    wx.previewImage({
      urls: ["https://ddiu.site/donate.png"]
    });
  }
})