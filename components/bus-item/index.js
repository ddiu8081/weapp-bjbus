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
  attached: function() {
    var that = this;
    console.log(this.data.busdata);
    var busData = this.data.busdata;
    if (!busData.id) {
      var lineData = app.getLineByName(busData.name);
      if (lineData.length > 0) {
        busData.id = lineData[0].id;
      }
      that.setData({
        busdata: busData
      })
    }
    wx.pro.request({
      url: app.globalData.headUrl + '/btic/detail',
      data: {
        'lineid': busData.id,
      },
    }).then(res => {
      console.log(res.data);
      that.setData({
        lineInfo: res.data
      })
    });
    // wx.pro.request({
    //   url: app.globalData.headUrl + '/btic/time',
    //   data: {
    //     'lineid': busData.id,
    //     'stop': busData.stop
    //   },
    // }).then(res => {
    //   console.log(res.data);
    //   that.setData({
    //     lineTime: res.data
    //   })
    // });
  },
  methods: {
  }
})