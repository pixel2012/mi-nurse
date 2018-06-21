var app = getApp();
const mi = require('../../common/js/mi.js');
let diyArr = mi.store.get('diyArr') ? mi.store.get('diyArr') : [];
Page({
  data: {
    acupoint: 1,//穴位
    position: 1,
    mode: 0,
    time: 8
  },
  onLoad() {

  },
  onShow() {

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
    diyArr.push({
      acupointName: '乳根穴',
      acupoint: 1,
      positionName: '左胸',
      position: 2,
      modeName: '盛夏如花',
      mode: 0,
      command: this.getCommand(),//左乳中8秒
      time: 8
    });
    mi.store.set('diyArr', diyArr);
  },
  getCommand() {






    
    return ['00', '00', '11', '08', '00', '00', '00', '00', '00', '00', '00', '00']
  }

});
