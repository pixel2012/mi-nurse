var app = getApp();
const mi = require('../../common/js/mi.js');
// 当前页面会把每个小的穴位组合拼组一个方便diy震动执行的大数组格式（shockArr），并将其看成一个整体增加一些其他相关的属性，具体格式可以添加打印查看，参数在下方（data）列出的相关解释
Page({
  data: {
    index: -1,//震动组合当前执行的索引值，-1是还没开始执行
    title: '',//震动组合名称
    timeUsed: 0,//震动组合已经用去的时间
    timeTotal: 0,//震动组合总时间
    play: false,//震动组合是否处在震动
    playStep: 0,//震动组合当前处在第几个步骤
    shockArr: []//执行的动画序列
  },
  onLoad(options) {
    mi.showLoading('加载数据中');
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

  },//从缓存中读取之前设置过的组合数据
  upParam() {
    if (app.result) {
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
  },//更新穴位修改的值
  inputChange(e) {
    this.setData({
      title: e.detail.value
    });
  },//修改组合名称
  edit(e) {
    app.param = this.data.shockArr[e.currentTarget.dataset.idx];
    wx.navigateTo({
      url: '/pages/acupoint/index?index=' + this.data.index + '&idx=' + e.currentTarget.dataset.idx + '&edit=1'
    });
  },//修改穴位设置
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
  },//保存震动组合
  getAllTimes(arr) {
    let time = 0;
    arr.forEach(v => {
      time += v.time
    });
    return time;
  }//计算震动组合总体需要耗费的时间
});
