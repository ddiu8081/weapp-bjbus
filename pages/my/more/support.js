// pages/my/more/support.js
Page({
  data: {
  },
  onShareAppMessage: function (res) {
    return {
      title: '北京公交出行 | 更好用的实时公交',
      imageUrl: '/res/share_banner.png',
      path: '/pages/index/index'
    }
  },
  showDonateImage: function () {
    wx.previewImage({
      urls: ["https://ddiu.site/donate.png"]
    });
  }
})