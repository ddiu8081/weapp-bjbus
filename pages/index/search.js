import store from '../../store'
import create from '../../libs/store/create'
var app = getApp();

create(store, ({
  data: {
    accuSearchList: [],
    normalSearchList: [],
    lastSeen1: [{
      line:1004,
      stop:10
    }]
  },
  onLoad: function (options) {
    console.log(this.store.data.thisBus)
  },
  onShow: function () {
  },
  setLocation: function () {
    var that = this;
    wx.pro.chooseLocation()
    .then(res => {
      that.update({
        location: {
          isSet: true,
          lat: res.latitude,
          lng: res.longitude,
          address: res.name
        }
      })
      wx.navigateBack({
        delta: 1
      });
    });
  },
  handleInput: function (event) {
    var str = event.detail.value.toUpperCase();
    if (str.length > 0) {
      this.search(str);
    } else {
      this.setData({
        accuSearchList: [],
        normalSearchList: []
      });
    }
  },
  search: function (str) {
    var count = app.globalData.busList.count;
    var busList = app.globalData.busList.lines;
    var accuArr = [];
    var normalArr = [];

    for (var i = 0; i < count; i++) {
      var thisBus = busList[i];
      if (thisBus.status == "0" && thisBus.linename.indexOf(str) >= 0) {
        var lineNames = thisBus.linename.split("(", 2);
        var lineInfo = {
          id: thisBus.id,
          name: lineNames[0],
          dir: lineNames[1].slice(0,-1)
        }
        if (str == lineNames[0]) {
          accuArr.push(lineInfo);
        } else {
          normalArr.push(lineInfo);
        }
      }
    }
    this.setData({
      accuSearchList: accuArr,
      normalSearchList: normalArr
    });
  }
}))