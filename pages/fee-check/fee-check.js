// pages/fee-check/fee-check.js
const apiRequest = require('../../utils/api-request.js')
const { citiesMap, districtsMap } = require('./fee-check-data.js')

Page({
  data: {
    currentTab: 'water',
    provinces: [
      'Select Province',
      'Beijing', 'Shanghai', 'Tianjin', 'Chongqing',
      'Guangdong', 'Jiangsu', 'Zhejiang', 'Sichuan', 'Hubei', 'Hunan', 'Henan', 'Shandong', 'Hebei', 'Shanxi', 'Shaanxi',
      'Liaoning', 'Jilin', 'Heilongjiang', 'Anhui', 'Fujian', 'Jiangxi', 'Yunnan', 'Guizhou', 'Guangxi Zhuang Autonomous Region', 'Hainan',
      'Inner Mongolia Autonomous Region', 'Ningxia Hui Autonomous Region', 'Gansu', 'Qinghai', 'Xinjiang Uygur Autonomous Region', 'Tibet Autonomous Region',
      'Hong Kong Special Administrative Region', 'Macao Special Administrative Region', 'Taiwan Province'
    ],
    provinceIndex: 0,
    cityIndex: 0,
    cities: ['Select City'],
    districts: ['Select District'],
    districtIndex: 0,
    feeTypes: ['Select Type', 'Residential Electric', 'Commercial Electric', 'Residential Water', 'Commercial Water'],
    feeTypeIndex: 0,
    roomTypes: ['Select Room Type', 'Studio', '1BR', '2BR', '3BR'],
    roomTypeIndex: 0,
    landlordPrice: '',
    usage: '',
    roomArea: '',
    landlordRent: '',
    calculator: {
      monthlyRent: '',
      propertyFee: '',
      waterFee: '',
      elecFee: '',
      gasFee: '',
      netFee: '',
      depositMonths: 1
    },
    verifyResult: null,
    rentResult: null,
    totalResult: null,
    resultPeriod: 'month',
    negotiationText: ''
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
  },

  onProvinceChange(e) {
    console.log('onProvinceChange triggered, e.detail.value:', e.detail.value);
    const provinceIndex = parseInt(e.detail.value);
    console.log('Converted provinceIndex:', provinceIndex);

    const originalCities = citiesMap[provinceIndex] || ['Select City'];
    const cities = ['Select City', ...originalCities];

    console.log('Got cities:', cities);

    this.setData({
      provinceIndex,
      cityIndex: 0,
      districtIndex: 0,
      cities: cities,
      districts: ['Select District']
    });

    console.log('Set data:', {
      provinceIndex: this.data.provinceIndex,
      cities: this.data.cities,
      cityIndex: this.data.cityIndex
    });
  },

  updateCities(provinceIndex) {
    const originalCities = citiesMap[provinceIndex] || ['Select City'];
    const cities = ['Select City', ...originalCities];
    this.setData({ cities, districts: ['Select District'] });
  },

  onCityChange(e) {
    console.log('onCityChange triggered, e.detail.value:', e.detail.value);
    const cityIndex = parseInt(e.detail.value);
    const city = this.data.cities[cityIndex];

    console.log('City index:', cityIndex, 'City name:', city);

    this.setData({
      cityIndex,
      districtIndex: 0,
      currentCity: city
    });

    console.log('Set cityIndex:', this.data.cityIndex);

    this.updateDistricts(city);
  },

  updateDistricts(city) {
    const originalDistricts = districtsMap[city] || ['Select District'];
    const districts = ['Select District', ...originalDistricts];
    this.setData({ districts });
  },

  onDistrictChange(e) {
    this.setData({ districtIndex: parseInt(e.detail.value) });
  },

  onFeeTypeChange(e) {
    this.setData({ feeTypeIndex: parseInt(e.detail.value) });
  },

  onRoomTypeChange(e) {
    this.setData({ roomTypeIndex: parseInt(e.detail.value) });
  },

  onPriceInput(e) {
    this.setData({ landlordPrice: e.detail.value });
  },

  onUsageInput(e) {
    this.setData({ usage: e.detail.value });
  },

  onAreaInput(e) {
    this.setData({ roomArea: e.detail.value });
  },

  onRentInput(e) {
    this.setData({ landlordRent: e.detail.value });
  },

  onCalculatorInput(e) {
    const field = e.currentTarget.dataset.field;
    const calculator = this.data.calculator;
    calculator[field] = e.detail.value;
    this.setData({ calculator });
  },

  verifyFee() {
    const { landlordPrice, usage, feeTypeIndex, currentCity } = this.data;

    if (!landlordPrice || !usage) {
      wx.showToast({
        title: 'Please fill in all information',
        icon: 'none'
      });
      return;
    }

    if (currentCity === 'Select City' || feeTypeIndex === 0) {
      wx.showToast({
        title: 'Please select city and type',
        icon: 'none'
      });
      return;
    }

    // Get real utility fee standards by city (unit: CNY)
    // Residential electricity (tiered pricing, first tier)
    const cityResidentialElectricPrices = {
      'Beijing': 0.4883, 'Shanghai': 0.617, 'Tianjin': 0.49, 'Chongqing': 0.52,
      'Guangzhou': 0.68, 'Shenzhen': 0.68, 'Dongguan': 0.68, 'Foshan': 0.68,
      'Zhuhai': 0.68, 'Shantou': 0.68, 'Huizhou': 0.68, 'Zhongshan': 0.68,
      'Jiangmen': 0.68, 'Zhanjiang': 0.68, 'Zhaoqing': 0.68, 'Jieyang': 0.68,
      'Maoming': 0.68, 'Qingyuan': 0.68, 'Shaoguan': 0.68, 'Chaozhou': 0.68,
      'Meizhou': 0.68, 'Shanwei': 0.68, 'Heyuan': 0.68, 'Yangjiang': 0.68,
      'Nanjing': 0.5283, 'Suzhou': 0.5283, 'Wuxi': 0.5283, 'Changzhou': 0.5283,
      'Xuzhou': 0.5283, 'Nantong': 0.5283, 'Lianyungang': 0.5283, 'Huai\'an': 0.5283,
      'Yancheng': 0.5283, 'Yangzhou': 0.5283, 'Zhenjiang': 0.5283, 'Taizhou': 0.5283,
      'Suqian': 0.5283, 'Hangzhou': 0.568, 'Ningbo': 0.5383, 'Wenzhou': 0.568,
      'Jiaxing': 0.568, 'Huzhou': 0.568, 'Shaoxing': 0.568, 'Jinhua': 0.568,
      'Quzhou': 0.568, 'Zhoushan': 0.568, 'Taizhou': 0.568, 'Lishui': 0.568,
      'Chengdu': 0.5224, 'Mianyang': 0.5224, 'Zigong': 0.5224, 'Panzhihua': 0.5224,
      'Luzhou': 0.5224, 'Deyang': 0.5224, 'Guangyuan': 0.5224, 'Suining': 0.5224,
      'Neijiang': 0.5224, 'Leshan': 0.5224, 'Nanchong': 0.5224, 'Meishan': 0.5224,
      'Yibin': 0.5224, 'Guang\'an': 0.5224, 'Dazhou': 0.5224, 'Ya\'an': 0.5224,
      'Bazhong': 0.5224, 'Ziyang': 0.5224, 'Wuhan': 0.5783, 'Yichang': 0.5783,
      'Huangshi': 0.5783, 'Xiangyang': 0.5783, 'Ezhou': 0.5783, 'Jingmen': 0.5783,
      'Xiaogan': 0.5783, 'Jingzhou': 0.5783, 'Huanggang': 0.5783, 'Xianning': 0.5783,
      'Suizhou': 0.5783, 'Enshi': 0.5783, 'Xiantao': 0.5783, 'Qianjiang': 0.5783,
      'Tianmen': 0.5783, 'Changsha': 0.588, 'Zhuzhou': 0.588, 'Xiangtan': 0.588,
      'Hengyang': 0.588, 'Shaoyang': 0.588, 'Yueyang': 0.588, 'Changde': 0.588,
      'Zhangjiajie': 0.588, 'Yiyang': 0.588, 'Chenzhou': 0.588, 'Yongzhou': 0.588,
      'Huaihua': 0.588, 'Loudi': 0.588, 'Xiangxi': 0.588, 'Zhengzhou': 0.56,
      'Luoyang': 0.56, 'Kaifeng': 0.56, 'Pingdingshan': 0.56, 'Anyang': 0.56,
      'Hebi': 0.56, 'Xinxiang': 0.56, 'Jiaozuo': 0.56, 'Puyang': 0.56,
      'Xuchang': 0.56, 'Luohe': 0.56, 'Sanmenxia': 0.56, 'Nanyang': 0.56,
      'Shangqiu': 0.56, 'Xinyang': 0.56, 'Zhoukou': 0.56, 'Zhumadian': 0.56,
      'Jiyuan': 0.56, 'Jinan': 0.5469, 'Qingdao': 0.5469, 'Zibo': 0.5469,
      'Zaozhuang': 0.5469, 'Dongying': 0.5469, 'Yantai': 0.5469, 'Weifang': 0.5469,
      'Jining': 0.5469, 'Tai\'an': 0.5469, 'Weihai': 0.5469, 'Rizhao': 0.5469,
      'Laiwu': 0.5469, 'Linyi': 0.5469, 'Dezhou': 0.5469, 'Liaocheng': 0.5469,
      'Binzhou': 0.5469, 'Heze': 0.5469, 'Shijiazhuang': 0.52, 'Baoding': 0.52,
      'Tangshan': 0.52, 'Qinhuangdao': 0.52, 'Handan': 0.52, 'Xingtai': 0.52,
      'Zhangjiakou': 0.52, 'Chengde': 0.52, 'Cangzhou': 0.52, 'Langfang': 0.52,
      'Hengshui': 0.52, 'Taiyuan': 0.477, 'Datong': 0.477, 'Yangquan': 0.477,
      'Changzhi': 0.477, 'Jincheng': 0.477, 'Shuozhou': 0.477, 'Jinzhong': 0.477,
      'Yuncheng': 0.477, 'Xinzhou': 0.477, 'Linfen': 0.477, 'Lvliang': 0.477,
      'Xi\'an': 0.4983, 'Xianyang': 0.4983, 'Tongchuan': 0.4983, 'Baoji': 0.4983,
      'Weinan': 0.4983, 'Yan\'an': 0.4983, 'Hanzhong': 0.4983, 'Yulin': 0.4983,
      'Ankang': 0.4983, 'Shangluo': 0.4983, 'Shenyang': 0.5, 'Dalian': 0.5,
      'Anshan': 0.5, 'Fushun': 0.5, 'Benxi': 0.5, 'Dandong': 0.5,
      'Jinzhou': 0.5, 'Yingkou': 0.5, 'Fuxin': 0.5, 'Liaoyang': 0.5,
      'Panjin': 0.5, 'Tieling': 0.5, 'Chaoyang': 0.5, 'Huludao': 0.5,
      'Changchun': 0.525, 'Jilin': 0.525, 'Siping': 0.525, 'Liaoyuan': 0.525,
      'Tonghua': 0.525, 'Baishan': 0.525, 'Songyuan': 0.525, 'Baicheng': 0.525,
      'Yanbian': 0.525, 'Harbin': 0.51, 'Qiqihar': 0.51, 'Jixi': 0.51,
      'Hegang': 0.51, 'Shuangyashan': 0.51, 'Daqing': 0.51, 'Yichun': 0.51,
      'Jiamusi': 0.51, 'Qitaihe': 0.51, 'Mudanjiang': 0.51, 'Heihe': 0.51,
      'Suihua': 0.51, 'Daxing\'anling': 0.51, 'Hefei': 0.5653, 'Wuhu': 0.5653,
      'Bengbu': 0.5653, 'Huainan': 0.5653, 'Ma\'anshan': 0.5653, 'Huaibei': 0.5653,
      'Tongling': 0.5653, 'Anqing': 0.5653, 'Huangshan': 0.5653, 'Chuzhou': 0.5653,
      'Fuyang': 0.5653, 'Suzhou': 0.5653, 'Liu\'an': 0.5653, 'Bozhou': 0.5653,
      'Chizhou': 0.5653, 'Xuancheng': 0.5653, 'Fuzhou': 0.4983, 'Xiamen': 0.5333,
      'Putian': 0.4983, 'Sanming': 0.4983, 'Quanzhou': 0.4983, 'Zhangzhou': 0.4983,
      'Nanping': 0.4983, 'Longyan': 0.4983, 'Ningde': 0.4983, 'Nanchang': 0.6,
      'Jingdezhen': 0.6, 'Pingxiang': 0.6, 'Jiujiang': 0.6, 'Xinyu': 0.6,
      'Yingtan': 0.6, 'Ganzhou': 0.6, 'Ji\'an': 0.6, 'Yichun': 0.6,
      'Fuzhou': 0.6, 'Shangrao': 0.6, 'Kunming': 0.51, 'Qujing': 0.51,
      'Yuxi': 0.51, 'Baoshan': 0.51, 'Zhaotong': 0.51, 'Lijiang': 0.51,
      'Pu\'er': 0.51, 'Lincang': 0.51, 'Chuxiong': 0.51, 'Honghe': 0.51,
      'Wenshan': 0.51, 'Xishuangbanna': 0.51, 'Dali': 0.51, 'Dehong': 0.51,
      'Nujiang': 0.51, 'Diqing': 0.51, 'Guiyang': 0.4556, 'Zunyi': 0.4556,
      'Liupanshui': 0.4556, 'Anshun': 0.4556, 'Bijie': 0.4556, 'Tongren': 0.4556,
      'Nanning': 0.5283, 'Liuzhou': 0.5283, 'Guilin': 0.5283, 'Wuzhou': 0.5283,
      'Beihai': 0.5283, 'Fangchenggang': 0.5283, 'Qinzhou': 0.5283, 'Guigang': 0.5283,
      'Yulin': 0.5283, 'Baise': 0.5283, 'Hezhou': 0.5283, 'Hechi': 0.5283,
      'Laibin': 0.5283, 'Chongzuo': 0.5283, 'Haikou': 0.6083, 'Sanya': 0.6083,
      'Sansha': 0.6083, 'Danzhou': 0.6083, 'Hohhot': 0.415, 'Baotou': 0.415,
      'Wuhai': 0.415, 'Chifeng': 0.415, 'Tongliao': 0.415, 'Ordos': 0.415,
      'Hulunbuir': 0.415, 'Bayan Nur': 0.415, 'Ulanqab': 0.415,
      'Xing\'an': 0.415, 'Xilingol': 0.415, 'Alxa': 0.415, 'Yinchuan': 0.4486,
      'Shizuishan': 0.4486, 'Wuzhong': 0.4486, 'Guyuan': 0.4486, 'Zhongwei': 0.4486,
      'Lanzhou': 0.515, 'Jiayuguan': 0.515, 'Jinchang': 0.515, 'Baiyin': 0.515,
      'Tianshui': 0.515, 'Wuwei': 0.515, 'Zhangye': 0.515, 'Pingliang': 0.515,
      'Jiuquan': 0.515, 'Qingyang': 0.515, 'Dingxi': 0.515, 'Longnan': 0.515,
      'Linxia': 0.515, 'Gannan': 0.515, 'Xining': 0.3974, 'Haidong': 0.3974,
      'Haibei': 0.3974, 'Huangnan': 0.3974, 'Hainan': 0.3974, 'Golog': 0.3974,
      'Yushu': 0.3974, 'Haixi': 0.3974, 'Urumqi': 0.39, 'Karamay': 0.39,
      'Turpan': 0.39, 'Hami': 0.39, 'Changji': 0.39, 'Bortala': 0.39,
      'Bayingolin': 0.39, 'Aksu': 0.39, 'Kizilsu': 0.39, 'Kashgar': 0.39,
      'Hotan': 0.39, 'Ili': 0.39, 'Tacheng': 0.39, 'Altay': 0.39,
      'Shihezi': 0.39, 'Aral': 0.39, 'Tumxuk': 0.39, 'Wujiaqu': 0.39,
      'Lhasa': 0.49, 'Shigatse': 0.49, 'Chamdo': 0.49, 'Nyingchi': 0.49,
      'Shannan': 0.49, 'Nagqu': 0.49, 'Ngari': 0.49, 'Hong Kong': 0.95,
      'Macau': 0.95, 'Taipei': 0.45, 'Kaohsiung': 0.45, 'Taichung': 0.45,
      'Tainan': 0.45, 'Taoyuan': 0.45, 'New Taipei': 0.45, 'Keelung': 0.45,
      'Hsinchu': 0.45, 'Chiayi': 0.45
    };

    // Commercial electricity (uniformly higher)
    const cityCommercialElectricPrices = {
      'Beijing': 0.9, 'Shanghai': 1.0, 'Tianjin': 0.8, 'Chongqing': 0.8,
      'Guangzhou': 0.95, 'Shenzhen': 0.95, 'Dongguan': 0.95, 'Foshan': 0.95,
      'Zhuhai': 0.95, 'Shantou': 0.95, 'Huizhou': 0.95, 'Zhongshan': 0.95,
      'Jiangmen': 0.95, 'Zhanjiang': 0.95, 'Zhaoqing': 0.95, 'Jieyang': 0.95,
      'Maoming': 0.95, 'Qingyuan': 0.95, 'Shaoguan': 0.95, 'Chaozhou': 0.95,
      'Meizhou': 0.95, 'Shanwei': 0.95, 'Heyuan': 0.95, 'Yangjiang': 0.95,
      'Nanjing': 0.85, 'Suzhou': 0.85, 'Wuxi': 0.85, 'Changzhou': 0.85,
      'Xuzhou': 0.85, 'Nantong': 0.85, 'Lianyungang': 0.85, 'Huai\'an': 0.85,
      'Yancheng': 0.85, 'Yangzhou': 0.85, 'Zhenjiang': 0.85, 'Taizhou': 0.85,
      'Suqian': 0.85, 'Hangzhou': 0.9, 'Ningbo': 0.88, 'Wenzhou': 0.9,
      'Jiaxing': 0.9, 'Huzhou': 0.9, 'Shaoxing': 0.9, 'Jinhua': 0.9,
      'Quzhou': 0.9, 'Zhoushan': 0.9, 'Taizhou': 0.9, 'Lishui': 0.9,
      'Chengdu': 0.85, 'Mianyang': 0.85, 'Zigong': 0.85, 'Panzhihua': 0.85,
      'Luzhou': 0.85, 'Deyang': 0.85, 'Guangyuan': 0.85, 'Suining': 0.85,
      'Neijiang': 0.85, 'Leshan': 0.85, 'Nanchong': 0.85, 'Meishan': 0.85,
      'Yibin': 0.85, 'Guang\'an': 0.85, 'Dazhou': 0.85, 'Ya\'an': 0.85,
      'Bazhong': 0.85, 'Ziyang': 0.85, 'Wuhan': 0.88, 'Yichang': 0.88,
      'Huangshi': 0.88, 'Xiangyang': 0.88, 'Ezhou': 0.88, 'Jingmen': 0.88,
      'Xiaogan': 0.88, 'Jingzhou': 0.88, 'Huanggang': 0.88, 'Xianning': 0.88,
      'Suizhou': 0.88, 'Enshi': 0.88, 'Xiantao': 0.88, 'Qianjiang': 0.88,
      'Tianmen': 0.88, 'Changsha': 0.9, 'Zhuzhou': 0.9, 'Xiangtan': 0.9,
      'Hengyang': 0.9, 'Shaoyang': 0.9, 'Yueyang': 0.9, 'Changde': 0.9,
      'Zhangjiajie': 0.9, 'Yiyang': 0.9, 'Chenzhou': 0.9, 'Yongzhou': 0.9,
      'Huaihua': 0.9, 'Loudi': 0.9, 'Xiangxi': 0.9, 'Zhengzhou': 0.88,
      'Luoyang': 0.88, 'Kaifeng': 0.88, 'Pingdingshan': 0.88, 'Anyang': 0.88,
      'Hebi': 0.88, 'Xinxiang': 0.88, 'Jiaozuo': 0.88, 'Puyang': 0.88,
      'Xuchang': 0.88, 'Luohe': 0.88, 'Sanmenxia': 0.88, 'Nanyang': 0.88,
      'Shangqiu': 0.88, 'Xinyang': 0.88, 'Zhoukou': 0.88, 'Zhumadian': 0.88,
      'Jiyuan': 0.88, 'Jinan': 0.85, 'Qingdao': 0.85, 'Zibo': 0.85,
      'Zaozhuang': 0.85, 'Dongying': 0.85, 'Yantai': 0.85, 'Weifang': 0.85,
      'Jining': 0.85, 'Tai\'an': 0.85, 'Weihai': 0.85, 'Rizhao': 0.85,
      'Laiwu': 0.85, 'Linyi': 0.85, 'Dezhou': 0.85, 'Liaocheng': 0.85,
      'Binzhou': 0.85, 'Heze': 0.85, 'Shijiazhuang': 0.85, 'Baoding': 0.85,
      'Tangshan': 0.85, 'Qinhuangdao': 0.85, 'Handan': 0.85, 'Xingtai': 0.85,
      'Zhangjiakou': 0.85, 'Chengde': 0.85, 'Cangzhou': 0.85, 'Langfang': 0.85,
      'Hengshui': 0.85, 'Taiyuan': 0.8, 'Datong': 0.8, 'Yangquan': 0.8,
      'Changzhi': 0.8, 'Jincheng': 0.8, 'Shuozhou': 0.8, 'Jinzhong': 0.8,
      'Yuncheng': 0.8, 'Xinzhou': 0.8, 'Linfen': 0.8, 'Lvliang': 0.8,
      'Xi\'an': 0.85, 'Xianyang': 0.85, 'Tongchuan': 0.85, 'Baoji': 0.85,
      'Weinan': 0.85, 'Yan\'an': 0.85, 'Hanzhong': 0.85, 'Yulin': 0.85,
      'Ankang': 0.85, 'Shangluo': 0.85, 'Shenyang': 0.8, 'Dalian': 0.85,
      'Anshan': 0.8, 'Fushun': 0.8, 'Benxi': 0.8, 'Dandong': 0.8,
      'Jinzhou': 0.8, 'Yingkou': 0.8, 'Fuxin': 0.8, 'Liaoyang': 0.8,
      'Panjin': 0.8, 'Tieling': 0.8, 'Chaoyang': 0.8, 'Huludao': 0.8,
      'Changchun': 0.8, 'Jilin': 0.8, 'Siping': 0.8, 'Liaoyuan': 0.8,
      'Tonghua': 0.8, 'Baishan': 0.8, 'Songyuan': 0.8, 'Baicheng': 0.8,
      'Yanbian': 0.8, 'Harbin': 0.8, 'Qiqihar': 0.8, 'Jixi': 0.8,
      'Hegang': 0.8, 'Shuangyashan': 0.8, 'Daqing': 0.8, 'Yichun': 0.8,
      'Jiamusi': 0.8, 'Qitaihe': 0.8, 'Mudanjiang': 0.8, 'Heihe': 0.8,
      'Suihua': 0.8, 'Daxing\'anling': 0.8, 'Hefei': 0.88, 'Wuhu': 0.88,
      'Bengbu': 0.88, 'Huainan': 0.88, 'Ma\'anshan': 0.88, 'Huaibei': 0.88,
      'Tongling': 0.88, 'Anqing': 0.88, 'Huangshan': 0.88, 'Chuzhou': 0.88,
      'Fuyang': 0.88, 'Suzhou': 0.88, 'Liu\'an': 0.88, 'Bozhou': 0.88,
      'Chizhou': 0.88, 'Xuancheng': 0.88, 'Fuzhou': 0.85, 'Xiamen': 0.9,
      'Putian': 0.85, 'Sanming': 0.85, 'Quanzhou': 0.85, 'Zhangzhou': 0.85,
      'Nanping': 0.85, 'Longyan': 0.85, 'Ningde': 0.85, 'Nanchang': 0.88,
      'Jingdezhen': 0.88, 'Pingxiang': 0.88, 'Jiujiang': 0.88, 'Xinyu': 0.88,
      'Yingtan': 0.88, 'Ganzhou': 0.88, 'Ji\'an': 0.88, 'Yichun': 0.88,
      'Fuzhou': 0.88, 'Shangrao': 0.88, 'Kunming': 0.85, 'Qujing': 0.85,
      'Yuxi': 0.85, 'Baoshan': 0.85, 'Zhaotong': 0.85, 'Lijiang': 0.85,
      'Pu\'er': 0.85, 'Lincang': 0.85, 'Chuxiong': 0.85, 'Honghe': 0.85,
      'Wenshan': 0.85, 'Xishuangbanna': 0.85, 'Dali': 0.85, 'Dehong': 0.85,
      'Nujiang': 0.85, 'Diqing': 0.85, 'Guiyang': 0.8, 'Zunyi': 0.8,
      'Liupanshui': 0.8, 'Anshun': 0.8, 'Bijie': 0.8, 'Tongren': 0.8,
      'Nanning': 0.85, 'Liuzhou': 0.85, 'Guilin': 0.85, 'Wuzhou': 0.85,
      'Beihai': 0.85, 'Fangchenggang': 0.85, 'Qinzhou': 0.85, 'Guigang': 0.85,
      'Yulin': 0.85, 'Baise': 0.85, 'Hezhou': 0.85, 'Hechi': 0.85,
      'Laibin': 0.85, 'Chongzuo': 0.85, 'Haikou': 0.9, 'Sanya': 0.9,
      'Sansha': 0.9, 'Danzhou': 0.9, 'Hohhot': 0.8, 'Baotou': 0.8,
      'Wuhai': 0.8, 'Chifeng': 0.8, 'Tongliao': 0.8, 'Ordos': 0.8,
      'Hulunbuir': 0.8, 'Bayan Nur': 0.8, 'Ulanqab': 0.8,
      'Xing\'an': 0.8, 'Xilingol': 0.8, 'Alxa': 0.8, 'Yinchuan': 0.8,
      'Shizuishan': 0.8, 'Wuzhong': 0.8, 'Guyuan': 0.8, 'Zhongwei': 0.8,
      'Lanzhou': 0.85, 'Jiayuguan': 0.85, 'Jinchang': 0.85, 'Baiyin': 0.85,
      'Tianshui': 0.85, 'Wuwei': 0.85, 'Zhangye': 0.85, 'Pingliang': 0.85,
      'Jiuquan': 0.85, 'Qingyang': 0.85, 'Dingxi': 0.85, 'Longnan': 0.85,
      'Linxia': 0.85, 'Gannan': 0.85, 'Xining': 0.75, 'Haidong': 0.75,
      'Haibei': 0.75, 'Huangnan': 0.75, 'Hainan': 0.75, 'Golog': 0.75,
      'Yushu': 0.75, 'Haixi': 0.75, 'Urumqi': 0.7, 'Karamay': 0.7,
      'Turpan': 0.7, 'Hami': 0.7, 'Changji': 0.7, 'Bortala': 0.7,
      'Bayingolin': 0.7, 'Aksu': 0.7, 'Kizilsu': 0.7, 'Kashgar': 0.7,
      'Hotan': 0.7, 'Ili': 0.7, 'Tacheng': 0.7, 'Altay': 0.7,
      'Shihezi': 0.7, 'Aral': 0.7, 'Tumxuk': 0.7, 'Wujiaqu': 0.7,
      'Lhasa': 0.85, 'Shigatse': 0.85, 'Chamdo': 0.85, 'Nyingchi': 0.85,
      'Shannan': 0.85, 'Nagqu': 0.85, 'Ngari': 0.85, 'Hong Kong': 1.2,
      'Macau': 1.2, 'Taipei': 0.85, 'Kaohsiung': 0.85, 'Taichung': 0.85,
      'Tainan': 0.85, 'Taoyuan': 0.85, 'New Taipei': 0.85, 'Keelung': 0.85,
      'Hsinchu': 0.85, 'Chiayi': 0.85
    };

    // Residential water (CNY/m³)
    const cityWaterPrices = {
      'Beijing': 5.0, 'Shanghai': 3.45, 'Tianjin': 4.9, 'Chongqing': 3.5,
      'Guangzhou': 2.83, 'Shenzhen': 2.67, 'Dongguan': 2.88, 'Foshan': 2.88,
      'Zhuhai': 2.88, 'Shantou': 2.83, 'Huizhou': 2.88, 'Zhongshan': 2.88,
      'Jiangmen': 2.88, 'Zhanjiang': 2.83, 'Zhaoqing': 2.88, 'Jieyang': 2.83,
      'Maoming': 2.83, 'Qingyuan': 2.83, 'Shaoguan': 2.83, 'Chaozhou': 2.83,
      'Meizhou': 2.83, 'Shanwei': 2.83, 'Heyuan': 2.83, 'Yangjiang': 2.83,
      'Nanjing': 3.04, 'Suzhou': 4.57, 'Wuxi': 4.57, 'Changzhou': 4.57,
      'Xuzhou': 4.57, 'Nantong': 4.57, 'Lianyungang': 4.57, 'Huai\'an': 4.57,
      'Yancheng': 4.57, 'Yangzhou': 4.57, 'Zhenjiang': 4.57, 'Taizhou': 4.57,
      'Suqian': 4.57, 'Hangzhou': 3.8, 'Ningbo': 4.35, 'Wenzhou': 3.8,
      'Jiaxing': 3.8, 'Huzhou': 3.8, 'Shaoxing': 3.8, 'Jinhua': 3.8,
      'Quzhou': 3.8, 'Zhoushan': 3.8, 'Taizhou': 3.8, 'Lishui': 3.8,
      'Chengdu': 3.13, 'Mianyang': 3.13, 'Zigong': 3.13, 'Panzhihua': 3.13,
      'Luzhou': 3.13, 'Deyang': 3.13, 'Guangyuan': 3.13, 'Suining': 3.13,
      'Neijiang': 3.13, 'Leshan': 3.13, 'Nanchong': 3.13, 'Meishan': 3.13,
      'Yibin': 3.13, 'Guang\'an': 3.13, 'Dazhou': 3.13, 'Ya\'an': 3.13,
      'Bazhong': 3.13, 'Ziyang': 3.13, 'Wuhan': 2.47, 'Yichang': 2.47,
      'Huangshi': 2.47, 'Xiangyang': 2.47, 'Ezhou': 2.47, 'Jingmen': 2.47,
      'Xiaogan': 2.47, 'Jingzhou': 2.47, 'Huanggang': 2.47, 'Xianning': 2.47,
      'Suizhou': 2.47, 'Enshi': 2.47, 'Xiantao': 2.47, 'Qianjiang': 2.47,
      'Tianmen': 2.47, 'Changsha': 3.2, 'Zhuzhou': 3.2, 'Xiangtan': 3.2,
      'Hengyang': 3.2, 'Shaoyang': 3.2, 'Yueyang': 3.2, 'Changde': 3.2,
      'Zhangjiajie': 3.2, 'Yiyang': 3.2, 'Chenzhou': 3.2, 'Yongzhou': 3.2,
      'Huaihua': 3.2, 'Loudi': 3.2, 'Xiangxi': 3.2, 'Zhengzhou': 4.4,
      'Luoyang': 4.4, 'Kaifeng': 4.4, 'Pingdingshan': 3.9, 'Anyang': 4.4,
      'Hebi': 4.4, 'Xinxiang': 4.4, 'Jiaozuo': 4.4, 'Puyang': 4.4,
      'Xuchang': 4.4, 'Luohe': 4.4, 'Sanmenxia': 4.4, 'Nanyang': 4.4,
      'Shangqiu': 4.4, 'Xinyang': 4.4, 'Zhoukou': 4.4, 'Zhumadian': 4.4,
      'Jiyuan': 4.4, 'Jinan': 4.2, 'Qingdao': 4.4, 'Zibo': 4.2,
      'Zaozhuang': 4.2, 'Dongying': 4.2, 'Yantai': 4.2, 'Weifang': 4.2,
      'Jining': 4.2, 'Tai\'an': 4.2, 'Weihai': 4.2, 'Rizhao': 4.2,
      'Laiwu': 4.2, 'Linyi': 4.2, 'Dezhou': 4.2, 'Liaocheng': 4.2,
      'Binzhou': 4.2, 'Heze': 4.2, 'Shijiazhuang': 4.63, 'Baoding': 4.63,
      'Tangshan': 4.63, 'Qinhuangdao': 4.63, 'Handan': 4.63, 'Xingtai': 4.63,
      'Zhangjiakou': 4.63, 'Chengde': 4.63, 'Cangzhou': 4.63, 'Langfang': 4.63,
      'Hengshui': 4.63, 'Taiyuan': 4.2, 'Datong': 4.2, 'Yangquan': 4.2,
      'Changzhi': 4.2, 'Jincheng': 4.2, 'Shuozhou': 4.2, 'Jinzhong': 4.2,
      'Yuncheng': 4.2, 'Xinzhou': 4.2, 'Linfen': 4.2, 'Lvliang': 4.2,
      'Xi\'an': 3.8, 'Xianyang': 3.8, 'Tongchuan': 3.8, 'Baoji': 3.8,
      'Weinan': 3.8, 'Yan\'an': 3.8, 'Hanzhong': 3.8, 'Yulin': 3.8,
      'Ankang': 3.8, 'Shangluo': 3.8, 'Shenyang': 3.4, 'Dalian': 4.6,
      'Anshan': 3.4, 'Fushun': 3.4, 'Benxi': 3.4, 'Dandong': 3.4,
      'Jinzhou': 3.4, 'Yingkou': 3.4, 'Fuxin': 3.4, 'Liaoyang': 3.4,
      'Panjin': 3.4, 'Tieling': 3.4, 'Chaoyang': 3.4, 'Huludao': 3.4,
      'Changchun': 4.0, 'Jilin': 4.0, 'Siping': 4.0, 'Liaoyuan': 4.0,
      'Tonghua': 4.0, 'Baishan': 4.0, 'Songyuan': 4.0, 'Baicheng': 4.0,
      'Yanbian': 4.0, 'Harbin': 3.6, 'Qiqihar': 3.6, 'Jixi': 3.6,
      'Hegang': 3.6, 'Shuangyashan': 3.6, 'Daqing': 3.6, 'Yichun': 3.6,
      'Jiamusi': 3.6, 'Qitaihe': 3.6, 'Mudanjiang': 3.6, 'Heihe': 3.6,
      'Suihua': 3.6, 'Daxing\'anling': 3.6, 'Hefei': 3.4, 'Wuhu': 3.4,
      'Bengbu': 3.4, 'Huainan': 3.4, 'Ma\'anshan': 3.4, 'Huaibei': 3.4,
      'Tongling': 3.4, 'Anqing': 3.4, 'Huangshan': 3.4, 'Chuzhou': 3.4,
      'Fuyang': 3.4, 'Suzhou': 3.4, 'Liu\'an': 3.4, 'Bozhou': 3.4,
      'Chizhou': 3.4, 'Xuancheng': 3.4, 'Fuzhou': 3.23, 'Xiamen': 3.4,
      'Putian': 3.23, 'Sanming': 3.23, 'Quanzhou': 3.23, 'Zhangzhou': 3.23,
      'Nanping': 3.23, 'Longyan': 3.23, 'Ningde': 3.23, 'Nanchang': 2.68,
      'Jingdezhen': 2.68, 'Pingxiang': 2.68, 'Jiujiang': 2.68, 'Xinyu': 2.68,
      'Yingtan': 2.68, 'Ganzhou': 2.68, 'Ji\'an': 2.68, 'Yichun': 2.68,
      'Fuzhou': 2.68, 'Shangrao': 2.68, 'Kunming': 4.2, 'Qujing': 4.2,
      'Yuxi': 4.2, 'Baoshan': 4.2, 'Zhaotong': 4.2, 'Lijiang': 4.2,
      'Pu\'er': 4.2, 'Lincang': 4.2, 'Chuxiong': 4.2, 'Honghe': 4.2,
      'Wenshan': 4.2, 'Xishuangbanna': 4.2, 'Dali': 4.2, 'Dehong': 4.2,
      'Nujiang': 4.2, 'Diqing': 4.2, 'Guiyang': 3.3, 'Zunyi': 3.3,
      'Liupanshui': 3.3, 'Anshun': 3.3, 'Bijie': 3.3, 'Tongren': 3.3,
      'Nanning': 2.98, 'Liuzhou': 2.98, 'Guilin': 2.98, 'Wuzhou': 2.98,
      'Beihai': 2.98, 'Fangchenggang': 2.98, 'Qinzhou': 2.98, 'Guigang': 2.98,
      'Yulin': 2.98, 'Baise': 2.98, 'Hezhou': 2.98, 'Hechi': 2.98,
      'Laibin': 2.98, 'Chongzuo': 2.98, 'Haikou': 3.3, 'Sanya': 3.3,
      'Sansha': 3.3, 'Danzhou': 3.3, 'Hohhot': 4.2, 'Baotou': 4.2,
      'Wuhai': 4.2, 'Chifeng': 4.2, 'Tongliao': 4.2, 'Ordos': 4.2,
      'Hulunbuir': 4.2, 'Bayan Nur': 4.2, 'Ulanqab': 4.2,
      'Xing\'an': 4.2, 'Xilingol': 4.2, 'Alxa': 4.2, 'Yinchuan': 4.3,
      'Shizuishan': 4.3, 'Wuzhong': 4.3, 'Guyuan': 4.3, 'Zhongwei': 4.3,
      'Lanzhou': 4.68, 'Jiayuguan': 4.68, 'Jinchang': 4.68, 'Baiyin': 4.68,
      'Tianshui': 4.68, 'Wuwei': 4.68, 'Zhangye': 4.68, 'Pingliang': 4.68,
      'Jiuquan': 4.68, 'Qingyang': 4.68, 'Dingxi': 4.68, 'Longnan': 4.68,
      'Linxia': 4.68, 'Gannan': 4.68, 'Xining': 3.45, 'Haidong': 3.45,
      'Haibei': 3.45, 'Huangnan': 3.45, 'Hainan': 3.45, 'Golog': 3.45,
      'Yushu': 3.45, 'Haixi': 3.45, 'Urumqi': 2.79, 'Karamay': 2.79,
      'Turpan': 2.79, 'Hami': 2.79, 'Changji': 2.79, 'Bortala': 2.79,
      'Bayingolin': 2.79, 'Aksu': 2.79, 'Kizilsu': 2.79, 'Kashgar': 2.79,
      'Hotan': 2.79, 'Ili': 2.79, 'Tacheng': 2.79, 'Altay': 2.79,
      'Shihezi': 2.79, 'Aral': 2.79, 'Tumxuk': 2.79, 'Wujiaqu': 2.79,
      'Lhasa': 1.8, 'Shigatse': 1.8, 'Chamdo': 1.8, 'Nyingchi': 1.8,
      'Shannan': 1.8, 'Nagqu': 1.8, 'Ngari': 1.8, 'Hong Kong': 5.0,
      'Macau': 5.0, 'Taipei': 11.0, 'Kaohsiung': 11.0, 'Taichung': 11.0,
      'Tainan': 11.0, 'Taoyuan': 11.0, 'New Taipei': 11.0, 'Keelung': 11.0,
      'Hsinchu': 11.0, 'Chiayi': 11.0
    };

    // Commercial water (CNY/m³)
    const cityCommercialWaterPrices = {
      'Beijing': 9.5, 'Shanghai': 6.8, 'Tianjin': 8.5, 'Chongqing': 6.5,
      'Guangzhou': 5.5, 'Shenzhen': 5.2, 'Dongguan': 5.5, 'Foshan': 5.5,
      'Zhuhai': 5.5, 'Shantou': 5.5, 'Huizhou': 5.5, 'Zhongshan': 5.5,
      'Jiangmen': 5.5, 'Zhanjiang': 5.5, 'Zhaoqing': 5.5, 'Jieyang': 5.5,
      'Maoming': 5.5, 'Qingyuan': 5.5, 'Shaoguan': 5.5, 'Chaozhou': 5.5,
      'Meizhou': 5.5, 'Shanwei': 5.5, 'Heyuan': 5.5, 'Yangjiang': 5.5,
      'Nanjing': 5.8, 'Suzhou': 8.5, 'Wuxi': 8.5, 'Changzhou': 8.5,
      'Xuzhou': 8.5, 'Nantong': 8.5, 'Lianyungang': 8.5, 'Huai\'an': 8.5,
      'Yancheng': 8.5, 'Yangzhou': 8.5, 'Zhenjiang': 8.5, 'Taizhou': 8.5,
      'Suqian': 8.5, 'Hangzhou': 7.2, 'Ningbo': 8.0, 'Wenzhou': 7.2,
      'Jiaxing': 7.2, 'Huzhou': 7.2, 'Shaoxing': 7.2, 'Jinhua': 7.2,
      'Quzhou': 7.2, 'Zhoushan': 7.2, 'Taizhou': 7.2, 'Lishui': 7.2,
      'Chengdu': 5.8, 'Mianyang': 5.8, 'Zigong': 5.8, 'Panzhihua': 5.8,
      'Luzhou': 5.8, 'Deyang': 5.8, 'Guangyuan': 5.8, 'Suining': 5.8,
      'Neijiang': 5.8, 'Leshan': 5.8, 'Nanchong': 5.8, 'Meishan': 5.8,
      'Yibin': 5.8, 'Guang\'an': 5.8, 'Dazhou': 5.8, 'Ya\'an': 5.8,
      'Bazhong': 5.8, 'Ziyang': 5.8, 'Wuhan': 5.0, 'Yichang': 5.0,
      'Huangshi': 5.0, 'Xiangyang': 5.0, 'Ezhou': 5.0, 'Jingmen': 5.0,
      'Xiaogan': 5.0, 'Jingzhou': 5.0, 'Huanggang': 5.0, 'Xianning': 5.0,
      'Suizhou': 5.0, 'Enshi': 5.0, 'Xiantao': 5.0, 'Qianjiang': 5.0,
      'Tianmen': 5.0, 'Changsha': 6.0, 'Zhuzhou': 6.0, 'Xiangtan': 6.0,
      'Hengyang': 6.0, 'Shaoyang': 6.0, 'Yueyang': 6.0, 'Changde': 6.0,
      'Zhangjiajie': 6.0, 'Yiyang': 6.0, 'Chenzhou': 6.0, 'Yongzhou': 6.0,
      'Huaihua': 6.0, 'Loudi': 6.0, 'Xiangxi': 6.0, 'Zhengzhou': 7.8,
      'Luoyang': 7.8, 'Kaifeng': 7.8, 'Pingdingshan': 7.0, 'Anyang': 7.8,
      'Hebi': 7.8, 'Xinxiang': 7.8, 'Jiaozuo': 7.8, 'Puyang': 7.8,
      'Xuchang': 7.8, 'Luohe': 7.8, 'Sanmenxia': 7.8, 'Nanyang': 7.8,
      'Shangqiu': 7.8, 'Xinyang': 7.8, 'Zhoukou': 7.8, 'Zhumadian': 7.8,
      'Jiyuan': 7.8, 'Jinan': 7.5, 'Qingdao': 8.0, 'Zibo': 7.5,
      'Zaozhuang': 7.5, 'Dongying': 7.5, 'Yantai': 7.5, 'Weifang': 7.5,
      'Jining': 7.5, 'Tai\'an': 7.5, 'Weihai': 7.5, 'Rizhao': 7.5,
      'Laiwu': 7.5, 'Linyi': 7.5, 'Dezhou': 7.5, 'Liaocheng': 7.5,
      'Binzhou': 7.5, 'Heze': 7.5, 'Shijiazhuang': 8.5, 'Baoding': 8.5,
      'Tangshan': 8.5, 'Qinhuangdao': 8.5, 'Handan': 8.5, 'Xingtai': 8.5,
      'Zhangjiakou': 8.5, 'Chengde': 8.5, 'Cangzhou': 8.5, 'Langfang': 8.5,
      'Hengshui': 8.5, 'Taiyuan': 7.8, 'Datong': 7.8, 'Yangquan': 7.8,
      'Changzhi': 7.8, 'Jincheng': 7.8, 'Shuozhou': 7.8, 'Jinzhong': 7.8,
      'Yuncheng': 7.8, 'Xinzhou': 7.8, 'Linfen': 7.8, 'Lvliang': 7.8,
      'Xi\'an': 7.0, 'Xianyang': 7.0, 'Tongchuan': 7.0, 'Baoji': 7.0,
      'Weinan': 7.0, 'Yan\'an': 7.0, 'Hanzhong': 7.0, 'Yulin': 7.0,
      'Ankang': 7.0, 'Shangluo': 7.0, 'Shenyang': 6.5, 'Dalian': 8.5,
      'Anshan': 6.5, 'Fushun': 6.5, 'Benxi': 6.5, 'Dandong': 6.5,
      'Jinzhou': 6.5, 'Yingkou': 6.5, 'Fuxin': 6.5, 'Liaoyang': 6.5,
      'Panjin': 6.5, 'Tieling': 6.5, 'Chaoyang': 6.5, 'Huludao': 6.5,
      'Changchun': 7.5, 'Jilin': 7.5, 'Siping': 7.5, 'Liaoyuan': 7.5,
      'Tonghua': 7.5, 'Baishan': 7.5, 'Songyuan': 7.5, 'Baicheng': 7.5,
      'Yanbian': 7.5, 'Harbin': 6.8, 'Qiqihar': 6.8, 'Jixi': 6.8,
      'Hegang': 6.8, 'Shuangyashan': 6.8, 'Daqing': 6.8, 'Yichun': 6.8,
      'Jiamusi': 6.8, 'Qitaihe': 6.8, 'Mudanjiang': 6.8, 'Heihe': 6.8,
      'Suihua': 6.8, 'Daxing\'anling': 6.8, 'Hefei': 6.5, 'Wuhu': 6.5,
      'Bengbu': 6.5, 'Huainan': 6.5, 'Ma\'anshan': 6.5, 'Huaibei': 6.5,
      'Tongling': 6.5, 'Anqing': 6.5, 'Huangshan': 6.5, 'Chuzhou': 6.5,
      'Fuyang': 6.5, 'Suzhou': 6.5, 'Liu\'an': 6.5, 'Bozhou': 6.5,
      'Chizhou': 6.5, 'Xuancheng': 6.5, 'Fuzhou': 6.2, 'Xiamen': 6.5,
      'Putian': 6.2, 'Sanming': 6.2, 'Quanzhou': 6.2, 'Zhangzhou': 6.2,
      'Nanping': 6.2, 'Longyan': 6.2, 'Ningde': 6.2, 'Nanchang': 5.5,
      'Jingdezhen': 5.5, 'Pingxiang': 5.5, 'Jiujiang': 5.5, 'Xinyu': 5.5,
      'Yingtan': 5.5, 'Ganzhou': 5.5, 'Ji\'an': 5.5, 'Yichun': 5.5,
      'Fuzhou': 5.5, 'Shangrao': 5.5, 'Kunming': 7.5, 'Qujing': 7.5,
      'Yuxi': 7.5, 'Baoshan': 7.5, 'Zhaotong': 7.5, 'Lijiang': 7.5,
      'Pu\'er': 7.5, 'Lincang': 7.5, 'Chuxiong': 7.5, 'Honghe': 7.5,
      'Wenshan': 7.5, 'Xishuangbanna': 7.5, 'Dali': 7.5, 'Dehong': 7.5,
      'Nujiang': 7.5, 'Diqing': 7.5, 'Guiyang': 6.2, 'Zunyi': 6.2,
      'Liupanshui': 6.2, 'Anshun': 6.2, 'Bijie': 6.2, 'Tongren': 6.2,
      'Nanning': 5.8, 'Liuzhou': 5.8, 'Guilin': 5.8, 'Wuzhou': 5.8,
      'Beihai': 5.8, 'Fangchenggang': 5.8, 'Qinzhou': 5.8, 'Guigang': 5.8,
      'Yulin': 5.8, 'Baise': 5.8, 'Hezhou': 5.8, 'Hechi': 5.8,
      'Laibin': 5.8, 'Chongzuo': 5.8, 'Haikou': 6.5, 'Sanya': 6.5,
      'Sansha': 6.5, 'Danzhou': 6.5, 'Hohhot': 7.8, 'Baotou': 7.8,
      'Wuhai': 7.8, 'Chifeng': 7.8, 'Tongliao': 7.8, 'Ordos': 7.8,
      'Hulunbuir': 7.8, 'Bayan Nur': 7.8, 'Ulanqab': 7.8,
      'Xing\'an': 7.8, 'Xilingol': 7.8, 'Alxa': 7.8, 'Yinchuan': 7.5,
      'Shizuishan': 7.5, 'Wuzhong': 7.5, 'Guyuan': 7.5, 'Zhongwei': 7.5,
      'Lanzhou': 8.5, 'Jiayuguan': 8.5, 'Jinchang': 8.5, 'Baiyin': 8.5,
      'Tianshui': 8.5, 'Wuwei': 8.5, 'Zhangye': 8.5, 'Pingliang': 8.5,
      'Jiuquan': 8.5, 'Qingyang': 8.5, 'Dingxi': 8.5, 'Longnan': 8.5,
      'Linxia': 8.5, 'Gannan': 8.5, 'Xining': 6.8, 'Haidong': 6.8,
      'Haibei': 6.8, 'Huangnan': 6.8, 'Hainan': 6.8, 'Golog': 6.8,
      'Yushu': 6.8, 'Haixi': 6.8, 'Urumqi': 5.5, 'Karamay': 5.5,
      'Turpan': 5.5, 'Hami': 5.5, 'Changji': 5.5, 'Bortala': 5.5,
      'Bayingolin': 5.5, 'Aksu': 5.5, 'Kizilsu': 5.5, 'Kashgar': 5.5,
      'Hotan': 5.5, 'Ili': 5.5, 'Tacheng': 5.5, 'Altay': 5.5,
      'Shihezi': 5.5, 'Aral': 5.5, 'Tumxuk': 5.5, 'Wujiaqu': 5.5,
      'Lhasa': 4.0, 'Shigatse': 4.0, 'Chamdo': 4.0, 'Nyingchi': 4.0,
      'Shannan': 4.0, 'Nagqu': 4.0, 'Ngari': 4.0, 'Hong Kong': 9.0,
      'Macau': 9.0, 'Taipei': 16.0, 'Kaohsiung': 16.0, 'Taichung': 16.0,
      'Tainan': 16.0, 'Taoyuan': 16.0, 'New Taipei': 16.0, 'Keelung': 16.0,
      'Hsinchu': 16.0, 'Chiayi': 16.0
    };

    // Get price for this city and type, use default if not set
    let officialPrice;
    const cityKey = currentCity || 'Zhengzhou';
    if (feeTypeIndex === 1) { // Residential electricity
      officialPrice = cityResidentialElectricPrices[cityKey] || 0.56;
    } else if (feeTypeIndex === 2) { // Commercial electricity
      officialPrice = cityCommercialElectricPrices[cityKey] || 0.88;
    } else if (feeTypeIndex === 3) { // Residential water
      officialPrice = cityWaterPrices[cityKey] || 4.0;
    } else { // Commercial water
      officialPrice = cityCommercialWaterPrices[cityKey] || 7.0;
    }

    const landlordPriceNum = parseFloat(landlordPrice);
    const usageNum = parseFloat(usage);

    const isOverpriced = landlordPriceNum > officialPrice;
    const overPricePercent = isOverpriced ? ((landlordPriceNum - officialPrice) / officialPrice * 100).toFixed(2) : 0;
    const monthlyFee = (landlordPriceNum * usageNum * 30).toFixed(2);
    const yearDiff = isOverpriced ? ((landlordPriceNum - officialPrice) * usageNum * 365).toFixed(2) : 0;

    const feeUnit = feeTypeIndex <= 2 ? 'CNY/kWh' : 'CNY/m³';
    const negotiationText = `Hello, according to the official standard for ${this.data.feeTypes[feeTypeIndex]} in ${currentCity}, the price is ${officialPrice}${feeUnit}. Your quoted ${landlordPrice}${feeUnit} exceeds the official standard by ${overPricePercent}%, which means an additional ${yearDiff} CNY per year. I hope you can charge according to the official standard.`;

    this.setData({
      verifyResult: {
        isOverpriced,
        officialPrice,
        landlordPrice: landlordPriceNum,
        overPricePercent,
        monthlyFee,
        yearDiff,
        feeUnit
      },
      negotiationText
    });
  },

  async verifyRent() {
    const { roomArea, landlordRent, roomTypeIndex, districtIndex, currentCity, districts, provinces, provinceIndex, cities, cityIndex } = this.data;

    console.log('verifyRent check:', {
      provinceIndex,
      cityIndex,
      districtIndex,
      roomTypeIndex,
      roomArea,
      landlordRent,
      cities: cities,
      currentCity
    });

    // Check required fields
    if (!roomArea || !landlordRent) {
      wx.showToast({
        title: 'Please fill in all information',
        icon: 'none'
      });
      return;
    }

    if (provinceIndex === 0 || cityIndex === 0) {
      console.log('Province or city not selected');
      wx.showToast({
        title: 'Please select province and city',
        icon: 'none'
      });
      return;
    }

    if (districtIndex === 0) {
      wx.showToast({
        title: 'Please select district',
        icon: 'none'
      });
      return;
    }

    if (roomTypeIndex === 0) {
      wx.showToast({
        title: 'Please select room type',
        icon: 'none'
      });
      return;
    }

    const selectedCity = cities[cityIndex];
    const selectedDistrict = districts[districtIndex];
    const selectedRoomType = ['Studio', '1BR', '2BR', '3BR'][roomTypeIndex];
    const areaNum = parseFloat(roomArea);
    const landlordRentNum = parseFloat(landlordRent);

    // Show loading prompt
    wx.showLoading({
      title: 'Searching prices...',
      mask: true
    });

    try {
      // Call API to get real-time rent data
      const apiData = await apiRequest.getRentPrice(selectedCity, selectedDistrict, selectedRoomType, areaNum);
      
      let basePrice = 80; // Default value
      let apiPrice = null;

      if (apiData && apiData.avgPrice) {
        // Use API returned price
        apiPrice = parseFloat(apiData.avgPrice);
        basePrice = apiPrice / areaNum; // Calculate unit price
      } else {
        // API call failed, use backup data
        const cityBasePrices = {
          'Beijing': 65, 'Shanghai': 70, 'Guangzhou': 52, 'Shenzhen': 62,
          'Hangzhou': 48, 'Nanjing': 42, 'Wuhan': 38, 'Chengdu': 35,
          'Chongqing': 30, 'Xi\'an': 38, 'Suzhou': 48, 'Tianjin': 38,
          'Qingdao': 38, 'Dalian': 40, 'Xiamen': 52, 'Fuzhou': 38,
          'Changsha': 42, 'Zhengzhou': 18, 'Pingdingshan': 14, 'Shenyang': 25, 'Harbin': 22,
          'Jinan': 32, 'Hefei': 28, 'Nanchang': 26, 'Nanning': 26,
          'Kunming': 28, 'Guiyang': 24, 'Shijiazhuang': 24, 'Taiyuan': 26,
          'Changchun': 22, 'Ningbo': 45, 'Zhuhai': 45, 'Foshan': 32,
          'Dongguan': 40, 'Zhongshan': 32, 'Huizhou': 28
        };
        basePrice = cityBasePrices[selectedCity] || 80;
      }

      // Adjust multiplier by room type (consider room count and comfort)
      const roomTypeMultipliers = [1.0, 1.1, 1.2, 1.35]; // Studio, 1BR, 2BR, 3BR
      const typeMultiplier = roomTypeMultipliers[roomTypeIndex - 1] || 1.0;
      
      // Adjust multiplier by district (core 1.1, normal 1.0, suburb 0.85)
      let districtMultiplier = 1.0;
      if (selectedDistrict.includes('Chaoyang') || selectedDistrict.includes('Haidian') || 
          selectedDistrict.includes('Pudong') || selectedDistrict.includes('Huangpu') ||
          selectedDistrict.includes('Tianhe') || selectedDistrict.includes('Nanshan') ||
          selectedDistrict.includes('Xihu') || selectedDistrict.includes('Gulou') ||
          selectedDistrict.includes('Jinshui') || selectedDistrict.includes('Zhongyuan') ||
          selectedDistrict.includes('Zhengdong') || selectedDistrict.includes('Gaoxin')) {
        districtMultiplier = 1.1;
      } else if (selectedDistrict.includes('New') || selectedDistrict.includes('Jiaoqu') ||
                 selectedDistrict.includes('Bao\'an') || selectedDistrict.includes('Longgang') ||
                 selectedDistrict.includes('Panyu') || selectedDistrict.includes('Baiyun')) {
        districtMultiplier = 0.85;
      }

      // Area correction: smaller area has higher unit price, larger area lower
      let areaMultiplier = 1.0;
      if (areaNum < 50) {
        areaMultiplier = 1.1; // Small apartment premium
      } else if (areaNum > 100) {
        areaMultiplier = 0.95; // Large apartment slightly lower
      }

      const avgPrice = Math.round(basePrice * typeMultiplier * districtMultiplier * areaMultiplier * areaNum);
      const deviation = ((landlordRentNum - avgPrice) / avgPrice * 100).toFixed(1);
      const isOverpriced = parseFloat(deviation) > 10; // Over 10% is considered overpriced
      const minPrice = Math.round(avgPrice * 0.8);
      const maxPrice = Math.round(avgPrice * 1.2);
      const position = Math.min(100, Math.max(0, Math.round((landlordRentNum / maxPrice) * 100)));

      let analysis = '';
      if (position < 50) {
        analysis = 'Current price is lower than community average, good value. Recommended to sign quickly.';
      } else if (position < 80) {
        analysis = 'Current price is within reasonable range, normal market price.';
      } else {
        analysis = 'Current price is higher than community average. Recommended to negotiate or find other options.';
      }

      // If API data was used, add data source note
      if (apiPrice) {
        analysis += ' (Data source: Real-time API)';
      }

      this.setData({
        rentResult: {
          isOverpriced,
          avgPrice,
          landlordPrice: landlordRentNum,
          deviation,
          minPrice,
          maxPrice,
          position,
          analysis,
          dataSource: apiPrice ? 'API Real-time Data' : 'Local Data'
        }
      });

      wx.hideLoading();
    } catch (error) {
      console.error('Failed to fetch price data:', error);
      wx.hideLoading();
      
      // API call failed, use backup data
      const cityBasePrices = {
        'Beijing': 65, 'Shanghai': 70, 'Guangzhou': 52, 'Shenzhen': 62,
        'Hangzhou': 48, 'Nanjing': 42, 'Wuhan': 38, 'Chengdu': 35,
        'Chongqing': 30, 'Xi\'an': 38, 'Suzhou': 48, 'Tianjin': 38,
        'Qingdao': 38, 'Dalian': 40, 'Xiamen': 52, 'Fuzhou': 38,
        'Changsha': 42, 'Zhengzhou': 18, 'Pingdingshan': 14, 'Shenyang': 25, 'Harbin': 22,
        'Jinan': 32, 'Hefei': 28, 'Nanchang': 26, 'Nanning': 26,
        'Kunming': 28, 'Guiyang': 24, 'Shijiazhuang': 24, 'Taiyuan': 26,
        'Changchun': 22, 'Ningbo': 45, 'Zhuhai': 45, 'Foshan': 32,
        'Dongguan': 40, 'Zhongshan': 32, 'Huizhou': 28
      };

      const basePrice = cityBasePrices[selectedCity] || 80;
      const areaNum = parseFloat(roomArea);
      const landlordRentNum = parseFloat(landlordRent);
      
      const roomTypeMultipliers = [1.0, 1.1, 1.2, 1.35];
      const typeMultiplier = roomTypeMultipliers[roomTypeIndex - 1] || 1.0;
      
      let districtMultiplier = 1.0;
      if (selectedDistrict.includes('Chaoyang') || selectedDistrict.includes('Haidian') || 
          selectedDistrict.includes('Pudong') || selectedDistrict.includes('Huangpu') ||
          selectedDistrict.includes('Tianhe') || selectedDistrict.includes('Nanshan') ||
          selectedDistrict.includes('Xihu') || selectedDistrict.includes('Gulou') ||
          selectedDistrict.includes('Jinshui') || selectedDistrict.includes('Zhongyuan') ||
          selectedDistrict.includes('Zhengdong') || selectedDistrict.includes('Gaoxin')) {
        districtMultiplier = 1.1;
      } else if (selectedDistrict.includes('New') || selectedDistrict.includes('Jiaoqu') ||
                 selectedDistrict.includes('Bao\'an') || selectedDistrict.includes('Longgang') ||
                 selectedDistrict.includes('Panyu') || selectedDistrict.includes('Baiyun')) {
        districtMultiplier = 0.85;
      }

      let areaMultiplier = 1.0;
      if (areaNum < 50) {
        areaMultiplier = 1.1;
      } else if (areaNum > 100) {
        areaMultiplier = 0.95;
      }

      const avgPrice = Math.round(basePrice * typeMultiplier * districtMultiplier * areaMultiplier * areaNum);
      const deviation = ((landlordRentNum - avgPrice) / avgPrice * 100).toFixed(1);
      const isOverpriced = parseFloat(deviation) > 10;
      const minPrice = Math.round(avgPrice * 0.8);
      const maxPrice = Math.round(avgPrice * 1.2);
      const position = Math.min(100, Math.max(0, Math.round((landlordRentNum / maxPrice) * 100)));

      let analysis = '';
      if (position < 50) {
        analysis = 'Current price is lower than community average, good value. Recommended to sign quickly.';
      } else if (position < 80) {
        analysis = 'Current price is within reasonable range, normal market price.';
      } else {
        analysis = 'Current price is higher than community average. Recommended to negotiate or find other options.';
      }

      this.setData({
        rentResult: {
          isOverpriced,
          avgPrice,
          landlordPrice: landlordRentNum,
          deviation,
          minPrice,
          maxPrice,
          position,
          analysis,
          dataSource: 'Local Data'
        }
      });

      wx.hideLoading();
    }
  },

  onLoad(options) {
    console.log('fee-check onLoad starting');

    // Default select "Select Province" and "Select City"
    const initialProvinceIndex = 0;
    const originalCities = citiesMap[initialProvinceIndex] || [];
    const initialCities = ['Select City', ...originalCities];

    this.setData({
      provinceIndex: initialProvinceIndex,
      cityIndex: 0,
      districtIndex: 0,
      cities: initialCities,
      currentCity: initialCities[0]
    });

    // Check if there is saved location info
    const savedLocation = wx.getStorageSync('savedLocation');
    if (savedLocation && savedLocation.province && savedLocation.city) {
      console.log('Using saved location:', savedLocation);
      this.setLocationByAddress(savedLocation.province, savedLocation.city);
    }
  },

  autoLocateCity() {
    console.log('Starting auto location');

    // Use chooseLocation to let user select location
    wx.chooseLocation({
      success: (res) => {
        console.log('Location selected:', res);

        const address = res.address || '';
        const name = res.name || '';

        console.log('Full address:', address);

        const locationInfo = this.parseAddress(address + ' ' + name);

        if (locationInfo.province && locationInfo.city) {
          wx.setStorageSync('savedLocation', locationInfo);

          this.setLocationByAddress(locationInfo.province, locationInfo.city);

          wx.showToast({
            title: `Located in ${locationInfo.city}`,
            icon: 'success',
            duration: 1500
          });
        }
      },
      fail: (err) => {
        console.log('Location selection failed:', err);
      }
    });
  },

  parseAddress(addressStr) {
    let province = '';
    let city = '';

    // Check municipalities first
    if (addressStr.includes('Beijing')) {
      return { province: 'Beijing', city: 'Beijing' };
    } else if (addressStr.includes('Shanghai')) {
      return { province: 'Shanghai', city: 'Shanghai' };
    } else if (addressStr.includes('Tianjin')) {
      return { province: 'Tianjin', city: 'Tianjin' };
    } else if (addressStr.includes('Chongqing')) {
      return { province: 'Chongqing', city: 'Chongqing' };
    }

    // Province list (simplified, common provinces only)
    const provincePatterns = [
      { name: 'Guangdong', pattern: /Guangdong/ },
      { name: 'Jiangsu', pattern: /Jiangsu/ },
      { name: 'Zhejiang', pattern: /Zhejiang/ },
      { name: 'Sichuan', pattern: /Sichuan/ },
      { name: 'Hubei', pattern: /Hubei/ },
      { name: 'Hunan', pattern: /Hunan/ },
      { name: 'Henan', pattern: /Henan/ },
      { name: 'Shandong', pattern: /Shandong/ },
      { name: 'Hebei', pattern: /Hebei/ },
      { name: 'Shanxi', pattern: /Shanxi/ },
      { name: 'Shaanxi', pattern: /Shaanxi/ },
      { name: 'Liaoning', pattern: /Liaoning/ },
      { name: 'Jilin', pattern: /Jilin/ },
      { name: 'Heilongjiang', pattern: /Heilongjiang/ },
      { name: 'Anhui', pattern: /Anhui/ },
      { name: 'Fujian', pattern: /Fujian/ },
      { name: 'Jiangxi', pattern: /Jiangxi/ },
      { name: 'Yunnan', pattern: /Yunnan/ },
      { name: 'Guizhou', pattern: /Guizhou/ },
      { name: 'Guangxi', pattern: /Guangxi/ },
      { name: 'Hainan', pattern: /Hainan/ },
      { name: 'Inner Mongolia', pattern: /Inner Mongolia/ },
      { name: 'Ningxia', pattern: /Ningxia/ },
      { name: 'Gansu', pattern: /Gansu/ },
      { name: 'Qinghai', pattern: /Qinghai/ },
      { name: 'Xinjiang', pattern: /Xinjiang/ },
      { name: 'Tibet', pattern: /Tibet/ }
    ];

    // Match province
    for (const prov of provincePatterns) {
      const match = addressStr.match(prov.pattern);
      if (match) {
        province = prov.name;
        break;
      }
    }

    // If no province matched, try to infer from city name
    if (!province) {
      const commonCities = [
        'Guangzhou', 'Shenzhen', 'Nanjing', 'Hangzhou', 'Wuhan', 'Chengdu',
        'Xi\'an', 'Zhengzhou', 'Changsha', 'Qingdao', 'Shenyang', 'Dalian',
        'Xiamen', 'Fuzhou', 'Nanchang', 'Nanning', 'Haikou', 'Kunming',
        'Guiyang', 'Taiyuan', 'Changchun', 'Harbin', 'Hefei', 'Jinan'
      ];

      for (const cityName of commonCities) {
        if (addressStr.includes(cityName)) {
          // Infer province from city
          const cityToProvince = {
            'Guangzhou': 'Guangdong', 'Shenzhen': 'Guangdong',
            'Nanjing': 'Jiangsu', 'Suzhou': 'Jiangsu', 'Wuxi': 'Jiangsu',
            'Hangzhou': 'Zhejiang', 'Ningbo': 'Zhejiang',
            'Wuhan': 'Hubei',
            'Chengdu': 'Sichuan',
            'Xi\'an': 'Shaanxi',
            'Zhengzhou': 'Henan',
            'Changsha': 'Hunan',
            'Qingdao': 'Shandong', 'Jinan': 'Shandong',
            'Shenyang': 'Liaoning', 'Dalian': 'Liaoning',
            'Xiamen': 'Fujian', 'Fuzhou': 'Fujian',
            'Nanchang': 'Jiangxi',
            'Nanning': 'Guangxi',
            'Haikou': 'Hainan',
            'Kunming': 'Yunnan',
            'Guiyang': 'Guizhou',
            'Taiyuan': 'Shanxi',
            'Changchun': 'Jilin',
            'Harbin': 'Heilongjiang',
            'Hefei': 'Anhui',
            'Shijiazhuang': 'Hebei'
          };

          if (cityToProvince[cityName]) {
            province = cityToProvince[cityName];
            city = cityName;
            break;
          }
        }
      }
    }

    return { province, city: city || '' };
  },

  chooseUserLocation() {
    wx.chooseLocation({
      success: (res) => {
        // res.address contains full address, res.name is location name
        // Extract province and city from address
        const address = res.address;

        // Simple address parsing, match province and city from address string
        let province = '';
        let city = '';

        // Check municipalities
        if (address.includes('Beijing')) {
          province = 'Beijing';
          city = 'Beijing';
        } else if (address.includes('Shanghai')) {
          province = 'Shanghai';
          city = 'Shanghai';
        } else if (address.includes('Tianjin')) {
          province = 'Tianjin';
          city = 'Tianjin';
        } else if (address.includes('Chongqing')) {
          province = 'Chongqing';
          city = 'Chongqing';
        } else {
          // Regular province, try to extract province and city
          const provinceMatch = address.match(/(Beijing|Shanghai|Tianjin|Chongqing|Guangdong|Jiangsu|Zhejiang|Sichuan|Hubei|Hunan|Henan|Shandong|Hebei|Shanxi|Shaanxi|Liaoning|Jilin|Heilongjiang|Anhui|Fujian|Jiangxi|Yunnan|Guizhou|Guangxi|Hainan|Inner Mongolia|Ningxia|Gansu|Qinghai|Xinjiang|Tibet|Hong Kong|Macao|Taiwan)/);
          if (provinceMatch) {
            province = provinceMatch[0];
          }

          // Try to extract city (usually after province)
          const cityMatch = address.match(/(City|Autonomous Region|Province)\s*([^City]+City)/);
          if (cityMatch) {
            city = cityMatch[2];
          }
        }

        if (province && city) {
          this.setLocationByAddress(province, city);
          wx.showToast({
            title: `Located in ${city}`,
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: 'Location failed, please select manually',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: 'Selection cancelled, using default city',
          icon: 'none'
        });
      }
    });
  },

  setDefaultLocation() {
    // Default to Beijing
    this.setLocationByIndex(1, 0);
  },

  setLocationByAddress(province, city) {
    // Find corresponding index by province name
    const provinces = this.data.provinces;
    let provinceIndex = 1; // Default to Beijing

    for (let i = 1; i < provinces.length; i++) {
      if (provinces[i] === province || provinces[i].includes(province)) {
        provinceIndex = i;
        break;
      }
    }

    // Update city list (auto prepend "Select City")
    this.updateCities(provinceIndex);

    // Find city index (first element is "Select City", so add 1)
    const originalCities = citiesMap[provinceIndex] || [];
    let cityIndex = 0; // Default to "Select City"

    for (let i = 0; i < originalCities.length; i++) {
      if (originalCities[i] === city || originalCities[i].includes(city)) {
        cityIndex = i + 1; // Add 1 because first element is "Select City"
        break;
      }
    }

    this.setData({
      provinceIndex,
      cityIndex,
      districtIndex: 0,
      currentCity: city
    });

    // Update district list
    this.updateDistricts(city);
  },

  setLocationByIndex(provinceIndex, cityIndex) {
    this.updateCities(provinceIndex);
    const cities = this.data.cities;
    this.setData({
      provinceIndex,
      cityIndex,
      districtIndex: 0,
      currentCity: cities[cityIndex]
    });
    this.updateDistricts(cities[cityIndex]);
  },

  loadSavedLocation() {
    // Disable auto-restore, let user select manually
  },

  onShow() {
    // On page show, do not auto-reset selectors, preserve user selection
  },

  calculateTotal() {
    const calculator = this.data.calculator;
    const { monthlyRent, propertyFee, waterFee, elecFee, gasFee, netFee, depositMonths } = calculator;

    if (!monthlyRent) {
      wx.showToast({
        title: 'Please enter monthly rent',
        icon: 'none'
      });
      return;
    }

    const monthlyRentNum = parseFloat(monthlyRent) || 0;
    const propertyFeeNum = parseFloat(propertyFee) || 0;
    const waterFeeNum = parseFloat(waterFee) || 0;
    const elecFeeNum = parseFloat(elecFee) || 0;
    const gasFeeNum = parseFloat(gasFee) || 0;
    const netFeeNum = parseFloat(netFee) || 0;
    const depositMonthsNum = parseInt(depositMonths) || 0;

    const monthlyTotal = monthlyRentNum + propertyFeeNum + waterFeeNum + elecFeeNum + gasFeeNum + netFeeNum;
    const utilitiesTotal = waterFeeNum + elecFeeNum + gasFeeNum;

    // Calculate fee ratios
    const rentRatio = ((monthlyRentNum / monthlyTotal) * 100).toFixed(1);
    const propertyRatio = ((propertyFeeNum / monthlyTotal) * 100).toFixed(1);
    const utilitiesRatio = ((utilitiesTotal / monthlyTotal) * 100).toFixed(1);
    const netRatio = ((netFeeNum / monthlyTotal) * 100).toFixed(1);

    this.setData({
      totalResult: {
        monthly: monthlyTotal.toFixed(2),
        quarter: (monthlyTotal * 3).toFixed(2),
        year: (monthlyTotal * 12).toFixed(2),
        rent: monthlyRentNum.toFixed(2),
        propertyFee: propertyFeeNum.toFixed(2),
        utilities: utilitiesTotal.toFixed(2),
        netFee: netFeeNum.toFixed(2),
        deposit: (monthlyRentNum * depositMonthsNum).toFixed(2),
        total: monthlyTotal.toFixed(2),
        ratios: [
          { name: 'Rent', ratio: rentRatio, color: '#1890ff' },
          { name: 'Property Fee', ratio: propertyRatio, color: '#52c41a' },
          { name: 'Utilities', ratio: utilitiesRatio, color: '#faad14' },
          { name: 'Internet Fee', ratio: netRatio, color: '#722ed1' }
        ]
      },
      resultPeriod: 'month'
    });
  },

  switchResultPeriod(e) {
    const period = e.currentTarget.dataset.period;
    const totalResult = this.data.totalResult;
    let total = 0;

    if (period === 'month') {
      total = totalResult.monthly;
    } else if (period === 'quarter') {
      total = totalResult.quarter;
    } else {
      total = totalResult.year;
    }

    totalResult.total = total;
    this.setData({
      resultPeriod: period,
      totalResult
    });
  },

  copyNegotiation() {
    wx.setClipboardData({
      data: this.data.negotiationText,
      success: () => {
        wx.showToast({
          title: 'Copied successfully',
          icon: 'success'
        });
      }
    });
  },

  generateReport() {
    wx.showLoading({
      title: 'Generating...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: 'Report generated successfully',
        icon: 'success'
      });

      // Save to local storage
      const report = {
        id: Date.now(),
        type: 'fee-check',
        city: this.data.currentCity || 'Unknown',
        feeType: this.data.feeTypes[this.data.feeTypeIndex] || 'Unknown',
        landlordPrice: this.data.verifyResult?.landlordPrice || 0,
        officialPrice: this.data.verifyResult?.officialPrice || 0,
        isOverpriced: this.data.verifyResult?.isOverpriced || false,
        createTime: new Date().getTime(),
        dateStr: this.formatDate(new Date().getTime())
      };

      try {
        let reports = wx.getStorageSync('feeCheckRecords') || [];
        reports.push(report);
        wx.setStorageSync('feeCheckRecords', reports);
      } catch (e) {
        console.error('Failed to save', e);
      }
    }, 1500);
  },

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
  }
})
