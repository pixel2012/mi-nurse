var app = getApp();
const mi = require('../../common/js/mi.js');
Page({
  data: {
    pass: '123'
  },
  onLoad() {
    this.init();
  },
  onShow(){
    this.init();
  },
  init(){
    let oldPass = mi.store.get('pass');
    if (oldPass) {
      this.setData({
        pass: oldPass
      });
    }
  },
  verify(){
    mi.showLoading('验证密码123');
    app.command({
      command: 'c9',
      param: ['31','32','33'],
      check: true,
      success: function () {
        setTimeout(function () {
          if (typeof app.verPass == 'string' && app.verPass == '00') {
            app.verPass = false;//恢复原状
            mi.hideLoading();
            mi.toast('验证成功');
          } else {
            mi.hideLoading();
            mi.toast('验证失败');
          }
        }, 1000);
      }
    });
  },
  factoryReset(){
    let _this=this;
    mi.showLoading('正在恢复中..');
    app.command({
      command: 'cb',
      check: false,
      success:function(){
        setTimeout(function () {
          console.log('app.resetPass', app.resetPass);
          if (typeof app.resetPass == 'string' && app.resetPass == '00') {
            app.resetPass = false;//恢复原状
            mi.store.set('pass', '123');
            _this.setData({
              pass:'123'
            });
            mi.hideLoading();
            mi.toast('恢复成功');
          } else {
            mi.hideLoading();
            mi.toast('恢复失败');
          }
        },5000);
      }
    });
  }
});