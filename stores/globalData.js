var extendObservable = require('../libs/mobx').extendObservable;
var globalData = function () {
  extendObservable(this, {
    location: {
      isSet: false,
      lat: 39.913945,
      lng: 116.356858
    }
  });
}

module.exports = {
  default: new globalData,
}