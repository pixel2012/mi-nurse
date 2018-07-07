var app = getApp();
const mi = require('../../common/js/mi.js');
Page({
  data: {
    passO: '',
    passA: '',
    passB: ''
  },
  onLoad() {
    let oldPass = mi.store.get('pass');
    if (oldPass) {
      this.setData({
        passO: oldPass
      });
    }
  },
  onShow() {

  },
  change(e) {
    if (e.detail.value * 1 > 9999999) {
      return mi.toast('密码长度不能超过7位数');
    }
    this.setData({
      ['pass' + e.currentTarget.dataset.pos]: e.detail.value
    });
  },
  savePass() {
    let _this = this;
    if (this.data.passO == '' || this.data.passA == '' || this.data.passB == '') {
      return mi.toast('密码不能为空');
    }
    if (this.data.passA != this.data.passB) {
      return mi.toast('两次输入的密码不一致，请重新输入');
    }
    if (!app.bleIsConnect) {
      return mi.toast('请先连接蓝牙设备，再设置密码');
    }
    let oldPass = mi.pass2Hex(this.data.passO);
    let hexPass = mi.pass2Hex(this.data.passA);
    app.setPass = true;
    mi.showLoading('设置中..');
    app.command({
      command: 'c8',
      param: oldPass.concat(hexPass),
      check: true,
      success: function() {
        console.log('已设置密码');
        setTimeout(function() {
          if (typeof app.setPass == 'string' && app.setPass == '00') {
            app.setPass=false;//恢复原状
            _this.verify(oldPass.concat(hexPass));
          }else{
            mi.hideLoading();
            mi.toast('设置失败');
          }
        }, 1000);
      }

    });
  },
  verify(hexPass){
    let _this=this;
    app.command({
      command: 'c9',
      param: hexPass,
      check: true,
      success: function () {
        setTimeout(function () {
          if (typeof app.verPass == 'string' && app.verPass == '00') {
            mi.hideLoading();
            mi.toast('设置成功');
            app.verPass = false;//恢复原状
            mi.store.set('pass', _this.data.passA);
            //清空设置
            _this.setData({
              passO: '',
              passA: '',
              passB: ''
            });
          } else {
            mi.hideLoading();
            mi.toast('设置失败');
          }
        }, 1000);
      }

    });
  }
});