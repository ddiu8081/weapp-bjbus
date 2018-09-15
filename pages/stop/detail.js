// pages/stop/detail.js
var timer;

Page({
  data: {
    options: [],
    first_buses: {},
    swiper_current: 0,
    buses_count: 0
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
  onReady: function () {

  },
  onShow: function () {
    this.fetchStopDetail(this.data.options);
  },
  onHide: function () {
    console.log("stop - on hide");
    clearTimeout(timer);
  },
  onPullDownRefresh: function () {
    this.fetchPageDetail(this.data.swiper_current);
  },
  loadPage: function (event) {
    this.setData({
      swiper_current: event.detail.current,
    })
    this.fetchPageDetail(event.detail.current);
  },
  fetchStopDetail: function (options) {
    var that = this;
    wx.showNavigationBarLoading();
    var first_buses_array = options.buses.split(",");
    console.log(first_buses_array);
    var buses_count = first_buses_array.length;
    var buses_page = parseInt((buses_count - 1) / 5) + 1;
    var first_buses = new Array();
    for (var i = 0; i < buses_page; i++) {
      var left = i == (buses_page - 1) ? buses_count - 5 * i : 5;
      first_buses[i] = new Array();
      for (var j = 0; j < left; j++) {
        first_buses[i][j] = {};
        first_buses[i][j]['name'] = first_buses_array[i * 5 + j];
      }
    }
    that.setData({
      swiper_current: 0,
      first_buses: first_buses,
      buses_count: buses_count
    })
    wx.startPullDownRefresh();
  },
  fetchPageDetail: function (page) {
    var that = this;
    var buses_detail = that.data.first_buses[page];
    for (var i = 0; i < buses_detail.length; i++) {
      var dir = buses_detail[i].dir ? buses_detail[i].dir : '';
      that.fetchBusDetail(buses_detail[i].name, dir, that.data.options.name, page, i);
    }
    
    clearTimeout(timer);
    timer = setTimeout(function () {
      that.fetchPageDetail(that.data.swiper_current);
      console.log(new Date());
    }, 8000);
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  fetchBusDetail: function (line, dir, stop, page, index) {
    var that = this;
    var new_data = that.data.first_buses;
    new_data[page][index]['refresh'] = true;
    this.setData({
      first_buses: new_data
    });
    wx.request({
      url: 'https://api.ddiu.site/bjbus/time',
      data: {
        'line': line,
        'dir': dir,
        'stop': stop
      },
      success: function (res) {
        var new_data = that.data.first_buses;
        new_data[page][index]['detail'] = res.data;
        new_data[page][index]['refresh'] = false;
        if (res.data.success) {
          new_data[page][index]['dir'] = res.data.dir.id;
          new_data[page][index]['opposite'] = res.data.dir.opposite;
        }
        that.setData({
          first_buses: new_data
        });
        console.log(res.data);
      }
    });
  },
  getOpposite: function (event) {
    var dataSet = event.currentTarget.dataset;
    console.log(event.currentTarget)
    var that = this;
    if (!dataSet.success) {
      wx.showToast({
        title: '无数据',
        icon: 'none'
      })
    } else if (dataSet.opposite) {
      that.fetchBusDetail(event.currentTarget.id, dataSet.opposite, that.data.options.name, dataSet.page, dataSet.index);
    } else {
      wx.showToast({
        title: '本车单向运行',
        icon: 'none'
      })
    }
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
})