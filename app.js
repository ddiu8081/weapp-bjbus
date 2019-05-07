//app.js
const ald = require('./utils/ald-stat.js')
import './libs/wxPromise.min.js'
import store from './store'

App({
  globalData: {
    headUrl: 'https://api.ddiu.site',
    // headUrl: 'http://localhost:8000',
    userId: '',
    busList: {
      count: 0,
      lines: []
    }
  },
  onLaunch: function () {
    // this.login();
    this.initBusList();
  },
  onShow: function () {
    
  },
  // login: function () {
  //   var that = this;
  //   wx.pro.login()
  //   .then(res => {
  //     wx.request({
  //       url: that.globalData.headUrl + '/bjbus/app/user/login?code=' + res.code,
  //       success: function (res) {
  //         console.log(res.data);
  //         that.globalData.userId = res.data.openid;
  //       }
  //     })
  //   });
  // },
  initBusList: function () {
    wx.pro.request({
      url: this.globalData.headUrl + '/btic/list'
    }).then(res => {
      console.log(res.data);
      this.globalData.busList = {
        count: res.data.updateNum,
        lines: res.data.lines.line,
      }
      store.data.hasfetchedBusList = true;
      this.initFavList();
      store.update();
    })
  },
  initFavList: function () {
    var favList = wx.getStorageSync("favList");
    if (favList) {
      store.data.favList = favList;
    }
  },
  fetchLineDetail: function (lineId, callback) {
    wx.pro.request({
      url: this.globalData.headUrl + '/btic/detail',
      data: {
        'lineid': lineId,
      },
    }).then(res => {
      // console.log(res.data);
      callback(res.data);
    });
  },
  fetchLineTime: function (lineId, stop, callback) {
    wx.pro.request({
      url: this.globalData.headUrl + '/btic/time',
      data: {
        'lineid': lineId,
        'stop': stop
      },
    }).then(res => {
      console.log(res.data);
      callback(res.data);
    });
  },
  getLineByName: function (lineName) {
    var that = this;
    var count = that.globalData.busList.count;
    var busList = that.globalData.busList.lines;
    var arr = [];

    for (var i = 0; i < count; i++) {
      var thisBus = busList[i];
      if (thisBus.status == "0" && lineName == thisBus.linename.split("(", 2)[0]) {
        arr.push(thisBus);
        if (i < count - 1) {
          var nextBus = busList[i + 1];
          if (nextBus.status == "0" && lineName == nextBus.linename.split("(", 2)[0]) {
            arr.push(nextBus);
          }
        }
        break;
      }
    }

    return arr;
  },
  getOppositeId: function (lineName, thisId) {
    var lineArr = this.getLineByName(lineName);
    if (lineArr.length == 1) {
      return "";
    } else {
      if (lineArr[1].id == thisId) {
        return lineArr[0].id;
      } else {
        return lineArr[1].id;
      }
    }
  },
  getStopId: function (stations, stopName) {
    for (var i = 0; i < stations.length; i++) {
      var thisStation = stations[i];
      if (thisStation.name == stopName) {
        return thisStation.id;
      }
    }
    return -1;
  }
})