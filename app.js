//app.js
import './libs/wxPromise.min.js'
var observer = require('./libs/observer').observer;

App(observer({
  props: {
    data: require('./stores/globalData').default,
  },
  globalData: {
    headUrl: 'https://api.ddiu.site',
    // headUrl: 'http://localhost:8000',
    userId: ''
  },
  onLaunch: function () {
    this.login();
    this.initBusList();
  },
  login: function () {
    var that = this;
    wx.pro.login()
    .then(res => {
      wx.request({
        url: that.globalData.headUrl + '/bjbus/app/user/login?code=' + res.code,
        success: function (res) {
          console.log(res.data);
          that.globalData.userId = res.data.openid;
        }
      })
    });
  },
  initBusList: function () {
    var that = this;
    wx.request({
      url: that.globalData.headUrl + '/btic/list',
      success: function (res) {
        console.log(res.data);
        that.globalData.busList = {
          count: res.data.updateNum,
          lines: res.data.lines.line,
        }
      }
    })
  }
}))