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
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/time',
      data: {
        'lineid': that.data.thisBus.id,
        'stop': that.data.thisBus.stop
      },
    }).then(res => {
      console.log(res.data);
      if (res.data.success) {
        var lineTime = res.data.bus;
        var allStopId = res.data.stopid;
        var buses_list = {};
        var nearest = [{
            nsn: -1,
            srt: 999999999999
          }, {
            nsn: -1,
            srt: 999999999999
          }];
        for (var i = 0; i < lineTime.length; i++) {
          var thisBus = lineTime[i];
          if (parseInt(thisBus.nsn) <= allStopId) {
            if (thisBus.srt < nearest[0].srt) {
              nearest[1] = nearest[0];
              nearest[0] = thisBus;
            } else if (thisBus.srt < nearest[1].srt) {
              nearest[1] = thisBus;
            }
          }
          var suffix = thisBus.nsrt == -1 ? "" : "m";
          var stopId = thisBus.nsn + suffix;
          if (!buses_list[stopId]) {
            buses_list[stopId] = [];
          }
          buses_list[stopId].push(thisBus);
        }
        console.log(nearest);
        that.store.data.thisBus.stop = allStopId;
        // if (allStopId > 0) {
        //   that.store.data.thisBus.stopName = that.data.lineDetail.stations[allStopId - 1].name;
        // }
        that.update({
          stop_id: allStopId,
          buses_list: buses_list,
          nearest: nearest
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
        url: 'detail?id=' + oppositeId
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
  },
  nearStop: function () {
    var stop_id = this.data.stop_id;
    var thisStop = this.data.lineDetail.stations[stop_id - 1];
    this.update({
      location: {
        isSet: true,
        lat: thisStop.latitude,
        lng: thisStop.longitude,
        address: thisStop.name + "附近"
      }
    })
    wx.switchTab({
      url: '../index/index',
    });
  }
}));