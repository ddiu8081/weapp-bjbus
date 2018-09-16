//app.js
import './libs/wxPromise.min.js'
var observer = require('./libs/observer').observer;

App(observer({
  props: {
    data: require('./stores/globalData').default,
  },
  globalData: {
    userInfo: null
  },
  onLaunch: function () {
    this.props.data.login();
    this.initBusList();
    wx.showTabBarRedDot({
      index: 2
    });
  },
  initBusList: function () {
    var that = this;
    wx.request({
      url: 'https://api.ddiu.site/btic/list',
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