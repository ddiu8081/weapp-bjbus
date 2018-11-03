Component({
  externalClasses: ['i-class'],
  properties: {
    info: Object,
  },
  data: {
    swiper_current: 0
  },
  methods: {
    onLoad: function () {
      console.log("haha");
      console.log(this.data.list)
    }
  }
})