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
    
  }
})