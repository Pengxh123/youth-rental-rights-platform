// app.js
App({
  globalData: {
    userInfo: null,
    cloudEnv: 'YOUR_CLOUD_ENV_ID', // 云开发环境 ID，请替换为你自己的
    city: 'Guangzhou',
    region: ['Guangdong', 'Guangzhou', 'Tianhe'],
    location: { latitude: 23.1296, longitude: 113.3839 },
    rightsRecords: [],
    verifyRecords: [],
    discussions: [],
    appid: 'touristappid'
  },
  onLaunch() {
    const appid = this.globalData.appid;
    console.log('App launched, appid:', appid);
    
    if (!appid) {
      console.error('Warning: appid not set or empty!');
      wx.showModal({
        confirmText: 'OK', cancelText: 'No',
        title: 'AppID Configuration Error',
        content: 'Mini program appid is missing, please check project configuration',
        showCancel: false
      });
    } else {
      console.log('AppID configured correctly:', appid);
    }
    
    this.initCloud();
    this.getUserLocation();
    this.loadLocalData();
  },
  
  initCloud() {
    if (!wx.cloud) {
      console.error('Please use WeChat base library version 2.2.3 or above for cloud capabilities');
      wx.showModal({
        confirmText: 'OK', cancelText: 'No',
        title: 'Notice',
        content: 'Current WeChat version is too low, please update WeChat',
        showCancel: false
      });
    } else {
      wx.cloud.init({
        env: this.globalData.cloudEnv || 'your-cloud-env-id',
        traceUser: true
      });
      console.log('Cloud development initialized successfully');
    }
  },
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        };
        this.getCityByLocation(res.latitude, res.longitude);
      },
      fail: (err) => {
        console.log('Failed to get location', err);
      }
    });
  },
  getCityByLocation(latitude, longitude) {
    wx.request({
      url: 'https://apis.map.qq.com/ws/geocoder/v1/',
      data: {
        location: `${latitude},${longitude}`,
        key: 'YOUR_TENCENT_MAP_KEY',
        get_poi: 0
      },
      success: (res) => {
        if (res.data.status === 0) {
          const address = res.data.result.address_component;
          this.globalData.city = address.city;
          this.globalData.region = [address.province, address.city, address.district];
          console.log('Location found, saved to global data:', this.globalData.region);
        }
      },
      fail: (err) => {
        console.log('Reverse geocoding failed', err);
      }
    });
  },
  loadLocalData() {
    try {
      const rightsRecords = wx.getStorageSync('rightsRecords');
      if (rightsRecords) {
        this.globalData.rightsRecords = rightsRecords;
      }
      const verifyRecords = wx.getStorageSync('verifyRecords');
      if (verifyRecords) {
        this.globalData.verifyRecords = verifyRecords;
      }
    } catch (e) {
      console.log('Failed to load local data', e);
    }
  }
})
