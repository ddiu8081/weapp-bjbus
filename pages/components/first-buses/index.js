var timer;

Component({
  properties: {
    list: Object,
    count: Number
  },
  data: {
    swiper_current: 0
  },
  ready: function () {
    var that = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      that.fetchPageDetail(that.data.swiper_current);
      console.log(new Date());
    }, 8000);
  },
  methods: {
    loadPage: function (event) {
      this.setData({
        swiper_current: event.detail.current,
      })
      this.fetchPageDetail(event.detail.current);
    },
    fetchPageDetail: function (page) {
      var that = this;
      var buses_detail = that.data.list[page];
      for (var i = 0; i < buses_detail.length; i++) {
        var dir = buses_detail[i].dir ? buses_detail[i].dir : '';
        that.fetchBusDetail(buses_detail[i].name, dir, that.data.first_stop, page, i);
      }
      wx.stopPullDownRefresh();
      clearTimeout(timer);
      timer = setTimeout(function () {
        that.fetchPageDetail(that.data.swiper_current);
        console.log(new Date());
      }, 8000);
    },
    fetchBusDetail: function (line, dir, stop, page, index) {
      var that = this;
      var new_data = that.data.list;
      new_data[page][index]['refresh'] = true;
      this.setData({
        list: new_data
      });
      wx.request({
        url: 'https://api.ddiu.site/bjbus/time',
        data: {
          'line': line,
          'dir': dir,
          'stop': stop
        },
        success: function (res) {
          var new_data = that.data.list;
          new_data[page][index]['detail'] = res.data;
          new_data[page][index]['refresh'] = false;
          if (res.data.success) {
            new_data[page][index]['dir'] = res.data.dir.id;
            new_data[page][index]['opposite'] = res.data.dir.opposite;
          }
          that.setData({
            list: new_data
          });
          console.log(res.data);
        }
      });
    },
  }
})