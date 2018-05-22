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
    displayMultipleItems:2,
    tabIndex:0,//当前高亮的tab标签栏
    isMenu:false,//是否显示菜单
    menuIndex:0,//当前高亮的菜单项
    menuList:[
      {
        id:0,
        title:'盛夏\n如花'
      },
      {
        id: 2,
        title: '高山\n流水'
      },
      {
        id: 3,
        title: '阵阵\n酥麻'
      },
      {
        id: 4,
        title: '小鹿\n乱撞'
      },
      {
        id: 5,
        title: '浪花\n迭起'
      },
      {
        id: 6,
        title: '琴瑟\n长鸣'
      },
      {
        id: 7,
        title: '随机'
      }
    ],
    play:false,//震动状态
    playTitle:'',
    strength:1,//震动强度
  },
  onLoad(){

  },
  onShow(){
    
  },
  bindTab(e){
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    });
  },
  showMenu(){
    this.setData({
      isMenu:true
    });
  },
  hideMenu(){
    this.setData({
      isMenu: false
    });
  },
  showMenuItem(e){
    this.setData({
      menuIndex: e.currentTarget.dataset.index
    });
  },
  bindPlay(){
    this.setData({
      play:!this.data.play
    });
  },
  bindStrength(e){
    this.setData({
      strength: e.currentTarget.dataset.index
    });
  }
});
