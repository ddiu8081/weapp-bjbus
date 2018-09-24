// pages/index/search.js
var observer = require('../../libs/observer').observer;
var app = getApp();

Page(observer({
  props: {
    data: require('../../stores/globalData').default,
  },
  data: {
    searchList: []
  },
  onLoad: function (options) {
  },
  onShow: function () {
  },
  setLocation: function () {
    var that = this;
    wx.pro.chooseLocation()
    .then(res => {
      var pages = getCurrentPages(); // 当前页面
      var indexPage = pages[pages.length - 2]; // 前一个页面
      that.props.data.location = {
        isSet: true,
        lat: res.latitude,
        lng: res.longitude,
        address: res.name
      };
      indexPage.initStopList();
      wx.navigateBack({
        delta: 1
      });
    });
  },
  handleInput: function (event) {
    var str = event.detail.value.toUpperCase();
    if (str.length > 0) {
      this.search(str);
    } else {
      this.setData({
        searchList: []
      });
    }
  },
  search: function (str) {
    var count = app.globalData.busList.count;
    var busList = app.globalData.busList.lines;
    var arr = [];

    for (var i = 0; i < count; i++) {
      var thisBus = busList[i];
      if (thisBus.status == "0" && thisBus.linename.indexOf(str) >= 0) {
        arr.push(thisBus);
      }
    }
    this.setData({
      searchList: arr
    });
  }
}))