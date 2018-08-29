var app = getApp();
const mi = require('../../common/js/mi.js');
const api = {
  wh: mi.ip + 'user/updateHeightWeight', //身高
  chest: mi.ip + 'user/updateChest', //胸围
  birthday: mi.ip + 'user/updateBirthday', //生日
  version: mi.ip + 'open/getNewVersion', //获取最新版本
  info: mi.ip +'user/queryById'//获取用户信息
};
Page({
  data: {
    nickName: '',
    headerUrl: '',
    isFigure: false, //是否显示身材
    isBreast: false, //是否显示胸围
    currentDate: new Date().getFullYear() + '-01',
    dateStart: new Date().getFullYear() - 50 + '-01',
    dataEnd: new Date().getFullYear() + '-12',
    height: '', //身高
    weight: '', //体重
    multiArray: [mi.heightInit(),mi.weightInit()],
    multiIndex: [40, 20],



    imgUrls: [{
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
    currentRt: -1,
    indicatorDots: true,
    indicatorActiveColor: '#12C8C8',
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular: true,
    displayMultipleItems: 2,
    oldSet:{
      age:'',
      height:'',
      weight:'',
      shape:'',
      size:''
    }
  },
  onLoad() {
    let _this=this;
    let userInfo = mi.store.get('userInfo') || {};
    let age = mi.store.get('age') || '';
    let height = mi.store.get('height') || '';
    let weight = mi.store.get('weight') || '';
    let myBreast = mi.store.get('myBreast') || {};

    this.getInfo(function(data){
      userInfo = Object.assign(userInfo, {
        nickName: data.nickName || '未知',
        avatar: data.avatar || ''
      });
      mi.store.set('userInfo', userInfo);
      
      if (data.birthday){
        mi.store.set('age',data.birthday);
      }
      if (data.height) {
        mi.store.set('height', parseInt(data.height/10));
      }
      if (data.weight) {
        mi.store.set('weight', parseInt(data.weight/10));
      }
      if (data.birthday) {
        mi.store.set('age', data.birthday);
      }
      myBreast = Object.assign(myBreast, {
        shape: data.extChestType || '',
        size: data.extChestSize || '',
        up: data.extChestUp || 70,
        down: data.extChestDown || 63,
        result: data.extChestSize || '65AA',
        current: data.extChestType ? mi.getBreastIndex(_this.data.imgUrls,data.extChestType) : 0,
        currentRt: data.extChestType ? mi.getBreastIndex(_this.data.imgUrls, data.extChestType) : -1
      });
      mi.store.set('myBreast', myBreast);
      _this.updateInfo();
    });
  },
  onShow() {
  },
  getInfo(callback){
    mi.ajax({
      url: api.info,
      method: 'get',
      login: false,
      data: {
        "userId": mi.store.get('myId')
      },
      encrypt: true,
      callback: function (data) {
        let res = JSON.parse(mi.crypto.decode(data));
        if(callback){
          callback(res.data);
        }
      }
    });
  },
  bindMultiPickerChange: function (e) {
    this.data.height = this.data.multiArray[0][e.detail.value[0]];
    this.data.weight = this.data.multiArray[1][e.detail.value[1]];
    this.data.oldSet.height = this.data.multiArray[0][e.detail.value[0]];
    this.data.oldSet.weight = this.data.multiArray[1][e.detail.value[1]];
    this.setData({
      height: this.data.height,
      weight: this.data.weight,
      oldSet: this.data.oldSet
    });
    this.bindSave2();
  },
  updateInfo(){
    let userInfo = mi.store.get('userInfo');
    let myBreast = mi.store.get('myBreast');
    let age = mi.store.get('age');
    let height = mi.store.get('height');
    let weight = mi.store.get('weight');
    this.setData({
      nickName: userInfo.nickName,
      headerUrl: userInfo.avatar,
      currentDate: age ? age : new Date().getFullYear() + '-01',
      height: height ? height : '',
      weight: weight ? weight : '',
      multiIndex: [mi.getIndex(this.data.multiArray[0], height, 'cm'), mi.getIndex(this.data.multiArray[1], weight, 'kg')],
      up: myBreast.up,
      down: myBreast.down,
      result: myBreast.result,
      current: myBreast.currentRt,
      currentRt: myBreast.currentRt,
      oldSet: {
        age: age ? mi.getAge(age) : '',
        height: height ? height + 'cm' : '',
        weight: weight ? weight + 'kg' : '',
        shape: myBreast.shape,
        size: myBreast.size
      }
    });
  },//废弃
  hideAll: function() {
    this.setData({
      isFigure: false,
      isBreast: false
    });
  },
  preventBubble: function() {},
  bindFigureChange: function(e) {
    this.setData({
      isFigure: true
    });
  },
  bindBreastChange: function(e) {
    let _this = this;
    this.setData({
      isBreast: true,
      current: _this.data.currentRt > -1 ? _this.data.currentRt : 0
    });
  },
  closeBreast: function() {
    this.setData({
      isBreast: false
    });
  },
  changeCurrent(e) {
    if (e.detail.source == 'touch') {
      this.setData({
        current: e.detail.current
      });
    }
  },
  changeBreast(e) {
    this.setData({
      currentRt: e.currentTarget.dataset.index
    });
  },
  save() {
    if (this.data.currentRt == -1) {
      return mi.toast('请选择自己的胸型，点击确认');
    }
    if (this.data.result == '') {
      return mi.toast('请输入合理的范围');
    }
    let _this = this;
    let myBreast = {
      shape: this.data.imgUrls[this.data.currentRt].title,
      size: this.data.result,
      up: this.data.up,
      down: this.data.down,
      result: this.data.result,
      currentRt: this.data.currentRt
    };

    mi.store.set('myBreast', myBreast);
    mi.ajax({
      url: api.chest,
      method: 'post',
      login: false,
      data: {
        "upSize": this.data.up,
        "downSize": this.data.down,
        "chestSize": this.data.result,
        "chestType": this.data.imgUrls[this.data.currentRt].title
      },
      encrypt: true,
      dataPos: false,
      callback: function(data) {
        let res = JSON.parse(mi.crypto.decode(data));
        _this.setData({
          isBreast: false
        });
        _this.updateInfo();
      }
    });
  },
  bindDateChange: function(e) {
    let _this=this;
    this.setData({
      currentDate: e.detail.value
    });
    mi.ajax({
      url: api.birthday,
      method: 'post',
      login: false,
      data: {
        "birthday": this.data.currentDate,
      },
      encrypt: true,
      dataPos: false,
      callback: function(data) {
        let res = JSON.parse(mi.crypto.decode(data));
        mi.store.set('age', _this.data.currentDate);
        _this.updateInfo();
      }
    });
  }, //生日
  inputHeight(e) {
    this.setData({
      height: e.detail.value
    });
  }, //身高
  inputWeight(e) {
    this.setData({
      weight: e.detail.value
    });
  }, //体重
  bindSave() {
    if (!this.data.height) {
      return mi.toast('请输入合适的身高');
    }
    if (!this.data.weight) {
      return mi.toast('请输入合适的体重');
    }
    let _this = this;
    mi.ajax({
      url: api.wh,
      method: 'post',
      login: false,
      data: {
        "height": this.data.height * 10,
        "weight": this.data.weight * 10
      },
      encrypt: true,
      dataPos: false,
      callback: function(data) {
        let res = JSON.parse(mi.crypto.decode(data));
        _this.setData({
          isFigure: false
        });
        mi.store.set('height', _this.data.height);
        mi.store.set('weight', _this.data.weight);
        _this.updateInfo();
      }
    });
  }, //身高体重
  bindSave2() {
    let _this = this;
    mi.ajax({
      url: api.wh,
      method: 'post',
      login: false,
      data: {
        "height": this.data.oldSet.height.replace('cm','') * 10,
        "weight": this.data.oldSet.weight.replace('kg', '') * 10
      },
      encrypt: true,
      dataPos: false,
      callback: function (data) {
        let res = JSON.parse(mi.crypto.decode(data));
      }
    });
  }, //身高体重
  bindsliderChange1: function(e) {
    this.setData({
      up: e.detail.value
    });
    let _this = this;
    this.calc(function(val) {
      _this.setData({
        result: val
      });
    });
  }, //上胸围
  bindsliderChange2: function(e) {
    this.setData({
      down: e.detail.value
    });
    let _this = this;
    this.calc(function(val) {
      _this.setData({
        result: val
      });
    });
  }, //下胸围
  calc(callback) {
    let up = this.data.up; //上胸围
    let down = this.data.down; //下胸围
    let diff = up - down;
    let val = '';
    if (diff <= 0 || diff > 23) {
      return callback('');
    }
    // 63~67
    if (down >= 63 && down <= 67) {
      if (diff >= 7 && diff <= 8) {
        val = '65AA';
      } else
      if (diff >= 9 && diff <= 11) {
        val = '65A';
      } else
      if (diff >= 12 && diff <= 13) {
        val = '65B';
      } else
      if (diff >= 14 && diff <= 16) {
        val = '65C';
      } else
      if (diff >= 17 && diff <= 18) {
        val = '65D';
      } else
      if (diff >= 19 && diff <= 21) {
        val = '65E';
      } else
      if (diff >= 22 && diff <= 23) {
        val = '65F';
      } else {
        callback('');
      }
    } else
      // 68~72
      if (down >= 68 && down <= 72) {
        if (diff >= 7 && diff <= 8) {
          val = '70AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '70A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '70B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '70C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '70D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '70E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '70F';
        } else {
          callback('');
        }
      }
    else
      // 73~77
      if (down >= 73 && down <= 77) {
        if (diff >= 7 && diff <= 8) {
          val = '75AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '75A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '75B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '75C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '75D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '75E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '75F';
        } else {
          callback('');
        }
      }
    else
      // 78~82
      if (down >= 78 && down <= 82) {
        if (diff >= 7 && diff <= 8) {
          val = '80AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '80A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '80B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '80C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '80D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '80E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '80F';
        } else {
          callback('');
        }
      }
    else
      // 83~87
      if (down >= 83 && down <= 87) {
        if (diff >= 7 && diff <= 8) {
          val = '85AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '85A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '85B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '85C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '85D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '85E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '85F';
        } else {
          callback('');
        }
      }
    else
      // 87~92
      if (down >= 87 && down <= 92) {
        if (diff >= 7 && diff <= 8) {
          val = '90AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '90A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '90B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '90C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '90D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '90E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '90F';
        } else {
          callback('');
        }
      }
    else
      // 93~97
      if (down >= 93 && down <= 97) {
        if (diff >= 7 && diff <= 8) {
          val = '95AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '95A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '95B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '95C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '95D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '95E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '95F';
        } else {
          callback('');
        }
      }
    else
      // 98~102
      if (down >= 98 && down <= 102) {
        if (diff >= 7 && diff <= 8) {
          val = '100AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '100A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '100B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '100C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '100D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '100E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '100F';
        } else {
          callback('');
        }
      }
    else
      // 103~107
      if (down >= 103 && down <= 107) {
        if (diff >= 7 && diff <= 8) {
          val = '105AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '105A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '105B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '105C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '105D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '105E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '105F';
        } else {
          callback('');
        }
      }
    else
      // 108~112
      if (down >= 108 && down <= 112) {
        if (diff >= 7 && diff <= 8) {
          val = '110AA';
        } else
        if (diff >= 9 && diff <= 11) {
          val = '110A';
        } else
        if (diff >= 12 && diff <= 13) {
          val = '110B';
        } else
        if (diff >= 14 && diff <= 16) {
          val = '110C';
        } else
        if (diff >= 17 && diff <= 18) {
          val = '110D';
        } else
        if (diff >= 19 && diff <= 21) {
          val = '110E';
        } else
        if (diff >= 22 && diff <= 23) {
          val = '110F';
        } else {
          callback('');
        }
      }
    else {
      callback('');
    }
    callback(val);
  },
  searchVer() {
    mi.ajax({
      url: api.version,
      login: true,
      data: {
        "v": app.bleVer,
        "type": 3
      },
      callback: function(data) {
        let res = JSON.parse(mi.crypto.decode(data));
        mi.toast(res.data ? res.data : '未知版本');

      }
    });
  } //查看版本
});