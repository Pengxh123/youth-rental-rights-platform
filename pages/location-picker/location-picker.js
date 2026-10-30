// pages/location-picker/location-picker.js
const app = getApp()

Page({
  data: {
    region: ['Beijing', 'Beijing', 'Dongcheng'],
    currentLocation: null,
    isLocating: false,
    cityList: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xi\'an', 'Chongqing', 'Tianjin']
  },

  onLoad() {
    // Get current location from global data
    if (app.globalData.region) {
      this.setData({ region: app.globalData.region })
    }
    if (app.globalData.location) {
      this.setData({ currentLocation: app.globalData.location })
    }
  },

  // Auto locate
  getLocation() {
    this.setData({ isLocating: true })
    wx.showLoading({ title: 'Locating...' })

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res
        this.setData({
          currentLocation: { latitude, longitude }
        })

        // Match city
        this.matchCityFromLocation(latitude, longitude)
      },
      fail: () => {
        wx.hideLoading()
        this.setData({ isLocating: false })
        wx.showToast({
          title: 'Location failed, please select manually',
          icon: 'none'
        })
      }
    })
  },

  // Match city by coordinates
  matchCityFromLocation(latitude, longitude) {
    const locations = app.globalData.locations || []

    // Find nearest district
    let closestLocation = null
    let minDistance = Infinity

    for (const loc of locations) {
      const distance = this.calculateDistance(latitude, longitude, loc.lat, loc.lng)
      if (distance < minDistance) {
        minDistance = distance
        closestLocation = loc
      }
    }

    wx.hideLoading()

    if (closestLocation) {
      const region = [closestLocation.province, closestLocation.city, closestLocation.district]
      this.setData({
        region,
        isLocating: false
      })

      wx.showToast({
        title: `Located: ${closestLocation.city}`,
        icon: 'success',
        duration: 2000
      })
    } else {
      this.setData({ isLocating: false })
      wx.showToast({
        title: 'No matching city, please select manually',
        icon: 'none'
      })
    }
  },

  // Calculate distance between two points
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  // Region selection changed
  onRegionChange(e) {
    const region = e.detail.value
    this.setData({ region })
  },

  // Common city selection
  selectCity(e) {
    const city = e.currentTarget.dataset.city
    const cityRegionMap = {
      'Beijing': ['Beijing', 'Beijing', 'Dongcheng'],
      'Shanghai': ['Shanghai', 'Shanghai', 'Huangpu'],
      'Guangzhou': ['Guangdong', 'Guangzhou', 'Tianhe'],
      'Shenzhen': ['Guangdong', 'Shenzhen', 'Nanshan'],
      'Chengdu': ['Sichuan', 'Chengdu', 'Jinjiang'],
      'Hangzhou': ['Zhejiang', 'Hangzhou', 'Xihu'],
      'Wuhan': ['Hubei', 'Wuhan', 'Jiangan'],
      'Xi\'an': ['Shaanxi', 'Xi\'an', 'Yanta'],
      'Chongqing': ['Chongqing', 'Chongqing', 'Yuzhong'],
      'Tianjin': ['Tianjin', 'Tianjin', 'Heping']
    }

    const region = cityRegionMap[city] || cityRegionMap['Beijing']
    this.setData({ region })
  },

  // Confirm selection
  confirmLocation() {
    // Save to global data
    app.globalData.region = this.data.region
    app.globalData.city = this.data.region[1]
    app.globalData.location = this.data.currentLocation

    wx.showToast({
      title: 'Location saved',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateBack()
    }, 1500)
  }
})
