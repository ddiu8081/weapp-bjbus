Component({
  properties: {
    busTime: Object
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  methods: {
    onLoad: function () {
      console.log("haha");
      console.log(this.data.busTime)
    }
  }
})