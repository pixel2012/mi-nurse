let app = getApp();
const mi = require('../../common/js/mi.js');
class Shake {
  constructor(mode, strength) {
    this.mode = mode || '10';//震动模式
    this.strength = strength || '01';//震动强度
  }
  getStep1() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var step = [
      {
        index: 0,
        command: ['00', '00', ms, '08', '00', '00', '00', '00', '00', '00', '00', '00'],//左乳中8秒
        time: 8
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', ms, '08', '00', '00'],//右乳中8秒
        time: 8
      },
      {
        index: 2,
        command: ['00', '00', ms, '08', '00', '00', '00', '00', ms, '08', '00', '00'],//左右乳中8秒
        time: 8
      }
    ];
    return [
      {
        step: step,
        loop: 1
      }
    ];
  }
  getStep2() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var step = [
      {
        index: 0,
        command: [ms, '08', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],//左乳根8秒
        time: 8
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', ms, '08', '00', '00', '00', '00'],//右乳根8秒
        time: 8
      },
      {
        index: 2,
        command: [ms, '08', '00', '00', '00', '00', ms, '08', '00', '00', '00', '00'],//左右乳根8秒
        time: 8
      }
    ];
    return [
      {
        step: step,
        loop: 1
      }
    ];
  }
  getStep3() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var step = [
      {
        index: 0,
        command: ['00', '00', '00', '00', ms, '08', '00', '00', '00', '00', '00', '00'],//左天溪8秒
        time: 8
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', ms, '08'],//右天溪8秒
        time: 8
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', ms, '08', '00', '00', '00', '00', ms, '08'],//左右天溪8秒
        time: 8
      }
    ];
    return [
      {
        step: step,
        loop: 1
      }
    ];
  }
  getStep4() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var stepA = [
      {
        index: 0,
        command: ['00', '00', ms, '02', '00', '00', '00', '00', '00', '00', '00', '00'],//左天溪8秒
        time: 2
      },
      {
        index: 1,
        command: [ms, '02', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],//右天溪8秒
        time: 2
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', ms, '02', '00', '00', '00', '00', '00', '00'],//左右天溪8秒
        time: 2
      }
    ];
    var stepB = [
      {
        index: 0,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', ms, '02', '00', '00'],//左天溪8秒
        time: 2
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', ms, '02', '00', '00', '00', '00'],//右天溪8秒
        time: 2
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', ms, '02'],//左右天溪8秒
        time: 2
      }
    ];
    var stepC = [
      {
        index: 0,
        command: ['00', '00', ms, '02', '00', '00', '00', '00', ms, '02', '00', '00'],//左天溪8秒
        time: 2
      },
      {
        index: 1,
        command: [ms, '02', '00', '00', '00', '00', ms, '02', '00', '00', '00', '00'],//右天溪8秒
        time: 2
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', ms, '02', '00', '00', '00', '00', ms, '02'],//左右天溪8秒
        time: 2
      }
    ];
    var stepD = [
      {
        index: 0,
        command: [ms, '08', , ms, '08', ms, '08', '00', '00', '00', '00', '00', '00'],//左天溪8秒
        time: 8
      }
    ];
    var stepE = [
      {
        index: 0,
        command: ['00', '00', '00', '00', '00', '00', ms, '08', ms, '08', ms, '08'],//右天溪8秒
        time: 8
      }
    ];
    var stepF = [
      {
        index: 0,
        command: [ms, '08', ms, '08', ms, '08', ms, '08', ms, '08', ms, '08'],//左右天溪8秒
        time: 8
      }
    ];
    return [
      {
        step: stepA,
        loop: 5
      },
      {
        step: stepB,
        loop: 5
      },
      {
        step: stepC,
        loop: 5
      },
      {
        step: stepD,
        loop: 1
      },
      {
        step: stepE,
        loop: 1
      },
      {
        step: stepF,
        loop: 1
      }
    ];
  }
  set(mode, strength) {
    if (mode) {
      this.mode = mode;
    }
    if (strength) {
      this.strength = strength;
    }
  }
}
let shaker= null;//本地震动对象
let timer = null;//本地震动定时器
Page({
  data: {
    bleIsConnect: false,//是否连接蓝牙
    bleIsSync: '',//是否蓝牙信息同步
    bleEnergy: '',//电池电量
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    current: 0,
    indicatorDots: true,
    indicatorActiveColor: '#12C8C8',
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true,
    displayMultipleItems: 2,
    tabIndex: 0,//当前高亮的tab标签栏
    isMenu: false,//是否显示菜单
    menuIndex: 0,//当前高亮的菜单项
    menuList: [
      {
        id: 0,
        title: '盛夏如花',
        mode: '10'
      },
      {
        id: 1,
        title: '高山流水',
        mode: '20'
      },
      {
        id: 2,
        title: '阵阵酥麻',
        mode: '30'
      },
      {
        id: 3,
        title: '小鹿乱撞',
        mode: '40'
      },
      {
        id: 4,
        title: '浪花迭起',
        mode: '50'
      },
      {
        id: 5,
        title: '琴瑟长鸣',
        mode: '60'
      },
      {
        id: 7,
        title: '随机',
        mode: '00'
      }
    ],
    mode: '01',//震动模式
    play: false,//震动状态
    playTitle: '',
    strength: '01',//震动强度
    playProgress: 0,//0~360,
    playBgc: '#F7F7F7',//播放进度条背景色
  },
  onLoad() {
    this.updateStatus();
    var that = this;
    var num = 0
    setInterval(function () {
      if (num == 360) {
        num = 0;
      } else {
        num += 10;
      }
      that.setPlay(num);
    }, 1000);
  },
  onShow() {
    this.updateStatus();
  },
  updateStatus() {
    this.setData({
      bleIsConnect: app.bleIsConnect,//是否连接蓝牙
      bleIsSync: app.bleIsSync,//是否蓝牙信息同步
      bleEnergy: app.bleEnergy,//电池电量
      bleDeviceId: app.bleDeviceId,//蓝牙设备的id号
      bleServerId: app.bleServerId,//蓝牙设备的服务id号
      bleCharWriteId: app.bleCharWriteId,//蓝牙设备的服务写入特征值id号
      bleCharNotifyId: app.bleCharNotifyId,//蓝牙设备的服务接收通知特征值id号
    });
  },
  test() {
    this.command({
      command: 'c5',
      param: [mi.hexMerge('10', '01'), '08', '00', '00', '00', '00', '00', '00', '00', '00', mi.hexMerge('10', '04'), '08'],
      check: false
    });
  },
  command(obj, hexStr) {
    const command = {
      c1: '000500C1C4',
      c2: '000500C2C7',
      c3: '000600C3',//后面需追加两位机位和两位校验码
      c4: '000500C4C1',
      c5: '001100C5',
      c6: '000500C6C3',
      c7: '',
      c8: '',
      C9: '',
      ca: '',
      cb: '000500CBCE',
      cc: '000500CCC9'
    };
    let tempObj = mi.deepMerge({}, obj);
    tempObj.hex = command[obj.command];
    if (obj.command == 'c3' || obj.command == 'c5') {
      obj.param.forEach(v => {
        tempObj.hex += v;//追加上参数
      });
      if (tempObj.check) {
        tempObj.hex += mi.check(tempObj.hex);//追加运算校验码
      } else {
        tempObj.hex += '00';//追加00校验码
      }
    }
    //追加包头，开始写入特征值
    tempObj.hex = 'FBFA' + tempObj.hex;
    console.log('震动命令', tempObj.hex);
    wx.writeBLECharacteristicValue({
      deviceId: this.data.bleDeviceId,
      serviceId: this.data.bleServerId,
      characteristicId: this.data.bleCharWriteId,
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
  },
  bindPlay() {
    this.setData({
      play: !this.data.play
    });
    if (this.data.play) {
      this.run();
    } else {
      this.stop();
    }
  },
  run() {
    //this.test();
    shaker=new Shake(this.data.mode, this.data.strength)//实例化
    //执行动画
    //做一些准备工作，设置当前进度，得到步骤1
    var step

  },//执行
  stop() {

  },//停止
  bindTab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index,
      mode: e.currentTarget.dataset.mode
    });
  },
  showMenu() {
    this.setData({
      isMenu: true
    });
  },
  hideMenu() {
    this.setData({
      isMenu: false
    });
  },
  showMenuItem(e) {
    this.setData({
      menuIndex: e.currentTarget.dataset.index
    });
  },
  bindStrength(e) {
    this.setData({
      strength: e.currentTarget.dataset.index
    });
  },
  setPlay: function (num) {
    if (num < 180) {
      this.setData({
        playProgress: num,
        playBgc: '#F7F7F7',//播放进度条背景色
      });
    } else {
      this.setData({
        playProgress: num - 180,
        playBgc: '#12C8C8',//播放进度条背景色
      });
    }
  }
});
