var app = getApp();
const mi = require('../../common/js/mi.js');
const api = {
  feedback: mi.ip + 'qa/publish' //意见反馈
};
Page({
  data: {
    advice: '',
    email: '',
    imgs: []
  },
  onLoad() {

  },
  onShow() {

  },
  bindInput(e){
    this.setData({
      [e.currentTarget.dataset.type]: e.detail.value
    });
  },
  upload() {
    let _this = this;
    if (this.data.imgs.length < 9) {
      wx.chooseImage({
        count: 9 - _this.data.imgs.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          console.log(res);
          let tempFilePaths = res.tempFilePaths
          _this.data.imgs = _this.data.imgs.concat(tempFilePaths);
          _this.setData({
            imgs: _this.data.imgs
          });

        }
      });
    } else {
      mi.toast('上传图片不能超过9张');
    }
  }, //上传图片
  delImg(e) {
    this.data.imgs.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      imgs: this.data.imgs
    });
  },
  submit() {
    console.log(this.data);
    if (!this.data.advice && !this.data.email && this.data.imgs.length == 0) {
      return mi.toast('请至少填写一项');
    }
    mi.ajax({
      url: api.feedback,
      method: 'post',
      login: false,
      data: {
        "content": this.data.advice,
        "email": this.data.email,
        "picture": this.data.imgs
      },
      dataPos: false,
      callback: function(data) {
        console.log(data);
        mi.toast('上传成功');
      }
    });
  } //提交
});