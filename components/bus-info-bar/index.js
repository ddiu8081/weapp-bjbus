import create from '../../libs/store/create'
create({
  properties: {
    info: Object,
    showFav: Boolean
  },
  data: {
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