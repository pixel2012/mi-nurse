var app = getApp();
const mi = require('../../common/js/mi.js');
Page({
  data: {
    index: -1,
    title: '',
    timeUsed: 0,
    timeTotal: 0,
    play: false,
    playStep: 0,
    shockArr: []//执行的动画序列
  },
  onLoad(options) {
    mi.showLoading('加载数据中');
    console.log('massage-onLoad', options);
    let currentIndex = -1;
    if ('index' in options) {
      currentIndex = options.index
    }
    this.setData({
      index: currentIndex
    });
    //更新本地数据
    this.updata(function(){
      mi.hideLoading();
    });
  },
  onShow() {
    //更新本地数据
    this.upParam();
  },
  updata(callback) {
    let diyArr = mi.store.get('diyArr') ? mi.store.get('diyArr') : [];
    if (this.data.index != -1) {
      //url中传的有参数，说明是修改
      let curr = diyArr[this.data.index];
      this.setData({
        title: curr.title,
        timeUsed: curr.timeUsed,
        timeTotal: curr.timeTotal,
        play: curr.play,
        shockArr: curr.shockArr
      });
    } else {
      //url中无参数，说明是新建
      this.setData({
        title: '组合' + (diyArr.length + 1),
        timeUsed: 0,
        timeTotal: 0,
        play: false,
        shockArr: []
      });
    }
    if (callback){
      callback();
    }

  },
  upParam() {
    if (app.result) {
      console.log('666', 'app.result', app.result);
      console.log('666', 'app.idx', app.idx);
      let shockArr = this.data.shockArr;
      if (app.idx != -1) {
        shockArr[app.idx] = app.result;
      } else {
        shockArr.push(app.result);
      }
      this.setData({
        shockArr: shockArr
      });
      app.result = '';
      app.idx = '';
    }
  },//跟新穴位修改的值
  inputChange(e) {
    this.setData({
      title: e.detail.value
    });
  },
  edit(e) {
    app.param = this.data.shockArr[e.currentTarget.dataset.idx];
    wx.navigateTo({
      url: '/pages/acupoint/index?index=' + this.data.index + '&idx=' + e.currentTarget.dataset.idx + '&edit=1'
    });
  },
  remove(e) {
    let shockArr = this.data.shockArr;
    if (shockArr.length>1){
      shockArr.splice(e.currentTarget.dataset.idx, 1);
      this.setData({
        shockArr: shockArr
      });
    }else{
      this.delete();
    }
    
  },//删除穴位
  delete() {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除该组合吗',
      success: function (res) {
        if (res.confirm) {
          let diyArr = mi.store.get('diyArr') ? mi.store.get('diyArr') : [];
          diyArr.splice(_this.data.index, 1);
          mi.store.set('diyArr', diyArr);
          wx.navigateBack();
        }
      }
    });
  },//删除组合
  save() {
    if (this.data.title == '') {
      return mi.toast('请填写组合名称');
    }
    if (this.data.shockArr.length == 0) {
      return mi.toast('请至少添加一个穴位');
    }
    let diyArr = mi.store.get('diyArr') ? mi.store.get('diyArr') : [];
    let curr = {
      title: this.data.title,
      timeUsed: this.data.timeUsed,
      timeTotal: this.getAllTimes(this.data.shockArr),
      play: this.data.play,
      playStep: this.data.playStep,
      shockArr: this.data.shockArr
    };
    if (this.data.index == -1) {
      diyArr.push(curr);
    } else {
      diyArr[this.data.index] = curr;
    }
    mi.store.set('diyArr', diyArr);
    wx.navigateBack();
  },
  getAllTimes(arr) {
    let time = 0;
    arr.forEach(v => {
      time += v.time
    });
    console.log('time', time);
    return time;
  }
});
