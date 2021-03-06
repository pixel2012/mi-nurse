let app = getApp();
const mi = require('../../common/js/mi.js');
class Shake {
  constructor(mode, strength) {
    this.mode = mode || '10'; //震动模式
    this.strength = strength || '01'; //震动强度
    this.loop = 0; //循环次数
  }
  getStep0() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var step = [{
        index: 0,
        command: ['00', '00', ms, '08', '00', '00', '00', '00', '00', '00', '00', '00'], //左乳中8秒
        time: 8
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', ms, '08', '00', '00'], //右乳中8秒
        time: 8
      },
      {
        index: 2,
        command: ['00', '00', ms, '08', '00', '00', '00', '00', ms, '08', '00', '00'], //左右乳中8秒
        time: 8
      }
    ];
    return [{
      step: step,
      loop: 1
    }];
  }//步骤一
  getStep1() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var step = [{
        index: 0,
        command: [ms, '08', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'], //左乳根8秒
        time: 8
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', ms, '08', '00', '00', '00', '00'], //右乳根8秒
        time: 8
      },
      {
        index: 2,
        command: [ms, '08', '00', '00', '00', '00', ms, '08', '00', '00', '00', '00'], //左右乳根8秒
        time: 8
      }
    ];
    return [{
      step: step,
      loop: 1
    }];
  }//步骤二
  getStep2() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var step = [{
        index: 0,
        command: ['00', '00', '00', '00', ms, '08', '00', '00', '00', '00', '00', '00'], //左天溪8秒
        time: 8
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', ms, '08'], //右天溪8秒
        time: 8
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', ms, '08', '00', '00', '00', '00', ms, '08'], //左右天溪8秒
        time: 8
      }
    ];
    return [{
      step: step,
      loop: 1
    }];
  }//步骤三
  getStep3() {
    var ms = mi.hexMerge(this.mode, this.strength);
    var stepA = [{
        index: 0,
        command: ['00', '00', ms, '02', '00', '00', '00', '00', '00', '00', '00', '00'], //左天溪8秒
        time: 2
      },
      {
        index: 1,
        command: [ms, '02', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'], //右天溪8秒
        time: 2
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', ms, '02', '00', '00', '00', '00', '00', '00'], //左右天溪8秒
        time: 2
      }
    ];
    var stepB = [{
        index: 0,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', ms, '02', '00', '00'], //左天溪8秒
        time: 2
      },
      {
        index: 1,
        command: ['00', '00', '00', '00', '00', '00', ms, '02', '00', '00', '00', '00'], //右天溪8秒
        time: 2
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', ms, '02'], //左右天溪8秒
        time: 2
      }
    ];
    var stepC = [{
        index: 0,
        command: ['00', '00', ms, '02', '00', '00', '00', '00', ms, '02', '00', '00'], //左天溪8秒
        time: 2
      },
      {
        index: 1,
        command: [ms, '02', '00', '00', '00', '00', ms, '02', '00', '00', '00', '00'], //右天溪8秒
        time: 2
      },
      {
        index: 2,
        command: ['00', '00', '00', '00', ms, '02', '00', '00', '00', '00', ms, '02'], //左右天溪8秒
        time: 2
      }
    ];
    var stepD = [{
      index: 0,
      command: [ms, '08', , ms, '08', ms, '08', '00', '00', '00', '00', '00', '00'], //左天溪8秒
      time: 8
    }];
    var stepE = [{
      index: 0,
      command: ['00', '00', '00', '00', '00', '00', ms, '08', ms, '08', ms, '08'], //右天溪8秒
      time: 8
    }];
    var stepF = [{
      index: 0,
      command: [ms, '08', ms, '08', ms, '08', ms, '08', ms, '08', ms, '08'], //左右天溪8秒
      time: 8
    }];
    return [{
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
  }//步骤四
  setMode(mode) {
    if (mode) {
      this.mode = mode;
    }
  }//设置震动模式
  setStrength(strength) {
    if (strength) {
      this.strength = strength;
    }
  }//设置震动强度
}//自动震动模式震动流程构建的类
let shaker = null; //本地震动对象
let timer = null; //本地震动定时器
let timer2 = null; //diy震动定时器
let shakeTimes = 0; //记录开始震动到暂停/停止的时间（自动）
let shakeTimes2 = 0; //记录开始震动到暂停/停止的时间（diy）
let curContext = null; //存储当前自动震动上下文
let diyCurContext = null; //存储当前diy震动上下文
let autoUsedTime = 0; //当前震动步骤的已用时间，切换下一步时重置为0,存到这里方便修改
let diyUsedTime = 0; //当前震动步骤的已用时间，切换下一步时重置为0,存到这里方便修改
const api = {
  uploadZD: mi.ip + 'zhimito/used/post', //获取温度列表
}
Page({
  data: {
    bleIsConnect: false, //是否连接蓝牙
    bleIsSync: '', //是否蓝牙信息同步
    bleEnergy: 0, //电池电量
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    allLoops: 5, //总循环几次
    allLoop: 0, //当前总循环次数轮大循环计数
    nowTime: 0, //已用时间
    allTime: 0, //总共时间
    current: 0, //整个进度第几部
    stepIndex: 0, //大步中第几部
    stepLoop: 0, //至少循环1遍
    index: 0, //每部中的小步
    indicatorDots: true,
    indicatorActiveColor: '#12C8C8',
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true,
    displayMultipleItems: 2,
    tabIndex: 0, //当前高亮的tab标签栏
    isMenu: false, //是否显示菜单
    menuIndex: 0, //当前高亮的菜单项
    menuList: [{
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
    mode: '10', //震动模式
    play: false, //震动状态true/false
    playTitle: '',
    strength: '01', //震动强度01/02/03/04
    playProgress: 0, //0~360,
    playPoints: [], //当前播放的节点
    playBgc: '#F7F7F7', //播放进度条背景色
    diyIndex: -1, //当前diy震动的是第几个
    diyArr: [], //diy按摩组合
    diyStrength: 1, //diy震动强度
  },
  onLoad() {
    if (!mi.store.get('yet')) {
      this.setData({
        isMenu: true
      });
      mi.store.set('yet', true);
    }
    //还原上次震动强度
    this.setData({
      strength: mi.store.get('strength') || '01',
      diyStrength: mi.store.get('diyStrength') * 1 || 1
    });

    this.updateStatus();
  },
  onShow() {
    this.updateStatus();
  },
  onHide() {},
  updateStatus() {
    this.setData({
      bleIsConnect: app.bleIsConnect, //是否连接蓝牙
      bleIsSync: app.bleIsSync, //是否蓝牙信息同步
      bleEnergy: app.bleEnergy, //电池电量
      bleDeviceId: app.bleDeviceId, //蓝牙设备的id号
      bleServerId: app.bleServerId, //蓝牙设备的服务id号
      bleCharWriteId: app.bleCharWriteId, //蓝牙设备的服务写入特征值id号
      bleCharNotifyId: app.bleCharNotifyId, //蓝牙设备的服务接收通知特征值id号
      diyArr: timer2 ? this.data.diyArr : (mi.store.get('diyArr') ? mi.store.get('diyArr') : [])
    });

  },//同步咪小护页面的数据
  test() {
    this.command({
      command: 'c5',
      param: [mi.hexMerge('10', '01'), '08', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
      check: false
    });
  },//无用，测试
  command(obj, hexStr) {
    const command = {
      c1: '000500C1C4',
      c2: '000500C2C7',
      c3: '000600C3', //后面需追加两位机位和两位校验码
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
    wx.writeBLECharacteristicValue({
      deviceId: this.data.bleDeviceId,
      serviceId: this.data.bleServerId,
      characteristicId: this.data.bleCharWriteId,
      value: mi.hex2buf(tempObj.hex),
      success: function(res) {
        if (tempObj.success) {
          tempObj.success(res);
        }
      },
      fail: function(res) {
        if (tempObj.fail) {
          tempObj.fail(res);
        }
      }
    });
  },//蓝牙震动命令封装
  bindPlay() {
    if (!this.data.play) {
      if (timer2) {
        this.diyStop();
        let diyArr = this.data.diyArr;
        diyArr[this.data.diyIndex].play = false;
        this.setData({
          diyArr: diyArr
        });
      }
      this.run();
    } else {
      this.stop();
    }
  },//自动震动模式开始/暂停
  run() {
    let _this = this;
    // this.test();
    if (!app.bleIsConnect) {
      return mi.toast('请先连接蓝牙设备再进行相关操作');
    }
    if (!shaker) {
      shaker = new Shake(this.data.mode, this.data.strength) //实例化
      this.setData({
        allTime: this.setAllTime(shaker)
      });
    }
    this.allLoop(function() {
      wx.vibrateLong(); //手机震动
      wx.showModal({
        title: '恭喜',
        content: '你完成一次完整的按摩理疗，记得每天坚持哦！',
        confirmText: '我会加油',
        showCancel: false
      });
      _this.stop();
      autoUsedTime = 0; //重置
      shakeTimes = 0; //重置
      //提交后台按摩数据（自动模式）
      // _this.uploadZDMode(1, _this.data.allTime * 1000);
    });
  }, //执行自动震动
  allLoop(callback) {
    app.ishaking = true; //设置正在震动状态
    let _this = this;
    _this.loop(function() {
      let allLoop = _this.data.allLoop + 1;
      if (allLoop < _this.data.allLoops) {
        _this.setData({
          allLoop: allLoop
        });
        _this.allLoop(callback);
      } else {
        _this.setData({
          allLoop: 0,
          nowTime: 0,
        });
        _this.setPlay(0);
        shaker = null;
        timer = null;
        if (callback) {
          callback();
        }
      }

    });
  },//自动震动模式完整5轮大流程函数
  loop(callback) {
    let _this = this;
    _this.do(function() {
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
  },//5个大流程中的1轮流程函数
  do(callback) {
    if (!app.bleIsConnect) {
      return mi.toast('蓝牙断开连接，自动关闭按摩');
      this.stop();
    }
    let _this = this;
    let stepArr = null;
    let stepObj = null;
    stepArr = shaker['getStep' + _this.data.current]();
    stepObj = stepArr[_this.data.stepIndex];

    //判断是否是自动模式
    if (_this.data.menuIndex == 6) {
      let num = mi.getRadom(1, 6);
      let mode = num + '0';
      shaker.setMode(mode);
    }

    if (_this.data.index < stepObj.step.length) {
      _this.command({
        command: 'c5',
        param: stepObj.step[_this.data.index].command,
        check: false,
        success: function() {
          _this.setData({
            play: true
          });
        }
      });
      let roundTimes = stepObj.step[_this.data.index].time - autoUsedTime;
      circleTimes(roundTimes);

      function circleTimes(roundTimes) {
        if (!app.bleIsConnect) {
          _this.stop();
          return mi.toast('蓝牙已断开，自动暂停按摩');
        }
        if (roundTimes == 0) {
          autoUsedTime = 0;
          _this.setData({
            index: _this.data.index + 1
          });
          _this.do(callback);
        } else {
          autoUsedTime++;
          roundTimes--;
          timer = setTimeout(function() {
            if (_this.data.nowTime >= _this.data.allTime) {
              _this.setData({
                nowTime: _this.data.allTime
              });
            } else {
              _this.setData({
                nowTime: _this.data.nowTime + 1
              });
            }

            shakeTimes++; //记录片段时间
            _this.setPlay(parseInt(_this.data.nowTime * 360 / _this.data.allTime));
            circleTimes(roundTimes);
          }, 1000);
        }
      }
    } else {
      _this.setData({
        index: 0,
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
          index: 0,
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
  }, //1轮流程中1小段震动
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
    return allTime * this.data.allLoops
  },//根据震动进度实时更新视图中的进度条函数
  stop() {
    let _this = this;
    //先查询当前的播放状态
    // this.command({
    //   command: 'c4'
    // });
    //然后
    app.ishaking = false; //关闭震动状态
    _this.uploadZDMode(1, shakeTimes * 1000); //发送统计数据
    _this.command({
      command: 'c5',
      param: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
      check: false,
      success: function() {
        _this.setData({
          play: false
        });
      }
    });
    clearTimeout(timer);
    _this.setData({
      play: false
    });
    shakeTimes = 0; //清空震动片段时间时间
  }, //停止自动震动模式
  bindTab(e) {
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    });
  },//切换自动与diy
  showMenu() {
    this.setData({
      isMenu: !this.data.isMenu
    });
  },//显示震动模式菜单
  hideMenu() {
    this.setData({
      isMenu: false
    });
  },//隐藏菜单
  showMenuItem(e) {
    this.setData({
      menuIndex: e.currentTarget.dataset.index,
      mode: e.currentTarget.dataset.index == 6 ? mi.getRadom(1, 6) + '0' : e.currentTarget.dataset.mode
    });
    if (shaker) {
      shaker.setMode(this.data.mode);
    }
  },//选中震动模式
  bindStrength(e) {
    this.setData({
      strength: e.currentTarget.dataset.index
    });
    mi.store.set('strength', e.currentTarget.dataset.index);
    if (shaker) {
      shaker.setStrength('0' + e.currentTarget.dataset.index);
    }
    if (shaker && timer) {
      //如果是正在震动则立即调整震动模式
      clearTimeout(timer); //立即停止
      this.run(); //立即开始
    }
  },//设置自动震动强度
  bindStrength1(e) {
    let _this = this;
    //diyStrength
    this.setData({
      diyStrength: e.currentTarget.dataset.index * 1
    });
    mi.store.set('diyStrength', e.currentTarget.dataset.index);
    if (timer2 && diyCurContext) {
      //如果是正在震动则立即调整震动模式
      // this.diyRun(diyCurContext);//立即暂停
      clearTimeout(timer2); //立即停止
      let cur = this.data.diyArr[diyCurContext.currentTarget.dataset.index];
      _this.diyPlay(cur); //立即开始
    }
  },//设置diy震动强度
  setPlay: function(num) {
    if (num < 180) {
      this.setData({
        playProgress: num,
        playBgc: '#F7F7F7', //播放进度条背景色
      });
    } else {
      this.setData({
        playProgress: num - 180,
        playBgc: '#12C8C8', //播放进度条背景色
      });
    }
  },//设置进度条
  // diy按摩代码
  longShock(e) {
    if (timer) {
      this.stop();
    }
    if (timer2) {
      this.diyStop();
    }
    let code = e.currentTarget.dataset.code;
    let ms = mi.hexMerge('10', '0' + (this.data.diyStrength || '1'));
    let shock = ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'];
    if (code == 1) {
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
    this.command({
      command: 'c5',
      param: shock,
      check: false
    });
  },//diy长按震动
  closeShock() {
    this.command({
      command: 'c5',
      param: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
      check: false
    });
  },//diy关闭震动
  diyEdit(e) {
    if (timer2) {
      this.diyStop();
    }

    wx.navigateTo({
      url: '/pages/massage/index?index=' + e.currentTarget.dataset.index
    })
  },//diy编辑
  diyRun(e) {
    if (!app.bleIsConnect) {
      return mi.toast('蓝牙已断开，自动暂停按摩');
    }
    //关闭所有正在执行的震动模式
    if (timer) {
      this.stop();
    }
    //其他操作
    diyCurContext = e; //当前上下文存储到全局，方便修改震动模式使用
    let diyArr = this.data.diyArr;
    let cur = diyArr[e.currentTarget.dataset.index];
    if (cur.play) {
      cur.play = false;
      diyArr[e.currentTarget.dataset.index] = cur;
      this.setData({
        diyIndex: -1,
        diyArr: diyArr
      });
      this.diyStop();
    } else {
      if (timer2) {
        clearTimeout(timer2);
        timer2 = null;
      }
      for (let i = 0; i < diyArr.length; i++) {
        if (e.currentTarget.dataset.index != i) {
          diyArr[i].play = false;
          diyArr[i].timeUsed = 0;
        }
      }
      cur.play = true;
      diyArr[e.currentTarget.dataset.index] = cur;
      this.setData({
        diyIndex: e.currentTarget.dataset.index,
        diyArr: diyArr
      });
      this.diyPlay(cur);
    }
  }, //执行/关闭diy震动
  diyPlay(cur) {
    app.ishaking = true; //设置正在震动状态
    //开始执行diy震动
    let _this = this;
    this.diyCore(cur, function() {
      wx.vibrateLong();
      diyUsedTime = 0;
      diyCurContext = null;
      _this.diyStop(); //立即暂停
      wx.showModal({
        title: '恭喜您',
        content: cur.title + '执行完毕',
        showCancel: false
      });
      //震动完毕，上传后台震动数据
      // _this.uploadZDMode(2, _this.data.diyArr[_this.data.diyIndex].timeTotal * 1000);
    });
  }, //diy震动
  addDiyStrength(cur) {
    //cur.shockArr[cur.playStep]
    let arr = cur.shockArr[cur.playStep].command;
    let mn = mi.getMode(cur.shockArr[cur.playStep].mode, this.data.diyStrength);
    let acupoint = cur.shockArr[cur.playStep].acupoint;
    let position = cur.shockArr[cur.playStep].position;
    return mi.getCommand(arr, mn, acupoint, position);
  }, //动态修改diy震动强度
  diyCore(cur, callback) {
    if (!app.bleIsConnect) {
      this.diyStop();
      this.data.diyArr[this.data.diyIndex].play = false;
      this.setData({
        diyArr: this.data.diyArr
      });
      return mi.toast('蓝牙断开连接，自动关闭按摩');

    }
    let _this = this;
    let curCommond = _this.addDiyStrength(cur);
    _this.command({
      command: 'c5',
      param: curCommond,
      check: false,
      success: function() {
        let roundTimes = cur.shockArr[cur.playStep].time - diyUsedTime; //步骤总时间-可能已用的震动时间
        circleTime(roundTimes);

        function circleTime(roundTimes) {
          if (!app.bleIsConnect) {
            _this.diyStop();
            _this.data.diyArr[_this.data.diyIndex].play = false;
            _this.setData({
              diyArr: _this.data.diyArr
            });
            return mi.toast('蓝牙断开连接，自动关闭按摩');
          }
          if (roundTimes == 0) {
            diyUsedTime = 0; //步骤已用时间清零
            cur.playStep++; //震动步骤跳到下一步
            if (_this.data.diyArr[_this.data.diyIndex]){
              _this.data.diyArr[_this.data.diyIndex].playStep++;
              _this.setData({
                diyArr: _this.data.diyArr
              });
            }
            if (cur.playStep < cur.shockArr.length) {
              _this.diyCore(cur, callback);
            } else {
              //震动的结束，重置
              _this.data.diyArr[_this.data.diyIndex].timeUsed = 0;
              _this.data.diyArr[_this.data.diyIndex].play = false;
              _this.data.diyArr[_this.data.diyIndex].playStep = 0;
              _this.setData({
                diyArr: _this.data.diyArr
              });
              clearTimeout(timer2);
              timer2 = null;
              //已经震动到最后,执行成功回调
              if (callback) {
                callback();
              }
            }
          } else {
            timer2 = setTimeout(function() {
              diyUsedTime++; //震动步骤时间累加
              roundTimes--; //震动步骤总时间累减
              if (_this.data.diyIndex > -1) {
                if (_this.data.diyArr[_this.data.diyIndex].timeUsed >= _this.data.diyArr[_this.data.diyIndex].timeTotal) {
                  _this.data.diyArr[_this.data.diyIndex].timeUsed = _this.data.diyArr[_this.data.diyIndex].timeTotal;
                } else {
                  _this.data.diyArr[_this.data.diyIndex].timeUsed++;
                }
                shakeTimes2++;
              }
              _this.setData({
                diyArr: _this.data.diyArr
              });
              circleTime(roundTimes);
            }, 1000);
          }
        }
      }
    });
  }, //diy执行核心代码
  diyStop() {
    let _this = this;
    app.ishaking = false; //关闭震动状态
    _this.command({
      command: 'c5',
      param: ['00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00', '00'],
      check: false,
      success: function() {
        _this.uploadZDMode(2, shakeTimes2 * 1000); //发送统计数据
        shakeTimes2 = 0;
        clearTimeout(timer2);
        timer2 = null;
        if (_this.data.diyArr[_this.data.diyIndex]) {
          _this.data.diyArr[_this.data.diyIndex].play = false;
          _this.data.diyArr[_this.data.diyIndex].timeUsed = 0;
          _this.setData({
            diyArr: _this.data.diyArr
          });
        }
      }
    });
  }, //diy暂停
  uploadZDMode(mode, time) {
    mi.ajax({
      url: api.uploadZD,
      method: 'post',
      contentType: 'form',
      login: false,
      loading: false,
      data: {
        "type": mode,
        "ms": time,
      },
      dataPos: false,
      callback: function(data) {
      }
    });
  }, //上传震动
});