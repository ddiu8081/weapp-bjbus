var extendObservable = require('../libs/mobx').extendObservable;
var globalData = function () {
  extendObservable(this, {
    userId: '',
    location: {
      isSet: false,
      lat: 0,
      lng: 0,
      address: "我的位置"
    }
  });

  this.resetLoc = function (callback) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res);
        that.location = {
          isSet: false,
          lat: res.latitude,
          lng: res.longitude,
          address: "我的位置"
        }
        callback();
      }
    });
  }
  // this.login = function () {
  //   var that = this;
  //   wx.login({
  //     success: function (res) {
  //       wx.request({
  //         url: 'https://api.ddiu.site/bjbus/app/user/login?code=' + res.code,
  //         success: function (res) {
  //           console.log(res.data);
  //           that.userId = res.data.openid;
  //         }
  //       })
  //     }
  //   })
  // }
}

module.exports = {
  default: new globalData,
}