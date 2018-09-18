// pages/bus/detail.js

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
    console.log(options);
    this.setData({
      options: options
    });
    wx.setNavigationBarTitle({
      title: options.name
    });
  },
  onShow: function () {
    var that = this;
    wx.request({
      url: 'https://api.ddiu.site/btic/detail',
      data: {
        'lineid': this.options.lineid
      },
      success: function (res) {
        if (res.data.errcode == "200") {
          console.log(res.data.busline[0]);
          that.setData({
            str: res.data.busline[0]
          });
        }
      }
    })
    // this.fetchStopList(this.data.options);
    // wx.startPullDownRefresh();
  },
  onHide: function() {
    var that = this;
    wx.setTopBarText({
      text: that.data.bus_detail.desc,
      success: function (res) {
        console.log(res);
      }
    });
    console.log("bus - on hide");
    clearTimeout(timer);
  },
  onUnload: function () {
    var that = this;
    console.log("bus - on unload");
    console.log(that.data.bus_detail.desc);
    wx.setTopBarText({
      text: that.data.bus_detail.desc,
      success: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
    clearTimeout(timer);
  },
  onPullDownRefresh: function () {
    this.fetchBusDetail(this.data.options);
  },
  fetchStopList: function (options) {
    var that = this;
    var stop_list = {};
    wx.request({
      url: 'https://api.ddiu.site/bjbus/stop',
      data: {
        'line': options.name,
        'dir': options.direction
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          stop_list: res.data[0].stop
        });
      }
    })
  },
  fetchBusDetail: function (options) {
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