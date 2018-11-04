import store from '../../store'
import create from '../../libs/store/create'

var app = getApp();

var timer;
create(store, ({
  onLoad: function (options) {
    console.log(options);
    this.update({
      thisBus: {
        id: options.id,
        stop: options.stop
      },
      lastSeen: [{
        id: options.id,
        stop: options.stop
      }]
    });
  },
  onShow: function () {
    var that = this;
    this.fetchBusDetail();
    // this.fetchStopList(this.data.options);
    // wx.startPullDownRefresh();
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
    this.fetchBusDetail(this.data.options);
  },
  fetchBusDetail: function () {
    var that = this;
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/detail',
      data: {
        'lineid': that.options.id
      }
    }).then(res => {
      if (res.data.success) {
        console.log(res.data);
        that.setData({
          lineDetail: res.data
        });
        // console.log(app.getLineId(res.data.linename));
        // wx.setNavigationBarTitle({
        //   title: res.data.linename
        // });
      }
    });
  },
  fetchBusTime: function (options) {
    var that = this;
    wx.showNavigationBarLoading();
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/time',
      data: {
        'lineid': busData.id,
        'stopid': busData.stop
      },
    }).then(res => {
      console.log(res.data);
      that.update({
        lineTime: res.data
      })
    });
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
  }
}));