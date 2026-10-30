// pages/housing-verify/housing-verify.js
const app = getApp()
const apiRequest = require('../../utils/api-request.js')

const generateAreaData = (basePrice, deposit, civil, facilities, waterC, waterComm, elecC, elecComm) => ({
  avgPrice: basePrice,
  depositRatio: deposit,
  civilRatio: civil,
  facilities: facilities,
  waterPrice: { civil: waterC, commercial: waterComm },
  elecPrice: { civil: elecC, commercial: elecComm }
});

// Function to generate city data
const generateCityData = (getWaterPrice, getWaterCommPrice, getElecPrice, getElecCommPrice) => {
  return {
    beijingData: {
      'Chaoyang': generateAreaData('4,200', 1, 68, 203, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Haidian': generateAreaData('5,100', 2, 55, 267, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Xicheng': generateAreaData('3,500', 1, 72, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Dongcheng': generateAreaData('3,800', 1, 75, 134, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Fengtai': generateAreaData('2,800', 1, 80, 98, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Shijingshan': generateAreaData('2,600', 1, 82, 89, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Tongzhou': generateAreaData('2,400', 1, 85, 78, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    shanghaiData: {
      'Pudong New Area': generateAreaData('5,500', 2, 55, 278, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Huangpu': generateAreaData('6,200', 2, 48, 301, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jingan': generateAreaData('5,800', 2, 52, 289, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Xuhui': generateAreaData('5,300', 2, 58, 256, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Changning': generateAreaData('4,800', 1, 62, 223, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Putuo': generateAreaData('4,200', 1, 68, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Hongkou': generateAreaData('4,500', 1, 65, 203, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    guangzhouData: {
      'Tianhe': generateAreaData('4,500', 2, 60, 238, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Yuexiu': generateAreaData('3,800', 1, 70, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Haizhu': generateAreaData('3,200', 1, 78, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Liwan': generateAreaData('2,900', 1, 82, 134, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Baiyun': generateAreaData('2,500', 1, 85, 112, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Panyu': generateAreaData('2,300', 1, 88, 98, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Huangpu': generateAreaData('2,700', 1, 83, 125, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    shenzhenData: {
      'Nanshan': generateAreaData('5,800', 2, 52, 289, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Futian': generateAreaData('5,200', 2, 58, 267, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Luohu': generateAreaData('4,300', 1, 68, 203, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Baoan': generateAreaData('3,500', 1, 75, 167, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Longgang': generateAreaData('2,800', 1, 82, 134, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Longhua': generateAreaData('3,200', 1, 78, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Yantian': generateAreaData('3,800', 1, 72, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    hangzhouData: {
      'Xihu': generateAreaData('4,200', 2, 65, 215, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Yuhang': generateAreaData('3,500', 1, 72, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jianggan': generateAreaData('3,800', 1, 70, 203, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Shangcheng': generateAreaData('3,900', 1, 68, 198, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Xiacheng': generateAreaData('3,600', 1, 72, 176, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Binjiang': generateAreaData('4,000', 2, 68, 220, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Xiaoshan': generateAreaData('2,800', 1, 78, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    chengduData: {
      'Jinjiang': generateAreaData('3,200', 1, 75, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Wuhou': generateAreaData('3,000', 1, 78, 176, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Qingyang': generateAreaData('3,100', 1, 76, 182, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Chenghua': generateAreaData('2,800', 1, 80, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jinniu': generateAreaData('2,700', 1, 82, 145, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Gaoxin': generateAreaData('3,500', 2, 70, 203, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Tianfu New Area': generateAreaData('3,300', 1, 72, 198, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    nanjingData: {
      'Xuanwu': generateAreaData('3,500', 1, 72, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Gulou': generateAreaData('3,800', 1, 70, 203, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jianye': generateAreaData('3,600', 1, 72, 198, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Qinhuai': generateAreaData('3,400', 1, 74, 182, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Yuhuatai': generateAreaData('2,800', 1, 78, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jiangning': generateAreaData('2,500', 1, 82, 134, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Pukou': generateAreaData('2,300', 1, 85, 112, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    wuhanData: {
      'Wuchang': generateAreaData('3,000', 1, 75, 176, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jianghan': generateAreaData('3,200', 1, 72, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jiangan': generateAreaData('3,100', 1, 74, 182, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Qiaokou': generateAreaData('2,800', 1, 78, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Hanyang': generateAreaData('2,600', 1, 80, 145, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Hongshan': generateAreaData('2,900', 1, 76, 167, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'DonghuGaoxin': generateAreaData('3,300', 1, 70, 198, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    chongqingData: {
      'Yuzhong': generateAreaData('3,200', 1, 72, 189, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jiangbei': generateAreaData('3,000', 1, 75, 176, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Nanan': generateAreaData('2,800', 1, 78, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jiulongpo': generateAreaData('2,700', 1, 80, 145, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Shapingba': generateAreaData('2,600', 1, 82, 134, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Yubei': generateAreaData('2,900', 1, 76, 167, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'BaNan': generateAreaData('2,300', 1, 85, 112, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    xianData: {
      'Yanta': generateAreaData('3,100', 1, 74, 182, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Beilin': generateAreaData('3,000', 1, 75, 176, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Lianhu': generateAreaData('2,800', 1, 78, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'XinChengqu': generateAreaData('2,700', 1, 80, 145, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Weiyang': generateAreaData('2,600', 1, 82, 134, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Baqiao': generateAreaData('2,400', 1, 85, 112, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Changan': generateAreaData('2,300', 1, 88, 98, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    },
    defaultData: {
      'City Center': generateAreaData('3,000', 1, 70, 145, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'East New Area': generateAreaData('2,800', 1, 72, 134, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'West New Area': generateAreaData('2,600', 1, 75, 123, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'South New Area': generateAreaData('2,500', 1, 78, 112, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'North New Area': generateAreaData('2,400', 1, 80, 98, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Gaoxin': generateAreaData('3,200', 1, 68, 156, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice()),
      'Jingkai District': generateAreaData('3,000', 1, 72, 130, getWaterPrice(), getWaterCommPrice(), getElecPrice(), getElecCommPrice())
    }
  };
};

Page({
  data: {
    currentCity: 'Guangzhou',
    currentDistrict: '',
    currentProvince: '',
    showDistrictPicker: false,
    showCityPicker: false,
    showProvincePicker: false,
    availableDistricts: [],
    availableCities: [],
    areaData: {
      avgPrice: '4,500',
      depositRatio: 2,
      civilRatio: 60,
      facilities: 238,
      waterPrice: {
        civil: 4.5,
        commercial: 8.5
      },
      elecPrice: {
        civil: 0.58,
        commercial: 1.15
      }
    },
    roomTypes: [],
    checklist: {
      basic: [
        { id: 1, text: 'Check if water, electricity, gas, internet work', checked: true },
        { id: 2, text: 'Check if AC, washer and appliances are intact', checked: true },
        { id: 3, text: 'Check if door and window locks are secure', checked: true },
        { id: 4, text: 'Check if bathroom and kitchen drains flow', checked: true },
        { id: 5, text: 'Check if walls and floors have visible damage', checked: false }
      ],
      safety: [
        { id: 1, text: 'Check if fire exits are clear', checked: true },
        { id: 2, text: 'Check for unsafe electrical wiring', checked: true },
        { id: 3, text: 'Check if gas pipes are safe', checked: true },
        { id: 4, text: 'Check for illegal construction', checked: false },
        { id: 5, text: 'Check if community security is adequate', checked: true }
      ],
      contract: [
        { id: 1, text: 'Verify landlord identity and property title', checked: true },
        { id: 2, text: 'Confirm rent and deposit amounts', checked: true },
        { id: 3, text: 'Include utility rates in contract', checked: true },
        { id: 4, text: 'Clarify liability for breach', checked: false },
        { id: 5, text: 'Confirm lease start and end dates', checked: true }
      ]
    }
  },

  onLoad(options) {
    // First try to get user\'s location
    this.getUserLocation();
  },

  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        console.log('Location success:', res);
        this.getCityFromLocation(res.latitude, res.longitude);
      },
      fail: (err) => {
        console.log('Location failed:', err);
        // If fails, use default city or global city
        const globalCity = app.globalData.city || 'Guangzhou';
        this.setData({
          currentCity: globalCity
        });
        this.setInitialDistrict();
        this.loadAreaData();
      }
    });
  },

  getCityFromLocation(latitude, longitude) {
    // Use Tencent Maps API for reverse geocoding
    const url = `https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=YOUR_TENCENT_MAP_KEY`;
    
    wx.request({
      url: url,
      success: (res) => {
        console.log('Reverse geocoding success:', res);
        if (res.data.status === 0 && res.data.result) {
          const city = res.data.result.address_component.city || 'Guangzhou';
          this.setData({
            currentCity: city
          });
          // Save to global data
          app.globalData.city = city;
        } else {
          // Geocoding failed, use default city
          this.setData({
            currentCity: 'Guangzhou'
          });
        }
        this.setInitialDistrict();
        this.loadAreaData();
      },
      fail: (err) => {
        console.log('Reverse geocoding failed:', err);
        // Request failed, use default city
        this.setData({
          currentCity: 'Guangzhou'
        });
        this.setInitialDistrict();
        this.loadAreaData();
      }
    });
  },

  setInitialDistrict() {
    const city = this.data.currentCity;
    let defaultDistrict = '';

    if (city.includes('Beijing')) {
      defaultDistrict = 'Chaoyang';
    } else if (city.includes('Shanghai')) {
      defaultDistrict = 'Pudong New Area';
    } else if (city.includes('Guangzhou')) {
      defaultDistrict = 'Tianhe';
    } else if (city.includes('Shenzhen')) {
      defaultDistrict = 'Nanshan';
    } else if (city.includes('Hangzhou')) {
      defaultDistrict = 'Xihu';
    } else if (city.includes('Chengdu')) {
      defaultDistrict = 'Jinjiang';
    } else if (city.includes('Nanjing')) {
      defaultDistrict = 'Gulou';
    } else if (city.includes('Wuhan')) {
      defaultDistrict = 'Wuchang';
    } else if (city.includes('Chongqing')) {
      defaultDistrict = 'Yuzhong';
    } else if (city.includes('Xian')) {
      defaultDistrict = 'Yanta';
    } else if (city.includes('Suzhou')) {
      defaultDistrict = 'Gusu';
    } else if (city.includes('Tianjin')) {
      defaultDistrict = 'Heping';
    } else if (city.includes('Changsha')) {
      defaultDistrict = 'Furong';
    } else if (city.includes('Zhengzhou')) {
      defaultDistrict = 'Jinshui';
    } else if (city.includes('Pingdingshan')) {
      defaultDistrict = 'Xinhua';
    } else if (city.includes('Dongguan')) {
      defaultDistrict = 'Nancheng';
    } else if (city.includes('Foshan')) {
      defaultDistrict = 'Chancheng';
    } else if (city.includes('Qingdao')) {
      defaultDistrict = 'Shinan';
    } else if (city.includes('Dalian')) {
      defaultDistrict = 'Zhongshan';
    } else if (city.includes('Xiamen')) {
      defaultDistrict = 'Siming';
    } else if (city.includes('Ningbo')) {
      defaultDistrict = 'Haishu';
    } else if (city.includes('Shenyang')) {
      defaultDistrict = 'Heping';
    } else if (city.includes('Changchun')) {
      defaultDistrict = 'Nanguan';
    } else if (city.includes('Harbin')) {
      defaultDistrict = 'Daoli';
    } else if (city.includes('Jinan')) {
      defaultDistrict = 'Lixia';
    } else if (city.includes('Hefei')) {
      defaultDistrict = 'Shushan';
    } else if (city.includes('Fuzhou')) {
      defaultDistrict = 'Gulou';
    } else if (city.includes('Kunming')) {
      defaultDistrict = 'Wuhua';
    } else if (city.includes('Nanchang')) {
      defaultDistrict = 'Donghu';
    } else if (city.includes('Nanning')) {
      defaultDistrict = 'Qingxiu';
    } else if (city.includes('Guiyang')) {
      defaultDistrict = 'Nanming';
    } else if (city.includes('Taiyuan')) {
      defaultDistrict = 'Xiaodian';
    } else if (city.includes('Shijiazhuang')) {
      defaultDistrict = 'Changan';
    } else if (city.includes('Lanzhou')) {
      defaultDistrict = 'Chengguan';
    } else if (city.includes('Hohhot')) {
      defaultDistrict = 'Saihan';
    } else if (city.includes('Yinchuan')) {
      defaultDistrict = 'Jinfeng';
    } else if (city.includes('Xining')) {
      defaultDistrict = 'Chengzhong';
    } else if (city.includes('Urumqi')) {
      defaultDistrict = 'Saybag';
    } else if (city.includes('Lhasa')) {
      defaultDistrict = 'Chengguan';
    } else if (city.includes('Haikou')) {
      defaultDistrict = 'Longhua';
    } else if (city.includes('Sanya')) {
      defaultDistrict = 'Jiyang';
    } else if (city.includes('Macao')) {
      defaultDistrict = 'Macau Peninsula';
    } else if (city.includes('Hong Kong')) {
      defaultDistrict = 'Central and Western';
    } else if (city.includes('Taipei')) {
      defaultDistrict = 'Daan';
    } else if (city.includes('Kaohsiung')) {
      defaultDistrict = 'Qianjin';
    } else if (city.includes('Taichung')) {
      defaultDistrict = 'West';
    } else if (city.includes('Tainan')) {
      defaultDistrict = 'East';
    } else {
      defaultDistrict = 'City Center';
    }

    this.setData({
      currentDistrict: defaultDistrict
    });
  },

  chooseCity() {
    // Show province picker first
    this.setData({
      showProvincePicker: true,
      provinceList: [
        'Municipalities', 'Guangdong', 'Jiangsu', 'Zhejiang', 'Shandong', 'Henan', 'Sichuan', 'Hubei', 'Hunan',
        'Hebei', 'Fujian', 'Anhui', 'Shaanxi', 'Heilongjiang', 'Jilin', 'Liaoning', 'Jiangxi', 'Shanxi',
        'Yunnan', 'Guizhou', 'Guangxi', 'Inner Mongolia', 'Xinjiang', 'Ningxia',
        'Gansu', 'Qinghai', 'Tibet', 'Hainan', 'Taiwan', 'Hong Kong', 'Macao'
      ]
    });
    return;
  },

  chooseDistrict() {
    const city = this.data.currentCity;
    console.log('Current city:', city);

    // Return districts by city
    let districts = [];
    if (city.includes('Beijing')) {
      districts = ['Chaoyang', 'Haidian', 'Xicheng', 'Dongcheng', 'Fengtai', 'Shijingshan', 'Tongzhou', 'Shunyi', 'Changping', 'Daxing', 'Fangshan', 'Mentougou', 'Pinggu', 'Huairou', 'Miyun', 'Yanqing'];
    } else if (city.includes('Shanghai')) {
      districts = ['Pudong New Area', 'Huangpu', 'Jingan', 'Xuhui', 'Changning', 'Putuo', 'Hongkou', 'Yangpu', 'Minhang', 'Baoshan', 'Jiading', 'Jinshan', 'Songjiang', 'Qingpu', 'Fengxian', 'Chongming'];
    } else if (city.includes('Guangzhou')) {
      districts = ['Tianhe', 'Yuexiu', 'Haizhu', 'Liwan', 'Baiyun', 'Panyu', 'Huangpu', 'Huadu', 'Nansha', 'Conghua', 'Zengcheng'];
    } else if (city.includes('Shenzhen')) {
      districts = ['Nanshan', 'Futian', 'Luohu', 'Baoan', 'Longgang', 'Longhua', 'Yantian', 'Pingshan', 'Guangming', 'Dapeng New Area'];
    } else if (city.includes('Dongguan')) {
      districts = ['Guancheng', 'Dongcheng', 'Nancheng', 'Wanjiang', 'Shilong', 'Shipai', 'Chashan', 'Qishi', 'Qiaotou', 'Dongkeng', 'Hengli', 'Changping', 'Liaobu', 'Dalang', 'Huangjiang', 'Qingxi', 'Tangxia', 'Fenggang', 'Changan', 'Humen', 'Houjie', 'Shatian', 'Daojiao', 'Hongmei', 'Machong', 'Zhongtang', 'Gaobu', 'Zhangmutou', 'Dalingshan', 'Wangniudun'];
    } else if (city.includes('Foshan')) {
      districts = ['Chancheng', 'Nanhai', 'Shunde', 'Sanshui', 'Gaoming'];
    } else if (city.includes('Zhuhai')) {
      districts = ['Xiangzhou', 'Doumen', 'Jinwan', 'Hengqin New Area'];
    } else if (city.includes('Shantou')) {
      districts = ['Jinping', 'Longhu', 'Chenghai', 'Haojiang', 'Chaoyang', 'Chaonan', 'Nanao'];
    } else if (city.includes('Zhanjiang')) {
      districts = ['Chikan', 'Xiashan', 'Potou', 'Mazhang', 'Lianjiang', 'Leizhou', 'Wuchuan', 'Suixi', 'Xuwen'];
    } else if (city.includes('Maoming')) {
      districts = ['Maonan', 'Dianbai', 'Gaozhou', 'Huazhou', 'Xinyi'];
    } else if (city.includes('Zhaoqing')) {
      districts = ['Duanzhou', 'Dinghu', 'Gaoyao', 'Sihui', 'Guangning', 'Huaiji', 'Fengkai', 'Deqing'];
    } else if (city.includes('Huizhou')) {
      districts = ['Huicheng', 'Huiyang', 'Boluo', 'Huidong', 'Longmen'];
    } else if (city.includes('Jiangmen')) {
      districts = ['Pengjiang', 'Jianghai', 'Xinhui', 'Taishan', 'Kaiping', 'Heshan', 'Enping'];
    } else if (city.includes('Zhongshan')) {
      districts = ['Shiqi', 'East', 'West', 'Nan', 'Wuguishan', 'Huoju Development Zone', 'Huangpu', 'Nantou', 'Dongfeng', 'Fusha', 'Xiaolan', 'Dongsheng', 'Guzhen', 'Henglan', 'Sanjiao', 'Minzhong', 'Nanlang', 'Gangkou', 'Dayong', 'Shaxi', 'Sanxiang', 'Banfu', 'Shenwan', 'Tanzhou'];
    } else if (city.includes('Shaoguan')) {
      districts = ['Wujiang', 'Zhenjiang', 'Qujiang', 'Lechang', 'Nanxiong', 'Shixing', 'Renhua', 'Wengyuan', 'Ruyuan Yao Autonomous County', 'Xinfeng'];
    } else if (city.includes('Shanwei')) {
      districts = ['Chengqu', 'Haifeng', 'Luhe', 'Lufeng'];
    } else if (city.includes('Heyuan')) {
      districts = ['Yuancheng', 'Zijin', 'Longchuan', 'Lianping', 'Heping', 'Dongyuan'];
    } else if (city.includes('Yangjiang')) {
      districts = ['Jiangcheng', 'Yangdong', 'Yangchun', 'Yangxi'];
    } else if (city.includes('Qingyuan')) {
      districts = ['Qingcheng', 'Qingxin', 'Yingde', 'Lianzhou', 'Fogang', 'Yangshan', 'Lianshan Zhuang-Yao Autonomous County', 'Liannan Yao Autonomous County'];
    } else if (city.includes('Chaozhou')) {
      districts = ['Xiangqiao', 'Chaoan', 'Raoping'];
    } else if (city.includes('Jieyang')) {
      districts = ['Rongcheng', 'Jiedong', 'Puning', 'Jiexi', 'Huilai'];
    } else if (city.includes('Yunfu')) {
      districts = ['Yuncheng', 'Yunan', 'Luoding', 'Xinxing', 'Yunan'];
    } else if (city.includes('Hangzhou')) {
      districts = ['Xihu', 'Gongshu', 'Shangcheng', 'Binjiang', 'Yuhang', 'Xiaoshan', 'Linping', 'Qiantang', 'Fuyang', 'Lingang', 'Tonglu', 'Chunan', 'Jiande'];
    } else if (city.includes('Ningbo')) {
      districts = ['Haishu', 'Jiangbei', 'Beilun', 'Zhenhai', 'Yinzhou', 'Fenghua', 'Yuyao', 'Cixi', 'Xiangshan', 'Ninghai'];
    } else if (city.includes('Wenzhou')) {
      districts = ['Lucheng', 'Longwan', 'Ouhai', 'Dongtou', 'Yongjia', 'Pingyang', 'Cangnan', 'Wencheng', 'Taishun', 'Ruian', 'Yueqing', 'Longgang'];
    } else if (city.includes('Jiaxing')) {
      districts = ['Nanhu', 'Xiuzhou', 'Jiashan', 'Haiyan', 'Haining', 'Pinghu', 'Tongxiang'];
    } else if (city.includes('Huzhou')) {
      districts = ['Wuxing', 'Nanxun', 'Deqing', 'Changxing', 'Anji'];
    } else if (city.includes('Shaoxing')) {
      districts = ['Yuecheng', 'Keqiao', 'Shangyu', 'Xinchang', 'Zhuji', 'Shengzhou'];
    } else if (city.includes('Jinhua')) {
      districts = ['Wucheng', 'Jindong', 'Lanxi', 'Yiwu', 'Dongyang', 'Yongkang', 'Wuyi', 'Pujiang', 'Pan\'an'];
    } else if (city.includes('Quzhou')) {
      districts = ['Kecheng', 'Qujiang', 'Jiangshan', 'Changshan', 'Kaihua', 'Longyou'];
    } else if (city.includes('Zhoushan')) {
      districts = ['Dinghai', 'Putuo', 'Daishan', 'Shengsi'];
    } else if (city.includes('Taizhou')) {
      districts = ['Jiaojiang', 'Huangyan', 'Luqiao', 'Wenling', 'Linhai', 'Yuhuan', 'Sanmen', 'Tiantai', 'Xianju'];
    } else if (city.includes('Lishui')) {
      districts = ['Liandu', 'Longquan', 'Qingtian', 'Jinyun', 'Suichang', 'Songyang', 'Yunhe', 'Qingyuan', 'Jingning She Autonomous County'];
    } else if (city.includes('Chengdu')) {
      districts = ['Jinjiang', 'Wuhou', 'Qingyang', 'Chenghua', 'Jinniu', 'Gaoxin', 'Tianfu New Area', 'Longquanyi', 'Xindu', 'Wenjiang', 'Shuangliu', 'Pidu', 'Qingbaijiang', 'Jintang', 'Xinjin', 'Dayi', 'Pujiang', 'Dujiangyan', 'Pengzhou', 'Qionglai', 'Chongzhou', 'Jianyang'];
    } else if (city.includes('Nanjing')) {
      districts = ['Gulou', 'Xuanwu', 'Qinhuai', 'Jianye', 'Yuhuatai', 'Jiangning', 'Pukou', 'Qixia', 'Luhe', 'Lishui', 'Gaochun'];
    } else if (city.includes('Suzhou')) {
      districts = ['Gusu', 'Huqiu', 'Wuzhong', 'Xiangcheng', 'Wujiang', 'Industrial Park', 'Zhangjiagang', 'Changshu', 'Taicang', 'Kunshan'];
    } else if (city.includes('Wuxi')) {
      districts = ['Liangxi', 'Xishan', 'Huishan', 'Binhu', 'Xinwu', 'Jiangyin', 'Yixing'];
    } else if (city.includes('Changzhou')) {
      districts = ['Tianning', 'Zhonglou', 'Xinbei', 'Wujin', 'Jintan', 'Liyang'];
    } else if (city.includes('Xuzhou')) {
      districts = ['Yunlong', 'Gulou', 'Quanshan', 'Jiawang', 'Tongshan', 'Feng', 'Pei', 'Suining', 'Pizhou', 'Xinyi'];
    } else if (city.includes('Nantong')) {
      districts = ['Chongchuan', 'Gangzha', 'Tongzhou', 'Rudong', 'Qidong', 'Rugao', 'Haimen', 'Haian'];
    } else if (city.includes('Lianyungang')) {
      districts = ['Lianyungang', 'Haizhou', 'Ganyu', 'Donghai', 'Guanyun', 'Guannan'];
    } else if (city.includes('Huaian')) {
      districts = ['Qingjiangpu', 'Huaiyin', 'Huaian', 'Hongze', 'Lianshui', 'Xuyi', 'Jinhu'];
    } else if (city.includes('Yancheng')) {
      districts = ['Tinghu', 'Yandu', 'Dafeng', 'Xiangshui', 'Binhai', 'Funing', 'Sheyang', 'Jianhu', 'Dongtai'];
    } else if (city.includes('Yangzhou')) {
      districts = ['Hanjiang', 'Guangling', 'Jiangdu', 'Baoying', 'Yizheng', 'Gaoyou'];
    } else if (city.includes('Zhenjiang')) {
      districts = ['Jingkou', 'Runzhou', 'Dantu', 'Danyang', 'Yangzhong', 'Jurong'];
    } else if (city.includes('Taizhou')) {
      districts = ['Hailing', 'Gaogang', 'Jiangyan', 'Xinghua', 'Jingjiang', 'Taixing'];
    } else if (city.includes('Suqian')) {
      districts = ['Sucheng', 'Suyu', 'Shuyang', 'Siyang', 'Sihong'];
    } else if (city.includes('Wuhan')) {
      districts = ['Wuchang', 'Jianghan', 'Hongshan', 'Jiangan', 'Hanyang', 'Qiaokou', 'Qingshan', 'Dongxihu', 'Caidian', 'Jiangxia', 'Huangpi', 'Xinzhou', 'Hannan'];
    } else if (city.includes('Chongqing')) {
      districts = ['Yuzhong', 'Jiangbei', 'Nanan', 'Jiulongpo', 'Shapingba', 'Yubei', 'BaNan', 'Beibei', 'Fuling', 'Changshou', 'Jiangjin', 'Hechuan', 'Yongchuan', 'Nanchuan', 'Qijiang', 'Dazu', 'Bishan', 'Tongliang', 'Tongnan', 'Rongchang', 'Kaizhou', 'Liangping', 'Wulong', 'Chengkou', 'Fengdu', 'Dianjiang', 'Zhong', 'Yunyang', 'Fengjie', 'Wushan', 'Wuxi', 'Shizhu Tujia Autonomous County', 'Xiushan Tujia-Miao Autonomous County', 'Youyang Tujia-Miao Autonomous County', 'Pengshui Miao-Tujia Autonomous County'];
    } else if (city.includes('Xian')) {
      districts = ['Yanta', 'Beilin', 'Lianhu', 'XinChengqu', 'Weiyang', 'Baqiao', 'Changan', 'Yanliang', 'Lintong', 'Gaoling', 'Huyi', 'Lantian', 'Zhouzhi'];
    } else if (city.includes('Tianjin')) {
      districts = ['Heping', 'Hexi', 'Nankai', 'Hedong', 'Hebei', 'Hongqiao', 'Dongli', 'Xiqing', 'Jinnan', 'Beichen', 'Wuqing', 'Baodi', 'Binhai New Area', 'Ninghe', 'Jinghai', 'Jizhou'];
    } else if (city.includes('Changsha')) {
      districts = ['Furong', 'Tianxin', 'Yuelu', 'Kaifu', 'Yuhua', 'Wangcheng', 'Changsha', 'Liuyang', 'Ningxiang'];
    } else if (city.includes('Zhengzhou')) {
      districts = ['Jinshui', 'Zhongyuan', 'Erqi', 'Guancheng Hui', 'Huaiji', 'Zhengdong New Area', 'Gaoxin', 'Jingkai District', 'Hangkonggang', 'Zhongmu', 'Gongyi', 'Xingyang', 'Xinmi', 'Xinzheng', 'Dengfeng'];
    } else if (city.includes('Pingdingshan')) {
      districts = ['Xinhua', 'Weidong', 'Zhanhe', 'Shilong', 'Baofeng', 'Ye', 'Lushan', 'Jia', 'Wugang', 'Ruzhou'];
    } else if (city.includes('Qingdao')) {
      districts = ['Shinan', 'Shibei', 'Licang', 'Laoshan', 'Huangdao', 'Chengyang', 'Jimo', 'Jiaozhou', 'Pingdu', 'Laixi'];
    } else if (city.includes('Yantai')) {
      districts = ['Zhifu', 'Fushan', 'Muping', 'Laishan', 'Penglai', 'Longkou', 'Laiyang', 'Laizhou', 'Zhaoyuan', 'Qixia', 'Haiyang'];
    } else if (city.includes('Weifang')) {
      districts = ['Kuiwen', 'Weicheng', 'Hanting', 'Fangzi', 'Qingzhou', 'Zhucheng', 'Shouguang', 'Anqiu', 'Gaomi', 'Changyi', 'Changle', 'Linqu'];
    } else if (city.includes('Linyi')) {
      districts = ['Lanshan', 'Luozhuang', 'Hedong', 'YiNan', 'Tancheng', 'Yishui', 'Cangshan', 'Fei', 'Pingyi', 'JuNan', 'Mengyin', 'Linshu'];
    } else if (city.includes('Zibo')) {
      districts = ['Zhangdian', 'Zichuan', 'Boshan', 'Linzi', 'Zhoucun', 'Huantai', 'Gaoqing', 'Yiyuan'];
    } else if (city.includes('Jining')) {
      districts = ['Rencheng', 'Yanzhou', 'Qufu', 'Zoucheng', 'Weishan', 'Yutai', 'Jinxiang', 'Jiaxiang', 'Wenshang', 'Sishui', 'Liangshan'];
    } else if (city.includes('Taian')) {
      districts = ['Taishan', 'Daiyue', 'Xintai', 'Feicheng', 'Ningyang', 'Dongping'];
    } else if (city.includes('Liaocheng')) {
      districts = ['Dongchangfu', 'Linqing', 'Yanggu', 'Shen', 'Chiping', 'Donge', 'Guan', 'Gaotang'];
    } else if (city.includes('Weihai')) {
      districts = ['Huancui', 'Wendeng', 'Rongcheng', 'Rushan'];
    } else if (city.includes('Zaozhuang')) {
      districts = ['Shizhong', 'Xuecheng', 'Yicheng', 'Taierzhuang', 'Shanting', 'Tengzhou'];
    } else if (city.includes('Dezhou')) {
      districts = ['Decheng', 'Lingcheng', 'Leling', 'Yucheng', 'Ningjin', 'Qingyun', 'Linyi', 'Qihe', 'Pingyuan', 'Xiajin', 'Wucheng'];
    } else if (city.includes('Dongying')) {
      districts = ['Dongying', 'Hekou', 'Kenli', 'Lijin', 'Guangrao'];
    } else if (city.includes('Binzhou')) {
      districts = ['Bincheng', 'Zhanhua', 'Zouping', 'Huimin', 'Yangxin', 'Wudi', 'Boxing'];
    } else if (city.includes('Heze')) {
      districts = ['Mudan', 'Dingtao', 'Cao', 'Shan', 'Chengwu', 'Juye', 'Yuncheng', 'Juancheng', 'Dongming'];
    } else if (city.includes('Rizhao')) {
      districts = ['Donggang', 'Lanshan', 'Wulian', 'Ju'];
    } else if (city.includes('Changsha')) {
      districts = ['Furong', 'Tianxin', 'Yuelu', 'Kaifu', 'Yuhua', 'Wangcheng', 'Changsha', 'Ningxiang', 'Liuyang'];
    } else if (city.includes('Zhuzhou')) {
      districts = ['Tianyuan', 'Hetang', 'Lusong', 'Shifeng', 'Lukou', 'You', 'Chaling', 'Yanling', 'Liling'];
    } else if (city.includes('Xiangtan')) {
      districts = ['Yuhu', 'Yuetang', 'Xiangtan', 'Shaoshan', 'Xiangxiang'];
    } else if (city.includes('Hengyang')) {
      districts = ['Yanfeng', 'Shigu', 'Zhuhui', 'Zhengxiang', 'Nanyue', 'Hengyang', 'Hengnan', 'Hengshan', 'Hengdong', 'Qidong', 'Leiyang', 'Changning'];
    } else if (city.includes('Shaoyang')) {
      districts = ['Shuangqing', 'Daxiang', 'Beita', 'Shaodong', 'Xinshao', 'Shaoyang', 'Longhui', 'Dongkou', 'Suining', 'Xinning', 'Chengbu Miao Autonomous County', 'Wugang'];
    } else if (city.includes('Yueyang')) {
      districts = ['Yueyanglou', 'Yunxi', 'Junshan', 'Yueyang', 'Huarong', 'Xiangyin', 'Pingjiang', 'Miluo', 'Linxiang'];
    } else if (city.includes('Changde')) {
      districts = ['Wuling', 'Dingcheng', 'Anxiang', 'Hanshou', 'Li', 'Linli', 'Taoyuan', 'Shimen', 'Jinshi'];
    } else if (city.includes('Zhangjiajie')) {
      districts = ['Yongding', 'Wulingyuan', 'Cili', 'Sangzhi'];
    } else if (city.includes('Yiyang')) {
      districts = ['Ziyang', 'Heshan', 'Nan', 'Taojiang', 'Anhua', 'Yuanjiang'];
    } else if (city.includes('Chenzhou')) {
      districts = ['Beihu', 'Suxian', 'Guiyang', 'Yizhang', 'Yongxing', 'Jiahe', 'Linwu', 'Rucheng', 'Guidong', 'Anren', 'Zixing'];
    } else if (city.includes('Yongzhou')) {
      districts = ['Lingling', 'Lengshuitan', 'Qiyang', 'Dongan', 'Shuangpai', 'Dao', 'Jiangyong', 'Ningyuan', 'Lanshan', 'Xintian', 'Jianghua Yao Autonomous County'];
    } else if (city.includes('Huaihua')) {
      districts = ['Hecheng', 'Zhongfang', 'Yuanling', 'Chenxi', 'Xupu', 'Huitong', 'Mayang Miao Autonomous County', 'Xinhuang Dong Autonomous County', 'Zhijiang Dong Autonomous County', 'Jingzhou Miao-Dong Autonomous County', 'Tongdao Dong Autonomous County', 'Hongjiang'];
    } else if (city.includes('Loudi')) {
      districts = ['Louxing', 'Shuangfeng', 'Xinhua', 'Lengshuijiang', 'Lianyuan'];
    } else if (city.includes('Xiangxi')) {
      districts = ['Jishou', 'Luxi', 'Fenghuang', 'Huayuan', 'Baojing', 'Guzhang', 'Yongshun', 'Longshan'];
    } else if (city.includes('Chengdu')) {
      districts = ['Jinjiang', 'Qingyang', 'Jinniu', 'Wuhou', 'Chenghua', 'Longquanyi', 'Qingbaijiang', 'Xindu', 'Wenjiang', 'Shuangliu', 'Pidu', 'Xinjin', 'Jintang', 'Dayi', 'Pujiang', 'Dujiangyan', 'Pengzhou', 'Qionglai', 'Chongzhou', 'Jianyang'];
    } else if (city.includes('Guiyang')) {
      districts = ['Nanming', 'Yunyan', 'Huaxi', 'Wudang', 'Baiyun', 'Guanshanhu', 'Kaiyang', 'Xifeng', 'Xiuwen', 'Qingzhen'];
    } else if (city.includes('Kunming')) {
      districts = ['Wuhua', 'Panlong', 'Guandu', 'Xishan', 'Dongchuan', 'Chenggong', 'Jinning', 'Fumin', 'Yiliang', 'Shilin Yi Autonomous County', 'Songming', 'Luquan Yi-Miao Autonomous County', 'Xundian Hui-Yi Autonomous County', 'Anning'];
    } else if (city.includes('Nanning')) {
      districts = ['Qingxiu', 'Xingning', 'Jiangnan', 'Xixiangtang', 'Liangqing', 'Yongning', 'Wuming', 'Longan', 'Mashan', 'Shanglin', 'Binyang', 'Heng'];
    } else if (city.includes('Lhasa')) {
      districts = ['Chengguan', 'Doilungdeqen', 'Dagze', 'Lhunzhub', 'Damxung', 'Nyemo', 'Qüxü', 'Maizhokunggar'];
    } else if (city.includes('Yinchuan')) {
      districts = ['Xingqing', 'Jinfeng', 'Xixia', 'Yongning', 'Helan', 'Lingwu'];
    } else if (city.includes('Xining')) {
      districts = ['Chengzhong', 'Chengdong', 'Chengxi', 'Chengbei', 'Huangzhong', 'Huangyuan', 'Datong Hui-Tu Autonomous County'];
    } else if (city.includes('Lanzhou')) {
      districts = ['Chengguan', 'Qilihe', 'Xigu', 'Anning', 'Honggu', 'Yongdeng', 'Gaolan', 'Yuzhong'];
    } else if (city.includes('Taiyuan')) {
      districts = ['Xiaodian', 'Yingze', 'Xinghualing', 'Jiancaoping', 'Wanbolin', 'Jinyuan', 'Qingxu', 'Yangqu', 'Loulou', 'Gujiao'];
    } else if (city.includes('Shijiazhuang')) {
      districts = ['Changan', 'Qiaoxi', 'Xinhua', 'Yuhua', 'Jingxingkuang', 'Gaocheng', 'Luquan', 'Luancheng', 'Jingxing', 'Zhengding', 'Xingtang', 'Lingshou', 'Gaoyi', 'Shenze', 'Zanhuang', 'Wuji', 'Pingshan', 'Yuanshi', 'Zhao', 'Jinzhou', 'Xinle'];
    } else if (city.includes('Haikou')) {
      districts = ['Xiuying', 'Longhua', 'Qiongshan', 'Meilan'];
    } else if (city.includes('Sanya')) {
      districts = ['Haitang', 'Jiyang', 'Tianya', 'Yazhou'];
    } else if (city.includes('Taiwan')) {
      districts = ['Taipei', 'New Taipei', 'Taoyuan', 'Taichung', 'Tainan', 'Kaohsiung', 'Keelung', 'Hsinchu', 'Chiayi'];
    } else if (city.includes('Hong Kong')) {
      districts = ['Central and Western', 'Wan Chai', 'East', 'Nan', 'Yau Tsim Mong', 'Sham Shui Po', 'Kowloon City', 'Wong Tai Sin', 'Kwun Tong', 'Kwai Tsing', 'Tsuen Wan', 'Tuen Mun', 'Yuen Long', 'Bei', 'Tai Po', 'Sha Tin', 'Sai Kung', 'Islands'];
    } else if (city.includes('Macao')) {
      districts = ['Macau Peninsula', 'Taipa', 'Coloane', 'Cotai'];
    } else {
      districts = ['City Center', 'East New Area', 'West New Area', 'South New Area', 'North New Area', 'Gaoxin', 'Jingkai District'];
    }

    this.setData({
      availableDistricts: districts,
      showDistrictPicker: true
    });
  },

  selectProvince(e) {
    const province = e.currentTarget.dataset.province;
    console.log('Selected province:', province);

    // Close province picker first
    this.setData({
      showProvincePicker: false,
      currentProvince: province
    });

    // Set city list and show city picker directly
    this.showCitiesByProvince(province);
  },

  showCitiesByProvince(province) {
    let cityList = [];
    
    switch (province) {
      case 'Municipalities':
        cityList = ['Beijing', 'Shanghai', 'Tianjin', 'Chongqing'];
        break;
      case 'Guangdong':
        cityList = ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhuhai', 'Shantou', 'Zhanjiang', 'Maoming', 'Zhaoqing', 'Huizhou', 'Jiangmen', 'Yangjiang', 'Qingyuan', 'Shaoguan', 'Jieyang', 'Yunfu', 'Shanwei', 'Chaozhou', 'Heyuan', 'Meizhou', 'Zhongshan'];
        break;
      case 'Jiangsu':
        cityList = ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou', 'Xuzhou', 'Nantong', 'Lianyungang', 'Huaian', 'Yancheng', 'Yangzhou', 'Zhenjiang', 'Taizhou', 'Suqian'];
        break;
      case 'Zhejiang':
        cityList = ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou', 'Shaoxing', 'Jinhua', 'Quzhou', 'Zhoushan', 'Taizhou', 'Lishui'];
        break;
      case 'Shandong':
        cityList = ['Jinan', 'Qingdao', 'Yantai', 'Weifang', 'Linyi', 'Zibo', 'Jining', 'Taian', 'Liaocheng', 'Weihai', 'Zaozhuang', 'Dezhou', 'Dongying', 'Binzhou', 'Heze', 'Rizhao'];
        break;
      case 'Henan':
        cityList = ['Zhengzhou', 'Luoyang', 'Kaifeng', 'Anyang', 'Xinxiang', 'Jiaozuo', 'Xuchang', 'Pingdingshan', 'Luohe', 'Sanmenxia', 'Shangqiu', 'Zhoukou', 'Zhumadian', 'Nanyang', 'Xinyang', 'Puyang', 'Hebi', 'Jiyuan'];
        break;
      case 'Sichuan':
        cityList = ['Chengdu', 'Mianyang', 'Deyang', 'Zigong', 'Luzhou', 'Neijiang', 'Suining', 'Panzhihua', 'Guangyuan', 'Leshan', 'Yibin', 'Nanchong', 'Dazhou', 'Yaan', 'Guangan', 'Bazhong', 'Meishan', 'Ziyang', 'Aba Tibetan-Qiang Autonomous Prefecture', 'Garze Tibetan Autonomous Prefecture', 'Liangshan Yi Autonomous Prefecture'];
        break;
      case 'Hubei':
        cityList = ['Wuhan', 'Yichang', 'Xiangyang', 'Jingzhou', 'Huanggang', 'Xiaogan', 'Shiyan', 'Enshi Tujia-Miao Autonomous Prefecture', 'Ezhou', 'Jingmen', 'Huangshi', 'Xianning', 'Suizhou', 'Tianmen', 'Xiantao', 'Qianjiang', 'Shennongjia Forest District'];
        break;
      case 'Hunan':
        cityList = ['Changsha', 'Zhuzhou', 'Xiangtan', 'Hengyang', 'Shaoyang', 'Yueyang', 'Changde', 'Zhangjiajie', 'Yiyang', 'Chenzhou', 'Yongzhou', 'Huaihua', 'Loudi', 'Xiangxi Tujia-Miao Autonomous Prefecture'];
        break;
      case 'Hebei':
        cityList = ['Shijiazhuang', 'Tangshan', 'Qinhuangdao', 'Handan', 'Xingtai', 'Baoding', 'Zhangjiakou', 'Chengde', 'Cangzhou', 'Langfang', 'Hengshui', 'Xinji', 'Dingzhou'];
        break;
      case 'Fujian':
        cityList = ['Fuzhou', 'Xiamen', 'Quanzhou', 'Zhangzhou', 'Putian', 'Sanming', 'Nanping', 'Longyan', 'Ningde'];
        break;
      case 'Anhui':
        cityList = ['Hefei', 'Wuhu', 'Bengbu', 'Huainan', 'Maanshan', 'Huaibei', 'Tongling', 'Anqing', 'Huangshan', 'Chuzhou', 'Fuyang', 'Suzhou', 'Liuan', 'Bozhou', 'Chizhou', 'Xuancheng'];
        break;
      case 'Shaanxi':
        cityList = ['Xian', 'Tongchuan', 'Baoji', 'Xianyang', 'Weinan', 'Yanan', 'Hanzhong', 'Yulin', 'Ankang', 'Shangluo', 'Hancheng'];
        break;
      case 'Heilongjiang':
        cityList = ['Harbin', 'Qiqihar', 'Mudanjiang', 'Jiamusi', 'Daqing', 'Jixi', 'Shuangyashan', 'Yichun', 'Qitaihe', 'Hegang', 'Heihe', 'Suihua', 'Daxinganling Prefecture'];
        break;
      case 'Jilin':
        cityList = ['Changchun', 'Jilin', 'Siping', 'Liaoyuan', 'Tonghua', 'Baishan', 'Songyuan', 'Baicheng', 'Yanbian Korean Autonomous Prefecture', 'Gongzhuling', 'Meihekou'];
        break;
      case 'Liaoning':
        cityList = ['Shenyang', 'Dalian', 'Anshan', 'Fushun', 'Benxi', 'Dandong', 'Jinzhou', 'Yingkou', 'Fuxin', 'Liaoyang', 'Panjin', 'Tieling', 'Chaoyang', 'Huludao'];
        break;
      case 'Jiangxi':
        cityList = ['Nanchang', 'Jiujiang', 'Jingdezhen', 'Pingxiang', 'Xinyu', 'Yingtan', 'Ganzhou', 'Yichun', 'Shangrao', 'Jian', 'Fuzhou'];
        break;
      case 'Shanxi':
        cityList = ['Taiyuan', 'Datong', 'Yangquan', 'Changzhi', 'Jincheng', 'Shuozhou', 'Jinzhong', 'Yuncheng', 'Xinzhou', 'Linfen', 'Luliang'];
        break;
      case 'Yunnan':
        cityList = ['Kunming', 'Qujing', 'Yuxi', 'Baoshan', 'Zhaotong', 'Lijiang', 'Puer', 'Lincang', 'Chuxiong Yi Autonomous Prefecture', 'Honghe Hani-Yi Autonomous Prefecture', 'Wenshan Zhuang-Miao Autonomous Prefecture', 'Xishuangbanna Dai Autonomous Prefecture', 'Dali Bai Autonomous Prefecture', 'Dehong Dai-Jingpo Autonomous Prefecture', 'Nujiang Lisu Autonomous Prefecture', 'Diqing Tibetan Autonomous Prefecture'];
        break;
      case 'Guizhou':
        cityList = ['Guiyang', 'Liupanshui', 'Zunyi', 'Anshun', 'Bijie', 'Tongren', 'Qianxinan Buyei-Miao Autonomous Prefecture', 'Qiandongnan Miao-Dong Autonomous Prefecture', 'Qiannan Buyei-Miao Autonomous Prefecture'];
        break;
      case 'Guangxi':
        cityList = ['Nanning', 'Liuzhou', 'Guilin', 'Wuzhou', 'Beihai', 'Fangchenggang', 'Qinzhou', 'Guigang', 'Yulin', 'Baise', 'Hezhou', 'Hechi', 'Laibin', 'Chongzuo'];
        break;
      case 'Inner Mongolia':
        cityList = ['Hohhot', 'Baotou', 'Wuhai', 'Chifeng', 'Tongliao', 'Ordos', 'Hulunbuir', 'Bayannur', 'Ulanqab', 'Xinggan League', 'Xilin Gol League', 'Alxa League', 'Manzhouli', 'Erenhot'];
        break;
      case 'Xinjiang':
        cityList = ['Urumqi', 'Karamay', 'Turpan', 'Hami', 'Changji Hui Autonomous Prefecture', 'Bortala Mongol Autonomous Prefecture', 'Bayingolin Mongol Autonomous Prefecture', 'Aksu Prefecture', 'Kizilsu Kirghiz Autonomous Prefecture', 'Kashgar Prefecture', 'Hotan Prefecture', 'Ili Kazakh Autonomous Prefecture', 'Tacheng Prefecture', 'Altay Prefecture', 'Shihezi', 'Aral', 'Tumxuk', 'Wujiaqu', 'Beitun', 'Tiemenguan', 'Shuanghe', 'Kokdala', 'Kunyu', 'Huyanghe'];
        break;
      case 'Ningxia':
        cityList = ['Yinchuan', 'Shizuishan', 'Wuzhong', 'Guyuan', 'Zhongwei', 'Qingtongxia', 'Lingwu'];
        break;
      case 'Gansu':
        cityList = ['Lanzhou', 'Jiayuguan', 'Jinchang', 'Baiyin', 'Tianshui', 'Wuwei', 'Zhangye', 'Pingliang', 'Jiuquan', 'Qingyang', 'Dingxi', 'Longnan', 'Linxia Hui Autonomous Prefecture', 'Gannan Tibetan Autonomous Prefecture'];
        break;
      case 'Qinghai':
        cityList = ['Xining', 'Haidong', 'Haibei Tibetan Autonomous Prefecture', 'Huangnan Tibetan Autonomous Prefecture', 'Hainan Tibetan Autonomous Prefecture', 'Golog Tibetan Autonomous Prefecture', 'Yushu Tibetan Autonomous Prefecture', 'Haixi Mongol-Tibetan Autonomous Prefecture'];
        break;
      case 'Tibet':
        cityList = ['Lhasa', 'Xigaze', 'Qamdo', 'Nyingchi', 'Shannan', 'Nagqu', 'Ngari Prefecture'];
        break;
      case 'Hainan':
        cityList = ['Haikou', 'Sanya', 'Sansha', 'Danzhou', 'Wuzhishan', 'Qionghai', 'Wenchang', 'Wanning', 'Dongfang', 'Dingan', 'Tunchang', 'Chengmai', 'Lingao', 'Baisha Li Autonomous County', 'Changjiang Li Autonomous County', 'Ledong Li Autonomous County', 'Lingshui Li Autonomous County', 'Baoting Li-Miao Autonomous County', 'Qiongzhong Li-Miao Autonomous County'];
        break;
      case 'Taiwan':
        cityList = ['Taipei', 'New Taipei', 'Taoyuan', 'Taichung', 'Tainan', 'Kaohsiung', 'Keelung', 'Hsinchu', 'Chiayi'];
        break;
      case 'Hong Kong':
        cityList = ['Central and Western', 'Wan Chai', 'East', 'Nan', 'Yau Tsim Mong', 'Sham Shui Po', 'Kowloon City', 'Wong Tai Sin', 'Kwun Tong', 'Kwai Tsing', 'Tsuen Wan', 'Tuen Mun', 'Yuen Long', 'Bei', 'Tai Po', 'Sha Tin', 'Sai Kung', 'Islands'];
        break;
      case 'Macao':
        cityList = ['Macau Peninsula', 'Taipa', 'Coloane', 'Cotai'];
        break;
      default:
        cityList = [];
    }
    
    this.setData({
      provinceCities: cityList,
      showCityPicker: true
    });
  },

  selectCity(e) {
    const city = e.currentTarget.dataset.city;
    this.setData({
      currentCity: city,
      showCityPicker: false
    });
    this.setInitialDistrict();
    this.loadAreaData();
  },

  selectDistrict(e) {
    const district = e.currentTarget.dataset.district;
    this.setData({
      currentDistrict: district,
      showDistrictPicker: false
    });
    this.loadAreaData();
  },

  // Load area data
  loadAreaData() {
    const city = this.data.currentCity;
    const district = this.data.currentDistrict;
    
    // Define city base prices
    const cityBasePrices = {
      'Beijing': 5000,
      'Shanghai': 5500,
      'Guangzhou': 4500,
      'Shenzhen': 5800,
      'Hangzhou': 4200,
      'Chengdu': 3200,
      'Nanjing': 3500,
      'Wuhan': 3000,
      'Chongqing': 3200,
      'Xian': 3100,
      'Suzhou': 3800,
      'Tianjin': 3000,
      'Changsha': 2800,
      'Zhengzhou': 2600,
      'Qingdao': 2800,
      'Ningbo': 3500,
      'Dongguan': 3000,
      'Foshan': 2800,
      'Xiamen': 3800,
      'Dalian': 2500,
      'Shenyang': 2200,
      'Changchun': 2000,
      'Harbin': 2000,
      'Jinan': 2500,
      'Hefei': 2400,
      'Fuzhou': 2800,
      'Kunming': 2200,
      'Nanning': 2000,
      'Guiyang': 1800,
      'Taiyuan': 2000,
      'Shijiazhuang': 2200,
      'Lanzhou': 1800,
      'Urumqi': 2000,
      'Lhasa': 2500,
      'Haikou': 2500,
      'Sanya': 3000,
      'Xiangxi Tujia-Miao Autonomous Prefecture': 900
    };
    
    // Get city base price, default 2000
    const basePrice = cityBasePrices[city] || 2000;
    
    // Define district coefficients
    const districtCoefficients = {
      'City Center': 1.2,
      'Chaoyang': 1.1,
      'Haidian': 1.2,
      'Xicheng': 1.3,
      'Dongcheng': 1.3,
      'Fengtai': 0.9,
      'Shijingshan': 0.85,
      'Tongzhou': 0.8,
      'Pudong New Area': 1.2,
      'Huangpu': 1.4,
      'Jingan': 1.3,
      'Xuhui': 1.2,
      'Changning': 1.1,
      'Putuo': 1.0,
      'Hongkou': 1.0,
      'Tianhe': 1.2,
      'Yuexiu': 1.1,
      'Haizhu': 1.0,
      'Liwan': 0.95,
      'Baiyun': 0.85,
      'Panyu': 0.8,
      'Huangpu': 0.9,
      'Nanshan': 1.3,
      'Futian': 1.2,
      'Luohu': 1.1,
      'Baoan': 0.9,
      'Longgang': 0.8,
      'Longhua': 0.85,
      'Yantian': 0.95,
      'Xihu': 1.1,
      'Yuhang': 0.9,
      'Jianggan': 1.0,
      'Shangcheng': 1.1,
      'Xiacheng': 1.0,
      'Binjiang': 1.1,
      'Xiaoshan': 0.85,
      'Jinjiang': 1.1,
      'Wuhou': 1.05,
      'Qingyang': 1.1,
      'Chenghua': 1.0,
      'Jinniu': 1.0,
      'Gaoxin': 1.15,
      'Tianfu New Area': 1.1,
      'Xuanwu': 1.1,
      'Gulou': 1.15,
      'Jianye': 1.1,
      'Qinhuai': 1.05,
      'Yuhuatai': 0.9,
      'Jiangning': 0.85,
      'Pukou': 0.8,
      'Wuchang': 1.1,
      'Jianghan': 1.1,
      'Hongshan': 1.0,
      'Jiangan': 1.05,
      'Hanyang': 0.95,
      'Yuzhong': 1.1,
      'Jiangbei': 1.05,
      'Nanan': 1.0,
      'Jiulongpo': 1.0,
      'Shapingba': 0.95,
      'Yubei': 1.0,
      'BaNan': 0.85,
      'Yanta': 1.05,
      'Beilin': 1.05,
      'Lianhu': 1.0,
      'XinChengqu': 1.0,
      'Weiyang': 0.95,
      'Baqiao': 0.9,
      'Changan': 0.85,
      'Jishou': 1.1,
      'Luxi': 0.95,
      'Fenghuang': 1.0,
      'Huayuan': 0.9,
      'Baojing': 0.85,
      'Guzhang': 0.8,
      'Yongshun': 0.85,
      'Longshan': 0.8
    };
    
    // Get district coefficient, default 1.0
    const districtCoefficient = districtCoefficients[district] || 1.0;
    
    // Calculate final price
    const finalPrice = Math.round(basePrice * districtCoefficient);
    
    // Set area data
    const areaData = {
      avgPrice: finalPrice.toLocaleString(),
      depositRatio: basePrice > 3000 ? 2 : 1,
      civilRatio: basePrice > 4000 ? 60 : basePrice > 2000 ? 70 : 80,
      facilities: basePrice > 4000 ? 200 : basePrice > 2000 ? 150 : 100,
      waterPrice: {
        civil: 3.5,
        commercial: 6.8
      },
      elecPrice: {
        civil: 0.58,
        commercial: 1.15
      }
    };
    
    this.setData({
      areaData: areaData
    });
    
    // Calculate room type prices
    this.calculateRoomTypes(finalPrice);
  },
  
  // Calculate room type prices by base price
  calculateRoomTypes(basePrice) {
    // Calculate price coefficients for different room types
    const roomTypeCoefficients = {
      studio: 0.8,    // 1B1B
      one_bedroom: 0.6, // Single room
      two_bedroom: 1.0,   // 2B1B
      three_bedroom: 1.3  // 3B1B
    };

    // Generate roomTypes data
    const roomTypes = [
      {
        type: 'studio',
        name: '1B1B',
        price: Math.round(basePrice * roomTypeCoefficients.studio).toLocaleString(),
        area: '45-55',
        deposit: '1 month',
        trend: '↑ 3.5%'
      },
      {
        type: 'one_bedroom',
        name: 'Single Room',
        price: Math.round(basePrice * roomTypeCoefficients.one_bedroom).toLocaleString(),
        area: '25-35',
        deposit: '1 month',
        trend: '↑ 2.8%'
      },
      {
        type: 'two_bedroom',
        name: '2B1B',
        price: Math.round(basePrice * roomTypeCoefficients.two_bedroom).toLocaleString(),
        area: '65-75',
        deposit: '2 months',
        trend: '↑ 4.2%'
      },
      {
        type: 'three_bedroom',
        name: '3B1B',
        price: Math.round(basePrice * roomTypeCoefficients.three_bedroom).toLocaleString(),
        area: '85-95',
        deposit: '2 months',
        trend: '↑ 3.9%'
      }
    ];

    this.setData({
      roomTypes: roomTypes
    });
  },

  viewScenario(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/scenario-guide/scenario-guide?type=${type}`
    });
  },

  openPlatform(e) {
    const urlType = e.currentTarget.dataset.url;
    let url = '';
    
    switch (urlType) {
      case 'gov':
        url = 'https://zfzl.cin.gov.cn';
        break;
      case 'brand':
        url = 'https://www.ziroom.com';
        break;
      case 'agency':
        url = 'https://www.5i5j.com';
        break;
      default:
        url = 'https://www.ke.com';
    }
    
    wx.showToast({
      title: 'Redirecting to external platform',
      icon: 'none',
      duration: 1500
    });
    
    setTimeout(() => {
      wx.navigateTo({
        url: `/pages/web-view/web-view?url=${encodeURIComponent(url)}`
      });
    }, 1500);
  }
});