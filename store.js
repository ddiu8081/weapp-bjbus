export default {
  data: {
    notice: '',
    location: {
      isSet: false,
      lat: 116.397818,
      lng: 39.907952,
      address: "我的位置"
    },
    favList: [],
    hasLoaded: false,
    hasfetchedBusList: false,
    thisBus: {
      id: null,
      stop: null,
      fav: false
    },
  },
  resetLoc: function (callback) {
    var that = this;
    var getLocation = function () {
      wx.getLocation({
        type: 'gcj02',
        altitude: false,
        success: function (res) {
          console.log(res);
          var locData = {
            isSet: false,
            lat: parseFloat(res.latitude),
            lng: parseFloat(res.longitude),
            address: "我的位置"
          };
          that.data.location = locData;
          that.update();
          callback(locData);
        }
      });
    };
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用地理位置
              getLocation();
            },
            fail() {
              console.log('用户已拒绝授权位置');
              wx.showModal({
                title: '提示',
                content: '由于「北京公交出行」依赖您的位置获取附近的公交站，请授权使用位置信息以保证服务正常运行。',
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定，打开设置窗口');
                    wx.openSetting({
                      success(res) {
                        console.log(res.authSetting)
                        if (res.authSetting['scope.userLocation']) {
                          getLocation();
                        } else {
                          console.log('用户在设置中拒绝授权');
                        }
                        // res.authSetting = {
                        //   "scope.userInfo": true,
                        //   "scope.userLocation": true
                        // }
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户取消授权弹窗');
                  }
                }
              })
            }
          })
        } else {
          getLocation();
        }
      }
    })
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