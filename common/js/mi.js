let crypto = require('./crypto-js.min');
const aesKey = 'u.!4pb.pLzh^sN)u';
const mi = {
  version: '0.0.1',
  ip: 'http://api.51mito.com/api/',
  ajax: function (param) {
    var that = this;
    //默认请求方式为get
    if (!params.hasOwnProperty('method') || !params.method) {
      params.method = 'GET';
    }
    let myToken = store.get('myToken');
    let myRefreshToken = store.get('myRefreshToken');
    let userinfo = store.get('userinfo');

    if (!access_token && params.login) {
      request({
        url: this.ip + '/user/refreshToken',
        method: 'post',
        data: {
          myId: "18",
          myRefreshToken: "b4db6ce6-d6ae-1394-9139-73403063f7a4",
          pushChannelId: "42739732949249670",
          os: "android/ios"
        },
        success: function (data) {
          if (data) {
            //1，存储到本地
            data.forEach(v => {
              that.store.set(v, data[v]);
            });
            //2，请求接口
            request(params, data.myToken);
          }
        },
        fail: function () {
          wx.showModal({
            title: '提示',
            content: "刷新myRefreshToken失败！"
          });
        }
      });
    } else {
      request(params, data.myToken || '');
    }

    function request(params, token) {
      if (!params.hasOwnProperty('loading') || params.loading) {
        wx.showLoading({
          title: '努力加载中...',
        });
      }
      //判断参数是写到url里面还是body里面
      var Pos = 0; //0是不写任何参数，1是写到url里，2是写道body里
      if (params.hasOwnProperty('data')) {
        if (params.method == 'GET' || !params.hasOwnProperty('dataPos') || (params.hasOwnProperty('dataPos') && params.dataPos)) {
          Pos = 1; //params中方法是get的或者没有dataPos或者dataPos为true时，参数写道url里面
        } else {
          Pos = 2; //参数写道body里面
        }
      }
      var urlData = params.url + '?'; //url地址
      if (Pos == 1) {
        for (var item in params.data) {
          urlData += item + '=' + params.data[item] + '&';
        }
      }
      var sendData = ''; //定义将要上传服务器的数据
      /*当含有加密参数开启*/
      if (params.hasOwnProperty('encrypt') && params.encrypt) {
        sendData = that.crypto.encode(JSON.stringify(params.data));
      } else {
        sendData = params.data;
      }
      wx.request({
        url: urlData.slice(0, urlData.length - 1),
        method: params.method,
        header: {
          uid: store.get('uid'),
          token: token
        },
        data: sendData,
        success: function (res) {
          if (res.status) {
            //成功回调
            if (params.callback) {
              params.callback(res.data.data);
            }
          } else {
            if (!params.hasOwnProperty('failTip') || params.failTip) {
              wx.showModal({
                title: '提示',
                content: res.data.message || "未知错误"
              });
            }
            //报错回调
            if (params.failback) {
              params.failback(res.data.data);
            }
          }
        },
        fail: function (res) {
          if (!params.hasOwnProperty('errorTip') || params.errorTip) {
            wx.showModal({
              title: '提示',
              content: "url:" + params.url.slice(0, params.url.length) + "\n data:" + JSON.stringify(res)
            });
          }

        },
        complete: function (res) {
          if (!params.hasOwnProperty('loading') || params.loading) {
            wx.hideLoading()
          }
          if (params.finalback) {
            params.finalback(res);
          }
        }
      });
    }
  },
  store: {
    set: function (key, data, expire) {
      wx.setStorageSync(key, data);
      //如果传入了过期时间，则追加一个参数存储过期时间
      if (expires) {
        setTimeout(function () {
          wx.setStorageSync(key + '_expires', new Date().getTime() + expires);//单位毫秒
        }, 0);
      }
    },
    get: function (key) {
      var value = '';//获取的值
      var content = wx.getStorageSync(key);
      var expires = wx.getStorageSync(key + '_expires');
      if (expires) {
        //如果有过期时间
        if (expires - new Date().getTime() > 0) {
          return content
        } else {
          wx.removeStorageSync(key);
          wx.removeStorageSync(key + '_expires');
          return '';
        }
      } else {
        //没有过期时间
        return content
      }
    },
    remove: function (key) {
      wx.removeStorageSync(key);
    },
    clear: function () {
      wx.clearStorageSync();
    }
  },
  crypto: {
    encode: function (word) {
      let key = crypto.enc.Utf8.parse(aesKey);
      let result = crypto.enc.Utf8.parse(word);
      let encrypted = crypto.AES.encrypt(result, key, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
      // var encryptedStr = encrypted.ciphertext.toString();
      return encrypted.toString();
    },
    decode: function (word) {
      let key = crypto.enc.Utf8.parse(aesKey);
      let result = crypto.AES.decrypt(word, key, { mode: crypto.mode.ECB, padding: crypto.pad.Pkcs7 });
      return crypto.enc.Utf8.stringify(result).toString();
    }
  },
  user: {
    getSetting: function (callback) {
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            callback(true);
          } else {
            callback(false);
          }
        }
      });
    },//获取用户授权状态
    getInfo: function (callback) {
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          res.openId = 'oXGyD1VK6GnPVbUrcul8Wtp0FuWE';//定义openId
          callback(res);
          // mi.ajax({
          //   url: api.bindThirdAccount,
          //   method:'post',
          //   data:{

          //   },
          //   success:function(){

          //   }
          // });
        },
        fail: function () {
          wx.toast('获取用户信息失败');
        }
      });
    }
  },
  getArryMax(arr) {
    var max = arr[0];
    var len = arr.length;
    for (var i = 1; i < len; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  }
};
module.exports = mi;

