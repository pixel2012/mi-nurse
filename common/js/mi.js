let crypto = require('./crypto-js.min');
const aesKey = 'u.!4pb.pLzh^sN)u';
const mi = {
  version: '0.0.1',
  ip: 'https://api.51mito.com/api/',
  ajax: function(params) {
    let _this = this;
    //默认请求方式为get
    if (!params.hasOwnProperty('method') || !params.method) {
      params.method = 'GET';
    }
    let myId = _this.store.get('myId') || '';
    let myToken = _this.store.get('myToken') || '';
    let myRefreshToken = _this.store.get('myRefreshToken') || '';
    let userInfo = _this.store.get('userInfo');
    let systemInfo = _this.store.get('systemInfo');

    if (!myToken && params.login) {
      request({
        url: this.ip + '/user/refreshToken',
        method: 'post',
        data: {
          myId: myId,
          myRefreshToken: myRefreshToken,
          os: systemInfo.system.indexOf('ios') > -1 ? 'ios' : 'android'
        },
        success: function(data) {
          if (data) {
            //1，存储到本地
            data.forEach(v => {
              _this.store.set(v, data[v]);
            });
            //2，请求接口
            request(params, myToken);
          }
        },
        fail: function() {
          wx.showModal({
            title: '提示',
            content: "刷新myRefreshToken失败！"
          });
        }
      });
    } else {
      request(params, myToken || '');
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
        sendData = _this.crypto.encode(JSON.stringify(params.data));
      } else {
        sendData = params.data;
      }
      wx.request({
        url: urlData.slice(0, urlData.length - 1),
        method: params.method,
        header: {
          'content-type': (params.hasOwnProperty('contentType') && params.contentType == 'form') ? 'application/x-www-form-urlencoded' : 'application/json',
          'uid': myId,
          'token': myToken
        },
        data: sendData,
        success: function(res) {
          console.log(res);
          if (res.statusCode == 200) {
            //成功回调
            if (params.callback) {
              params.callback(res.data);
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
        fail: function(res) {
          if (!params.hasOwnProperty('errorTip') || params.errorTip) {
            wx.showModal({
              title: '提示',
              content: "url:" + params.url.slice(0, params.url.length) + "\n data:" + JSON.stringify(res)
            });
          }

        },
        complete: function(res) {
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
    set: function(key, data, expires) {
      wx.setStorageSync(key, data);
      //如果传入了过期时间，则追加一个参数存储过期时间
      if (expires) {
        console.log(!!expires);
        setTimeout(function() {
          wx.setStorageSync(key + '_expires', new Date().getTime() + expires); //单位毫秒
        }, 0);
      }
    },
    get: function(key) {
      let value = ''; //获取的值
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
    remove: function(key) {
      wx.removeStorageSync(key);
    },
    clear: function() {
      wx.clearStorageSync();
    }
  },
  crypto: {
    encode: function(word) {
      let key = crypto.enc.Utf8.parse(aesKey);
      let result = crypto.enc.Utf8.parse(word);
      let encrypted = crypto.AES.encrypt(result, key, {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
      });
      // let encryptedStr = encrypted.ciphertext.toString();
      return encrypted.toString();
    },
    decode: function(word) {
      let key = crypto.enc.Utf8.parse(aesKey);
      let result = crypto.AES.decrypt(word, key, {
        mode: crypto.mode.ECB,
        padding: crypto.pad.Pkcs7
      });
      return crypto.enc.Utf8.stringify(result).toString();
    }
  },
  user: {
    getSetting: function(callback) {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) {
            callback(true);
          } else {
            callback(false);
          }
        }
      });
    }, //获取用户授权状态
    login: function(callback) {
      wx.login({
        success: function(res) {
          if (callback) {
            callback(res.code);
          }
        }
      });
    },
    getInfo: function(callback) {
      wx.getUserInfo({
        success: function(res) {
          console.log(res);
          mi.store.set('openId', res.openId);
          mi.store.set('signature', res.signature);
          mi.store.set('userInfo', res.userInfo);
          // res.openId = 'oXGyD1VK6GnPVbUrcul8Wtp0FuWE';//定义openId
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
        fail: function() {
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
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  }, //二进制转16进制
  hex2buf(hex) {
    let typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function(h) {
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
  }, //二进制转字符串
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
    return (code + '')[1] ? code : '0' + code;
  }, //计算校验码
  xr(x1, x2) {
    let xi1 = parseInt(x1, 16);
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
  }, //异或比较
  isRight(hex) {
    //先校验数据是否完整
    let data = hex.replace('fbfa', '').slice(0, -2);
    let check = hex.replace('fbfa' + data, '');
    if (mi.check(data) == check) {
      console.log('数据传输完整，校验通过', data, check, mi.check(data));
      return true;
    } else {
      console.log('数据传输不完整，校验不通过', data, check, mi.check(data));
      return false;
    }
  },
  hexMerge(h1, h2) {
    let hex1 = Number('0x' + h1);
    let hex2 = Number('0x' + h2);
    return (hex1 + hex2).toString(16);
  },
  format(format, stamp) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    let date = stamp ? new Date(stamp) : new Date();
    let o = {
      "M+": date.getMonth() + 1, // month  
      "d+": date.getDate(), // day  
      "h+": date.getHours(), // hour  
      "m+": date.getMinutes(), // minute  
      "s+": date.getSeconds(), // second  
      "q+": Math.floor((date.getMonth() + 3) / 3), // quarter  
      "S": date.getMilliseconds()
      // millisecond  
    }
    if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 -
        RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
          o[k] :
          ("00" + o[k]).substr(("" + o[k]).length));
      }
    }
    return format;
  },
  getRadom(min, max) {
    return parseInt(Math.random() * max) + min;
  },
  showLoading(str) {
    wx.showLoading({
      title: str || '加载中',
      mask: true
    });
  },
  hideLoading() {
    wx.hideLoading();
  },
  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  }, //随机生成uuid
  switchCharData(charts) {
    let obj1 = {
      x: [],
      y: []
    }; //健康分数
    let obj2 = {
      x: [],
      y: []
    }; //乳温差
    let obj3 = {
      x: [],
      y1: [],
      y2: [],
      y3: [],
      y4: []
    }; //乳温（四个）
    for (let i = 0; i < charts.length; i++) {
      let time = this.format('dd日\nhh:mm', charts[i].ctime);
      obj1.x.push(time);
      obj2.x.push(time);
      obj3.x.push(time);
      obj1.y.push(charts[i].healthIndex);
      obj2.y.push(charts[i].maxDiff / 100);
      obj3.y1.push(charts[i].tp1 / 100);
      obj3.y2.push(charts[i].tp2 / 100);
      obj3.y3.push(charts[i].tp3 / 100);
      obj3.y4.push(charts[i].tp4 / 100);
      // obj1.x.push();
      // obj1.healthIndex = charts[i].healthIndex;//健康分
      // obj1.healthIndex = charts[i].healthIndex;//健康分
      // obj2.maxDiff = charts[i].maxDiff;//乳温差
      // obj3.tp1 = charts[i].tp1;//乳温
      // obj3.tp2 = charts[i].tp2;//乳温
      // obj3.tp3 = charts[i].tp3;//乳温
      // obj3.tp4 = charts[i].tp4;//乳温
      // arr1.push(obj1);
      // arr2.push(obj2);
      // arr3.push(obj3);
    }
    return [obj1, obj2, obj3];
  },
  pass2Hex(num) {
    let hex = (num * 1).toString(16).toUpperCase();
    let lack = 6 - hex.length;
    let patch = '';
    if (lack > 0) {
      for (let i = 0; i < lack; i++) {
        patch += '0';
      }
    }
    let result = patch + hex;
    return [result.substring(0, 2), result.substring(2, 4), result.substring(4)];
  }, //将十进制数转为6位十六进制数
  hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
      alert("Illegal Format ASCII Code!");
      return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value

      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
  }, //16进制转字符串
}
module.exports = mi;