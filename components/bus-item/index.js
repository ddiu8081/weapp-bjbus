import create from '../../libs/store/create'
var app = getApp();
var timer;

create({
  pure: true,
  externalClasses: ['i-class'],
  properties: {
    busdata: Object
  },
  data: {
    lineInfo: {},
    lineTime: {}
  },
  ready: function() {
    var that = this;
    console.log(this.data.busdata);
    var busData = this.data.busdata;
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/detail',
      data: {
        'lineid': busData.id,
      },
    }).then(res => {
      console.log(res.data);
      that.update({
        lineInfo: res.data
      })
    });
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/time',
      data: {
        'lineid': busData.id,
        'stopid': busData.stop
      },
    }).then(res => {
      console.log(res.data);
      that.update({
        lineTime: res.data
      })
    });
  },
  methods: {
  }
})