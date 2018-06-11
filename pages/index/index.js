let app = getApp();
const echarts = require('../../common/components/ec-canvas/echarts.js');
// let wxCharts = require('../../common/js/wxcharts.js');
const mi = require('../../common/js/mi.js');
const api = {
  bindThirdAccount: mi.ip + 'user/bindThirdAccount',//绑定账号
};

let chart, chart2, chart3;
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
    bleIsConnect: false,//是否连接蓝牙
    bleIsSync: '',//是否蓝牙信息同步
    bleEnergy: '',//电池电量
    bleIsShowList: false,//是否显示已搜索到的蓝牙设备列表
    bleLists: [],//搜索到蓝牙设备列表
    bleDeviceId: '',//蓝牙设备的id号
    bleServerId: '',//蓝牙设备的服务id号
    bleCharWriteId: '',//蓝牙设备的服务写入特征值id号
    bleCharNotifyId: '',//蓝牙设备的服务接收通知特征值id号
    isAuthorize: true,//是否授权
    temp_score: '',
    temp_lto: '',//左上外
    temp_lti: '',//左上内
    temp_rti: '',//右上内
    temp_rto: '',//右上外
    temp_avg: '',//平均乳温
    temp_avg_isNormal: true,//平均温是否处于正常范围
    temp_avg_title: '',//平均温诊断标题
    temp_avg_detial: '',//平均温诊断内容
    temp_diff_isNormal: true, //最大温差是否处于正常范围
    temp_diff_title: '',//最大温差诊断标题
    temp_diff_detial: '',//最大温差诊断内容
    temp_diff_num: '',//最大温差值
    ec: {
      onInit: initChart
    },
    ec2: {
      onInit: initChart2
    },
    ec3: {
      onInit: initChart3
    }

  },
  bluetoothInit: function () {
    let _this = this;
    //检测蓝牙是否打开
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log('打开蓝牙适配器', res);
        //检测蓝牙此时的状态
        wx.getBluetoothAdapterState({
          success: function (res) {
            console.log('获取蓝牙适配器状态成功', res);
            //监听蓝牙适配器状态
            wx.onBluetoothAdapterStateChange(function (res) {
              console.log(`adapterState changed, now is`, res);
            });
            //如果蓝牙此时处于空闲，则可以
            if (res.available && !res.discovering) {
              console.log('蓝牙处于空闲，开启蓝牙搜索...');
              //开启蓝牙搜索模式
              wx.startBluetoothDevicesDiscovery({
                services: [],
                success: function (res) {
                  console.log('蓝牙搜索的结果列表', res)
                  // _this.setData({
                  //   bleIsShowList:true
                  // });

                  wx.onBluetoothDeviceFound(function (res) {
                    console.log('new device list has founded');
                    console.log(res);
                    if (res.devices[0].name.indexOf('mito-Smart') > -1 || res.devices[0].localName.indexOf('mito-Smart') > -1) {
                      //发现蜜桃设备直接连接
                      _this.connect(res.devices[0].deviceId);
                    }
                    // let bleDevice;
                    // if(_this.data.os=='android'){
                    //   bleDevice = res.devices[0];
                    // } else if(_this.data.os == 'ios'){
                    //   bleDevice = res.devices[0];
                    // }else{
                    //   mi.toast('暂不支持您的设备');
                    // }
                    // _this.data.bleLists.push(bleDevice);
                    // _this.setData({
                    //   bleLists: _this.data.bleLists
                    // });
                  })
                },
                fail: function (res) {
                  console.log(res);
                }
              })

            } else {
              console.log('蓝牙正忙');
            }


          },
          fail: function (res) {
            console.log('获取蓝牙适配器状态失败', res);
          }
        });


      },
      fail: function (res) {
        console.log('蓝牙未打开');
      }
    });
  },
  connect(id) {
    let _this = this;
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log('关闭蓝牙搜索', res);
        _this.setData({
          bleIsShowList: false
        });
      }
    });
    wx.getBluetoothDevices({
      success: function (res) {
        console.log('尝试获取蓝牙搜索期间搜索到的设备', res);
      }
    });
    console.log('deviceId', id);
    let deviceId = id;
    this.setData({
      bleDeviceId: deviceId
    });
    wx.onBLEConnectionStateChange(function (res) {
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      mi.toast(res.connected ? '连接成功' : '连接失败');
      _this.setData({
        bleIsConnect: res.connected
      });
    });
    console.log('创建蓝牙连接');
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log('设备连接成功', res);
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success: function (res) {
            console.log('获取蓝牙设备所有服务', res);
            for (let i = 0; i < res.services.length; i++) {
              if (res.services[i].uuid.indexOf('0000FF92') > -1) {//查找自定义服务
                _this.setData({
                  bleServerId: res.services[i].uuid
                });
                break;//终止循环
              }
            }
            wx.getBLEDeviceCharacteristics({
              deviceId: deviceId,
              serviceId: _this.data.bleServerId,
              success: function (res) {
                console.log('读取蓝牙服务特征值', _this.data.bleServerId, res);
                let writeId, notifyId;
                for (let j = 0; j < res.characteristics.length; j++) {
                  if (res.characteristics[j].uuid.indexOf('9600') > -1) {
                    writeId = res.characteristics[j].uuid;
                  }
                  if (res.characteristics[j].uuid.indexOf('9601')) {
                    notifyId = res.characteristics[j].uuid;
                  }
                  console.log('writeId', writeId);
                  console.log('notifyId', notifyId);
                  _this.setData({
                    bleCharWriteId: writeId,
                    bleCharNotifyId: notifyId,
                  });
                }
                //至此拿到所有需要的值，开启特征值检测，检测一下
                wx.notifyBLECharacteristicValueChange({
                  deviceId: deviceId,
                  serviceId: _this.data.bleServerId,
                  characteristicId: _this.data.bleCharNotifyId,
                  state: true,
                  success: function (res) {
                    console.log('特征值订阅开启成功', res);
                    wx.onBLECharacteristicValueChange(function (res) {
                      console.log('检测到特征值发生变化', res);
                      let hex = mi.buf2hex(res.value);
                      console.log('特征值二进制转十六进制后结果', hex);
                      _this.deal(hex);
                    });
                    setTimeout(function () {
                      _this.command({
                        command: 'c6',
                        param: ['02']
                      });//查询模块版本号
                    }, 1000);
                  },
                  fail: function (res) {
                    console.log('特征值订阅开启失败', res);
                  }
                });
              }
            });
          }
        });
      },
      fail: function () {
        console.log('设备连接失败');
      }
    });
  },
  command(obj, hexStr) {
    const command = {
      c1: '000500C1C4',
      c2: '000500C2C7',
      c3: '000600C3',//后面需追加两位机位和两位校验码
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
        tempObj.hex += v;//追加上参数
      });
      tempObj.hex += mi.check(tempObj.hex);//追加校验码
    }
    //追加包头，开始写入特征值
    tempObj.hex = 'FBFA' + tempObj.hex;
    wx.writeBLECharacteristicValue({
      deviceId: this.data.bleDeviceId,
      serviceId: this.data.bleServerId,
      characteristicId: this.data.bleCharWriteId,
      value: mi.hex2buf(tempObj.hex),
      success: function (res) {
        console.log('特征值写入成功', res);
        if (tempObj.success) {
          tempObj.success(res);
        }
      },
      fail: function (res) {
        console.log('特征值写入失败', res);
        if (tempObj.fail) {
          tempObj.fail(res);
        }
      }
    });
  },
  deal(hex) {
    //查询模块版本号命令（0xC1）
    if (hex.indexOf('01c1') > -1) {
      if(!mi.isRight(hex)){
        return mi.toast('返回数据不完整');
      }
      let pkg = hex.split('01c1')[1].slice(0, -2);
      console.log(pkg);
      let result = mi.hex2str(pkg);
      console.log('结果c1', result);
      return result;
    }
    //查询电池电量命令（0xC2）
    if (hex.indexOf('01c2') > -1) {
      if (!mi.isRight(hex)) {
        return mi.toast('返回数据不完整');
      }
      let pkg = '0x' + hex.split('01c2')[1].substr(0, 2);
      let result = parseInt(pkg, 16);
      console.log('结果c2', result);
      return result;
    }
    //查询温度命令（0xC3）
    if (hex.indexOf('01c3') > -1) {
      if (!mi.isRight(hex)) {
        return mi.toast('返回数据不完整');
      }
      let pkg = hex.split('01c3')[1].slice(0, -2);
      console.log(pkg);
      let result = {
        slot: pkg.slice(0, 2),
        temp1: parseInt(pkg.slice(2, 6), 16) / 100,
        temp2: parseInt(pkg.slice(6), 16) / 100,
      }; //parseInt(pkg, 16);
      console.log('结果c3', result);
      return result;
    }
    //查询工作模式（0xC4）
    if (hex.indexOf('01c4') > -1) {
      let pkg = hex.split('01c4')[1].slice(0, -2);
      console.log(pkg);
      let result = pkg; //parseInt(pkg, 16);
      console.log('结果c4', result);
      return result;
    }
    //查询震动模式（0xC6）
    if (hex.indexOf('01c6') > -1) {
      let pkg = hex.split('01c6')[1].slice(0, -2);
      let result = pkg; //parseInt(pkg, 16);
      console.log('结果c6', result);
      return result;
    }
  },
  
  onLoad() {
    let _this = this;
    // this.lineInit();
    this.getUserInfo();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        _this.setData({
          os: res.platform
        });
      }
    });
    this.setData({
      temp_lto: 36.5,//左上外
      temp_lti: 37.4,//左上内
      temp_rti: 37.8,//右上内
      temp_rto: 37,//右上外
    });
    this.calcTemp();
    this.bluetoothInit();

  },
  onReady() {
    let _this = this;
    let timer = null;
    detch();
    function detch() {
      timer = setTimeout(() => {
        if (chart && chart2 && chart3) {
          _this.chartRender(chart, {
            color: ["#FF4578"],
            dataZoom: [{
              fillerColor: 'rgba(254,216,227,.5)',
              handleStyle: {
                color: 'rgba(254,216,227,1)'
              }
            }]
          }, '分');
          _this.chartRender(chart2, {
            color: ["#4586FF"],
          }, '℃');
          _this.chartRender(chart3, {
            color: ["#6DB35B", "#4586FF", "#FF4578", "#AB45FF"],
          }, '℃');
        } else {
          clearTimeout(timer);
          detch();
        }
      }, 1000);
    }
  },
  onShow() {

  },

  getUserInfo() {
    let that = this;
    //获取用户信息
    mi.user.getSetting(function (status) {
      if (status) {
        that.setData({
          isAuthorize: true
        });
        mi.user.getInfo(function (res) {

        });
      } else {
        that.setData({
          isAuthorize: false
        });
      }
    });
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {

    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           console.log(res.userInfo);
    //           console.log(res);
    //           let openId ='oXGyD1VK6GnPVbUrcul8Wtp0FuWE';//定义openId
    //           // mi.ajax({
    //           //   url: api.bindThirdAccount,
    //           //   method:'post',
    //           //   data:{

    //           //   },
    //           //   success:function(){

    //           //   }
    //           // });
    //         }
    //       })
    //     }
    //   }
    // });
  },
  chartRender(chart, opts, unit) {
    let option = {
      backgroundColor: '#FFF',
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        containLabel: true,
        left: 15,
        top: 40,
        right: 20,
        bottom: 15,
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          top: 10,
          height: 20,
          start: 0,
          end: 20,
          minSpan: 10,
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
        }
      ],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: (function () {
          let arr = [];
          for (let i = 0; i < 100; i++) {
            arr.push('X' + i);
          }
          return arr;
        })(),
        axisPointer: {
          label: {
            formatter: function (params) {
              // console.log(params);
              mi.toast(params.seriesData[0].seriesName + ':' + params.seriesData[0].name + '-' + params.seriesData[0].value + unit);
            }
          }
        },
      },
      yAxis: {
        x: 'center',
        type: 'value'
      },
      series: [{
        name: 'A商品',
        type: 'line',
        smooth: true,
        data: (function () {
          let arr = [];
          for (let i = 0; i < 100; i++) {
            arr.push(parseInt(Math.random() * 100));
          }
          return arr;
        })()
      }]
    };
    option = mi.deepMerge(option, opts);
    // console.log(option);

    chart.setOption(option);
  },
  calcTemp() {
    //平均温度
    let temp_avg = ((this.data.temp_lto + this.data.temp_lti + this.data.temp_rti + this.data.temp_rto) / 4).toFixed(1);
    //8种温差组合
    let temp_lto_lti = this.data.temp_lto - this.data.temp_lti;//左上外,左上内
    let temp_rto_rti = this.data.temp_rto - this.data.temp_rti;//右上外,右上内
    let temp_lto_rto = this.data.temp_lto - this.data.temp_rto;//左上外,右上外
    let temp_lti_rti = this.data.temp_lti - this.data.temp_rti;//左上内,右上内

    let temp_lti_lto = this.data.temp_lti - this.data.temp_lto;//左上内,左上外
    let temp_rti_rto = this.data.temp_rti - this.data.temp_rto;//右上内,右上外
    let temp_rto_lto = this.data.temp_rto - this.data.temp_lto;//右上外,左上外
    let temp_rti_lti = this.data.temp_rti - this.data.temp_lti;//右上内,左上内

    //列出三组温差值
    let temp_group1_max = [temp_lto_rto, temp_lti_rti];
    let temp_group2_max = [temp_lto_lti, temp_lti_lto, temp_rto_rti, temp_rti_rto];
    let temp_group3_max = [temp_rto_lto, temp_rti_lti];

    //计算健康分数
    let temp_score = this.calcScore(temp_avg, temp_group1_max, temp_group2_max, temp_group3_max);

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
    this.setData({
      temp_score: temp_score,
      temp_avg: temp_avg,//平均乳温
    });
  },//计算温度，蓝牙得到温度后触发
  calcScore(avg, g1, g2, g3) {
    let score = '';//所得分数
    //分别对数组进行倒序排列，得出最大温差值
    let gmax1 = mi.getArryMax(g1);
    let gmax2 = mi.getArryMax(g2);
    let gmax3 = mi.getArryMax(g3);
    //对三组最大温差值进行比较，得出最大的温差赋予temp
    let group_arr = [gmax1, gmax2, gmax3];
    let temp_max = mi.getArryMax(group_arr);
    let group_max = '';//最大温差的那个组合序号
    for (let i = 0; i < group_arr.length; i++) {
      if (temp_max == group_arr[i]) {
        group_max = i + 1;
        break;
      }
    }
    if (temp_max <= 0.4) {
      if (group_max == 1) {
        if (avg >= 35.8 && avg <= 37) {
          score = 100 - (0.4 - temp_max) * 11.5 - Math.abs(avg - (35.8 + 37) / 2) * 9;
        } else if (avg > 32 && avg < 35.8) {
          score = 89.9 - (0.4 - temp_max) * 15.7 - (35.7 - avg);
        } else if (avg > 37 && avg < 41) {
          score = 74.9 - (0.4 - temp_max) * 3 - (avg - 37.1) ^ (1 / 4) * 6.2;
        }
      }
      if (group_max == 2) {
        if (avg >= 35.8 && avg <= 37) {
          score = 100 - temp_max * 11.5 - Math.abs(t - (35.8 + 37) / 2) * 9;
        } else if (avg > 32 && avg < 35.8) {
          score = 89.9 - temp_max * 15.7 - (35.7 - avg);
        } else if (avg > 37 && avg < 41) {
          score = 74.9 - temp_max * 3 - (avg - 37.1) ^ (1 / 4) * 6.2;
        }
      }
      if (group_max == 3) {
        if (avg >= 35.8 && avg <= 37) {
          score = 95 - temp_max * 13 - Math.abs(avg - (35.8 + 37) / 2) * 8;
        } else if (avg > 32 && avg < 35.8) {
          score = 89.9 - temp_max * 15.7 - (35.7 - avg);
        } else if (avg > 37 && avg < 41) {
          score = 74.9 - temp_max * 3 - (avg - 37.1) ^ (1 / 4) * 6.2;
        }
      }
    } else if (temp_max > 0.4 && temp_max <= 0.9) {
      if (avg >= 35.8 && avg <= 37) {
        score = 85 - (temp_max - 0.5) * 19 - Math.abs(avg - (35.8 + 37) / 2) * 4;
      } else if (avg > 32 && avg < 35.8) {
        score = 74.9 - (temp_max - 0.5) * 20 - (35.7 - avg) ^ (1 / 2);
      } else if (avg > 37 && avg < 41) {
        score = 64.9 - (temp_max - 0.5) * 9 - (avg - 37.1) ^ (1 / 4) * 4.5;
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
        score = 4.9 - (temp_max - 3.7) ^ (1 / 2) / 1.74 - Math.abs(avg - (35.8 + 37) / 2);
      } else if (avg > 32 && avg < 35.8) {
        score = 3.5 - (temp_max - 3.7) ^ (1 / 2) / 1.88 - (35.7 - avg) / 12;
      } else if (avg > 37 && avg < 41) {
        score = 1.9 - (temp_max - 3.7) ^ (1 / 4) / 2.5 - (avg - 37.1) / 12.67;
      }
    }
    return score.toFixed(1);//返回分数值
  },//计算健康值
  calcAvgDiagnose(curr, last) {
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
      let diff = curr - last;//与历史比较的温差
      if (diff <= 0.3) {
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

  },//计算平均乳温诊断结果
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
    if (tempMax > 1) {
      let tempIndex = '';
      for (let i = 0; i < arr.length; i++) {
        if (tempMax == arr[i]) {
          tempIndex = i;
        }
      }
      this.setData({
        temp_diff_isNormal: false,
        temp_diff_title: `${tempDiffText[tempIndex][0]}区域温度显著高于${tempDiffText[tempIndex][1]}区域`,
        temp_diff_detial: '温馨提醒：有研究表明，当乳房对照位置的温度差超过1℃时，可能存在乳腺增生、恶性肿瘤的风险，建议就医检查。',
        temp_diff_num: tempMax.toFixed(1)
      });
    } else {
      this.setData({
        temp_diff_isNormal: true,
        temp_diff_title: '各测量部位未出现显著温差，要坚持测量乳房温度，防患于未然哦！',
        temp_diff_detial: '温馨提醒：测量乳房温度变化，对于及早发现乳腺增生、肿瘤有积极作用。因为乳腺增生、恶性肿瘤等部位血供丰富、代谢旺盛、产热增多，病灶处所产生的热传导至皮肤可使皮肤表面温度高于病灶周围其他区域的温度。',
        temp_diff_num: tempMax.toFixed(1)
      });
    }
  },//计算乳温差值诊断结果

});
