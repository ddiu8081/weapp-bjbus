// pages/bus/detail.js
var app = getApp();

var timer;
Page({
  data: {
    options: [],
    bus_detail: [],
    stop_list: [],
    buses_list: [],
    stopRight: false,
  },

  onLoad: function (options) {
    this.setData({
      options: options
    });
  },
  onShow: function () {
    this.fetchBusDetail();
    // this.fetchStopList(this.data.options);
    // wx.startPullDownRefresh();
  },
  onHide: function() {
    var that = this;
    clearTimeout(timer);
  },
  onUnload: function () {
    var that = this;
    console.log("bus - on unload");
    console.log(that.data.bus_detail.desc);
    clearTimeout(timer);
  },
  onPullDownRefresh: function () {
    this.fetchBusDetail(this.data.options);
  },
  fetchBusDetail: function () {
    var that = this;
    wx.request({
      url: app.globalData.headUrl + '/btic/detail',
      data: {
        'lineid': this.options.lineid
      },
      success: function (res) {
        if (res.data.success) {
          console.log(res.data);
          that.setData({
            str: res.data
          });
          wx.setNavigationBarTitle({
            title: res.data.linename
          });
        }
      }
    })
  },
  fetchBusTime: function (options) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://api.ddiu.site/bjbus/time',
      data: {
        'line': options.name,
        'dir': options.direction,
        'stop': options.stop
      },
      success: function (res) {
        console.log(res.data);

        var buses_list = {};
        for (var i = 0; i < res.data.buses.length; i++) {
          var this_poi = res.data.buses[i].poi;
          buses_list[this_poi] = true;
        }
        that.setData({
          bus_detail: res.data,
          buses_list: buses_list,
          stopRight: res.data.first.poi != "单向停靠"
        });
        clearTimeout(timer);
        timer = setTimeout(function () {
          that.fetchBusDetail(that.data.options);
          console.log(new Date());
        }, 8000);

        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  }
})