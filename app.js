const mi = require('./common/js/mi.js');
App({
  userInfo: {

  },
  bleIsConnect: false,//是否连接蓝牙
  bleIsSync: '',//是否蓝牙信息同步
  bleEnergy: '',//电池电量
  bleDeviceId: '',//蓝牙设备的id号
  bleServerId: '',//蓝牙设备的服务id号
  bleCharWriteId: '',//蓝牙设备的服务写入特征值id号
  bleCharNotifyId: '',//蓝牙设备的服务接收通知特征值id号
  blehdid:'',//蓝牙硬件ID
  wxCode: '',//wxCode
  systemInfo: '',
  setPass:false,
  verPass:false,
  resetPass: false,
  bleVer:'',//蓝牙硬件版本号
  ishaking:false,//是否正处于震动状态
  onLaunch() {
    wx.hideTabBar();
    let _this = this;
    this.bleDeviceId = mi.store.get('bleDeviceId') || '';
    this.bleServerId = mi.store.get('bleServerId') || '';
    this.bleCharWriteId = mi.store.get('bleCharWriteId') || '';
    this.bleCharNotifyId = mi.store.get('bleCharNotifyId') || '';
    mi.user.login(function (code) {
      if (code) {
        console.log('code', code);
        _this.wxCode = code;
      }
    });
    this.systemInfo = wx.getSystemInfoSync();
    mi.store.set('systemInfo', this.systemInfo);
    console.log(this.systemInfo);
  },
  param: '',//穴位组合跳转添加穴位传的参数写入全局
  result: '',//创建或者修改穴位后的结果
  idx: '',//创建或者修改穴位后的索引值
  command(obj, hexStr) {
    let _this=this;
    const command = {
      c1: '000500C1C4',
      c2: '000500C2C7',
      c3: '000600C3', //后面需追加两位机位和两位校验码
      c4: '000500C4C1',
      c5: '001100C5',
      c6: '000500C6C3',
      c7: '',
      c8: '000B00C8',
      c9: '000800C9',
      ca: '',
      cb: '000500CBCE',
      cc: '000500CCC9'
    };
    let tempObj = mi.deepMerge({}, obj);
    tempObj.hex = command[obj.command];
    if (obj.command == 'c3' || obj.command == 'c5' || obj.command == 'c8' || obj.command == 'c9') {
      console.log('obj.param', obj.param);
      obj.param.forEach(v => {
        tempObj.hex += v; //追加上参数
      });
      if ('check' in tempObj) {
        if (tempObj.check) {
          tempObj.hex += mi.check(tempObj.hex); //追加运算校验码
        } else {
          tempObj.hex += '00'; //追加00校验码
        }
      }
    }
    //追加包头，开始写入特征值
    tempObj.hex = 'FBFA' + tempObj.hex;
    console.log('震动命令', tempObj.hex);
    wx.writeBLECharacteristicValue({
      deviceId: this.bleDeviceId,
      serviceId: this.bleServerId,
      characteristicId: this.bleCharWriteId,
      value: mi.hex2buf(tempObj.hex),
      success: function (res) {
        console.log('特征值写入成功', res);
        if (tempObj.success) {
          tempObj.success(res);
        }
      },
      fail: function (res) {
        console.log('特征值写入失败', res);
        if (tempObj.fail) {
          tempObj.fail(res);
        }
      }
    });
  }
})
