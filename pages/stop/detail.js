import store from '../../store'
import create from '../../libs/store/create'

var app = getApp();
var timer;

create(store, ({
  data: {
    options: [],
    buslist: [],
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({
      options: options
    });
    this.fetchStopDetail(this.data.options);
  },
  onShow: function () {
    wx.startPullDownRefresh();
  },
  onHide: function () {
    console.log("stop - on hide");
  },
  onPullDownRefresh: function () {
    this.fetchPageDetail();
  },
  fetchStopDetail: function (options) {
    var that = this;
    wx.showNavigationBarLoading();
    var busArr = options.buses.split(",");
    var busList = [];
    for (var i = 0; i < busArr.length; i++) {
      busList.push({
        name: busArr[i],
        stop: options.name
      });
    }
    console.log(busList)
    that.setData({
      buslist: busList
    })
    wx.startPullDownRefresh();
  },
  fetchPageDetail: function () {
    var that = this;
    var busList = this.selectComponent("#buslist");
    busList.freshAll(function() {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  },
  showMap: function (event) {
    if (this.data.options.location) {
      var thisLoc = this.data.options.location.toString().split(',');
      wx.openLocation({
        latitude: parseFloat(thisLoc[1]),
        longitude: parseFloat(thisLoc[0]),
        scale: 18
      })
    }
  }
}));