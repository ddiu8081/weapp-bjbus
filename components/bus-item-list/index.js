import create from '../../libs/store/create'
var timer;

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
        console.log(busItem);
        busItem.fetchLineTime();
      })
      if (callback) {
        callback();
      }
    }
  }
})