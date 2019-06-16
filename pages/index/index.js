import store from '../../store'
import create from '../../libs/store/create'

var app = getApp();

create(store, ({
  data: {
    thisTab: 1
  },
  onLoad: function () {
    var that = this;
    this.getNotice();
    // this.resetLocation();
  },
  onShow: function () {
    // this.setData({
    //   thisTab: 1
    // });
    wx.startPullDownRefresh();
  },
  onPullDownRefresh: function () {
    var storeData = {
      isSet: this.store.data.location.isSet,
      lng: parseFloat(this.store.data.location.lng),
      lat: parseFloat(this.store.data.location.lat),
      address: this.store.data.location.address
    };
    if (storeData.isSet) {
      this.initStopList(storeData);
    } else {
      this.resetLocation();
    }
    if (this.data.thisTab == 2) {
      var favList = this.selectComponent("#fav-list");
      favList.freshAll();
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
      url: app.globalData.headUrl + '/app/notice',
    }).then(res => {
      console.log(res.data);
      that.update({
        notice: res.data.notice
      })
    });
  },
  changeTab: function (event) {
    app.aldstat.sendEvent('index_change_tab', {
      index: event.currentTarget.dataset.index
    })
    this.setData({
      thisTab: event.currentTarget.dataset.index
    })
  },
  navToSearch: function () {
    if (!store.data.hasfetchedBusList) {
      wx.showToast({
        title: '线路信息还在加载...',
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.navigateTo({
        url: 'search'
      });
    }
  },
  resetLocation: function () {
    var that = this;
    that.store.resetLoc(function (locData) {
      that.initStopList(locData);
      wx.stopPullDownRefresh();
    });
  },
  initStopList: function(locData) {
    var that = this;
    var latitude = locData.lat; // 纬度
    var longitude = locData.lng; // 经度

    wx.showNavigationBarLoading();
    wx.pro.request({
      url: app.globalData.headUrl + '/around',
      data: {
        'location': longitude + ',' + latitude
      }
    }).then(res => {
      console.log(res.data);
      if (!res.data.success) {
        that.update({
          stopList: res.data
        })
        wx.hideNavigationBarLoading();
        return;
      }
      that.update({
        hasLoaded: true,
        stopList: res.data,
      });
      // var count = bus_array.count;
      // var buses_page = parseInt((count - 1) / 5) + 1;
      // var first_buses = new Array();
      // for (var i = 0; i < buses_page; i++) {
      //   var left = i == (buses_page - 1) ? count - 5 * i : 5;
      //   first_buses[i] = new Array();
      //   for (var j = 0; j < left; j++) {
      //     first_buses[i][j] = {};
      //     first_buses[i][j]['name'] = bus_array.data[i * 5 + j];
      //     console.log(app.getLineId(bus_array.data[i * 5 + j]));
      //   }
      // }
      // that.setData({
      //   success: true,
      //   first_stop: res.data.pois[0].name,
      //   stopList: res.data,
      //   first_buses: first_buses
      // })
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
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
