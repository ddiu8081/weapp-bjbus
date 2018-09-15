//index.js
var observer = require('../../libs/observer').observer;

Page(observer({
  props: {
    data: require('../../stores/globalData').default,
  },
  data: {
    first_stop: '',
    pois: {},
    first_buses: {}
  },
  onLoad: function () {
    // wx.showModal({
    //   title: '提示',
    //   content: '感谢体验者们的体验，“北京公交出行”小程序已经审核上架，所有人都可以在微信中搜索使用。\r\n体验版小程序将继续更新，下一版本将试验接入运通数据源和地图上显示公交车。您可以继续使用体验版，但可能完成度与稳定性不如正式版。\r\n如有意见或建议，欢迎使用 右上角胶囊-关于小程序-菜单-意见反馈 进行反馈。',
    //   showCancel: false,
    //   success: function (res) {
    //   }
    // })
  },
  onShow: function () {
    console.log(this.props.data.location);
    if (!this.props.data.location.isSet) {
      this.initLocation();
    }
    console.log(this.props.data.location);

  },
  onHide: function () {
    console.log("index - on hide");
    clearTimeout(timer);
  },
  onPullDownRefresh: function () {
    // this.fetchPageDetail(this.data.swiper_current);
  },
  onShareAppMessage: function () {

  },
  initLocation: function () {
    var that = this;
    wx.showNavigationBarLoading();
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.props.data.location = {
          lat: res.latitude,
          lng: res.longitude
        };
        that.initStopList(res);
      },
    });
  },
  initStopList: function(res) {
    console.log(res);
    var that = this;
    var latitude = res.latitude; // 纬度
    var longitude = res.longitude; // 经度

    wx.showNavigationBarLoading();
    wx.request({
      url: 'https://api.ddiu.site/bjbus/around',
      data: {
        'location': longitude + ',' + latitude
      },
      success: function (res) {
        console.log(res.data);
        if (!res.data.success) {
          wx.showModal({
            title: '错误',
            content: res.data.errMsg
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
          swiper_current: 0,
          first_stop: res.data.pois[0].name,
          pois: res.data.pois,
          first_buses: first_buses
        })
        wx.hideNavigationBarLoading();
        wx.startPullDownRefresh();
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
      that.fetchBusDetail(event.currentTarget.id, dataSet.opposite, that.data.first_stop, dataSet.page, dataSet.index);
    } else {
      wx.showToast({
        title: '本车单向运行',
        icon: 'none'
      })
    }
  }
}))
