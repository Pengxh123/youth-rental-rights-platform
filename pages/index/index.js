const app = getApp()

Page({
  data: {
    cities: ['Auto Location', 'Beijing', 'Shanghai', 'Tianjin', 'Chongqing'],
    cityIndex: 0,
    region: ['Guangdong', 'Guangzhou', 'Tianhe'],
    searchText: '',
    warnings: [
      { id: 1, text: 'Warning: Deposits over 50% of rent may be risky!', level: 'high' },
      { id: 2, text: 'Reminder: Rental contract must specify utility rates', level: 'medium' },
      { id: 3, text: 'Note: Agency fees over 50% of rent are illegal', level: 'high' },
      { id: 4, text: 'Tip: Verify landlord property ownership before signing', level: 'medium' }
    ],
    hotTopics: [
      { id: 1, title: 'New grad: Is 1+3 or 1+1 deposit better?', category: 'Help', author: 'Newbie', views: 3286, comments: 89, isHot: true },
      { id: 2, title: 'Success story: Got deposit back after 3 months!', category: 'Success Cases', author: 'Advocate', views: 5214, comments: 56, isHot: true },
      { id: 3, title: '3 years in Beijing: Rental pitfalls to avoid', category: 'Tips', author: 'Veteran', views: 8942, comments: 234, isHot: false },
      { id: 4, title: 'Sublandlord disappeared, what to do?', category: 'Experiences', author: 'Victim A', views: 2134, comments: 67, isHot: true }
    ],
    tips: [
      { id: 1, text: 'Verify landlord identity and property ownership' },
      { id: 2, text: 'Include utility rates in contract to avoid surprises' },
      { id: 3, text: 'Take photos of property condition to prevent disputes' },
      { id: 4, text: 'Keep payment receipts and chat records' }
    ],
    stats: {
      totalUsers: '125K',
      totalCases: '3867',
      successRate: 89
    }
  },

  onLoad(options) {
    this.setData({
      region: ['Guangdong', 'Guangzhou', 'Tianhe']
    })
    this.loadHotTopics();
    this.getUserLocation();
  },

  onShow() {
    if (app.globalData.city) {
      const cityIndex = this.data.cities.indexOf(app.globalData.city);
      const currentIndex = cityIndex >= 0 ? cityIndex : 0;
      this.setData({ cityIndex: currentIndex });
    }
    if (app.globalData.region) {
      this.setData({ region: app.globalData.region });
    }
  },

  handleLocationClick() {
    wx.showToast({
      title: 'Location selection',
      icon: 'none'
    })
  },

  handleSearchClick() {
    wx.navigateTo({
      url: `/pages/search/search`
    });
  },

  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  onSearch() {
    const searchText = this.data.searchText;
    if (searchText && searchText.trim()) {
      wx.navigateTo({
        url: `/pages/search/search?keyword=${encodeURIComponent(searchText)}`
      });
    } else {
      wx.showToast({
        title: 'Please enter search content',
        icon: 'none'
      });
    }
  },

  getUserLocation() {
    wx.showLoading({ title: 'Locating...' });

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        app.globalData.location = { latitude, longitude };
        wx.hideLoading();
        this.matchCityFromLocation(latitude, longitude);
      },
      fail: () => {
        wx.hideLoading();
        wx.showModal({
          cancelText: 'No',
          title: 'Location Failed',
          content: 'Unable to get your location, please select city manually',
          showCancel: false,
          confirmText: 'Pick',
          success: () => {
            this.chooseCity();
          }
        });
      }
    });
  },

  matchCityFromLocation(latitude, longitude) {
    const locations = [
      { province: 'Beijing', city: 'Beijing', district: 'Dongcheng', lat: 39.9289, lng: 116.4170 },
      { province: 'Beijing', city: 'Beijing', district: 'Xicheng', lat: 39.9139, lng: 116.3665 },
      { province: 'Beijing', city: 'Beijing', district: 'Chaoyang', lat: 39.9439, lng: 116.4475 },
      { province: 'Beijing', city: 'Beijing', district: 'Haidian', lat: 39.9561, lng: 116.3094 },
      { province: 'Beijing', city: 'Beijing', district: 'Fengtai', lat: 39.8585, lng: 116.2871 },
      { province: 'Shanghai', city: 'Shanghai', district: 'Huangpu', lat: 31.2363, lng: 121.4905 },
      { province: 'Shanghai', city: 'Shanghai', district: 'Xuhui', lat: 31.1881, lng: 121.4373 },
      { province: 'Shanghai', city: 'Shanghai', district: 'Jing\'an', lat: 31.2491, lng: 121.4569 },
      { province: 'Shanghai', city: 'Shanghai', district: 'Pudong', lat: 31.2435, lng: 121.5042 },
      { province: 'Shanghai', city: 'Shanghai', district: 'Minhang', lat: 31.1121, lng: 121.3825 },
      { province: 'Guangdong', city: 'Guangzhou', district: 'Tianhe', lat: 23.1296, lng: 113.3839 },
      { province: 'Guangdong', city: 'Guangzhou', district: 'Yuexiu', lat: 23.1258, lng: 113.2643 },
      { province: 'Guangdong', city: 'Guangzhou', district: 'Haizhu', lat: 23.0837, lng: 113.3229 },
      { province: 'Guangdong', city: 'Guangzhou', district: 'Baiyun', lat: 23.1822, lng: 113.2731 },
      { province: 'Guangdong', city: 'Guangzhou', district: 'Panyu', lat: 22.9416, lng: 113.3838 },
      { province: 'Guangdong', city: 'Shenzhen', district: 'Nanshan', lat: 22.5469, lng: 113.9414 },
      { province: 'Guangdong', city: 'Shenzhen', district: 'Futian', lat: 22.5330, lng: 114.0554 },
      { province: 'Guangdong', city: 'Shenzhen', district: 'Luohu', lat: 22.5486, lng: 114.1169 },
      { province: 'Guangdong', city: 'Shenzhen', district: 'Bao\'an', lat: 22.5487, lng: 113.8832 },
      { province: 'Guangdong', city: 'Shenzhen', district: 'Longgang', lat: 22.7216, lng: 114.2734 },
      { province: 'Guangdong', city: 'Dongguan', district: 'Dongcheng', lat: 23.0205, lng: 113.7518 },
      { province: 'Guangdong', city: 'Foshan', district: 'Chancheng', lat: 23.0219, lng: 113.1214 },
      { province: 'Guangdong', city: 'Zhuhai', district: 'Xiangzhou', lat: 22.2697, lng: 113.5646 },
      { province: 'Zhejiang', city: 'Hangzhou', district: 'Xihu', lat: 30.2592, lng: 120.1559 },
      { province: 'Zhejiang', city: 'Hangzhou', district: 'Shangcheng', lat: 30.2525, lng: 120.1669 },
      { province: 'Zhejiang', city: 'Hangzhou', district: 'Gongshu', lat: 30.3208, lng: 120.1566 },
      { province: 'Zhejiang', city: 'Hangzhou', district: 'Binjiang', lat: 30.2084, lng: 120.2137 },
      { province: 'Zhejiang', city: 'Ningbo', district: 'Haishu', lat: 29.8776, lng: 121.5514 },
      { province: 'Zhejiang', city: 'Ningbo', district: 'Yinzhou', lat: 29.8295, lng: 121.5552 },
      { province: 'Jiangsu', city: 'Nanjing', district: 'Gulou', lat: 32.0603, lng: 118.7969 },
      { province: 'Jiangsu', city: 'Nanjing', district: 'Xuanwu', lat: 32.0486, lng: 118.7969 },
      { province: 'Jiangsu', city: 'Nanjing', district: 'Qinhuai', lat: 32.0088, lng: 118.7927 },
      { province: 'Jiangsu', city: 'Suzhou', district: 'Gusu', lat: 31.2989, lng: 120.5853 },
      { province: 'Jiangsu', city: 'Suzhou', district: 'Huqiu', lat: 31.2953, lng: 120.5635 },
      { province: 'Jiangsu', city: 'Wuxi', district: 'Liangxi', lat: 31.5791, lng: 120.2987 },
      { province: 'Sichuan', city: 'Chengdu', district: 'Jinjiang', lat: 30.6574, lng: 104.0815 },
      { province: 'Sichuan', city: 'Chengdu', district: 'Qingyang', lat: 30.6725, lng: 104.0458 },
      { province: 'Sichuan', city: 'Chengdu', district: 'Jinniu', lat: 30.6903, lng: 104.0742 },
      { province: 'Sichuan', city: 'Chengdu', district: 'Wuhou', lat: 30.6428, lng: 104.0434 },
      { province: 'Hubei', city: 'Wuhan', district: 'Jiang\'an', lat: 30.5886, lng: 114.3022 },
      { province: 'Hubei', city: 'Wuhan', district: 'Jianghan', lat: 30.5901, lng: 114.2704 },
      { province: 'Hubei', city: 'Wuhan', district: 'Qiaokou', lat: 30.5798, lng: 114.2641 },
      { province: 'Hubei', city: 'Wuhan', district: 'Hanyang', lat: 30.5495, lng: 114.2734 },
      { province: 'Hubei', city: 'Wuhan', district: 'Wuchang', lat: 30.5537, lng: 114.3555 },
      { province: 'Shandong', city: 'Jinan', district: 'Lixia', lat: 36.6667, lng: 117.1189 },
      { province: 'Shandong', city: 'Qingdao', district: 'Shinan', lat: 36.0661, lng: 120.3826 },
      { province: 'Shandong', city: 'Qingdao', district: 'Shibei', lat: 36.0862, lng: 120.3839 },
      { province: 'Tianjin', city: 'Tianjin', district: 'Heping', lat: 39.1211, lng: 117.2053 },
      { province: 'Chongqing', city: 'Chongqing', district: 'Yuzhong', lat: 29.5547, lng: 106.5746 },
      { province: 'Fujian', city: 'Xiamen', district: 'Siming', lat: 24.4798, lng: 118.0894 },
      { province: 'Liaoning', city: 'Shenyang', district: 'Heping', lat: 41.7968, lng: 123.4315 },
      { province: 'Liaoning', city: 'Dalian', district: 'Zhongshan', lat: 38.9187, lng: 121.6467 },
      { province: 'Heilongjiang', city: 'Harbin', district: 'Daoli', lat: 45.7556, lng: 126.6422 },
      { province: 'Shaanxi', city: "Xi'an", district: 'Yanta', lat: 34.2188, lng: 108.9402 },
      { province: 'Hunan', city: 'Changsha', district: 'Furong', lat: 28.1865, lng: 112.9861 },
      { province: 'Hunan', city: 'Changsha', district: 'Tianxin', lat: 28.1434, lng: 112.9828 },
      { province: 'Hunan', city: 'Changsha', district: 'Yuelu', lat: 28.2356, lng: 112.9309 },
      { province: 'Henan', city: 'Zhengzhou', district: 'Jinshui', lat: 34.7666, lng: 113.7495 },
      { province: 'Henan', city: 'Luoyang', district: 'Luolong', lat: 34.6197, lng: 112.4540 },
      { province: 'Hebei', city: 'Shijiazhuang', district: 'Chang\'an', lat: 38.0431, lng: 114.5149 },
      { province: 'Shanxi', city: 'Taiyuan', district: 'Xinghualing', lat: 37.8706, lng: 112.5489 },
      { province: 'Inner Mongolia', city: 'Hohhot', district: 'Xincheng', lat: 40.8424, lng: 111.7492 },
      { province: 'Jilin', city: 'Changchun', district: 'Chaoyang', lat: 43.8171, lng: 125.3235 },
      { province: 'Anhui', city: 'Hefei', district: 'Luyang', lat: 31.8669, lng: 117.2826 },
      { province: 'Jiangxi', city: 'Nanchang', district: 'Donghu', lat: 28.6842, lng: 115.8986 },
      { province: 'Guangxi', city: 'Nanning', district: 'Qingxiu', lat: 22.8157, lng: 108.3200 },
      { province: 'Yunnan', city: 'Kunming', district: 'Wuhua', lat: 25.0406, lng: 102.7183 },
      { province: 'Guizhou', city: 'Guiyang', district: 'Nanming', lat: 26.5811, lng: 106.7131 },
      { province: 'Fujian', city: 'Fuzhou', district: 'Gulou', lat: 26.0560, lng: 119.2834 },
      { province: 'Jiangxi', city: 'Jingdezhen', district: 'Changjiang', lat: 29.2761, lng: 117.2286 },
      { province: 'Guangxi', city: 'Guilin', district: 'Xiufeng', lat: 25.2741, lng: 110.2993 },
      { province: 'Hainan', city: 'Haikou', district: 'Xiuying', lat: 20.0319, lng: 110.3344 },
      { province: 'Hainan', city: 'Sanya', district: 'Tianya', lat: 18.2237, lng: 109.5028 },
      { province: 'Shaanxi', city: 'Xianyang', district: 'Qindu', lat: 34.3266, lng: 108.7231 },
      { province: 'Gansu', city: 'Lanzhou', district: 'Chengguan', lat: 36.0611, lng: 103.8343 },
      { province: 'Qinghai', city: 'Xining', district: 'Chengdong', lat: 36.6231, lng: 101.7789 },
      { province: 'Ningxia', city: 'Yinchuan', district: 'Xingqing', lat: 38.4878, lng: 106.2343 },
      { province: 'Xinjiang', city: 'Urumqi', district: 'Tianshan', lat: 43.8256, lng: 87.6168 },
      { province: 'Tibet', city: 'Lhasa', district: 'Chengguan', lat: 29.6549, lng: 91.1342 },
      { province: 'Hong Kong', city: 'Hong Kong', district: 'Central and Western', lat: 22.2855, lng: 114.1577 },
      { province: 'Macao', city: 'Macao', district: 'Macao Peninsula', lat: 22.1987, lng: 113.5439 },
      { province: 'Taiwan', city: 'Taipei', district: 'Zhongzheng', lat: 25.0478, lng: 121.5171 }
    ];

    let minDistance = Infinity;
    let matchedLocation = null;

    for (const loc of locations) {
      const distance = this.calculateDistance(latitude, longitude, loc.lat, loc.lng);
      if (distance < minDistance) {
        minDistance = distance;
        matchedLocation = loc;
      }
    }

    if (matchedLocation && minDistance < 0.5) {
      const region = [matchedLocation.province, matchedLocation.city, matchedLocation.district];
      this.setData({ region });
      app.globalData.region = region;
      app.globalData.city = matchedLocation.city;
    }
  },

  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  },

  chooseCity() {
    wx.showActionSheet({
      itemList: this.data.cities,
      success: (res) => {
        const city = this.data.cities[res.tapIndex];
        this.setData({
          cityIndex: res.tapIndex,
          region: [city, city, '']
        });
        app.globalData.city = city;
        app.globalData.region = [city, city, ''];
      }
    });
  },

  navigateTo(e) {
    const page = e.currentTarget.dataset.page;
    wx.navigateTo({ url: page });
  },

  viewTopic(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/topic-detail/topic-detail?id=${id}`
    });
  },

  callHotline(e) {
    const phone = e.currentTarget.dataset.phone;
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Call Hotline',
      content: 'Call ' + phone + '?',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: phone });
        }
      }
    });
  },

  loadHotTopics() {
    console.log('Hot topics loaded');
  }
});
