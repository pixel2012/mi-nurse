let app = getApp();
const echarts = require('../../common/components/ec-canvas/echarts.js');
// let wxCharts = require('../../common/js/wxcharts.js');
const mi = require('../../common/js/mi.js');
const api = {
  bindThirdAccount: mi.ip + 'user/bindThirdAccount', //绑定账号
  login: mi.ip + 'user/login', //登录
  tempUpload: mi.ip + 'temperature/post', //温度上传
  dateAble: mi.ip + 'temperature/historyMonth', //可用的温度时间列表
  history: mi.ip + 'temperature/list', //获取温度列表
  bindLog: mi.ip + 'zhimito/bindLog' //上传硬件信息
};

let chart, chart2, chart3;
let count = 0; //测量温度计数
let verifyFn = null; //验证完密码后的回调函数
let connectNum = 0; //连接次数，连接3次都失败就关闭连接

function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  return chart;
}

function initChart2(canvas, width, height) {
  chart2 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart2);
  return chart2;
}

function initChart3(canvas, width, height) {
  chart3 = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart3);
  return chart3;
}


Page({
  data: {
    bleIsConnect: false, //是否连接蓝牙
    bleIsSync: '', //是否蓝牙信息同步
    bleSyncInfo: '', //是否蓝牙信息同步
    bleEnergy: 0, //电池电量
    bleIsShowList: false, //是否显示已搜索到的蓝牙设备列表
    bleLists: [], //搜索到蓝牙设备列表
    bleDeviceId: '', //蓝牙设备的id号
    bleServerId: '', //蓝牙设备的服务id号
    bleCharWriteId: '', //蓝牙设备的服务写入特征值id号
    bleCharNotifyId: '', //蓝牙设备的服务接收通知特征值id号
    blehdid: '', //蓝牙硬件ID
    isAuthorize: true, //是否授权
    available: false, //蓝牙是否可用
    discovering: false, //蓝牙是否处于搜索
    temp_score: '',
    temp_lto: '', //左上外
    temp_lti: '', //左上内
    temp_rti: '', //右上内
    temp_rto: '', //右上外
    temp_avg: '', //平均乳温
    temp_diff_num: '', //最大温差值
    temp_diff_max_obj: '', //最大乳温差是谁
    temp_avg_isNormal: true, //平均温是否处于正常范围
    temp_avg_title: '', //平均温诊断标题
    temp_avg_detial: '', //平均温诊断内容
    temp_diff_isNormal: true, //最大温差是否处于正常范围
    temp_diff_title: '', //最大温差诊断标题
    temp_diff_detial: '', //最大温差诊断内容
    temp_cache: [], //测温临时缓存
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    ec3: {
      onInit: initChart3
    },
    yearOptions: [], //年份备选
    monthOptions: [], //当月合集
    superYears: [], //时间备选合集
    year: 0,
    month: 0,
    echart0: -1, //表0健康值
    echart1: -1, //表1温差
    echart2: [0, 0, 0, 0], //表2温度
    echart0Date: '', //表0日期
    echart1Date: '', //表1日期
    echart2Date: '', //表2日期
    measurementTime: 0, //测温时长
    jump0: null, //健康
    jump1: null, //温差
    jump2: null, //乳温
    superMonthArr: null, //当月的所有温度信息
    cellTime: '', //电池测量时间
    blePass: '', //蓝牙密码
    blueRight: false, //是否让用户输入蓝牙密码
  },
  onLoad() {
    let _this = this;
    //1,根据缓存判断用户是否注册过
    this.tempUpdate(function() {
      //先授权，后蓝牙
      _this.updateStore(function() {
        //console.log('_this.data.bleDeviceId', _this.data.bleDeviceId);
        if (_this.data.bleDeviceId) {
          _this.bluetoothInit(_this.data.bleDeviceId);
        }
      });
    });
  },
  onShow() {

  },
  updateLastTemp() {
    let lastTemp = mi.store.get('lastTemp');
    //console.log('lastTemp', lastTemp);
    if (lastTemp) {
      this.setData({
        bleIsSync: lastTemp.bleIsSync,
        bleSyncInfo: lastTemp.bleSyncInfo,
        temp_lto: lastTemp.temp_lto, //左上外
        temp_lti: lastTemp.temp_lti, //左上内
        temp_rti: lastTemp.temp_rti, //右上内
        temp_rto: lastTemp.temp_rto, //右上外
      });
      app.bleIsSync = lastTemp.bleIsSync;
      this.calcTemp();
    }
  },
  tempUpdate(callback) {
    let _this = this;
    // this.lineInit();
    if (!(mi.store.get('myId') && mi.store.get('myToken') && mi.store.get('myRefreshToken'))) {
      _this.getUserInfo();
    } else {
      if (callback) {
        callback();
      }
    }
  },
  detch(char1, char2, char3) {
    let timer = null;
    let _this = this;
    timer = setTimeout(() => {
      if (chart && chart2 && chart3) {
        _this.chartRender(chart, {
          target: 'echart0',
          jump: 'jump0',
          color: ["#FF4578"],
          dataZoom: [{
            fillerColor: 'rgba(254,216,227,.5)',
            handleStyle: {
              color: 'rgba(254,216,227,1)'
            }
          }],
          xAxis: {
            data: char1.x
          },
          series: [{
            name: '健康值',
            type: 'line',
            data: char1.y
          }]
        }, '分');
        _this.chartRender(chart2, {
          target: 'echart1',
          jump: 'jump1',
          color: ["#4586FF"],
          xAxis: {
            data: char2.x
          },
          series: [{
            name: '乳温差',
            type: 'line',
            data: char2.y
          }]
        }, '℃');
        _this.chartRender(chart3, {
          target: 'echart2',
          jump: 'jump2',
          color: ["#6DB35B", "#4586FF", "#FF4578", "#AB45FF"],
          xAxis: {
            data: char3.x
          },
          series: [{
              name: '左上外',
              type: 'line',
              data: char3.y1
            },
            {
              name: '左上内',
              type: 'line',
              data: char3.y2
            },
            {
              name: '右上内',
              type: 'line',
              data: char3.y3
            },
            {
              name: '右上外',
              type: 'line',
              data: char3.y4
            }
          ]
        }, '℃');
      } else {
        clearTimeout(timer);
        detch();
      }
    }, 1000);
  },
  chartRender(chart, opts, unit) {
    let _this = this;
    let option = {
      backgroundColor: '#FFF',
      tooltip: {
        trigger: 'axis'
      },
      noDataLoadingOption: {
        text: '暂无数据',
        effect: 'bubble',
        effectOption: {
          effect: {
            n: 10
          }
        }
      },
      grid: {
        containLabel: true,
        left: 15,
        top: 40,
        right: 20,
        bottom: 15,
      },
      dataZoom: [{
        show: true,
        realtime: true,
        top: 10,
        height: 20,
        start: 0,
        end: 100,
        minSpan: 10,
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '100%',
        textStyle: {
          color: '#888',
          fontSize: 10,
        },
        filterMode: 'none',
        backgroundColor: '#fff',
        dataBackground: {
          lineStyle: {
            color: '#d6d6d6'
          },
          areaStyle: {
            color: '#fafbfd'
          }
        }
      }],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
        axisPointer: {
          label: {
            formatter: function(params) {
              console.log(params);
              // mi.toast(params.seriesData[0].seriesName + ':' + params.seriesData[0].name + '-' + params.seriesData[0].value + unit);
              if (opts.target == 'echart2') {
                //console.log('当前图表点击了' + opts.jump);
                _this.setData({
                  [opts.target]: [params.seriesData[0].value, params.seriesData[1].value, params.seriesData[2].value, params.seriesData[3].value],
                  [opts.target + 'Date']: params.seriesData[0].name.replace('\n', ''),
                  [opts.jump]: params.seriesData[0]
                });
              } else {
                //console.log('当前图表点击了' + opts.jump);
                _this.setData({
                  [opts.target]: params.seriesData[0].value,
                  [opts.target+'Date']: params.seriesData[0].name.replace('\n',''),
                  [opts.jump]: params.seriesData[0]
                });
              }
              //console.log('superYears', _this.data.superYears);
            }
          }
        },
      },
      yAxis: {
        x: 'center',
        type: 'value'
      },
      series: [{
        name: '',
        type: 'line',
        data: []
      }]
    };
    option = mi.deepMerge(option, opts);
    // //console.log(option);
    chart.resize();
    chart.setOption(option);
  },
  updateStore(callback) {
    this.setData({
      bleDeviceId: app.bleDeviceId, //蓝牙设备的id号
      bleServerId: app.bleServerId, //蓝牙设备的服务id号
      bleCharWriteId: app.bleCharWriteId, //蓝牙设备的服务写入特征值id号
      bleCharNotifyId: app.bleCharNotifyId, //蓝牙设备的服务接收通知特征值id号
    });
    if (callback) {
      callback();
    }
  },
  getUserInfo(callback) {
    let _this = this;
    //获取用户信息
    mi.user.getSetting(function(status) {
      if (status) {
        _this.setData({
          isAuthorize: true
        });
        //授权成功，开始连接蓝牙
        if (callback && typeof callback.constructor == 'Function') {
          //console.log(callback);
          callback();
        } else {
          _this.updateStore(function() {
            //console.log('_this.data.bleDeviceId', _this.data.bleDeviceId);
            if (_this.data.bleDeviceId) {
              _this.bluetoothInit(_this.data.bleDeviceId);
            }
          });
        }
        //请求用户信息
        mi.user.getInfo(function(res) {
          mi.ajax({
            url: api.login,
            method: 'post',
            login: false,
            data: {
              "loginType": 4,
              "os": app.systemInfo.system.indexOf('iOS') > -1 ? 'ios' : 'android',
              "nickName": res.userInfo.nickName,
              "avatar": res.userInfo.avatarUrl,
              "signature": res.signature,
              "province": res.userInfo.province,
              "city": res.userInfo.city,
              "wxxcxCode": app.wxCode,
              "wxxcxEncryptedData": res.encryptedData,
              "wxxcxIV": res.iv
            },
            encrypt: true,
            dataPos: false,
            callback: function(data) {
              let res = JSON.parse(mi.crypto.decode(data));
              console.log('res', res);
              //将信息存储到本地缓存中
              mi.store.set('myId', res.data.myId);
              mi.store.set('myToken', res.data.myToken, res.data.outTime + 1000 * 60 * 60 * 24);
              mi.store.set('myRefreshToken', res.data.myRefreshToken, res.data.outTime + 1000 * 60 * 60 * 24 * 30);
              mi.store.set('userInfo', res.data);
              _this.getTempDateList();
            }
          });
        });
      } else {
        _this.setData({
          isAuthorize: false
        });
      }
    });
  },
  getTempDateList() {
    let _this = this;
    this.updateLastTemp(); //将本地最新测量温度还原回来
    mi.ajax({
      url: api.dateAble,
      method: 'get',
      login: true,
      loading: false,
      callback: function(data) {
        let res = JSON.parse(mi.crypto.decode(data));
        //console.log('res88888888888888888888888', res);
        // res.data = [
        //   "2017-03",
        //   "2017-02",
        //   "2016-08"
        // ];
        let yearOptions = [];
        let superYears = [];

        if (res.data.length > 0) {
          //yearOptions, superYears
          _this.formateDate(res.data, function(yearOptions, superYears) {
            _this.setData({
              year: yearOptions.length - 1,
              yearOptions: yearOptions,
              superYears: superYears,
              monthOptions: superYears[yearOptions.length - 1].months.reverse(),
              month: superYears[yearOptions.length - 1].months.length - 1
            });
            //如果年份数组大于0，则请求请求第最后一个月份的数据
            if (res.data.length > 0) {
              _this.getMonthHistory(function(res) {
                let obj = JSON.parse(res);
                // console.log('temp1111111111111111111111111111', obj);
                if (obj && obj.data.length > 0) {
                  let charArr = mi.switchCharData(obj.data);
                  // console.log('charArr', charArr);
                  _this.detch(charArr[0], charArr[1], charArr[2]);
                  _this.setData({
                    superMonthArr: obj.data.reverse()
                  });
                  const index = charArr[0].y.length - 1;
                  // let date = mi.format();
                  _this.assignInitVal(
                    charArr[0].y[index],
                    charArr[1].y[index], [charArr[2].y1[index], charArr[2].y2[index], charArr[2].y3[index], charArr[2].y4[index]],
                    charArr[0].x[index],
                    charArr[1].x[index],
                    charArr[2].x[index]
                  );
                } else {
                  // let charArr = [{ x: [], y: [] }, { x: [], y: [] }, { x: [], y: [] }];
                  // _this.detch(charArr[0], charArr[1], charArr[2]);
                  // mi.toast('您当月还没有任何测试数据');
                }
              });
            } else {
              // mi.toast('您还没有任何测试数据');
              // let charArr = [{ x: [], y: [] }, { x: [], y: [] }, { x: [], y: [] }];
              // _this.detch(charArr[0], charArr[1], charArr[2]);
            }
          });
        } else {
          _this.setData({
            yearOptions: [],
            monthOptions: [],
            superYears: []
          });
        }

      }
    });
  }, //获取可用的时间列表
  assignInitVal(t0, t1, t2, d0, d1, d2) {
    //console.log('t0,t1,t2', t0, t1, t2);
    this.setData({
      echart0: t0,
      echart1: t1,
      echart2: t2,
      echart0Date: d0.replace('\n',''), //表0日期
      echart1Date: d1.replace('\n', ''), //表1日期
      echart2Date: d2.replace('\n', '') //表2日期
    });
  }, //赋最新值
  changeMonth(e) {
    let _this = this;
    console.log('月份下标', e.currentTarget.dataset.month);
    this.setData({
      month: e.currentTarget.dataset.month
    });
    this.getMonthHistory(function(res) {
      let obj = JSON.parse(res);
      //console.log('temp1111111111111111111111111111', obj);
      if (obj && obj.data.length > 0) {
        let charArr = mi.switchCharData(obj.data);
        _this.detch(charArr[0], charArr[1], charArr[2]);
        _this.setData({
          superMonthArr: obj.data
        });

        //渲染附加信息
        const index = charArr[0].y.length - 1;
        // let date = mi.format();
        _this.assignInitVal(
          charArr[0].y[index],
          charArr[1].y[index], [charArr[2].y1[index], charArr[2].y2[index], charArr[2].y3[index], charArr[2].y4[index]],
          charArr[0].x[index],
          charArr[1].x[index],
          charArr[2].x[index]
        );

      }
    });
  },
  getMonthHistory(callback) {
    console.log('请求温度年月份温度值', this.data.yearOptions[this.data.year] + '年' + this.data.monthOptions[this.data.month] + '月');
    let _this = this;
    mi.ajax({
      url: api.history,
      method: 'get',
      contentType: 'form',
      data: {
        month: this.data.yearOptions[this.data.year] + '年' + this.data.monthOptions[this.data.month] + '月'
      },
      dataPos: false,
      login: true,
      callback: function(data) {
        let res = mi.crypto.decode(data);
        //console.log('获取当月数据',res);
        if (callback) {
          callback(res);
        }
      }
    });
  }, //获取当月的数据
  formateDate(date, callback) {
    let yearOptions = [];
    let superYears = [];
    let curr = {
      year: '',
      months: []
    };
    for (let i = 0; i < date.length; i++) {
      let cache = date[i].split('-');
      if (i == 0) {
        yearOptions.push(cache[0]);
        curr.year = cache[0];
        curr.months.push(cache[1]);

      } else {
        if (yearOptions.indexOf(cache[0]) > -1) {
          curr.months.push(cache[1]);
        } else {
          superYears.push(JSON.parse(JSON.stringify(curr)));
          curr.months = [];
          yearOptions.push(cache[0]);
          curr.year = cache[0];
          curr.months.push(cache[1]);
        }
      }

    }
    superYears.push(JSON.parse(JSON.stringify(curr)));
    if (callback) {
      callback(yearOptions, superYears);
    }
  }, //格式化时间
  bluetoothInit: function(oldId) {
    let _this = this;
    //检测蓝牙是否打开
    wx.openBluetoothAdapter({
      success: function(res) {
        mi.showLoading('蓝牙已打开');
        //console.log('打开蓝牙适配器', res);
        //检测蓝牙此时的状态
        wx.getBluetoothAdapterState({
          success: function(res) {
            //console.log('获取蓝牙适配器状态成功', res);
            //监听蓝牙适配器状态
            wx.onBluetoothAdapterStateChange(function(res) {
              //console.log(`adapterState changed, now is`, res);
              _this.setData({
                available: res.available, //蓝牙是否可用
                discovering: res.discovering, //蓝牙是否处于搜索
              });
            });
            //如果蓝牙此时处于空闲，则可以
            if (res.available && !res.discovering) {
              mi.showLoading('蓝牙搜索中');
              //console.log('蓝牙处于空闲，开启蓝牙搜索...');
              if (oldId && typeof oldId == 'string') {
                //console.log('oldId', oldId);
                _this.connect(oldId);
              } else {
                //开启蓝牙搜索模式
                wx.startBluetoothDevicesDiscovery({
                  services: [],
                  success: function(res) {
                    //开启定时器，一分钟后没有搜索，自动关闭蓝牙搜索
                    setTimeout(function() {
                      if (!_this.data.bleIsConnect) {
                        wx.stopBluetoothDevicesDiscovery({
                          success: function() {
                            mi.hideLoading();
                            mi.toast('未搜索到可用蓝牙设备');
                          }
                        });
                      }
                    }, 60000);
                    //console.log('蓝牙搜索的结果列表', res);
                    // _this.setData({
                    //   bleIsShowList:true
                    // });

                    wx.onBluetoothDeviceFound(function(res) {
                      //console.log('new device list has founded');
                      //console.log(res);
                      if (res.devices[0].name.indexOf('mito-Smart') > -1) {
                        //发现蜜桃设备直接连接
                        _this.connect(res.devices[0].deviceId);
                      }
                    })
                  },
                  fail: function(res) {
                    //console.log(res);
                  }
                });
              }
            } else {
              //console.log('蓝牙正忙');
              // mi.toast('蓝牙正忙');
              mi.hideLoading();
              wx.stopBluetoothDevicesDiscovery({
                success: function() {
                  _this.bluetoothInit(oldId);
                }
              });
            }


          },
          fail: function(res) {
            //console.log('获取蓝牙适配器状态失败', res);
            mi.toast('获取蓝牙适配器状态失败');
            mi.hideLoading();
          }
        });


      },
      fail: function(res) {
        //console.log('蓝牙未打开');
        mi.toast('蓝牙未打开');
        mi.hideLoading();
      }
    });
  },
  connect(id) {
    let _this = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function(res) {
        //console.log('关闭蓝牙搜索', res);
        // _this.setData({
        //   bleIsShowList: false
        // });
      }
    });
    // wx.getBluetoothDevices({
    //   success: function(res) {
    //     //console.log('尝试获取蓝牙搜索期间搜索到的设备', res);
    //   }
    // });
    //console.log('deviceId', id);
    let deviceId = id;
    this.setData({
      bleDeviceId: deviceId
    });
    app.bleDeviceId = this.data.bleDeviceId;
    mi.store.set('bleDeviceId', this.data.bleDeviceId);
    wx.onBLEConnectionStateChange(function(res) {
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      if (!res.connected) {
        mi.toast(res.connected ? '连接成功' : '蓝牙已断开');
        _this.setData({
          bleIsConnect: res.connected,
          blueRight: false,//关闭蓝牙密码输入框
        });
        app.bleIsConnect = res.connected;
      }
      setTimeout(function() {
        if (!app.bleIsConnect) {
          if (connectNum < 3) {
            connectNum++;
            wx.switchTab({
              url: "../index/index"
            });
            wx.stopBluetoothDevicesDiscovery({
              success: function() {
                mi.showLoading(`蓝牙重连中`);
                _this.bleConnection(id);

              }
            });
          } else {
            wx.stopBluetoothDevicesDiscovery({
              success: function() {
                // mi.hideLoading();
                mi.toast('连接超出最大次数，请手动点击连接');
              }
            });
          }
          //如果蓝牙断开，自动重连
          // if (_this.data.available && !_this.data.discovering) {
          //   wx.stopBluetoothDevicesDiscovery({
          //     success: function () {
          //       mi.showLoading('蓝牙重连中');
          //       _this.bleConnection(id);
          //       wx.switchTab({
          //         url: "../index/index"
          //       });
          //     }
          //   });
          //   // mi.showLoading('蓝牙重连中');
          //   // _this.connect(id);
          // } else {
          //   wx.stopBluetoothDevicesDiscovery({
          //     success: function() {
          //       // _this.bleConnection(id);
          //       wx.switchTab({
          //         url: "../index/index"
          //       });
          //     }
          //   });
          // }
        } else {
          connectNum = 0; //连接次数清零
          mi.hideLoading();
        }
      }, 500);
    });
    _this.bleConnection(deviceId);
  },
  bleConnection(deviceId) {
    let _this = this;
    //console.log('创建蓝牙连接');
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function(res) {
        // mi.hideLoading();
        console.log('创建蓝牙连接设备连接成功', res);
        mi.toast('蓝牙连接成功');
        _this.setData({
          bleIsConnect: true
        });
        app.bleIsConnect = true
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success: function(res) {
            //console.log('获取蓝牙设备所有服务', res);
            for (let i = 0; i < res.services.length; i++) {
              if (res.services[i].uuid.indexOf('0000FF92') > -1) { //查找自定义服务
                _this.setData({
                  bleServerId: res.services[i].uuid
                });
                app.bleServerId = _this.data.bleServerId;
                mi.store.set('bleServerId', _this.data.bleServerId);
                break; //终止循环
              }
            }
            wx.getBLEDeviceCharacteristics({
              deviceId: deviceId,
              serviceId: _this.data.bleServerId,
              success: function(res) {
                //console.log('读取蓝牙服务特征值', _this.data.bleServerId, res);
                let writeId, notifyId;
                for (let j = 0; j < res.characteristics.length; j++) {
                  if (res.characteristics[j].uuid.indexOf('9600') > -1) {
                    writeId = res.characteristics[j].uuid;
                  }
                  if (res.characteristics[j].uuid.indexOf('9601')) {
                    notifyId = res.characteristics[j].uuid;
                  }
                  //console.log('writeId', writeId);
                  //console.log('notifyId', notifyId);
                  _this.setData({
                    bleCharWriteId: writeId,
                    bleCharNotifyId: notifyId,
                  });
                  app.bleCharWriteId = _this.data.bleCharWriteId;
                  app.bleCharNotifyId = _this.data.bleCharNotifyId;
                  mi.store.set('bleCharWriteId', _this.data.bleCharWriteId);
                  mi.store.set('bleCharNotifyId', _this.data.bleCharNotifyId);
                }
                //至此拿到所有需要的值，开启特征值检测，检测一下
                wx.notifyBLECharacteristicValueChange({
                  deviceId: deviceId,
                  serviceId: _this.data.bleServerId,
                  characteristicId: _this.data.bleCharNotifyId,
                  state: true,
                  success: function(res) {
                    //console.log('特征值订阅开启成功', res);
                    wx.onBLECharacteristicValueChange(function(res) {
                      //console.log('检测到特征值发生变化', res);
                      let hex = mi.buf2hex(res.value);
                      //console.log('特征值二进制转十六进制后结果', hex);
                      _this.deal(hex);
                    });
                    //验证蓝牙密码
                    let oldPass = mi.store.get('pass');
                    //console.log('localstorageoldPass', oldPass);
                    let sendPass = oldPass ? mi.strToHexCharCode(oldPass) : mi.strToHexCharCode('123');
                    let callFn = function(data) {
                      if (data) {
                        //验证通过
                        // if (_this.data.blePass) {
                        //   mi.toast('蓝牙密码验证通过');
                        // }
                        mi.toast('蓝牙密码验证通过');
                        _this.getTempDateList();
                        setTimeout(function() {
                          _this.command({
                            command: 'c2',
                            check: false
                          }); //查询电量
                        }, 100);
                        setTimeout(function() {
                          _this.command({
                            command: 'c1',
                            check: false
                          }); //查询版本
                        }, 300);
                        setTimeout(function() {
                          _this.command({
                            command: 'cc',
                            check: false
                          }); //查询版本
                        }, 600);
                      } else {
                        //验证失败
                        mi.toast('蓝牙密码验证错误，请重新输入');
                        _this.confirmBluePass(callFn);
                      }
                    };
                    _this.verify(sendPass, callFn);
                  },
                  fail: function(res) {
                    //console.log('特征值订阅开启失败', res);
                    //console.log('特征值订阅开启失败');
                    wx.stopBluetoothDevicesDiscovery();
                  }
                });
              }
            });
          }
        });
      },
      fail: function() {
        console.log('蓝牙连接失败');
        mi.toast('蓝牙连接失败');
        _this.setData({
          bleIsConnect: false
        });
        app.bleIsConnect = false;
        //console.log('创建连接失败,请手动点击连接');
        mi.hideLoading();
        // mi.toast('蓝牙连接失败,请手动点击连接');
      }
    });
  }, //创建蓝牙连接
  confirmBluePass(callback) {
    this.setData({
      blueRight: true
    });
    verifyFn = callback; //因为回调函数无法继续往下传，只能将回调函数赋给全局变量
  }, //输入蓝牙密码
  toVerify() {
    if (this.data.blePass == '') {
      return mi.toast('密码不能为空');
    }
    let reg = /[\x00-\xff]+/g;
    let blePassArr = this.data.blePass.match(reg);
    if (!(blePassArr && blePassArr[0].length == 3)) {
      return mi.toast('密码长度仅支持3位且不能是中文');
    }
    let bluePass = mi.strToHexCharCode(this.data.blePass);
    this.verify(bluePass, verifyFn);
  }, //先验证蓝牙密码是否符合规则，再去通过硬件验证
  verify(pass, callback) {
    if (!app.bleIsConnect){
      this.setData({
        blueRight:false
      });
      return mi.toast('请先连接蓝牙设备');
    }
    mi.showLoading('校验密码中...');
    let _this = this;
    app.command({
      command: 'c9',
      param: pass,
      check: true,
      success: function() {
        setTimeout(function() {
          if (typeof app.verPass == 'string' && app.verPass == '00') {
            app.verPass = false; //恢复原状
            mi.hideLoading();
            _this.setData({
              blueRight: false
            });
            if (_this.data.blePass) {
              mi.store.set('pass', _this.data.blePass);
            }
            wx.showTabBar({
              animation: true,
              fail: function() {
                wx.showTabBar({
                  animation: true
                });
              }
            });
            if (callback) {
              callback(true);
            }
          } else {
            mi.hideLoading();
            app.verPass = false; //恢复原状
            if (callback) {
              callback(false);
            }
          }
        }, 1000);
      }
    });
  },
  changeBlue(e) {
    this.setData({
      blePass: e.detail.value
    });
  }, //修改蓝牙密码
  command(obj, hexStr) {
    const command = {
      c1: '000500C1C4',
      c2: '000500C2C7',
      c3: '000600C3', //后面需追加两位机位和两位校验码
      c4: '000500C4C1',
      c5: '',
      c6: '000500C6C3',
      c7: '',
      c8: '',
      C9: '',
      ca: '',
      cb: '000500CBCE',
      cc: '000500CCC9'
    };
    let tempObj = mi.deepMerge({}, obj);
    tempObj.hex = command[obj.command];
    if (obj.command == 'c3') {
      obj.param.forEach(v => {
        tempObj.hex += v; //追加上参数
      });
      if (tempObj.check) {
        tempObj.hex += mi.check(tempObj.hex); //追加运算校验码
      } else {
        tempObj.hex += '00'; //追加00校验码
      }

    }
    //追加包头，开始写入特征值
    tempObj.hex = 'FBFA' + tempObj.hex;
    wx.writeBLECharacteristicValue({
      deviceId: this.data.bleDeviceId,
      serviceId: this.data.bleServerId,
      characteristicId: this.data.bleCharWriteId,
      value: mi.hex2buf(tempObj.hex),
      success: function(res) {
        //console.log('特征值写入成功', res);
        if (tempObj.success) {
          tempObj.success(res);
        }
      },
      fail: function(res) {
        //console.log('特征值写入失败', res);
        if (tempObj.fail) {
          tempObj.fail(res);
        }
      }
    });
  },
  deal(hex) {
    let _this = this;
    //查询模块版本号命令（0xC1）
    if (hex.indexOf('01c1') > -1) {
      if (!mi.isRight(hex)) {
        return //console.log('c1返回数据不完整');
      }
      let pkg = hex.split('01c1')[1].slice(0, -2);
      //console.log(pkg);
      let result = mi.hexCharCodeToStr(pkg);
      //console.log('结果c1', result);
      app.bleVer = result;
      return result;
    }
    //查询电池电量命令（0xC2）
    if (hex.indexOf('01c2') > -1) {
      if (!mi.isRight(hex)) {
        return //console.log('c2返回数据不完整');
      }
      let pkg = '0x' + hex.split('01c2')[1].substr(0, 2);
      let result = parseInt(pkg, 16);
      //console.log('结果c2', result);
      _this.setData({
        bleEnergy: result
      });
      app.bleEnergy = _this.data.bleEnergy;
      if (result < 10) {
        if (_this.data.cellTime) { //电量低于10，每隔10分钟提醒一次
          if ((new Date().getTime() - _this.data.cellTime) > 1000 * 60 * 10) {
            wx.showModal({
              title: '提示',
              content: '电量不足，请及时充电',
              showCancel: false,
              success: function(res) {
                _this.setData({
                  cellTime: new Date().getTime()
                });
              }
            });
          }

        } else {
          _this.setData({
            cellTime: new Date().getTime()
          });
        }
      }
      return result;
    }
    //查询温度命令（0xC3）
    if (hex.indexOf('01c3') > -1) {
      if (!mi.isRight(hex)) {
        return //console.log('返回数据不完整');
      }
      let pkg = hex.split('01c3')[1].slice(0, -2);
      //console.log(pkg);
      let result = {
        slot: pkg.slice(0, 2),
        temp1: parseInt(pkg.slice(2, 6), 16) / 100,
        temp2: parseInt(pkg.slice(6), 16) / 100,
      }; //parseInt(pkg, 16);
      //console.log('结果c3', result);
      mi.hideLoading();
      //先判断是否是传感器断开或者短路
      if (result.temp1 == '167.05' || result.temp2 == '167.05' || result.temp1 == '169.62' || result.temp2 == '169.62') {
        return mi.toast('硬件可能有异常，请联系售后');
      }
      //验证温度在正常范围区间
      if (result.slot == '01') {
        _this.data.temp_cache[2] = result.temp1;
        _this.data.temp_cache[3] = result.temp2;
      }
      if (result.slot == '02') {
        _this.data.temp_cache[1] = result.temp1;
        _this.data.temp_cache[0] = result.temp2;
        _this.setData({
          temp_cache: _this.data.temp_cache
        });
        for (let i = 0; i < _this.data.temp_cache.length; i++) {
          if (!_this.data.temp_cache[i] || _this.data.temp_cache[i] <= 32 || !_this.data.temp_cache[i] || _this.data.temp_cache[i] >= 41) {
            count = 0;
            return wx.showModal({
              title: '数据不准确',
              content: '请确保温度传感器紧贴胸部皮肤，并保持皮肤表面干爽',
              cancelText: '取消',
              confirmText: '再试一次',
              success: function(res) {
                if (res.confirm) {
                  _this.getTem(); //重新获取温度
                  // _this.setData({
                  //   temp_lto: '', //左上外
                  //   temp_lti: '', //左上内
                  //   temp_rti: '', //右上内
                  //   temp_rto: '' //右上外
                  // });
                }
              }
            });
            break;
          } else {
            //校验通过
            count++;
          }
        }
        if (count == 4) {
          count = 0;
          //console.log('温度全部校验通过，提交温度信息');
          let date1 = mi.format('MM月dd hh:mm');
          let date2 = mi.format('dd日hh:mm');
          let lastTemp = {
            bleIsSync: date1,
            bleSyncInfo: date1,
            temp_lto: _this.data.temp_cache[0], //左上外
            temp_lti: _this.data.temp_cache[1], //左上内
            temp_rti: _this.data.temp_cache[2], //右上内
            temp_rto: _this.data.temp_cache[3], //右上外
            measurementTime: new Date().getTime() - _this.data.measurementTime
          };
          _this.setData(lastTemp);
          app.bleIsSync = _this.data.bleIsSync;
          mi.store.set('lastTemp', lastTemp); //将温度信息存储到本地
          _this.calcTemp(function() {
            //变更本地乳温差值
            mi.store.set('temp_avg_last', _this.data.temp_avg);
            //变更最新值
            _this.assignInitVal(
              _this.data.temp_score,
              _this.data.temp_diff_num, 
              [_this.data.temp_lto, _this.data.temp_lti, _this.data.temp_rti, _this.data.temp_rto],
              date2,
              date2,
              date2
              );
            //计算完所有温度后，提交后台
            _this.uploadTem();
          });
        }
      }
      return result;
    }
    //查询工作模式（0xC4）
    if (hex.indexOf('01c4') > -1) {
      let pkg = hex.split('01c4')[1].slice(0, -2);
      //console.log(pkg);
      let result = pkg; //parseInt(pkg, 16);
      //console.log('结果c4', result);
      return result;
    }
    //查询震动模式（0xC6）
    if (hex.indexOf('01c6') > -1) {
      let pkg = hex.split('01c6')[1].slice(0, -2);
      let result = pkg; //parseInt(pkg, 16);
      //console.log('结果c6', result);
      return result;
    }
    //设置密码是否设置成功（0xC8）
    if (hex.indexOf('01c8') > -1) {
      if (!mi.isRight(hex)) {
        return //console.log('c8返回数据不完整');
      }
      let pkg = '0x' + hex.split('01c8')[1].substr(0, 2);
      //console.log('c8', pkg);
      let result = parseInt(pkg, 16);
      //console.log('结果c8', result);
      if (result == 0) {
        app.setPass = '00';
      } else {
        app.setPass = '01';
      }
      return result;
    }

    //查询密码是否设置成功（0xC9）
    if (hex.indexOf('01c9') > -1) {
      if (!mi.isRight(hex)) {
        return //console.log('c8返回数据不完整');
      }
      let pkg = '0x' + hex.split('01c9')[1].substr(0, 2);
      let result = parseInt(pkg, 16);
      //console.log('结果c9', result);
      if (result == 0) {
        app.verPass = '00';
      } else {
        app.verPass = '01';
      }
      return result;
    }
    //恢复出厂设置
    if (hex.indexOf('01cb') > -1) {
      if (!mi.isRight(hex)) {
        return //console.log('cb返回数据不完整');
      }
      app.resetPass = '00';
    }
    //读取硬件id
    if (hex.indexOf('01cc') > -1) {
      if (!mi.isRight(hex)) {
        return //console.log('cc返回数据不完整');
      }
      let pkg = hex.split('01cc')[1].slice(8, -2);
      let result = 'Toys' + pkg;
      //console.log('cc', result);
      _this.setData({
        blehdid: result
      });
      app.blehdid = result;
      _this.uploadDeviceId();
    }
  },
  uploadDeviceId() {
    mi.ajax({
      url: api.bindLog,
      method: 'post',
      contentType: 'form',
      data: {
        "appType": app.systemInfo.system.indexOf('iOS') > -1 ? 'ios' : 'android',
        "devId": app.blehdid,
        "devMac": app.bleDeviceId
      },
      dataPos: false,
    });
  }, //上传硬件信息
  getTem() {
    if (app.ishaking) {
      return mi.toast('请先关闭震动模式，再进行测温操作');
    }
    mi.showLoading('测温中');
    let _this = this;
    //设置测温时间起始节点
    this.setData({
      measurementTime: new Date().getTime()
    });
    setTimeout(function() {
      _this.command({
        command: 'c3',
        param: ['01'],
        check: true
      }); //左胸
    }, 500);
    setTimeout(function() {
      _this.command({
        command: 'c3',
        param: ['02'],
        check: true
      }); //右胸
    }, 1000);
  },
  calcTemp(callback) {
    if (!(this.data.temp_lto && this.data.temp_lti && this.data.temp_rti && this.data.temp_rto)) {
      return false;
    }
    //平均温度
    let temp_avg = ((this.data.temp_lto + this.data.temp_lti + this.data.temp_rti + this.data.temp_rto) / 4).toFixed(1);
    //8种温差组合
    let temp_lto_lti = this.data.temp_lto - this.data.temp_lti; //左上外,左上内
    let temp_rto_rti = this.data.temp_rto - this.data.temp_rti; //右上外,右上内
    let temp_lto_rto = this.data.temp_lto - this.data.temp_rto; //左上外,右上外
    let temp_lti_rti = this.data.temp_lti - this.data.temp_rti; //左上内,右上内

    let temp_lti_lto = this.data.temp_lti - this.data.temp_lto; //左上内,左上外
    let temp_rti_rto = this.data.temp_rti - this.data.temp_rto; //右上内,右上外
    let temp_rto_lto = this.data.temp_rto - this.data.temp_lto; //右上外,左上外
    let temp_rti_lti = this.data.temp_rti - this.data.temp_lti; //右上内,左上内

    //列出三组温差值
    let temp_group1_max = [temp_lto_rto, temp_lti_rti];
    let temp_group2_max = [temp_lto_lti, temp_lti_lto, temp_rto_rti, temp_rti_rto];
    let temp_group3_max = [temp_rto_lto, temp_rti_lti];

    //分别对数组进行倒序排列，得出最大温差值
    let gmax1 = mi.getArryMax(temp_group1_max);
    let gmax2 = mi.getArryMax(temp_group2_max);
    let gmax3 = mi.getArryMax(temp_group3_max);
    //对三组最大温差值进行比较，得出最大的温差赋予temp
    let group_arr = [gmax3, gmax2, gmax1];
    let temp_max = mi.getArryMax(group_arr).toFixed(1);

    //计算健康分数
    // console.log('temp_score', temp_avg, temp_max, group_arr);
    let temp_score = this.calcScore(temp_avg, temp_max, group_arr);
    this.setData({
      temp_score: temp_score, //健康值
      temp_avg: temp_avg, //平均乳温
      temp_diff_num: temp_max
    });
    //计算诊断结果
    let avg_last = mi.store.get('temp_avg_last') || -1;
    this.calcAvgDiagnose(temp_avg, avg_last);
    this.calcDiffDiagnose([
      temp_lto_lti,
      temp_rto_rti,
      temp_lto_rto,
      temp_lti_rti,
      temp_lti_lto,
      temp_rti_rto,
      temp_rto_lto,
      temp_rti_lti
    ]);
    //根据蓝牙数据得到温度值
    if (callback) {
      callback();
    }

  }, //计算温度，蓝牙得到温度后触发
  calcScore(avg, temp_max, group_arr) {
    let score = ''; //所得分数

    let group_max = 0; //最大温差的那个组合序号
    for (let i = 0; i < group_arr.length; i++) {
      if (temp_max == group_arr[i].toFixed(1)) {
        group_max = i + 1;
        break;
      }
    }
    // console.log('group_max', group_max);
    if (temp_max <= 0.4) {
      if (group_max == 1) {
        if (avg >= 35.8 && avg <= 37) {
          score = 95 - temp_max * 13 - Math.abs(avg - (35.8 + 37) / 2) * 8;
        } else if (avg > 32 && avg < 35.8) {
          score = 89.9 - temp_max * 15.7 - (35.7 - avg);
        } else if (avg > 37 && avg < 41) {
          score = 74.9 - temp_max * 3 - Math.pow((avg - 37.1), (1 / 4)) * 6.2;
        }
      } else if (group_max == 2) {
        if (avg >= 35.8 && avg <= 37) {
          score = 100 - temp_max * 11.5 - Math.abs(avg - (35.8 + 37) / 2) * 9;
        } else if (avg > 32 && avg < 35.8) {
          score = 89.9 - temp_max * 15.7 - (35.7 - avg);
        } else if (avg > 37 && avg < 41) {
          score = 74.9 - temp_max * 3 - Math.pow((avg - 37.1), (1 / 4)) * 6.2;
        }
      } else if (group_max == 3) {
        if (avg >= 35.8 && avg <= 37) {
          score = 100 - (0.4 - temp_max) * 11.5 - Math.abs(avg - (35.8 + 37) / 2) * 9;
        } else if (avg > 32 && avg < 35.8) {
          score = 89.9 - (0.4 - temp_max) * 15.7 - (35.7 - avg);
        } else if (avg > 37 && avg < 41) {
          score = 74.9 - (0.4 - temp_max) * 3 - Math.pow((avg - 37.1), (1 / 4)) * 6.2;
        }
      }
    } else if (temp_max > 0.4 && temp_max <= 0.9) {
      if (avg >= 35.8 && avg <= 37) {
        score = 85 - (temp_max - 0.5) * 19 - Math.abs(avg - (35.8 + 37) / 2) * 4;
      } else if (avg > 32 && avg < 35.8) {
        score = 74.9 - (temp_max - 0.5) * 20 - Math.pow((35.7 - avg), (1 / 2));
      } else if (avg > 37 && avg < 41) {
        score = 64.9 - (temp_max - 0.5) * 9 - Math.pow((avg - 37.1), (1 / 4)) * 4.5;
      }
    } else if (temp_max > 0.9 && temp_max <= 3.6) {
      if (avg >= 35.8 && avg <= 37) {
        score = 59.9 - (temp_max - 1) * 15 - Math.abs(avg - (35.8 + 37) / 2) * 1.5;
      } else if (avg > 32 && avg < 35.8) {
        score = 49.9 - (temp_max - 1) * 13.81 - (35.7 - avg) * 1.11;
      } else if (avg > 37 && avg < 41) {
        score = 39.9 - (temp_max - 1) * 9.39 - (avg - 37.1) * 2.76;
      }
    } else if (temp_max > 3.6) {
      if (avg >= 35.8 && avg <= 37) {
        score = 4.9 - Math.pow((temp_max - 3.7), (1 / 2)) / 1.74 - Math.abs(avg - (35.8 + 37) / 2);
      } else if (avg > 32 && avg < 35.8) {
        score = 3.5 - Math.pow((temp_max - 3.7), (1 / 2)) / 1.88 - (35.7 - avg) / 12;
      } else if (avg > 37 && avg < 41) {
        score = 1.9 - Math.pow((temp_max - 3.7), (1 / 4)) / 2.5 - (avg - 37.1) / 12.67;
      }
    }

    // console.log('score', score);
    return score.toFixed(1); //返回分数值
  }, //计算健康值
  calcAvgDiagnose(curr, last) {
    // console.log('本地乳温：',curr,'上次乳温：', last);
    let avg_isNormal = true;
    let avg_title = '';
    let avg_detial = '';
    if (last == -1) {
      //没有历史数据
      if (curr > 37.2) {
        //高于正常范围
        avg_isNormal = false;
        avg_title = '当前平均乳温高于正常范围';
        avg_detial = '长期测量，可获得更准确的结果'
      } else if (curr < 35.8) {
        //低于正常范围
        avg_isNormal = false;
        avg_title = '当前平均乳温低于正常范围';
        avg_detial = '长期测量，可获得更准确的结果'
      } else {
        //正常范围
        avg_isNormal = true;
        avg_title = '当前平均乳温属于正常范围';
        avg_detial = '长期测量，可获得更准确的结果'
      }
    } else {
      //有历史数据
      let diff = curr - last; //与历史比较的温差
      // console.log('乳温差:', diff);
      if (diff <= -0.3) {
        if (curr > 37.2) {
          //高于正常范围
          avg_isNormal = false;
          avg_title = '平均乳温明显降低，但仍高于正常范围';
          avg_detial = '发烧、乳腺增生、局部炎症都有可能导致此情况，建议检查一下哦！'
        } else if (curr < 35.8) {
          //低于正常范围
          avg_isNormal = false;
          avg_title = '平均乳温明显降低，且低于正常范围';
          avg_detial = '注意保暖、补充能量哦！'
        } else {
          //正常范围
          avg_isNormal = true;
          avg_title = '平均乳温明显降低，但仍属于正常范围';
          avg_detial = '是“大姨妈”来了吗？'
        }
      } else if (diff >= 0.3) {
        if (curr > 37.2) {
          //高于正常范围
          avg_isNormal = false;
          avg_title = '平均乳温明显升高，且高于正常范围';
          avg_detial = '发烧、乳腺增生、局部炎症都有可能导致此情况，建议检查一下哦！'
        } else if (curr < 35.8) {
          //低于正常范围
          avg_isNormal = false;
          avg_title = '平均乳温明显升高，但仍低于正常范围';
          avg_detial = '注意保暖、补充能量哦！'
        } else {
          //正常范围
          avg_isNormal = true;
          avg_title = '平均乳温明显升高，但仍属于正常范围';
          avg_detial = '例假结束后1周左右乳温会上升，正常现象'
        }
      } else {
        if (curr > 37.2) {
          //高于正常范围
          avg_isNormal = false;
          avg_title = '平均乳温与上次基本持平，但高于正常范围';
          avg_detial = '发烧、乳腺增生、局部炎症都有可能导致此情况，建议检查一下哦！'
        } else if (curr < 35.8) {
          //低于正常范围
          avg_isNormal = false;
          avg_title = '平均乳温与上次基本持平，但低于正常范围';
          avg_detial = '注意保暖、补充能量哦！'
        } else {
          //正常范围
          avg_isNormal = true;
          avg_title = '平均乳温与上次基本持平，且属于正常范围';
          avg_detial = '健康的咪咪，除了温度均衡，还要坚持有规律的按摩哦！'
        }
      }
    }
    this.setData({
      temp_avg_isNormal: avg_isNormal,
      temp_avg_title: avg_title,
      temp_avg_detial: avg_detial,
    });

  }, //计算平均乳温诊断结果
  calcDiffDiagnose(arr) {
    const tempDiffText = [
      ['左乳上外', '左乳上内'],
      ['右乳上外', '右乳上内'],
      ['左乳上外', '右乳上外'],
      ['左乳上内', '右乳上内'],
      ['左乳上内', '左乳上外'],
      ['右乳上内', '右乳上外'],
      ['右乳上外', '左乳上外'],
      ['右乳上内', '左乳上内'],
    ];

    let tempMax = mi.getArryMax(arr);
    let tempIndex = '';
    for (let i = 0; i < arr.length; i++) {
      if (tempMax == arr[i]) {
        tempIndex = i;
      }
    }
    if (tempMax > 1) {
      this.setData({
        temp_diff_isNormal: false,
        temp_diff_max_obj: this.getDiffMaxObj(tempDiffText[tempIndex][0], tempDiffText[tempIndex][1]),
        temp_diff_title: `${tempDiffText[tempIndex][0]}区域温度显著高于${tempDiffText[tempIndex][1]}区域`,
        temp_diff_detial: '温馨提醒：有研究表明，当乳房对照位置的温度差超过1℃时，可能存在乳腺增生、恶性肿瘤的风险，建议就医检查。',
        temp_diff_num: tempMax.toFixed(1)
      });
    } else {
      this.setData({
        temp_diff_isNormal: true,
        temp_diff_max_obj: this.getDiffMaxObj(tempDiffText[tempIndex][0], tempDiffText[tempIndex][1]),
        temp_diff_title: '各测量部位未出现显著温差，要坚持测量乳房温度，防患于未然哦！',
        temp_diff_detial: '温馨提醒：测量乳房温度变化，对于及早发现乳腺增生、肿瘤有积极作用。因为乳腺增生、恶性肿瘤等部位血供丰富、代谢旺盛、产热增多，病灶处所产生的热传导至皮肤可使皮肤表面温度高于病灶周围其他区域的温度。',
        temp_diff_num: tempMax.toFixed(1)
      });
    }
  }, //计算乳温差值诊断结果
  getDiffMaxObj(a, b) {
    //console.log('a,b', a, b);
    const tempDiffText = ['左乳上外', '左乳上内', '右乳上内', '右乳上外'];
    let anum = tempDiffText.indexOf(a) + 1;
    let bnum = tempDiffText.indexOf(b) + 1;
    let result = anum > bnum ? bnum.toString() + anum.toString() : anum.toString() + bnum.toString();
    //console.log('result00000000000000000000000000000', result);
    return result;

  }, //得到最大乳温差是谁
  uploadTem() {
    let _this = this;
    let opt = {
      "tp1": parseInt(this.data.temp_lto * 100),
      "tp2": parseInt(this.data.temp_lti * 100),
      "tp3": parseInt(this.data.temp_rti * 100),
      "tp4": parseInt(this.data.temp_rto * 100),
      "d1": this.data.temp_diff_max_obj * 1,
      "maxDiff": parseInt(this.data.temp_diff_num * 100),
      "needTime": this.data.measurementTime,
      "label": '',
      "taskId": mi.guid(),
      "tips1": this.data.temp_avg_title,
      "tips2": this.data.temp_avg_detial,
      "tips3": this.data.temp_diff_title + ';' + this.data.temp_diff_detial,
      "startIdx": 0,
      "endIdx": 0,
      "healthIndex": this.data.temp_score * 1
    }
    //console.log(opt);
    mi.ajax({
      url: api.tempUpload,
      method: 'post',
      contentType: 'form',
      login: false,
      loading: false,
      data: opt,
      dataPos: false,
      callback: function(data) {
        let res = JSON.parse(mi.crypto.decode(data));
        //console.log('res', res);
        // _this.tempUpdate(); //图表同步更新
        if (_this.data.yearOptions.length > 0) {
          _this.getMonthHistory(function(res) {
            let obj = JSON.parse(res);
            //console.log('temp1111111111111111111111111111', obj);
            if (obj && obj.data.length > 0) {
              let charArr = mi.switchCharData(obj.data);
              _this.detch(charArr[0], charArr[1], charArr[2]);
              _this.setData({
                superMonthArr: obj.data
              });
            } else {
              // let charArr = [{ x: [], y: [] }, { x: [], y: [] }, { x: [], y: [] }];
              // _this.detch(charArr[0], charArr[1], charArr[2]);
              // mi.toast('您当月还没有任何测试数据');
            }
          });
        } else {
          //第一次测温，重新拉取日期
          _this.getTempDateList();
        }
      }
    });
  }, //上传温度信息
  bindPickerChange(e) {
    this.setData({
      year: e.detail.value,
      monthOptions: this.data.superYears[e.detail.value * 1].months.reverse()
    });
  },
  jump(e) {
    let index = e.currentTarget.dataset.go;
    let jumpIndex = 'jump' + index;
    //console.log('jumpIndex', jumpIndex);
    if (this.data[jumpIndex]) {
      if (this.data.superMonthArr) {
        let tempInfo = this.data.superMonthArr[this.data[jumpIndex].dataIndex]; //拿到点击那个点的温度详细信息
        console.log('tempInfo', tempInfo);
        //console.log(this.data.superMonthArr);
        wx.navigateTo({
          url: `/pages/health-detail/index?tp1=${tempInfo.tp1}&tp2=${tempInfo.tp2}&tp3=${tempInfo.tp3}&tp4=${tempInfo.tp4}&ctime=${tempInfo.ctime}&ltpStr=${tempInfo.tips2}`
        });
      }
    } else {
      mi.toast('请点击图表中具体的节点，再点详情');
    }
  },
});