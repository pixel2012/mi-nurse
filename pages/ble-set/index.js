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
    this.setData({
      ['pass' + e.currentTarget.dataset.pos]: e.detail.value
    });
  },
  savePass() {
    let _this = this;
    if (this.data.passO == '' || this.data.passA == '' || this.data.passB == '') {
      return mi.toast('密码不能为空');
    }
    let reg = /[\x00-\xff]+/g;
    let passO = this.data.passO.match(reg);
    let passA = this.data.passA.match(reg);
    let passB = this.data.passB.match(reg);
    if (!(passO && passO[0].length == 3)) {
      return mi.toast('旧密码长度仅支持3位且不能是中文');
    }
    let oldP = mi.store.get('pass') || '123';
    if (passO != oldP) {
      return mi.toast('旧密码错误');
    }
    if (!(passA && passA[0].length == 3)) {
      return mi.toast('新密码长度仅支持3位且不能是中文');
    }
    if (!(passB && passB[0].length == 3)) {
      return mi.toast('确认密码长度仅支持3位且不能是中文');
    }
    if (this.data.passA != this.data.passB) {
      return mi.toast('两次输入的密码不一致，请重新输入');
    }
    if (!app.bleIsConnect) {
      return mi.toast('请先连接蓝牙设备，再设置密码');
    }
    let oldPass = mi.strToHexCharCode(_this.data.passO);
    let hexPass = mi.strToHexCharCode(_this.data.passA);
    app.setPass = true;
    mi.showLoading('设置中..');
    app.command({
      command: 'c8',
      param: oldPass.concat(hexPass),
      check: true,
      success: function() {
        setTimeout(function() {
          if (typeof app.setPass == 'string' && app.setPass == '00') {
            app.setPass = false; //恢复原状
            mi.store.set('pass', _this.data.passA);
            //清空设置
            _this.setData({
              passO: '',
              passA: '',
              passB: ''
            });
            mi.toast('设置成功');
            wx.navigateBack();
          } else {
            mi.hideLoading();
            mi.toast('设置失败');
          }
        }, 3000);
      }

    });
  },
  verify(hexPass) {
    let _this = this;
    app.command({
      command: 'c9',
      param: hexPass,
      check: true,
      success: function() {
        setTimeout(function() {
          if (typeof app.verPass == 'string' && app.verPass == '00') {
            mi.hideLoading();
            mi.toast('设置成功');
            app.verPass = false; //恢复原状
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