// pages/house-reference/house-reference.js
const app = getApp()

Page({
  data: {
    officialPlatforms: [
      {
        name: 'Beike Rentals',
        desc: 'Verified listings, no fake info',
        tag: 'Mini Program',
        url: 'https://www.ke.com'
      },
      {
        name: 'Lianjia Rentals',
        desc: 'Verified listings, quality guaranteed',
        tag: 'Mini Program',
        url: 'https://www.lianjia.com'
      },
      {
        name: 'Ziroom',
        desc: 'Quality apartments, move-in ready',
        tag: 'Mini Program',
        url: 'https://www.ziroom.com'
      },
      {
        name: 'Boyu',
        desc: 'Vanke youth apartments',
        tag: 'Brand',
        url: 'https://www.vanke.com'
      },
      {
        name: 'Guanyu',
        desc: 'Longfor long-term rental apartments',
        tag: 'Brand',
        url: 'https://www.longfor.com'
      },
      {
        name: 'Ministry of Housing and Urban-Rural Development',
        desc: 'National housing rental supervision service platform',
        tag: 'Official',
        url: 'https://zfzl.cin.gov.cn'
      },
      {
        name: '5i5j',
        desc: 'Professional real estate brokerage',
        tag: 'Agency',
        url: 'https://www.5i5j.com'
      },
      {
        name: '58.com Rentals',
        desc: 'Massive listings, fast search',
        tag: 'Platform',
        url: 'https://www.58.com'
      },
      {
        name: 'Anjuke Rentals',
        desc: 'Verified listings, worry-free renting',
        tag: 'Platform',
        url: 'https://www.anjuke.com'
      }
    ],
    currentProvince: '',
    currentCity: '',
    currentDistrict: '',
    showCitySelector: false,
    showDistrictPicker: false,
    provinceList: [
      'Municipalities', 'Guangdong', 'Jiangsu', 'Zhejiang', 'Shandong', 'Henan', 'Sichuan', 'Hubei', 'Hunan',
      'Hebei', 'Fujian', 'Anhui', 'Shaanxi', 'Heilongjiang', 'Jilin', 'Liaoning', 'Jiangxi', 'Shanxi',
      'Yunnan', 'Guizhou', 'Guangxi', 'Inner Mongolia', 'Xinjiang', 'Ningxia',
      'Gansu', 'Qinghai', 'Tibet', 'Hainan', 'Taiwan', 'Hong Kong', 'Macao'
    ],
    cityList: [],
    availableDistricts: [],
    areaData: null,
    isLoading: false
  },

  onLoad(options) {
    console.log('House reference page onLoad called')
    this.detectUserLocation()
  },

  detectUserLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('Got location:', res)
        this.getCityFromLocation(res.latitude, res.longitude)
      },
      fail: (err) => {
        console.log('Failed to get location:', err)
        wx.showToast({
          title: 'Unable to get current location, please select city manually',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  getCityFromLocation(latitude, longitude) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      method: 'GET',
      data: {
        location: `${latitude},${longitude}`,
        key: 'YOUR_TENCENT_MAP_KEY'
      },
      success: (res) => {
        if (res.data.status === 0) {
          const addressComponent = res.data.result.address_component
          const city = addressComponent.city || addressComponent.province
          console.log('Reverse geocoding success:', city)
          this.setData({
            currentCity: city
          })
          this.loadAreaData()
        }
      },
      fail: (err) => {
        console.log('Reverse geocoding failed:', err)
      }
    })
  },

  chooseCity() {
    console.log('Clicked select city')
    this.setData({
      showCitySelector: true,
      currentProvince: '',
      cityList: []
    })
  },

  closeCitySelector() {
    console.log('Close city selector')
    this.setData({
      showCitySelector: false,
      currentProvince: '',
      cityList: []
    })
  },

  backToProvince() {
    console.log('Back to province selection')
    this.setData({
      currentProvince: '',
      cityList: []
    })
  },

  stopPropagation() {
    console.log('Stop event propagation')
  },

  selectProvince(e) {
    const province = e.currentTarget.dataset.province
    console.log('Selected province:', province)

    // Directly set city list and show city selector
    this.showCitiesByProvince(province)
  },
  
  closeDistrictPicker() {
    console.log('Close district picker')
    this.setData({
      showDistrictPicker: false
    })
  },

  showCitiesByProvince(province) {
    console.log('====================================')
    console.log('showCitiesByProvince called, province:', province)

    // Hardcode city list to ensure display
    let cities = []

    // Set city list for each province
    switch (province) {
      case 'Guangdong':
        cities = ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhuhai', 'Shantou', 'Shaoguan', 'Zhanjiang', 'Zhaoqing', 'Jiangmen', 'Maoming', 'Huizhou', 'Meizhou', 'Shanwei', 'Heyuan', 'Yangjiang', 'Qingyuan', 'Chaozhou', 'Jieyang', 'Yunfu']
        break
      case 'Jiangsu':
        cities = ['Nanjing', 'Suzhou', 'Wuxi', 'Changzhou', 'Xuzhou', 'Nantong', 'Lianyungang', 'Huaian', 'Yancheng', 'Yangzhou', 'Zhenjiang', 'Taizhou', 'Suqian']
        break
      case 'Municipalities':
        cities = ['Beijing', 'Shanghai', 'Tianjin', 'Chongqing']
        break
      case 'Zhejiang':
        cities = ['Hangzhou', 'Ningbo', 'Wenzhou', 'Jiaxing', 'Huzhou', 'Shaoxing', 'Jinhua', 'Quzhou', 'Zhoushan', 'Taizhou', 'Lishui']
        break
      case 'Shandong':
        cities = ['Jinan', 'Qingdao', 'Zibo', 'Zaozhuang', 'Dongying', 'Yantai', 'Weifang', 'Jining', 'Taian', 'Weihai', 'Rizhao', 'Linyi', 'Dezhou', 'Liaocheng', 'Binzhou', 'Heze']
        break
      case 'Henan':
        cities = ['Zhengzhou', 'Kaifeng', 'Luoyang', 'Pingdingshan', 'Anyang', 'Hebi', 'Xinxiang', 'Jiaozuo', 'Puyang', 'Xuchang', 'Luohe', 'Sanmenxia', 'Nanyang', 'Shangqiu', 'Xinyang', 'Zhoukou', 'Zhumadian']
        break
      case 'Sichuan':
        cities = ['Chengdu', 'Zigong', 'Panzhihua', 'Luzhou', 'Deyang', 'Mianyang', 'Guangyuan', 'Suining', 'Neijiang', 'Leshan', 'Nanchong', 'Meishan', 'Yibin', 'Guangan', 'Dazhou', 'Ya\'an', 'Bazhong', 'Ziyang']
        break
      case 'Hubei':
        cities = ['Wuhan', 'Huangshi', 'Shiyan', 'Yichang', 'Xiangyang', 'Ezhou', 'Jingmen', 'Xiaogan', 'Jingzhou', 'Huanggang', 'Xianning', 'Suizhou']
        break
      case 'Hunan':
        cities = ['Changsha', 'Zhuzhou', 'Xiangtan', 'Hengyang', 'Shaoyang', 'Yueyang', 'Changde', 'Zhangjiajie', 'Yiyang', 'Chenzhou', 'Yongzhou', 'Huaihua', 'Loudi', 'Xiangxi Tujia-Miao Autonomous Prefecture']
        break
      case 'Hebei':
        cities = ['Shijiazhuang', 'Tangshan', 'Qinhuangdao', 'Handan', 'Xingtai', 'Baoding', 'Zhangjiakou', 'Chengde', 'Cangzhou', 'Langfang', 'Hengshui']
        break
      case 'Fujian':
        cities = ['Fuzhou', 'Xiamen', 'Putian', 'Sanming', 'Quanzhou', 'Zhangzhou', 'Nanping', 'Longyan', 'Ningde']
        break
      case 'Anhui':
        cities = ['Hefei', 'Wuhu', 'Bengbu', 'Huainan', 'Maanshan', 'Huaibei', 'Tongling', 'Anqing', 'Huangshan', 'Chuzhou', 'Fuyang', 'Suzhou', 'Luan', 'Bozhou', 'Chizhou', 'Xuancheng']
        break
      case 'Shaanxi':
        cities = ['Xian', 'Tongchuan', 'Baoji', 'Xianyang', 'Weinan', 'Yanan', 'Hanzhong', 'Yulin', 'Ankang', 'Shangluo']
        break
      case 'Heilongjiang':
        cities = ['Harbin', 'Qiqihar', 'Jixi', 'Hegang', 'Shuangyashan', 'Daqing', 'Yichun', 'Jiamusi', 'Qitaihe', 'Mudanjiang', 'Heihe', 'Suihua', 'Daxinganling']
        break
      case 'Jilin':
        cities = ['Changchun', 'Jilin', 'Siping', 'Liaoyuan', 'Tonghua', 'Baishan', 'Songyuan', 'Baicheng', 'Yanbian Korean Autonomous Prefecture']
        break
      case 'Liaoning':
        cities = ['Shenyang', 'Dalian', 'Anshan', 'Fushun', 'Benxi', 'Dandong', 'Jinzhou', 'Yingkou', 'Fuxin', 'Liaoyang', 'Panjin', 'Tieling', 'Chaoyang', 'Huludao']
        break
      case 'Jiangxi':
        cities = ['Nanchang', 'Jingdezhen', 'Pingxiang', 'Jiujiang', 'Xinyu', 'Yingtan', 'Ganzhou', 'Jian', 'Yichun', 'Fuzhou', 'Shangrao']
        break
      case 'Shanxi':
        cities = ['Taiyuan', 'Datong', 'Yangquan', 'Changzhi', 'Jincheng', 'Shuozhou', 'Jinzhong', 'Yuncheng', 'Xinzhou', 'Linfen', 'Lvliang']
        break
      case 'Yunnan':
        cities = ['Kunming', 'Qujing', 'Yuxi', 'Baoshan', 'Zhaotong', 'Lijiang', 'Pu\'er', 'Lincang', 'Chuxiong Yi Autonomous Prefecture', 'Honghe Hani-Yi Autonomous Prefecture', 'Wenshan Zhuang-Miao Autonomous Prefecture', 'Xishuangbanna Dai Autonomous Prefecture', 'Dali Bai Autonomous Prefecture', 'Dehong Dai-Jingpo Autonomous Prefecture', 'Nujiang Lisu Autonomous Prefecture', 'Diqing Tibetan Autonomous Prefecture']
        break
      case 'Guizhou':
        cities = ['Guiyang', 'Liupanshui', 'Zunyi', 'Anshun', 'Bijie', 'Tongren', 'Qianxinan Bouyei-Miao Autonomous Prefecture', 'Qiandongnan Miao-Dong Autonomous Prefecture', 'Qiannan Bouyei-Miao Autonomous Prefecture']
        break
      case 'Guangxi':
        cities = ['Nanning', 'Liuzhou', 'Guilin', 'Wuzhou', 'Beihai', 'Fangchenggang', 'Qinzhou', 'Guigang', 'Yulin', 'Baise', 'Hezhou', 'Hechi', 'Laibin', 'Chongzuo']
        break
      case 'Inner Mongolia':
        cities = ['Hohhot', 'Baotou', 'Wuhai', 'Chifeng', 'Tongliao', 'Ordos', 'Hulunbuir', 'Bayannur', 'Ulanqab', 'Hinggan League', 'Xilingol League', 'Alxa League']
        break
      case 'Xinjiang':
        cities = ['Urumqi', 'Karamay', 'Turpan', 'Hami', 'Changji Hui Autonomous Prefecture', 'Bortala Mongol Autonomous Prefecture', 'Bayingolin Mongol Autonomous Prefecture', 'Aksu Prefecture', 'Kizilsu Kirghiz Autonomous Prefecture', 'Kashgar Prefecture', 'Hotan Prefecture', 'Ili Kazakh Autonomous Prefecture', 'Tacheng Prefecture', 'Altay Prefecture']
        break
      case 'Ningxia':
        cities = ['Yinchuan', 'Shizuishan', 'Wuzhong', 'Guyuan', 'Zhongwei']
        break
      case 'Gansu':
        cities = ['Lanzhou', 'Jiayuguan', 'Jinchang', 'Baiyin', 'Tianshui', 'Wuwei', 'Zhangye', 'Pingliang', 'Jiuquan', 'Qingyang', 'Dingxi', 'Longnan', 'Linxia Hui Autonomous Prefecture', 'Gannan Tibetan Autonomous Prefecture']
        break
      case 'Qinghai':
        cities = ['Xining', 'Haidong', 'Haibei Tibetan Autonomous Prefecture', 'Huangnan Tibetan Autonomous Prefecture', 'Hainan Tibetan Autonomous Prefecture', 'Golog Tibetan Autonomous Prefecture', 'Yushu Tibetan Autonomous Prefecture', 'Haixi Mongol-Tibetan Autonomous Prefecture']
        break
      case 'Tibet':
        cities = ['Lhasa', 'Shigatse', 'Chamdo', 'Nyingchi', 'Shannan', 'Nagqu', 'Ngari Prefecture']
        break
      case 'Hainan':
        cities = ['Haikou', 'Sanya', 'Sansha', 'Danzhou', 'Wuzhishan', 'Qionghai', 'Wenchang', 'Wanning', 'Dongfang']
        break
      case 'Taiwan':
        cities = ['Taipei', 'New Taipei', 'Taoyuan', 'Taichung', 'Tainan', 'Kaohsiung']
        break
      case 'Hong Kong':
        cities = ['Hong Kong Island', 'Kowloon', 'New Territories']
        break
      case 'Macao':
        cities = ['Macau Peninsula', 'Taipa', 'Coloane']
        break
      default:
        cities = ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen']
    }

    console.log('Got city list:', cities)
    console.log('City list length:', cities.length)

    // Directly set all data
    console.log('Ready to set data')
    this.setData({
      cityList: cities,
      currentProvince: province
    })

    // Check if data was set successfully
    console.log('Data set complete')
    console.log('cityList:', this.data.cityList)
    console.log('cityList length:', this.data.cityList.length)
    console.log('currentProvince:', this.data.currentProvince)
    console.log('====================================')
  },

  selectCity(e) {
    const city = e.currentTarget.dataset.city
    console.log('Selected city:', city)

    // Close city selector
    this.setData({
      currentCity: city,
      showCitySelector: false
    })

    // Use setTimeout to ensure setData completes, then show district picker
    setTimeout(() => {
      console.log('===== setTimeout callback starts =====')
      console.log('Current currentCity:', this.data.currentCity)
      console.log('Ready to call showDistrictsByCity, city:', city)
      this.showDistrictsByCity(city)
      console.log('===== setTimeout callback complete =====')
    }, 300)
  },

  showDistrictsByCity(city) {
    console.log('====================================')
    console.log('showDistrictsByCity called, city:', city)

    let districts = []
    
    // Set real district data for major cities
    if (city === 'Beijing') {
      districts = ['Dongcheng', 'Xicheng', 'Chaoyang', 'Haidian', 'Fengtai', 'Shijingshan', 'Mentougou', 'Fangshan', 'Tongzhou', 'Shunyi', 'Changping', 'Daxing', 'Huairou', 'Pinggu', 'Miyun', 'Yanqing']
    } else if (city === 'Shanghai') {
      districts = ['Huangpu', 'Xuhui', 'Changning', 'Jingan', 'Putuo', 'Hongkou', 'Yangpu', 'Pudong New Area', 'Minhang', 'Baoshan', 'Jiading', 'Jinshan', 'Songjiang', 'Qingpu', 'Fengxian', 'Chongming']
    } else if (city === 'Guangzhou') {
      districts = ['Yuexiu', 'Haizhu', 'Liwan', 'Tianhe', 'Baiyun', 'Huangpu', 'Panyu', 'Huadu', 'Nansha', 'Conghua', 'Zengcheng']
    } else if (city === 'Shenzhen') {
      districts = ['Luohu', 'Futian', 'Nanshan', 'Baoan', 'Longgang', 'Yantian', 'Longhua', 'Pingshan', 'Guangming', 'Dapeng New Area']
    } else if (city === 'Hangzhou') {
      districts = ['Shangcheng', 'Xiacheng', 'Jianggan', 'Gongshu', 'Xihu', 'Binjiang', 'Xiaoshan', 'Yuhang', 'Fuyang', 'Linan', 'Tonglu', 'Chunan', 'Jiande']
    } else if (city === 'Chengdu') {
      districts = ['Jinjiang', 'Qingyang', 'Jinniu', 'Wuhou', 'Chenghua', 'Longquanyi', 'Qingbaijiang', 'Xindu', 'Wenjiang', 'Shuangliu', 'Pidu', 'Jintang', 'Dayi', 'Pujiang', 'Xinjin', 'Dujiangyan', 'Pengzhou', 'Qionglai', 'Chongzhou']
    } else if (city === 'Wuhan') {
      districts = ['Jiangan', 'Jianghan', 'Qiaokou', 'Hanyang', 'Wuchang', 'Qingshan', 'Hongshan', 'Dongxihu', 'Hannan', 'Caidian', 'Jiangxia', 'Huangpi', 'Xinzhou']
    } else if (city === 'Chongqing') {
      districts = ['Yuzhong', 'Dadukou', 'Jiangbei', 'Shapingba', 'Jiulongpo', 'Nanan', 'Beibei', 'Qijiang', 'Dazu', 'Yubei', 'Banan', 'Qianjiang', 'Changshou', 'Jiangjin', 'Hechuan', 'Yongchuan', 'Nanchuan']
    } else if (city === 'Xian') {
      districts = ['Xincheng', 'Beilin', 'Lianhu', 'Baqiao', 'Weiyang', 'Yanta', 'Yanliang', 'Lintong', 'Changan', 'Gaoling', 'Huyi', 'Lantian', 'Zhouzhi']
    } else if (city === 'Nanjing') {
      districts = ['Xuanwu', 'Qinhuai', 'Jianye', 'Gulou', 'Pukou', 'Qixia', 'Yuhuatai', 'Jiangning', 'Luhe', 'Lishui', 'Gaochun']
    } else if (city === 'Changsha') {
      districts = ['Furong', 'Tianxin', 'Yuelu', 'Kaifu', 'Yuhua', 'Wangcheng', 'Changsha', 'Ningxiang', 'Liuyang']
    } else if (city === 'Shenyang') {
      districts = ['Heping', 'Shenhe', 'Dadong', 'Huanggu', 'Tiexi', 'Sujiatun', 'Hunnan', 'Shenbei New Area', 'Yuhong', 'Liaozhong', 'Kangping', 'Faku', 'Xinmin']
    } else if (city === 'Qingdao') {
      districts = ['Shinan', 'Shibei', 'Huangdao', 'Laoshan', 'Licang', 'Chengyang', 'Jimo', 'Jiaozhou', 'Pingdu', 'Laixi']
    } else if (city === 'Ningbo') {
      districts = ['Haishu', 'Jiangbei', 'Beilun', 'Zhenhai', 'Yinzhou', 'Fenghua', 'Xiangshan', 'Ninghai', 'Yuyao', 'Cixi']
    } else if (city === 'Dongguan') {
      districts = ['Guancheng', 'Nancheng', 'Dongcheng', 'Wanjiang', 'Shilong', 'Shipai', 'Chashan', 'Qishi', 'Qiaotou', 'Dongkeng', 'Hengli', 'Changping']
    } else if (city === 'Foshan') {
      districts = ['Chancheng', 'Nanhai', 'Shunde', 'Sanshui', 'Gaoming']
    } else if (city === 'Suzhou') {
      districts = ['Gusu', 'Huqiu', 'Wuzhong', 'Xiangcheng', 'Wujiang', 'Kunshan', 'Changshu', 'Zhangjiagang', 'Taicang']
    } else if (city === 'Zhengzhou') {
      districts = ['Zhongyuan', 'Erqi', 'Guancheng Hui District', 'Jinshui', 'Shangjie', 'Huiji', 'Zhongmu', 'Gongyi', 'Xingyang', 'Xinmi', 'Xinzheng', 'Dengfeng']
    } else if (city === 'Tianjin') {
      districts = ['Heping', 'Hedong', 'Hexi', 'Nankai', 'Hebei', 'Hongqiao', 'Dongli', 'Xiqing', 'Jinnan', 'Beichen', 'Wuqing', 'Baodi', 'Binhai New Area', 'Ninghe', 'Jinghai', 'Jizhou']
    } else if (city === 'Chengdu') {
      districts = ['Jinjiang', 'Qingyang', 'Jinniu', 'Wuhou', 'Chenghua', 'Longquanyi', 'Qingbaijiang', 'Xindu', 'Wenjiang', 'Shuangliu', 'Pidu', 'Jintang', 'Dayi', 'Pujiang', 'Xinjin', 'Dujiangyan', 'Pengzhou', 'Qionglai', 'Chongzhou']
    } else if (city === 'Hangzhou') {
      districts = ['Shangcheng', 'Xiacheng', 'Jianggan', 'Gongshu', 'Xihu', 'Binjiang', 'Xiaoshan', 'Yuhang', 'Fuyang', 'Linan', 'Tonglu', 'Chunan', 'Jiande']
    } else if (city.includes('Xiangxi')) {
      districts = ['Jishou', 'Luxi', 'Fenghuang', 'Huayuan', 'Baojing', 'Guzhang', 'Yongshun', 'Longshan']
    } else if (city.includes('Autonomous Prefecture') || city.includes('League')) {
      // Add real county data for autonomous prefectures and leagues
      districts = ['Jishou', 'Luxi', 'Fenghuang', 'Huayuan', 'Baojing', 'Guzhang', 'Yongshun', 'Longshan']
    } else {
      // Provide generic district options for other cities
      districts = ['Dongcheng', 'Xicheng', 'Nancheng', 'Beicheng', 'Zhongcheng', 'Gaoxin', 'Economic Development Zone', 'Xincheng']
    }
    
    this.setData({
      availableDistricts: districts,
      showDistrictPicker: true
    })
  },

  selectDistrict(e) {
    const district = e.currentTarget.dataset.district
    console.log('Selected district:', district)
    this.setData({
      currentDistrict: district,
      showDistrictPicker: false
    })
    this.loadAreaData()
  },

  loadAreaData() {
    console.log('Load area data, city:', this.data.currentCity, 'district:', this.data.currentDistrict)
    this.setData({ isLoading: true })
    
    // Simulate async data loading
    setTimeout(() => {
      this.calculateBasePrice()
      this.calculateRoomTypes()
      this.calculateUtilities()
      this.setData({ isLoading: false })
    }, 500)
  },

  calculateBasePrice() {
    const city = this.data.currentCity
    const district = this.data.currentDistrict
    
    // Set different base prices for different cities
    const cityBasePrices = {
      'Beijing': 4500,
      'Shanghai': 4800,
      'Guangzhou': 3200,
      'Shenzhen': 3500,
      'Hangzhou': 2800,
      'Nanjing': 2200,
      'Chengdu': 1800,
      'Wuhan': 2000,
      'Chongqing': 1600,
      'Xian': 1500,
      'Changsha': 1600,
      'Qingdao': 1800,
      'Ningbo': 2000,
      'Dongguan': 2200,
      'Foshan': 1800,
      'Suzhou': 2500,
      'Zhengzhou': 1500,
      'Tianjin': 2200,
      'Xiangxi Tujia-Miao Autonomous Prefecture': 900
    }
    
    // Get city base price, use default if not found
    const basePrice = cityBasePrices[city] || 1500
    
    // Adjust price based on district
    let districtMultiplier = 1.0
    if (district.includes('Central') || district.includes('cheng')) {
      districtMultiplier = 1.2
    } else if (district.includes('New Area') || district.includes('Gaoxin')) {
      districtMultiplier = 1.1
    } else if (district.includes('Yuan')) {
      districtMultiplier = 0.8
    }
    
    const finalPrice = Math.round(basePrice * districtMultiplier)
    
    this.setData({
      averageRent: finalPrice,
      depositMonths: 1
    })
  },

  calculateRoomTypes() {
    const basePrice = this.data.averageRent || 1500
    
    // Calculate prices for different room types based on base price
    const roomTypes = [
      {
        type: '1B1B',
        area: '40-60sqm',
        price: Math.round(basePrice * 0.8),
        deposit: '1-month deposit, 3-month rent',
        priceTrend: '+1.2%'
      },
      {
        type: '2B1B',
        area: '65-75sqm',
        price: basePrice,
        deposit: '1-month deposit, 3-month rent',
        priceTrend: '+1.5%'
      },
      {
        type: '3B1B',
        area: '85-95sqm',
        price: Math.round(basePrice * 1.3),
        deposit: '2-month deposit, 3-month rent',
        priceTrend: '+1.3%'
      }
    ]
    
    this.setData({ roomTypes })
  },

  calculateUtilities() {
    const city = this.data.currentCity
    
    // Set different utility prices for different cities
    const utilityPrices = {
      'Beijing': { electricity: 0.48, water: 5.00 },
      'Shanghai': { electricity: 0.48, water: 3.45 },
      'Guangzhou': { electricity: 0.61, water: 1.98 },
      'Shenzhen': { electricity: 0.68, water: 2.30 },
      'Hangzhou': { electricity: 0.53, water: 2.90 },
      'Nanjing': { electricity: 0.52, water: 3.00 },
      'Chengdu': { electricity: 0.52, water: 3.08 },
      'Wuhan': { electricity: 0.57, water: 2.32 },
      'Chongqing': { electricity: 0.52, water: 3.50 },
      'Xian': { electricity: 0.49, water: 3.80 },
      'Changsha': { electricity: 0.58, water: 2.58 },
      'Qingdao': { electricity: 0.54, water: 3.50 },
      'Ningbo': { electricity: 0.53, water: 3.20 },
      'Dongguan': { electricity: 0.61, water: 2.00 },
      'Foshan': { electricity: 0.61, water: 2.00 },
      'Suzhou': { electricity: 0.52, water: 3.40 },
      'Zhengzhou': { electricity: 0.56, water: 3.10 },
      'Tianjin': { electricity: 0.49, water: 4.90 },
      'Xiangxi Tujia-Miao Autonomous Prefecture': { electricity: 0.58, water: 2.00 }
    }
    
    // Get city utility prices, use default if not found
    const prices = utilityPrices[city] || { electricity: 0.56, water: 2.80 }
    
    // Calculate average household utility costs
    const electricityUsage = 150 // Monthly electricity usage (kWh)
    const waterUsage = 15 // Monthly water usage (tons)
    const electricityCost = Math.round(prices.electricity * electricityUsage)
    const waterCost = Math.round(prices.water * waterUsage)
    const totalUtilityCost = electricityCost + waterCost
    
    this.setData({
      electricityPrice: prices.electricity.toFixed(2),
      waterPrice: prices.water.toFixed(2),
      electricityCost: electricityCost,
      waterCost: waterCost,
      totalUtilityCost: totalUtilityCost
    })
  }
})
