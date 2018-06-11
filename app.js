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
  onLaunch() {
    this.bleDeviceId = mi.store.get('bleDeviceId') || '';
    this.bleServerId = mi.store.get('bleServerId') || '';
    this.bleCharWriteId = mi.store.get('bleCharWriteId') || '';
    this.bleCharNotifyId = mi.store.get('bleCharNotifyId') || '';
  }

})
