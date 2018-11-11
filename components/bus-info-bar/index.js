Component({
  properties: {
    info: Object,
    stopid: Number
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  ready: function () {
    console.log("haha");
    console.log(this.data.stopid)
    console.log(this.data)
  }
})