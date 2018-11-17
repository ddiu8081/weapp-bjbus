export default {
  data: {
    notice: '',
    location: {
      isSet: false,
      lat: 0,
      lng: 0,
      address: "我的位置"
    },
    favList: [],
    hasLoaded: false,
    stopList: {},
    nearBusArray: [],
    thisBus: {
      id: null,
      stop: null,
      fav: false
    },
    lastSeen: [],
  },
  resetLoc: function (callback) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      altitude: false,
      success: function (res) {
        console.log(res);
        var locData = {
          isSet: false,
          lat: res.latitude,
          lng: res.longitude,
          address: "我的位置"
        };
        that.data.location = locData;
        that.update();
        callback(locData);
      }
    });
  },
  addFav: function (lineid, stopid, callback) {
    console.log(lineid);
    console.log(stopid);
    this.data.favList.push({
      id: lineid,
      stop: stopid
    });
    this.update();
    wx.setStorage({
      key: "favList",
      data: this.data.favList
    })
    callback();
  }
}