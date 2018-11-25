import create from '../../libs/store/create'
create({
  properties: {
    info: Object,
    showFav: Boolean
  },
  data: {
    // 这里是一些组件内部数据
    someData: {}
  },
  ready: function () {
  },
  methods: {
    addFav: function () {
      this.triggerEvent('addFav', {}, {});
    },
    removeFav: function () {
      this.triggerEvent('removeFav', {}, {});
    }
  }
})