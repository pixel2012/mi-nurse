var app = getApp();
const mi = require('../../common/js/mi.js');
Page({
  data: {
    isFigure: false,//是否显示身材
    isBreast: false,//是否显示胸围
    currentDate: new Date().getFullYear() + '-01',
    dateStart: new Date().getFullYear() - 50 + '-01',
    dataEnd: new Date().getFullYear() + '-12',
    imgUrls: [
      {
        title: '圆盘型',
        url: 'img/01.jpg'
      },
      {
        title: '圆锥型',
        url: 'img/02.jpg'
      },
      {
        title: '水滴型',
        url: 'img/03.jpg'
      },
      {
        title: '半球型',
        url: 'img/04.jpg'
      },
      {
        title: '木瓜型',
        url: 'img/05.jpg'
      },
      {
        title: '下垂型',
        url: 'img/06.jpg'
      },
    ],
    up: 70,
    down: 63,
    result: '65AA',
    current: 0,
    indicatorDots: true,
    indicatorActiveColor: '#12C8C8',
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true,
    displayMultipleItems: 2
  },
  onLoad() {

  },
  onShow() {

  },
  hideAll: function () {
    this.setData({
      isFigure: false,
      isBreast: false
    });
  },
  preventBubble: function () { },
  bindFigureChange: function (e) {
    this.setData({
      isFigure: true
    });
  },
  bindBreastChange: function (e) {
    this.setData({
      isBreast: true
    });
  },
  closeBreast: function () {
    this.setData({
      isBreast: false
    });
  },
  save(){
    console.log(this.data.result);
    this.setData({
      isBreast: false
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      currentDate: e.detail.value
    });
  },
  bindsliderChange1: function (e) {
    this.setData({
      up: e.detail.value
    });
    let _this = this;
    this.calc(function (val) {
      _this.setData({
        result: val
      });
    });
  },
  bindsliderChange2: function (e) {
    this.setData({
      down: e.detail.value
    });
    let _this = this;
    this.calc(function (val) {
      _this.setData({
        result: val
      });
    });
  },
  calc(callback) {
    let up = this.data.up;//上胸围
    let down = this.data.down;//下胸围
    let diff = up - down;
    let val='';
    if(diff<=0 || diff>23){
      return callback('请选择正确的尺寸');
    }
    // 63~67
    if (down >= 63 && down <= 67) {
      if (diff >= 7 && diff <= 8) {
        val = '65AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '65A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '65B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '65C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '65D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '65E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '65F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 68~72
    if (down >= 68 && down <= 72) {
      if (diff >= 7 && diff <= 8) {
        val = '70AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '70A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '70B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '70C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '70D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '70E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '70F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 73~77
    if (down >= 73 && down <= 77) {
      if (diff >= 7 && diff <= 8) {
        val = '75AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '75A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '75B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '75C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '75D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '75E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '75F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 78~82
    if (down >= 78 && down <= 82) {
      if (diff >= 7 && diff <= 8) {
        val = '80AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '80A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '80B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '80C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '80D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '80E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '80F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 83~87
    if (down >= 83 && down <= 87) {
      if (diff >= 7 && diff <= 8) {
        val = '85AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '85A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '85B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '85C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '85D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '85E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '85F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 87~92
    if (down >= 87 && down <= 92) {
      if (diff >= 7 && diff <= 8) {
        val = '90AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '90A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '90B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '90C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '90D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '90E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '90F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 93~97
    if (down >= 93 && down <= 97) {
      if (diff >= 7 && diff <= 8) {
        val = '95AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '95A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '95B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '95C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '95D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '95E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '95F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 98~102
    if (down >= 98 && down <= 102) {
      if (diff >= 7 && diff <= 8) {
        val = '100AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '100A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '100B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '100C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '100D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '100E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '100F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    // 103~107
    if (down >= 103 && down <= 107) {
      if (diff >= 7 && diff <= 8) {
        val = '105AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '105A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '105B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '105C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '105D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '105E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '105F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      } 
    }
    else
    // 108~112
    if (down >= 108 && down <= 112) {
      if (diff >= 7 && diff <= 8) {
        val = '110AA';
      }
      else
      if (diff >= 9 && diff <= 11) {
        val = '110A';
      }
      else
      if (diff >= 12 && diff <= 13) {
        val = '110B';
      }
      else
      if (diff >= 14 && diff <= 16) {
        val = '110C';
      }
      else
      if (diff >= 17 && diff <= 18) {
        val = '110D';
      }
      else
      if (diff >= 19 && diff <= 21) {
        val = '110E';
      }
      else
      if (diff >= 22 && diff <= 23) {
        val = '110F';
      }
      else
      {
        callback('请输入正确的胸围尺寸');
      }
    }
    else
    {
      callback('请输入正确的胸围尺寸');
    }
    callback(val);
  }
});
