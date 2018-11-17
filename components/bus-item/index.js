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
        app.fetchLineDetail(busData.id, function(data) {
          var stopId = -1;
          if (parseInt(busData.stop) == busData.stop) {
            stopId = busData.stop;
          } else {
            stopId = app.getStopId(data.stations, busData.stop);
          }
          that.setData({
            lineInfo: data,
            stopId: stopId
          });
        });
      } else {
        that.setData({
          lineInfo: null
        });
      }
      that.setData({
        busdata: busData
      });
    }
  },
  methods: {
    navigateToBusDetail: function () {
      var busData = this.data.busdata;
      if (busData.id) {
        wx.navigateTo({
          url: "/pages/bus/detail?id=" + this.data.busdata.id + "&stop=" + this.data.busdata.stop,
        });
      } else {
        wx.showToast({
          icon: "none",
          title: "没有数据"
        })
      }
    }
  }
})