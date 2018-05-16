var app = getApp();
Page({
  data: {},
  onLoad() {
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
    })





  },
  onShow() {

  }
});
