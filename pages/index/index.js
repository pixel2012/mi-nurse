var app = getApp();
var wxCharts = require('../../common/js/wxcharts.js');
var lineChart = null;
Page({
  data: {},
  onLoad() {

    this.lineInit();
  },
  onShow() {

  },
  bluetoothInit: function () {
    //检测蓝牙是否打开
    wx.openBluetoothAdapter({
      success: function (res) {
        console.log(res);
        //检测蓝牙此时的状态
        wx.getBluetoothAdapterState({
          success: function (res) {
            console.log(res);
            //监听蓝牙适配器状态
            wx.onBluetoothAdapterStateChange(function (res) {
              console.log(`adapterState changed, now is`, res);
            })
            //如果蓝牙此时处于空闲，则可以
            if (res.available && !res.discovering) {
              //开启蓝牙搜索模式
              wx.startBluetoothDevicesDiscovery({
                services: [],
                success: function (res) {
                  console.log(res)
                  // ArrayBuffer转16进度字符串示例
                  function ab2hex(buffer) {
                    var hexArr = Array.prototype.map.call(
                      new Uint8Array(buffer),
                      function (bit) {
                        return ('00' + bit.toString(16)).slice(-2)
                      }
                    )
                    return hexArr.join('');
                  }
                  wx.onBluetoothDeviceFound(function (devices) {
                    console.log('new device list has founded')
                    console.dir(devices)
                    console.log(ab2hex(devices[0].advertisData))
                  })
                },
                fail: function (res) {
                  console.log(res);
                }
              })

            }






          },
          fail: function (res) {
            console.log(res);
          }
        });








      },
      fail: function (res) {
        console.log('蓝牙未打开');
      }
    });
  },
  lineInit: function () {
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth - 20;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    var simulationData = this.createSimulationData();
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: simulationData.categories,
      animation: true,
      // background: '#f5f5f5',
      series: [{
        name: '成交量1',
        data: simulationData.data,
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }, {
        name: '成交量2',
        data: [2, 0, 0, 3, null, 4, 0, 0, 2, 0],
        format: function (val, name) {
          return val.toFixed(2) + '万';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '成交金额 (万元)',
        format: function (val) {
          return val.toFixed(2);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });
  },
  touchHandler: function (e) {
    console.log(lineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, {
      // background: '#7cb5ec',
      format: function (item, category) {
        return category + ' ' + item.name + ':' + item.data
      }
    });
  },
  createSimulationData: function () {
    var categories = [];
    var data = [];
    for (var i = 0; i < 10; i++) {
      categories.push('2016-' + (i + 1));
      data.push(Math.random() * (20 - 10) + 10);
    }
    // data[4] = null;
    return {
      categories: categories,
      data: data
    }
  },
});
