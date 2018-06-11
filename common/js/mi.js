let crypto = require('./crypto-js.min');
const aesKey = 'u.!4pb.pLzh^sN)u';
const mi = {
  version: '0.0.1',
  ip: 'http://api.51mito.com/api/',
  ajax: function (param) {
    let that = this;
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
      let Pos = 0; //0是不写任何参数，1是写到url里，2是写道body里
      if (params.hasOwnProperty('data')) {
        if (params.method == 'GET' || !params.hasOwnProperty('dataPos') || (params.hasOwnProperty('dataPos') && params.dataPos)) {
          Pos = 1; //params中方法是get的或者没有dataPos或者dataPos为true时，参数写道url里面
        } else {
          Pos = 2; //参数写道body里面
        }
      }
      let urlData = params.url + '?'; //url地址
      if (Pos == 1) {
        for (let item in params.data) {
          urlData += item + '=' + params.data[item] + '&';
        }
      }
      let sendData = ''; //定义将要上传服务器的数据
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
      let value = '';//获取的值
      let content = wx.getStorageSync(key);
      let expires = wx.getStorageSync(key + '_expires');
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
      // let encryptedStr = encrypted.ciphertext.toString();
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
    let max = arr[0];
    let len = arr.length;
    for (let i = 1; i < len; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }
    return max;
  },
  toast(data) {
    if (typeof data == 'string') {
      wx.showToast({
        title: data,
        icon: 'none'
      });
    }
  },
  deepMerge(obj1, obj2) {
    let key;
    for (key in obj2) {
      // 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
      obj1[key] = obj1[key] && obj1[key].toString() === "[object Object]" ?
        this.deepMerge(obj1[key], obj2[key]) : obj1[key] = obj2[key];
    }
    return obj1;
  },
  buf2hex(buffer) {
    let hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },//二进制转16进制
  hex2buf(hex) {
    let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    }));
    return typedArray.buffer;
  },
  buf2str(buffer) {
    let arr = Array.prototype.map.call(new Uint8Array(buffer), x => x)
    let str = ''
    for (let i = 0; i < arr.length; i++) {
      str += String.fromCharCode(arr[i])
    }
    return str
  },//二进制转字符串
  hex2str(hex) {
    let trimedStr = hex.trim();
    let rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
    let len = rawStr.length;
    if (len % 2 !== 0) {
      return "";
    }
    let curCharCode;
    let resultStr = [];
    for (let i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
  },
  check(para) {
    let dateArr = [];
    for (let i = 0; i < para.length / 2; i++) {
      dateArr.push(para[2 * i] + para[2 * i + 1]);
    }
    let code = "";
    for (let i = 0; i < dateArr.length - 1; i++) {
      if (i == 0) {
        code = this.xr(dateArr[i], dateArr[i + 1]);
      } else {
        code = this.xr(code, dateArr[i + 1]);
      }
    }
    return code;
  },//计算校验码
  xr(x1,x2){
    let xi1=parseInt(x1,16);
    let xi2 = parseInt(x2, 16);
    return (xi1 ^ xi2).toString(16);
  },
  xor(strHex_X, strHex_Y) {
    //将x、y转成二进制形式   
    let anotherBinary = parseInt(strHex_X, 16).toString(2);
    let thisBinary = parseInt(strHex_Y, 16).toString(2);

    let result = "";
    //判断是否为8位二进制，否则左补零
    if (anotherBinary.length != 8) {
      for (let i = anotherBinary.length; i < 8; i++) {
        anotherBinary = "0" + anotherBinary;
      }
    }
    if (thisBinary.length != 8) {
      for (let i = thisBinary.length; i < 8; i++) {
        thisBinary = "0" + thisBinary;
      }
    }
    //异或运算   
    for (let i = 0; i < anotherBinary.length; i++) {
      //如果相同位置数相同，则补0，否则补1 
      if (thisBinary.charAt(i) == anotherBinary.charAt(i))
        result += "0";
      else {
        result += "1";
      }
    }
    let resultHex = parseInt(result, 2).toString(16);
    return resultHex[1] ? resultHex : '0' + resultHex;
  },//异或比较
  isRight(hex){
    //先校验数据是否完整
    let data = hex.replace('fbfa', '').slice(0, -2);
    let check = hex.replace('fbfa' + data, '');
    if (mi.check(data) == check) {
      console.log('数据传输完整，校验通过', data, check, mi.check(data));
      return true;
    }else{
      console.log('数据传输不完整，校验不通过', data, check, mi.check(data));
      return false;
    }
  }
}
module.exports = mi;

