import create from '../../libs/store/create'
var timer;

create({
  pure: true,
  properties: {
    buslist: Array
  },
  data: {
  },
  ready: function () {
    var that = this;
    console.log(this.data.buslist);
    // clearTimeout(timer);
    // timer = setTimeout(function () {
    //   that.fetchPageDetail(that.data.swiper_current);
    //   console.log(new Date());
    // }, 8000);
  },
  methods: {
    
  }
})