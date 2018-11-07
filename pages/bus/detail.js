import store from '../../store'
import create from '../../libs/store/create'

var app = getApp();

var timer;
create(store, ({
  onLoad: function (options) {
    console.log(options);
    var stopSet = false;
    if (options.stop) {
      stopSet = true;
    }
    this.setData({
      stopSet: stopSet,
      thisBus: {
        id: options.id,
        stop: options.stop
      }
    });
    this.fetchBusDetail();
  },
  onShow: function () {
    var that = this;
    wx.startPullDownRefresh();
    wx.setStorage({
      key: 'lastSeen',
      data: that.store.data.thisBus,
    })
  },
  // onHide: function() {
  //   var that = this;
  //   clearTimeout(timer);
  // },
  // onUnload: function () {
  //   var that = this;
  //   console.log("bus - on unload");
  //   console.log(that.data.bus_detail.desc);
  //   clearTimeout(timer);
  // },
  onPullDownRefresh: function () {
    this.fetchBusTime();
  },
  fetchBusDetail: function () {
    wx.showNavigationBarLoading();
    var that = this;
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/detail',
      data: {
        'lineid': that.data.thisBus.id
      }
    }).then(res => {
      if (res.data.success) {
        console.log(res.data);
        that.setData({
          lineDetail: res.data
        });
        wx.hideNavigationBarLoading();
        // wx.startPullDownRefresh();
      }
    });
  },
  fetchBusTime: function () {
    var that = this;
    // wx.showNavigationBarLoading();
    console.log(that.data.thisBus);
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/time',
      data: {
        'lineid': that.data.thisBus.id,
        'stop': that.data.thisBus.stop
      },
    }).then(res => {
      console.log(res.data);
      if (res.data.success) {
        var lineTime = res.data.bus
        var buses_list = {};
        for (var i = 0; i < lineTime.length; i++) {
          var thisBus = lineTime[i];
          var suffix = thisBus.nsrt == -1 ? "" : "m";
          var stopId = thisBus.nsn + suffix;
          if (!buses_list[stopId]) {
            buses_list[stopId] = [];
          }
          buses_list[stopId].push(thisBus);
        }
        that.update({
          stop_id: res.data.stopid,
          lineTime: lineTime,
          buses_list: buses_list
        });
        wx.stopPullDownRefresh();
      }
    });
    // wx.request({
    //   url: 'https://api.ddiu.site/bjbus/time',
    //   data: {
    //     'line': options.name,
    //     'dir': options.direction,
    //     'stop': options.stop
    //   },
    //   success: function (res) {
    //     console.log(res.data);

    //     var buses_list = {};
    //     for (var i = 0; i < res.data.buses.length; i++) {
    //       var this_poi = res.data.buses[i].poi;
    //       buses_list[this_poi] = true;
    //     }
    //     that.setData({
    //       bus_detail: res.data,
    //       buses_list: buses_list,
    //       stopRight: res.data.first.poi != "单向停靠"
    //     });
    //     clearTimeout(timer);
    //     timer = setTimeout(function () {
    //       that.fetchBusDetail(that.data.options);
    //       console.log(new Date());
    //     }, 8000);

    //     wx.hideNavigationBarLoading();
    //     wx.stopPullDownRefresh();
    //   }
    // });
  },
  changeDir: function () {
    var thisData = this.data.lineDetail;
    var oppositeId = app.getOppositeId(thisData.linename, thisData.lineid);
    if (oppositeId == "") {
      wx.showToast({
        title: '本车单向运行',
        icon: 'none'
      })
    } else {
      wx.redirectTo({
        url: 'detail?id=' + oppositeId + '&stop=1'
      });
    }
  },
  setStopId: function (event) {
    var that = this;
    this.setData({
      stopSet: true,
      thisBus: {
        id: that.data.thisBus.id,
        stop: event.currentTarget.dataset.id
      }
    });
    wx.startPullDownRefresh();
  }
}));