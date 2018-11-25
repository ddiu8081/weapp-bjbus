import create from '../../libs/store/create'
var timer;
var app = getApp();

create({
  pure: true,
  properties: {
    buslist: Array,
    showStop: Boolean
  },
  data: {
  },
  ready: function () {
    var that = this;
    // clearTimeout(timer);
    // timer = setTimeout(function () {
    //   that.fetchPageDetail(that.data.swiper_current);
    //   console.log(new Date());
    // }, 8000);
  },
  methods: {
    freshAll: function (callback) {
      var busItems = this.selectAllComponents("#bus-item");
      busItems.forEach((busItem) => {
        busItem.fetchLineDetail();
      })
      if (callback) {
        callback();
      }
    },
    // freshDetail: function (index, callback) {
    //   var busItems = this.selectAllComponents("#bus-item");
    //   if (busItems[index]) {
    //     busItems[index].fetchLineDetail();
    //   }
    //   if (callback) {
    //     callback();
    //   }
    // },
    changeDir: function (e) {
      if (e.detail) {
        var busItem = this.data.buslist[e.detail.index];
        var oppositeId = app.getOppositeId(busItem.name, e.detail.thisId);
        if (oppositeId == "") {
          wx.showToast({
            title: '本车单向运行',
            icon: 'none'
          });
        } else {
          busItem.id = oppositeId;
          var busList = this.data.buslist;
          busList[e.detail.index] = busItem;
          this.data.buslist = busList
          this.setData({
            buslist: busList
          });
          this.freshAll();
        }
      }
    }
  }
})