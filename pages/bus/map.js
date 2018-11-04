// pages/bus/map.js
var app = getApp();

Page({
  data: {
    lineData: [],
    markers: [],
    polyline: [],
    stopMarks: []
  },
  onShow: function (options) {
    this.initData();
  },
  initData: function (lineid) {
    var that = this;
    wx.showNavigationBarLoading();
    that.initStopData(this.options.lineid, function (stopMarks) {
      console.log(stopMarks);
      that.initBusData(that.options.lineid, function (busMarks) {
        console.log(busMarks);
        that.setMarks(stopMarks.concat(busMarks));
        wx.hideNavigationBarLoading();
      });
    });
  },
  initStopData: function (lineid, callback) {
    var that = this;

    wx.pro.request({
      url: app.globalData.headUrl + '/btic/detail',
      data: {
        'lineid': lineid,
        'map': 'true'
      }
    }).then(res => {
      if (res.data.success) {
        console.log(res.data);
        wx.setNavigationBarTitle({
          title: res.data.linename
        });
        var stopMarks = that.getMarks(1, res.data.stations);
        that.setData({
          lineData: res.data,
          stopMarks: stopMarks,
          polyline: [{
            points: res.data.coord,
            arrowLine: true,
            color: "#5cadff",
            width: 7
          }]
        });
        callback(stopMarks);
      }
    });
  },
  initBusData(lineid, callback) {
    var that = this;
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/time',
      data: {
        'lineid': lineid,
        'stopid': '10'
      }
    }).then(res => {
      if (res.data.success) {
        console.log(res.data);
        var busMarks = that.getMarks(2, res.data.bus);
        callback(busMarks);
      }
    });
  },
  getMarks(markType, data) {
    var that = this;
    var marks = [];

    if (markType == 1) {
      // Stop Marks
      for (var i = 0, length = data.length; i < length; i++) {
        var item = data[i];
        marks.push({
          iconPath: "/res/stop_point.png",
          id: item.id,
          title: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          zIndex: 0,
          width: 18,
          height: 18,
          anchor: { x: .5, y: .5 }
        });
      }
    } else if (markType == 2) {
      // Bus Marks
      for (var i = 0, length = data.length; i < length; i++) {
        var item = data[i];
        marks.push({
          iconPath: "/res/bus_point.png",
          id: item.id,
          title: "下一站：" + item.ns,
          latitude: item.latitude,
          longitude: item.longitude,
          zIndex: 1,
          width: 24,
          height: 24,
          anchor: { x: .5, y: .5 }
        });
      }
    }
    return marks;
  },
  setMarks (marks) {
    this.setData({
      markers: marks
    });
  },
  refresh (event) {
    var that = this;

    wx.showNavigationBarLoading();
    that.initBusData(that.options.lineid, function (busMarks) {
      console.log(busMarks);
      that.setMarks(that.data.stopMarks.concat(busMarks));
      wx.hideNavigationBarLoading();
    });
  }
})