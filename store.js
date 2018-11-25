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
    thisBus: {
      id: null,
      stop: null,
      fav: false
    },
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
  addFav: function (lineid, linename, stopid, callback) {
    if (this.data.favList.length >= 10) {
      callback(false, "最多收藏10条线路哦")
    } else {
      this.data.favList.push({
        id: lineid,
        name: linename,
        stop: stopid
      });
      this.update();
      wx.setStorage({
        key: "favList",
        data: this.data.favList
      })
      callback(true);
    }
  },
  removeFav: function (index, callback) {
    this.data.favList.splice(index, 1);
    this.update();
    wx.setStorage({
      key: "favList",
      data: this.data.favList
    })
    callback();
  }
}