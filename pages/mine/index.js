var app = getApp();
Page({
  data: {
    isFigure:false,//是否显示身材
    isBreast:false,//是否显示胸围
    currentDate:new Date().getFullYear()+'-01',
    dateStart:new Date().getFullYear()-50+'-01',
    dataEnd:new Date().getFullYear()+'-12',
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
  onLoad() {

  },
  onShow() {

  },
  hideAll:function(){
  	this.setData({
  	  isFigure: false,
  	  isBreast:false
  	});
  },
  preventBubble:function(){},
  bindFigureChange:function(e){
  	this.setData({
  	  	isFigure:true
  	});
  },
  bindBreastChange:function(e){
  	this.setData({
  	  	isBreast:true
  	});
  },
  closeBreast:function(){
  	this.setData({
  	  	isBreast:false
  	});
  },
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      currentDate: e.detail.value
    });
  },
  bindsliderChange:function(e){
  	console.log('picker发送选择改变，携带值为', e.detail.value);
  }
});
