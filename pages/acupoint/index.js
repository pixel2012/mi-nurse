var app = getApp();
const mi = require('../../common/js/mi.js');
Page({
  data: {
    index: -1,//按摩组合的索引位置，由上一个页面（massage）传入，主要用于判断是添加还是编辑
    idx: -1,//按摩组合的索引位置，由上一个页面（massage）shockArr的循环索引传入，主要用于判断是添加还是编辑
    acupointName: '乳根穴',
    acupoint: 1,//穴位索引
    positionName: '左右胸同步',
    position: 1,//位置索引
    modeName: '生如夏花',
    mode: 0,//震动模式
    time: 8//震动时间
  },
  onLoad(options) {
    if ('edit' in options) {
      let param = app.param;
      app.param = ''; //读完后删除之
      this.setData({
        index: options.index,
        idx: options.idx,
        acupointName: param.acupointName,
        acupoint: param.acupoint,
        positionName: param.positionName,
        position: param.position,
        modeName: param.modeName,
        mode: param.mode,
        time: param.time
      });
    } else {
      this.setData({
        index: options.index,
        idx: options.idx,
      });
    }
  },
  radioChange1(e) {
    let name = '';
    if (e.detail.value == 1) {
      name = '乳根';
    }
    if (e.detail.value == 2) {
      name = '乳中+膺窗';
    }
    if (e.detail.value == 3) {
      name = '天溪';
    }
    this.setData({
      acupointName: name,
      acupoint: e.detail.value
    });
  },//选择穴位
  radioChange2(e) {
    let name = '';
    if (e.detail.value == 1) {
      name = '左右胸同步';
    }
    if (e.detail.value == 2) {
      name = '仅左胸';
    }
    if (e.detail.value == 3) {
      name = '仅右胸';
    }
    this.setData({
      positionName: name,
      position: e.detail.value
    });
  },//选择位置
  modeChange(e) {
    this.setData({
      modeName: e.currentTarget.dataset.name,
      mode: e.currentTarget.dataset.mode
    });
  },//选择震动模式
  sliderChange(e) {
    this.setData({
      time: e.detail.value
    });
  },//选择按摩时长
  save() {
    let param = {
      acupointName: this.data.acupointName,
      acupoint: this.data.acupoint,
      positionName: this.data.positionName,
      position: this.data.position,
      modeName: this.data.modeName,
      mode: this.data.mode,
      command: this.getCommand(), //左乳中8秒
      time: this.data.time
    };
    app.result = param;
    app.idx = this.data.idx;
    wx.navigateBack(); //返回上一级
  },//保存按摩设置
  getCommand() {
    let left = ['00', '00', '00', '00', '00', '00'];
    let right = ['00', '00', '00', '00', '00', '00'];
    let ms = this.getMode(this.data.mode);
    let ts = parseInt(this.data.time).toString(16);
    ts = ts[1] ? ts : '0' + ts;
    if (this.data.acupoint == 1 && (this.data.position == 1 || this.data.position == 2)) {
      left = [ms, ts, '00', '00', '00', '00'];
    }
    if (this.data.acupoint == 2 && (this.data.position == 1 || this.data.position == 2)) {
      left = ['00', '00', ms, ts, '00', '00'];
    }
    if (this.data.acupoint == 3 && (this.data.position == 1 || this.data.position == 2)) {
      left = ['00', '00', '00', '00', ms, ts];
    }
    if (this.data.acupoint == 1 && (this.data.position == 1 || this.data.position == 3)) {
      right = [ms, ts, '00', '00', '00', '00'];
    }
    if (this.data.acupoint == 2 && (this.data.position == 1 || this.data.position == 3)) {
      right = ['00', '00', ms, ts, '00', '00'];
    }
    if (this.data.acupoint == 3 && (this.data.position == 1 || this.data.position == 3)) {
      right = ['00', '00', '00', '00', ms, ts];
    }
    return left.concat(right);
  },//根据设置的参数，生成穴位组合，可以打印查看具体格式
  getMode(num) {
    let result = '';
    if (num == 0) {
      result = '11';
    }
    if (num == 1) {
      result = '21';
    }
    if (num == 2) {
      result = '31';
    }
    if (num == 3) {
      result = '41';
    }
    if (num == 4) {
      result = '51';
    }
    if (num == 5) {
      result = '61';
    }
    return result;
  }//得到震动模式数值

});