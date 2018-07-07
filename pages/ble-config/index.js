var app = getApp();
const mi = require('../../common/js/mi.js');
Page({
  data: {
    pass: '123'
  },
  onLoad() {
    let oldPass = mi.store.get('pass');
    if (oldPass) {
      this.setData({
        pass: oldPass
      });
    }
  }
});