export default {
  data: {
    notice: '',
    location: {
      isSet: false,
      lat: 0,
      lng: 0,
      address: "我的位置"
    },
    favList: [
      {
        id: 362,
        stop: 10
      },
      {
        id: 634,
        stop: 17
      }
    ],
    hasLoaded: false,
    stopList: {},
    nearBusArray: [],
    thisBus: {},
    lastSeen: [],
  },
  resetLoc: function (callback) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res);
        that.data.location = {
          isSet: false,
          lat: res.latitude,
          lng: res.longitude,
          address: "我的位置"
        }
        that.update();
        callback();
      }
    });
  }
}