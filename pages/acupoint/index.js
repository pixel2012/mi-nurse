var app = getApp();
const mi = require('../../common/js/mi.js');
Page({
  data: {
    index: -1,
    idx: -1,
    acupointName: '乳根穴',
    acupoint: 1,
    positionName: '左右胸同步',
    position: 1,
    modeName: '生如夏花',
    mode: 0,
    time: 8
  },
  onLoad(options) {
    //console.log('acupoint-onLoad', options);
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
  },
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
  },
  modeChange(e) {
    this.setData({
      modeName: e.currentTarget.dataset.name,
      mode: e.currentTarget.dataset.mode
    });
  },
  sliderChange(e) {
    this.setData({
      time: e.detail.value
    });
  },
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
    //console.log('app.result', app.result);
    //console.log('app.idx', app.idx);
    wx.navigateBack(); //返回上一级
  },
  getCommand() {
    let left = ['00', '00', '00', '00', '00', '00'];
    let right = ['00', '00', '00', '00', '00', '00'];
    let ms = this.getMode(this.data.mode);
    let ts = parseInt(this.data.time).toString(16);
    ts = ts[1] ? ts : '0' + ts;
    //console.log('ts', ts);
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
    //console.log('left.concat(right)', left.concat(right));
    return left.concat(right);
  },
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
  }

});