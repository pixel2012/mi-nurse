let app = getApp();
const mi = require('../../common/js/mi.js');
class Shake {
  constructor(mode, strength) {
    this.mode = mode || '10';//震动模式
    this.strength = strength || '01';//震动强度
    this.loop = 0;//循环次数
  }
  getStep0() {
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
  getStep1() {
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
  getStep2() {
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
  getStep3() {
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
  setMode(mode) {
    if (mode) {
      this.mode = mode;
    }
  }
  setStrength(strength) {
    if (strength) {
      console.log('setstrength', strength, 'setmode', mode, );
      this.strength = strength;
    }
  }
}
let shaker = null;//本地震动对象
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
    allLoops: 1,//总循环几次
    allLoop: 0,//当前总循环次数轮大循环计数
    nowTime: 0,//已用时间
    allTime: 0,//总共时间
    current: 0,//整个进度第几部
    stepIndex: 0,//大步中第几部
    stepLoop: 0,//至少循环1遍
    index: 0,//每部中的小步
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
        id: 6,
        title: '随机',
        mode: '00'
      }
    ],
    mode: '10',//震动模式
    play: false,//震动状态true/false
    playTitle: '',
    strength: '01',//震动强度01/02/03/04
    playProgress: 0,//0~360,
    playPoints: [],//当前播放的节点
    playBgc: '#F7F7F7',//播放进度条背景色
    diy:[
      {
        title:'组合1',
        timeUsed:0,
        timeTotal:120,
        play:false,
        shockArr:[
          {
            acupoint:'乳根穴',//穴位
            position:'左胸',
            mode:'盛夏如花',
            command: ['00', '00', '11', '08', '00', '00', '00', '00', '00', '00', '00', '00'],//左乳中8秒
            time: 8
          }
        ]//执行的动画序列
      }
    ],//diy按摩组合
  },
  onLoad() {
    // this.updateStatus();
    // var that = this;
    // var num = 0
    // setInterval(function () {
    //   if (num == 360) {
    //     num = 0;
    //   } else {
    //     num += 10;
    //   }
    //   that.setPlay(num);
    // }, 1000);
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
      param: [mi.hexMerge('10', '01'), '08', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
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
      console.log('obj.param', obj.param);
      obj.param.forEach(v => {
        tempObj.hex += v;//追加上参数
      });
      if ('check' in tempObj) {
        if (tempObj.check) {
          tempObj.hex += mi.check(tempObj.hex);//追加运算校验码
        } else {
          tempObj.hex += '00';//追加00校验码
        }
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
    if (!this.data.play) {
      this.run();
    } else {
      this.stop();
    }
  },
  run() {
    // this.test();
    if (!shaker) {
      shaker = new Shake(this.data.mode, this.data.strength)//实例化
      this.setData({
        allTime: this.setAllTime(shaker)
      });
    }
    this.allLoop();
  },//执行
  allLoop() {
    let _this = this;
    _this.loop(function () {
      console.log('大动画执行' + _this.data.allLoop + '完毕');
      let allLoop = _this.data.allLoop + 1;
      if (allLoop < _this.data.allLoops) {
        _this.setData({
          allLoop: allLoop
        });
        _this.allLoop();
      } else {
        console.log('全部动画执行完毕');
        _this.setData({
          allLoop: 0,
          nowTime: 0,
        });
        _this.setPlay(0);
        shaker = null;
        timer = null;
      }

    });
  },
  loop(callback) {
    let _this = this;
    _this.do(function () {
      console.log('第' + _this.data.current + '大段执行' + _this.data.stepLoop + '轮完毕');
      let current = _this.data.current + 1;
      if (current < 4) {
        _this.setData({
          current: current,
          stepIndex: 0,
          index: 0
        });
        _this.loop(callback);
      } else {
        _this.setData({
          current: 0,
          stepIndex: 0,
          index: 0,
          play: false
        });
        if (callback) {
          callback();
        }
      }
    });
  },
  do(callback) {
    let _this = this;
    let stepArr = null;
    let stepObj = null;
    console.log('doooo', _this.data.current, _this.data.stepIndex, _this.data.index);
    stepArr = shaker['getStep' + _this.data.current]();
    stepObj = stepArr[_this.data.stepIndex];

    //判断是否是自动模式
    console.log('_this.data.mode', _this.data.mode);
    if (_this.data.menuIndex == 6) {
      let num = mi.getRadom(1, 7);
      console.log('num', num);
      let strength = (num - 1) + '0';
      console.log('strength', strength);
      shaker.setMode(strength);
    }

    if (_this.data.index < stepObj.step.length) {
      _this.command({
        command: 'c5',
        param: stepObj.step[_this.data.index].command,
        check: false,
        success: function () {
          _this.setData({
            play: true
          });
        }
      });
      timer = setTimeout(function () {
        _this.setData({
          index: _this.data.index + 1,
          nowTime: _this.data.nowTime + stepObj.step[_this.data.index].time
        });
        _this.setPlay(Math.ceil(_this.data.nowTime * 360 / _this.data.allTime));
        _this.do(callback);
      }, 1000 * stepObj.step[_this.data.index].time);
    } else {
      _this.setData({
        stepLoop: _this.data.stepLoop + 1
      });
      //判断这一轮完了没有
      if (_this.data.stepLoop < stepObj.loop) {
        _this.setData({
          index: 0
        });
        _this.do(callback);
      } else {
        _this.setData({
          stepLoop: 0,
          stepIndex: _this.data.stepIndex + 1
        });
        if (_this.data.stepIndex < stepArr.length) {
          _this.do(callback);
        } else {
          if (callback) {
            callback();
          }
        }
      }
    }
  },//每次执行一小段
  setAllTime(shaker) {
    let step0 = shaker.getStep0();
    let step1 = shaker.getStep1();
    let step2 = shaker.getStep2();
    let step3 = shaker.getStep3();
    let allTime = 0;
    for (let i = 0; i < step0.length; i++) {
      let time = 0;
      for (let j = 0; j < step0[i].step.length; j++) {
        time += step0[i].step[j].time;
      }
      allTime += time * step0[i].loop;
    }
    for (let i = 0; i < step1.length; i++) {
      let time = 0;
      for (let j = 0; j < step1[i].step.length; j++) {
        time += step1[i].step[j].time;
      }
      allTime += time * step0[i].loop;
    }
    for (let i = 0; i < step2.length; i++) {
      let time = 0;
      for (let j = 0; j < step2[i].step.length; j++) {
        time += step2[i].step[j].time;
      }
      allTime += time * step0[i].loop;
    }
    for (let i = 0; i < step3.length; i++) {
      let time = 0;
      for (let j = 0; j < step3[i].step.length; j++) {
        time += step3[i].step[j].time;
      }
      allTime += time * step3[i].loop;
    }
    console.log('allTime', allTime * this.data.allLoops);
    return allTime * this.data.allLoops
  },
  stop() {
    let _this = this;
    //先查询当前的播放状态
    // this.command({
    //   command: 'c4'
    // });
    //然后
    _this.command({
      command: 'c5',
      param: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
      check: false,
      success: function () {
        _this.setData({
          play: false
        });
      }
    });
    clearTimeout(timer);
  },//停止
  bindTab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
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
    console.log('e.currentTarget.dataset', e.currentTarget.dataset);
    this.setData({
      menuIndex: e.currentTarget.dataset.index,
      mode: e.currentTarget.dataset.index == 6 ? mi.getRadom(1, 6) + '0' : e.currentTarget.dataset.mode
    });
    if (shaker) {
      shaker.setMode(this.data.mode);
    }
  },
  bindStrength(e) {
    this.setData({
      strength: e.currentTarget.dataset.index
    });
    if (shaker) {
      shaker.setStrength('0' + e.currentTarget.dataset.index);
    }
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
  },
  // diy按摩代码
  longShock(e) {
    console.log(666);
    if (this.data.play) {
      this.stop();
    }
    console.log('e', e);
    let code = e.currentTarget.dataset.code;
    let ms = mi.hexMerge('10', '01');
    console.log('ms', ms);
    let shock = ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'];
    if(code==1){
      shock = [ms, 'F0', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'];
    }
    if (code == 2) {
      shock = ['00', '00', ms, 'F0', '00', '00', '00', '00', '00', '00', '00', '00'];
    }
    if (code == 3) {
      shock = ['00', '00', '00', '00', ms, 'F0', '00', '00', '00', '00', '00', '00'];
    }
    if (code == 4) {
      shock = ['00', '00', '00', '00', '00', '00', ms, 'F0', '00', '00', '00', '00'];
    }
    if (code == 5) {
      shock = ['00', '00', '00', '00', '00', '00', '00', '00', ms, 'F0', '00', '00'];
    }
    if (code == 6) {
      shock = ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', ms, 'F0'];
    }
    console.log('code', code);
    console.log('shock', shock);
    this.command({
      command: 'c5',
      param: shock,
      check: false
    });
  },
  closeShock() {
    console.log(777);
    this.command({
      command: 'c5',
      param: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
      check: false
    });
  }
});
