import store from '../../store'
import create from '../../libs/store/create'

var app = getApp();

var timer;
create(store, ({
  data: {
    favList: []
  },
  onLoad: function (options) {
    console.log(options);
    var that = this;
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
    app.fetchLineDetail(options.id, function(data) {
      if (data.success) {
        that.setData({
          lineDetail: data
        });
        wx.hideNavigationBarLoading();
        // wx.startPullDownRefresh();
      }
    });
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
        that.getStar(that.data.thisBus.id, allStopId);
        wx.stopPullDownRefresh();
      }
    });
  },
  getStar: function (lineid, stopid) {
    var favList = this.store.data.favList;
    this.store.data.thisBus.fav = false;
    for (var i = 0; i < favList.length; i++) {
      var favItem = favList[i];
      if (favItem.id == lineid && favItem.stop == stopid) {
        this.store.data.thisBus.fav = true;
      }
    }
    this.update();
  },
  addFav: function () {
    var that = this;
    this.store.addFav(this.data.thisBus.id, this.data.stop_id, function() {
      that.store.data.thisBus.fav = true;
    });
    this.update();
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