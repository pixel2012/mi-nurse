let app = getApp();
let echarts = require('../../common/components/ec-canvas/echarts.js');
// let wxCharts = require('../../common/js/wxcharts.js');
let mi = require('../../common/js/mi.js');
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
    os:'',//操作平台
    bleIsConnect:false,//是否连接蓝牙
    bleIsSync:'',//是否蓝牙信息同步
    bleEnergy:'',//电池电量
    bleIsShowList:false,//是否显示已搜索到的蓝牙设备列表
    bleLists:[],//搜索到蓝牙设备列表
    bleDeviceId:'',//蓝牙设备的id号
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
    let _this=this;
    // _this.setData({
    //   bleIsConnect: true
    // });
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
                  _this.setData({
                    bleIsShowList:true
                  });
                  // ArrayBuffer转16进度字符串示例
                  function ab2hex(buffer) {
                    let hexArr = Array.prototype.map.call(
                      new Uint8Array(buffer),
                      function (bit) {
                        return ('00' + bit.toString(16)).slice(-2)
                      }
                    )
                    return hexArr.join('');
                  }

                  wx.onBluetoothDeviceFound(function (res) {
                    console.log('new device list has founded');
                    console.log(res);
                    console.log(ab2hex(res.devices[0].advertisData));
                    let bleDevice;
                    if(_this.data.os=='android'){
                      bleDevice = res.devices[0];
                    } else if(_this.data.os == 'ios'){
                      bleDevice = res.devices[0];
                    }else{
                      mi.toast('暂不支持您的设备');
                    }
                    _this.data.bleLists.push(bleDevice);
                    _this.setData({
                      bleLists: _this.data.bleLists
                    });
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
  onLoad() {
    let _this=this;
    // this.lineInit();
    this.getUserInfo();
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        _this.setData({
          os:res.platform
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
    let _this=this;
    let timer=null;
    detch();
    function detch(){
      timer=setTimeout(()=>{
        if (chart && chart2 && chart3){
          _this.chartRender(chart, {
            color: ["#FF4578"],
            dataZoom: [{
              fillerColor:'rgba(254,216,227,.5)',
              handleStyle: {
                color: 'rgba(254,216,227,1)'
              }
            }]
          }, '分');
          _this.chartRender(chart2, {
            color: ["#4586FF"],
          }, '℃');
          _this.chartRender(chart3, {
            color: ["#6DB35B", "#4586FF", "#FF4578","#AB45FF"],
          }, '℃');
        }else{
          clearTimeout(timer);
          detch();
        }
      },1000);
    }
  },
  onShow() {

  },
  connect(e){
    let _this=this;
    wx.stopBluetoothDevicesDiscovery({
      success:function(res){
        console.log('关闭蓝牙搜索',res);
        _this.setData({
          bleIsShowList: false
        });
      }
    });
    wx.getBluetoothDevices({
      success:function(res){
        console.log('尝试获取蓝牙搜索期间搜索到的设备', res);
      }
    });
    console.log(e.currentTarget.dataset.id);
    let deviceId = e.currentTarget.dataset.id;
    this.setData({
      bleDeviceId: deviceId
    });
    wx.onBLEConnectionStateChange(function(res){
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`);
      mi.toast(res.connected?'连接成功':'连接失败');
    });
    console.log('创建蓝牙连接');
    wx.createBLEConnection({
      deviceId: deviceId,
      success: function (res) {
        console.log('设备连接成功',res);
        wx.getBLEDeviceServices({
          deviceId: deviceId,
          success:function(res){
            console.log('获取蓝牙设备所有服务',res);
            res.services.forEach(v=>{
              wx.getBLEDeviceCharacteristics({
                deviceId: deviceId,
                serviceId:v.uuid,
                success:function(res){
                  console.log('读取蓝牙服务特征值', res);
                  // wx.readBLECharacteristicValue({
                  //   deviceId: deviceId,
                  //   serviceId: v.uuid,
                  //   characteristicId:res.uuid
                  // });
                }
              });
            });
          }
        });
      },
      fail:function(){
        console.log('设备连接失败');
      }
    });
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
