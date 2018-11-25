import create from '../../libs/store/create'
var app = getApp();
var timer;

create({
  pure: true,
  externalClasses: ['i-class'],
  properties: {
    busdata: Object,
    showStop: Boolean
  },
  data: {
    load: false,
    lineInfo: {},
    lineTime: {}
  },
  attached: function() {
    var that = this;
    var busData = this.data.busdata;
    console.log(busData);
    if (!busData.id) {
      var lineData = app.getLineByName(busData.name);
      if (lineData.length > 0) {
        busData.id = lineData[0].id;
      } else {
        that.setData({
          load: true,
          lineInfo: null
        });
        return;
      }
    }
    app.fetchLineDetail(busData.id, function (data) {
      var stopId = -1;
      busData.name = data.linename;
      if (parseInt(busData.stop) == busData.stop) {
        stopId = busData.stop;
      } else {
        stopId = app.getStopId(data.stations, busData.stop);
      }
      that.setData({
        busdata: busData,
        lineInfo: data,
        stopId: stopId
      });
      that.fetchLineTime();
    });
  },
  methods: {
    navigateToBusDetail: function () {
      var busData = this.data.busdata;
      if (busData.id) {
        wx.navigateTo({
          url: "/pages/bus/detail?id=" + busData.id + "&stop=" + busData.stop,
        });
      } else {
        wx.showToast({
          icon: "none",
          title: "没有数据"
        })
      }
    },
    fetchLineTime: function () {
      var that = this;
      var stopId = this.data.stopId;
      var busData = this.data.busdata;
      if (stopId > 0) {
        app.fetchLineTime(busData.id, stopId, function (data) {
          if (data.success) {
            var lineTime = data.bus;
            var nearest = {};
            for (var i = 0; i < lineTime.length; i++) {
              var thisBus = lineTime[i];
              if (parseInt(thisBus.nsn) <= stopId) {
                if (!nearest.srt || thisBus.srt < nearest.srt) {
                  nearest = thisBus;
                }
              }
            }
            that.setData({
              load: true,
              nearest: nearest
            });
          }
        });
      } else {
        that.setData({
          load: true
        });
      }
    }
  }
})