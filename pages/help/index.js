var app = getApp();
const mi = require('../../common/js/mi.js');
const api = {
  help: mi.ip + 'singlePage/info' //意见反馈
};
Page({
  data: {
    title:'',
    content:'',
    description:''
  },
  onLoad() {
    let _this=this;
    mi.ajax({
      url: api.help,
      login: false,
      data: {
        "id": 2,
      },
      callback: function (data) {
        let res = JSON.parse(mi.crypto.decode(data));
        console.log('data', res);
        _this.setData({
          title:res.data.title,
          content:res.data.content,
          description: res.data.description
        });

      }
    });
  },
  onShow() {

  }
});
