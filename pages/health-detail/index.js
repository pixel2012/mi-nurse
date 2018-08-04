let app = getApp();
let mi = require('../../common/js/mi.js');

Page({
  data: {
    isAuthorize: true, //是否授权
    temp_score: '',
    temp_lto: '', //左上外
    temp_lti: '', //左上内
    temp_rti: '', //右上内
    temp_rto: '', //右上外
    temp_avg: '', //平均乳温
    temp_avg_isNormal: true, //平均温是否处于正常范围
    temp_avg_title: '', //平均温诊断标题
    temp_avg_detial: '', //平均温诊断内容
    temp_diff_isNormal: true, //最大温差是否处于正常范围
    temp_diff_title: '', //最大温差诊断标题
    temp_diff_detial: '', //最大温差诊断内容
    temp_diff_num: '', //最大温差值
    currentTime: '', //当前时间
    ltpStr:'',//平均乳温文案
  },
  onLoad(options) {
    //console.log('options', options);
    this.setData({
      temp_lto: options.tp1 / 100, //左上外
      temp_lti: options.tp2 / 100, //左上内
      temp_rti: options.tp3 / 100, //右上内
      temp_rto: options.tp4 / 100, //右上外
      ltpStr: options.ltpStr,
      currentTime: mi.format('MM月dd日 hh:mm', options.ctime*1)
    });
    this.calcTemp();

  },
  onShow() {

  },
    calcTemp(callback) {
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
        let group_arr = [gmax1, gmax2, gmax3];
        let temp_max = mi.getArryMax(group_arr).toFixed(1);

        //计算健康分数
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
    calcScore(avg, temp_max,group_arr) {
        let score = ''; //所得分数

        let group_max = ''; //最大温差的那个组合序号
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
                    score = 74.9 - (0.4 - temp_max) * 3 - Math.pow((avg - 37.1) , (1 / 4) * 6.2);
                }
            }
            else if (group_max == 2) {
                if (avg >= 35.8 && avg <= 37) {
                    score = 100 - temp_max * 11.5 - Math.abs(avg - (35.8 + 37) / 2) * 9;
                } else if (avg > 32 && avg < 35.8) {
                    score = 89.9 - temp_max * 15.7 - (35.7 - avg);
                } else if (avg > 37 && avg < 41) {
                    score = 74.9 - temp_max * 3 - Math.pow((avg - 37.1) , (1 / 4) * 6.2);
                }
            }
            else if (group_max == 3) {
                if (avg >= 35.8 && avg <= 37) {
                    score = 95 - temp_max * 13 - Math.abs(avg - (35.8 + 37) / 2) * 8;
                } else if (avg > 32 && avg < 35.8) {
                    score = 89.9 - temp_max * 15.7 - (35.7 - avg);
                } else if (avg > 37 && avg < 41) {
                    score = 74.9 - temp_max * 3 - Math.pow((avg - 37.1) , (1 / 4) * 6.2);
                }
            }
        } else if (temp_max > 0.4 && temp_max <= 0.9) {
            if (avg >= 35.8 && avg <= 37) {
                score = 85 - (temp_max - 0.5) * 19 - Math.abs(avg - (35.8 + 37) / 2) * 4;
            } else if (avg > 32 && avg < 35.8) {
                score = 74.9 - (temp_max - 0.5) * 20 - Math.pow((35.7 - avg) , (1 / 2));
            } else if (avg > 37 && avg < 41) {
                score = 64.9 - (temp_max - 0.5) * 9 - Math.pow((avg - 37.1) , (1 / 4) * 4.5);
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
                score = 4.9 - Math.pow((temp_max - 3.7) , (1 / 2) / 1.74) - Math.abs(avg - (35.8 + 37) / 2);
            } else if (avg > 32 && avg < 35.8) {
                score = 3.5 - Math.pow((temp_max - 3.7) , (1 / 2) / 1.88) - (35.7 - avg) / 12;
            } else if (avg > 37 && avg < 41) {
                score = 1.9 - Math.pow((temp_max - 3.7) , (1 / 4) / 2.5) - (avg - 37.1) / 12.67;
            }
        }
        return score.toFixed(1); //返回分数值
    }, //计算健康值
  calcAvgDiagnose(curr, last) {
    let _this=this;
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
      temp_avg_detial: avg_detial
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
  }, //计算乳温差值诊断结果

});