const { UserService, RightsService, HouseService, FavoriteService } = require('../../utils/db-service.js')

Page({
  data: {
    userInfo: null,
    rightsCases: [],
    houseRecords: [],
    favorites: [],
    stats: {
      rightsCount: 0,
      verifyCount: 0,
      topicCount: 0,
      favoriteCount: 0
    },
    messageRights: 'No new messages',
    messageRightsBadge: 0,
    messageInteractive: 'No new messages',
    messageInteractiveBadge: 0,
    messageSystem: 'No new messages',
    messageSystemBadge: 0,
    unreadCount: 0,
    settings: {
      message: true,
      anonymous: false
    },
    cacheSize: '0KB'
  },

  onLoad() {
    this.initCloud()
    this.loadUserData()
  },

  onShow() {
    // Update stats when page shows
    this.updateStatsFromLocal()
  },

  initCloud() {
    if (!wx.cloud) {
      wx.showToast({
        title: 'Please use base library 2.2.3 or above',
        icon: 'none'
      })
      return
    }
    wx.cloud.init({
      env: 'rent-rights-prod',
      traceUser: true
    })
  },

  async loadUserData() {
    try {
      wx.showLoading({ title: 'Loading...' })

      // First read user info from local storage
      const localUserInfo = wx.getStorageSync('userInfo')

      if (localUserInfo) {
        this.setData({ userInfo: localUserInfo })
      }

      // Try to get data from cloud
      try {
        const openid = await this.getOpenid()
        const userInfo = await UserService.getUserInfo(openid)

        if (userInfo) {
          this.setData({ userInfo })
          await this.loadRightsCases(openid)
          await this.loadHouseRecords(openid)
          await this.loadFavorites(openid)

          // Update statistics
          this.updateStats()
        }
      } catch (cloudError) {
        console.log('Cloud data loading failed, using local data:', cloudError)
        // Cloud loading failed, using local data
        this.updateStatsFromLocal()
      }
      // Load message data
      this.loadMessages()

      // Load settings
      const settings = wx.getStorageSync('userSettings') || {
        message: true,
        anonymous: false
      }
      this.setData({ settings })

      // Calculate cache size
      this.calculateCacheSize()

      wx.hideLoading()
    } catch (error) {
      wx.hideLoading()
      console.error('Failed to load user data:', error)
      wx.showToast({
        title: 'Failed to load',
        icon: 'none'
      })
    }
  },

  // Update stats from local data
  updateStatsFromLocal() {
    const localUserInfo = wx.getStorageSync('userInfo') || {}
    const stats = {
      rightsCount: 0,
      verifyCount: 0,
      topicCount: 0,
      favoriteCount: 0
    }

    // Read actual data from local storage
    try {
      const rightsRecords = wx.getStorageSync('rightsRecords') || []
      stats.rightsCount = rightsRecords.length
    } catch (e) {
      console.error('Failed to read rights records', e)
    }

    try {
      const feeCheckRecords = wx.getStorageSync('feeCheckRecords') || []
      stats.verifyCount = feeCheckRecords.length
    } catch (e) {
      console.error('Failed to read verification records', e)
    }

    try {
      const myTopics = wx.getStorageSync('myTopics') || []
      stats.topicCount = myTopics.length
    } catch (e) {
      console.error('Failed to read topic records', e)
    }

    try {
      const favorites = wx.getStorageSync('favorites') || []
      stats.favoriteCount = favorites.length
    } catch (e) {
      console.error('Failed to read favorite records', e)
    }

    this.setData({ stats })
  },

  // Load message data
  loadMessages() {
    // Read badge status from local storage, use mock data if not found
    const savedBadges = wx.getStorageSync('messageBadges')

    if (savedBadges) {
      // Use badge status from local storage
      this.setData({
        messageRightsBadge: savedBadges.messageRightsBadge || 0,
        messageInteractiveBadge: savedBadges.messageInteractiveBadge || 0,
        messageSystemBadge: savedBadges.messageSystemBadge || 0,
        unreadCount: (savedBadges.messageRightsBadge || 0) +
                    (savedBadges.messageInteractiveBadge || 0) +
                    (savedBadges.messageSystemBadge || 0)
      })
    } else {
      // Use mock data
      const messageData = this.getMockMessages()
      this.setData(messageData)
    }
  },

  // Get mock message data
  getMockMessages() {
    return {
      messageRights: 'You have 2 rights protection record updates',
      messageRightsBadge: 2,
      messageInteractive: 'Rental pitfall experts and 2 others replied to your topics',
      messageInteractiveBadge: 3,
      messageSystem: 'Platform feature update: New fee calculator added',
      messageSystemBadge: 1,
      unreadCount: 6
    }
  },

  async getOpenid() {
    try {
      if (!wx.cloud) {
        console.warn('Cloud development not initialized, returning mock openid')
        return 'mock_openid_' + Date.now()
      }
      const res = await wx.cloud.callFunction({
        name: 'login'
      })
      return res.result.openid
    } catch (error) {
      console.error('Failed to get openid:', error)
      console.warn('Cloud function call failed, returning mock openid')
      return 'mock_openid_' + Date.now()
    }
  },

  async loadRightsCases(openid) {
    try {
      const cases = await RightsService.getRightsCases(openid)
      this.setData({ rightsCases: cases })
    } catch (error) {
      console.error('Failed to load rights cases:', error)
    }
  },

  async loadHouseRecords(openid) {
    try {
      const records = await HouseService.getHouseRecords(openid)
      this.setData({ houseRecords: records })
    } catch (error) {
      console.error('Failed to load house records:', error)
    }
  },

  async loadFavorites(openid) {
    try {
      const favorites = await FavoriteService.getFavorites(openid)
      this.setData({ favorites })
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  },

  // Update statistics
  updateStats() {
    // Prioritize using locally stored verification record data to ensure real-time updates
    try {
      const feeCheckRecords = wx.getStorageSync('feeCheckRecords') || []
      this.setData({ stats: {
        rightsCount: this.data.rightsCases.length || 0,
        verifyCount: feeCheckRecords.length || 0,
        topicCount: 0, // Need to get from topic service
        favoriteCount: this.data.favorites.length || 0
      }})
    } catch (e) {
      console.error('Failed to read verification records', e)
      // If reading fails, use default values
      this.setData({ stats: {
        rightsCount: this.data.rightsCases.length || 0,
        verifyCount: this.data.houseRecords.length || 0,
        topicCount: 0, // Need to get from topic service
        favoriteCount: this.data.favorites.length || 0
      }})
    }
  },

  async onSaveUserInfo(e) {
    const { name, phone, idCard } = e.detail.value

    try {
      wx.showLoading({ title: 'Saving...' })

      const openid = await this.getOpenid()
      const userInfo = await UserService.getUserInfo(openid)

      if (userInfo) {
        await UserService.updateUserInfo(openid, { name, phone, idCard })
      } else {
        await UserService.createUserInfo({
          name,
          phone,
          idCard,
          avatar: this.data.avatar || '',
          nickname: this.data.nickname || ''
        })
      }

      await this.loadUserData()
      wx.hideLoading()
      wx.showToast({
        title: 'Saved successfully',
        icon: 'success'
      })
    } catch (error) {
      wx.hideLoading()
      console.error('Failed to save user info:', error)
      wx.showToast({
        title: 'Failed to save',
        icon: 'none'
      })
    }
  },

  async onCreateRightsCase(e) {
    const { title, description, type, evidence } = e.detail.value

    try {
      wx.showLoading({ title: 'Submitting...' })

      const openid = await this.getOpenid()
      await RightsService.createRightsCase({
        title,
        description,
        type,
        evidence,
        openid
      })

      await this.loadRightsCases(openid)
      wx.hideLoading()
      wx.showToast({
        title: 'Submitted successfully',
        icon: 'success'
      })
    } catch (error) {
      wx.hideLoading()
      console.error('Failed to submit rights case:', error)
      wx.showToast({
        title: 'Failed to submit',
        icon: 'none'
      })
    }
  },

  async onSaveHouseRecord(e) {
    const { city, district, address, price, area, landlord } = e.detail.value

    try {
      wx.showLoading({ title: 'Saving...' })

      const openid = await this.getOpenid()
      await HouseService.saveHouseRecord({
        city,
        district,
        address,
        price,
        area,
        landlord,
        openid
      })

      await this.loadHouseRecords(openid)
      wx.hideLoading()
      wx.showToast({
        title: 'Saved successfully',
        icon: 'success'
      })
    } catch (error) {
      wx.hideLoading()
      console.error('Failed to save house record:', error)
      wx.showToast({
        title: 'Failed to save',
        icon: 'none'
      })
    }
  },

  async onAddFavorite(e) {
    const { houseId, title, price, address } = e.currentTarget.dataset

    try {
      const openid = await this.getOpenid()
      await FavoriteService.addFavorite({
        houseId,
        title,
        price,
        address,
        openid
      })

      await this.loadFavorites(openid)
      wx.showToast({
        title: 'Added to favorites',
        icon: 'success'
      })
    } catch (error) {
      console.error('Failed to add to favorites:', error)
      wx.showToast({
        title: 'Failed to add to favorites',
        icon: 'none'
      })
    }
  },

  async onRemoveFavorite(e) {
    const { id } = e.currentTarget.dataset

    try {
      await FavoriteService.removeFavorite(id)
      const openid = await this.getOpenid()
      await this.loadFavorites(openid)
      wx.showToast({
        title: 'Removed from favorites',
        icon: 'success'
      })
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
      wx.showToast({
        title: 'Operation failed',
        icon: 'none'
      })
    }
  },

  // Navigate to specified page
  navigateTo(e) {
    const page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: page,
      fail: (err) => {
        console.error('Page navigation failed:', err)
        wx.showToast({
          title: 'Failed to navigate',
          icon: 'none'
        })
      }
    })
  },

  // Edit avatar
  editAvatar() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        this.setData({
          avatar: tempFilePaths[0]
        })
        wx.showToast({
          title: 'Avatar selected',
          icon: 'success'
        })
      }
    })
  },

  // Edit profile
  editProfile() {
    wx.navigateTo({
      url: '/pages/profile-edit/profile-edit',
      fail: (err) => {
        console.error('Page navigation failed:', err)
      }
    })
  },

  // View records
  viewRecords(e) {
    const type = e.currentTarget.dataset.type

    switch (type) {
      case 'rights':
        // Navigate to rights records
        wx.navigateTo({
          url: '/pages/rights-records/rights-records'
        })
        break
      case 'verify':
        // Navigate to verification report
        wx.navigateTo({
          url: '/pages/verify-result/verify-result'
        })
        break
      case 'topics':
        // Navigate to my topics page
        wx.navigateTo({
          url: '/pages/my-topics/my-topics'
        })
        break
      case 'favorites':
        // Navigate to favorites page
        wx.navigateTo({
          url: '/pages/my-favorites/my-favorites'
        })
        break
    }
  },

  // View messages
  viewMessage(e) {
    const type = e.currentTarget.dataset.type
    console.log('View messages:', type)

    // Clear badge for corresponding type
    this.clearMessageBadge(type)

    switch (type) {
      case 'rights':
        // Navigate to rights records
        wx.navigateTo({
          url: '/pages/rights-records/rights-records'
        })
        break
      case 'interactive':
        // Navigate to message detail page
        wx.navigateTo({
          url: '/pages/message-detail/message-detail?type=interactive'
        })
        break
      case 'system':
        // Navigate to message detail page
        wx.navigateTo({
          url: '/pages/message-detail/message-detail?type=system'
        })
        break
    }
  },

  // Clear message badge
  clearMessageBadge(type) {
    const badgeKey = `message${type.charAt(0).toUpperCase() + type.slice(1)}Badge`

    if (this.data[badgeKey] > 0) {
      // Update badge for corresponding type to 0
      this.setData({
        [badgeKey]: 0,
        unreadCount: this.data.unreadCount - 1
      })

      // Store to local
      wx.setStorageSync('messageBadges', this.data)
    }
  },

  // Toggle setting
  toggleSetting(e) {
    const setting = e.currentTarget.dataset.setting
    const settings = this.data.settings || {}

    settings[setting] = !settings[setting]
    this.setData({ settings })

    wx.setStorageSync('userSettings', settings)
    wx.showToast({
      title: settings[setting] ? 'Enabled' : 'Disabled',
      icon: 'success'
    })
  },

  // Setting change
  onSettingChange(e) {
    const { setting } = e.currentTarget.dataset
    const value = e.detail.value

    const settings = this.data.settings || {}
    settings[setting] = value

    this.setData({ settings })
    wx.setStorageSync('userSettings', settings)
  },

  // Clear cache
  clearCache() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Clear Cache',
      content: 'Are you sure you want to clear all cache data?',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync()
            wx.showToast({
              title: 'Cache cleared',
              icon: 'success'
            })
            this.setData({ cacheSize: '0KB' })

            setTimeout(() => {
              this.onLoad()
            }, 1000)
          } catch (error) {
            console.error('Failed to clear cache:', error)
            wx.showToast({
              title: 'Failed to clear',
              icon: 'none'
            })
          }
        }
      }
    })
  },

  // Log out
  logout() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Log Out',
      content: 'Are you sure you want to log out?',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('userInfo')
            this.setData({ userInfo: null })
            wx.showToast({
              title: 'Logged out',
              icon: 'success'
            })
          } catch (error) {
            console.error('Failed to log out:', error)
          }
        }
      }
    })
  },

  // Login
  login() {
    wx.showToast({
      title: 'Please use mini program login function',
      icon: 'none',
      duration: 2000
    })

    // Mock login
    setTimeout(() => {
      const userInfo = {
        nickName: 'Rental User' + Math.floor(Math.random() * 1000),
        avatar: '',
        realName: '',
        mobile: ''
      }

      wx.setStorageSync('userInfo', userInfo)
      this.setData({ userInfo })
      this.updateStatsFromLocal()
      this.loadMessages()

      wx.showToast({
        title: 'Login successful',
        icon: 'success'
      })
    }, 500)
  },

  // Calculate cache size
  calculateCacheSize() {
    try {
      const res = wx.getStorageInfoSync()
      const sizeInKB = res.currentSize / 1024
      const sizeText = sizeInKB < 1024
        ? Math.round(sizeInKB) + 'KB'
        : (sizeInKB / 1024).toFixed(2) + 'MB'

      this.setData({ cacheSize: sizeText })
    } catch (error) {
      console.error('Failed to get cache info:', error)
      this.setData({ cacheSize: '0KB' })
    }
  }
})
