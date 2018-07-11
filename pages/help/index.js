var app = getApp();
const mi = require('../../common/js/mi.js');
const WxParse = require('../../common/components/wxParse/wxParse.js');
const api = {
  help: mi.ip + 'singlePage/info' //意见反馈
};
Page({
  data: {
    title: '',
    content: '',
    description: '',
    article: ''
  },
  onLoad() {
    let _this = this;
    mi.ajax({
      url: api.help,
      login: false,
      data: {
        "id": 2
      },
      callback: function(data) {
        let res = JSON.parse(mi.crypto.decode(data));

        console.log('data', data);
        _this.setData({
          title:res.data.title,
          content:res.data.content
        });
        WxParse.wxParse('description', 'html', res.data.description, _this, 10);
      }
    });
  },
  onShow() {

  }
});