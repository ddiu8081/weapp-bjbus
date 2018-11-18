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
    // var buses_detail = that.data.first_buses[page];
    // for (var i = 0; i < buses_detail.length; i++) {
    //   var dir = buses_detail[i].dir ? buses_detail[i].dir : '';
    //   that.fetchBusDetail(buses_detail[i].name, dir, that.data.options.name, page, i);
    // }
    
    // clearTimeout(timer);
    // timer = setTimeout(function () {
    //   that.fetchPageDetail(that.data.swiper_current);
    //   console.log(new Date());
    // }, 8000);
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
}));