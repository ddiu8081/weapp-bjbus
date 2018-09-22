// pages/bus/map.js
Page({
  data: {
    markers: [],
    polyline: []
  },
  onLoad: function (options) {
    this.fetchBusDetail();
    this.setData({
      options: options
    });
  },
  fetchBusDetail: function () {
    var that = this;
    wx.request({
      url: 'https://api.ddiu.site/btic/detail',
      data: {
        'lineid': that.options.lineid,
        'map': 'true'
      },
      success: function (res) {
        if (res.data.success) {
          console.log(res.data);
          var markers = [];
          for (var i = 0, length = res.data.stations.length; i < length; i++) {
            var item = res.data.stations[i];
            markers.push({
              iconPath: "/res/loc_point.png",
              id: item.id,
              title: item.name,
              latitude: item.latitude,
              longitude: item.longitude,
              width: 10,
              height: 10,
              anchor: {x:.5, y:.5}
            });
          }
          that.setData({
            str: res.data,
            markers: markers,
            polyline: [{
              points: res.data.coord,
              color: "#5298fe",
              width: 4
            }]
          });
          wx.setNavigationBarTitle({
            title: res.data.linename
          });
        }
      }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }
})