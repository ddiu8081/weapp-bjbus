//index.js
var app = getApp();
var observer = require('../../libs/observer').observer;

Page(observer({
  props: {
    data: require('../../stores/globalData').default,
  },
  data: {
    success: true,
    notice: '',
    first_stop: '',
    near: {},
    first_buses: {}
  },
  onLoad: function () {
    var that = this;
    this.getNotice();
    this.resetLocation();
  },
  onShow: function () {
  },
  onHide: function () {
    // clearTimeout(timer);
  },
  onPullDownRefresh: function () {
    if (this.props.data.location.isSet) {
      that.initStopList();
    } else {
      this.resetLocation();
    }
  },
  onShareAppMessage: function () {
    return {
      title: '北京公交出行 | 更好用的实时公交',
      imageUrl: '/res/share_banner.png',
      path: '/pages/index/index'
    }
  },
  getNotice: function () {
    var that = this;
    wx.pro.request({
      url: app.globalData.headUrl + '/bjbus/app/notice',
    }).then(res => {
      console.log(res.data);
      that.setData({
        notice: res.data.notice
      })
    });
  },
  resetLocation: function() {
    var that = this;
    that.props.data.resetLoc(function () {
      that.initStopList();
    });
  },
  initStopList: function() {
    var that = this;
    var latitude = that.props.data.location.lat; // 纬度
    var longitude = that.props.data.location.lng; // 经度

    wx.showNavigationBarLoading();
    wx.pro.request({
      url: app.globalData.headUrl + '/bjbus/around',
      data: {
        'location': longitude + ',' + latitude
      }
    }).then(res => {
      console.log(res.data);
      if (!res.data.success) {
        that.setData({
          near: res.data
        })
        return;
      }
      var first_buses_array = res.data.pois[0].buses;
      var buses_count = first_buses_array.count;
      var buses_page = parseInt((buses_count - 1) / 5) + 1;
      var first_buses = new Array();
      for (var i = 0; i < buses_page; i++) {
        var left = i == (buses_page - 1) ? buses_count - 5 * i : 5;
        first_buses[i] = new Array();
        for (var j = 0; j < left; j++) {
          first_buses[i][j] = {};
          first_buses[i][j]['name'] = first_buses_array.data[i * 5 + j];
        }
      }
      that.setData({
        success: true,
        first_stop: res.data.pois[0].name,
        near: res.data,
        first_buses: first_buses
      })
      wx.hideNavigationBarLoading();
      // wx.startPullDownRefresh();
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
      that.fetchBusDetail(event.currentTarget.id, dataSet.opposite, that.data.first_stop, dataSet.page, dataSet.index);
    } else {
      wx.showToast({
        title: '本车单向运行',
        icon: 'none'
      })
    }
  }
}))
