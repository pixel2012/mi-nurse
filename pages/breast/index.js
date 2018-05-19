var app = getApp();
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    current:0,
    indicatorDots: true,
    indicatorActiveColor:'#12C8C8',
    autoplay: false,
    interval: 5000,
    duration: 1000,
    circular:true,
    displayMultipleItems:2
  },
  onLoad(){

  },
  onShow(){
    
  }
});
