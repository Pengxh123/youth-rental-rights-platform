// pages/user-center/user-center.js
const app = getApp()

Page({
  data: {
    userInfo: {
      avatar: '',
      nickname: 'Not logged in',
      phone: ''
    },
    isLogin: false,
    
    stats: {
      rightsCases: 0,
      checkReports: 0,
      posts: 0,
      favorites: 0
    },
    
    featureList: [
      {
        icon: '📋',
        title: 'My Rights',
        desc: 'Check rights progress and results',
        page: '/pages/rights-station/rights-station',
        badge: 0
      },
      {
        icon: '📊',
        title: 'Verification Reports',
        desc: 'View fee verification history',
        page: '/pages/fee-check/fee-check',
        badge: 0
      },
      {
        icon: '💬',
        title: 'My Topics',
        desc: 'Manage my published topics',
        page: '/pages/my-topics/my-topics',
        badge: 0
      },
      {
        icon: '⭐',
        title: 'My Favorites',
        desc: 'Saved rental tips and tools',
        page: '',
        badge: 0
      }
    ],
    
    settingsList: [
      {
        icon: '🔔',
        title: 'Notifications',
        desc: 'Enable or disable push notifications',
        value: 'Enabled'
      },
      {
        icon: '🔒',
        title: 'Privacy Settings',
        desc: 'Manage anonymous posting options',
        page: ''
      },
      {
        icon: '💭',
        title: 'Feedback',
        desc: 'Send us suggestions',
        page: ''
      },
      {
        icon: '🧹',
        title: 'Clear Cache',
        desc: 'Clear app cache data',
        action: 'clearCache'
      },
      {
        icon: 'ℹ️',
        title: 'About Us',
        desc: 'Learn about the platform',
        page: ''
      }
    ],
    
    notifications: [
      {
        id: 1,
        type: 'Rights',
        title: 'Rights Progress Update',
        content: 'Your rights application R1234567890 has been processed',
        time: '2 hours ago',
        isRead: false
      },
      {
        id: 2,
        type: 'Interaction',
        title: 'New Comment',
        content: 'Someone commented on your post',
        time: '5 hours ago',
        isRead: false
      },
      {
        id: 3,
        type: 'Announcement',
        title: 'Platform Notice',
        content: 'Rental rights legal guide updated',
        time: '1 day ago',
        isRead: true
      }
    ]
  },

  onLoad() {
    this.loadUserInfo()
    this.loadStats()
  },

  onShow() {
    this.loadStats()
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({
        userInfo,
        isLogin: true
      })
    }
  },

  loadStats() {
    const rightsCases = wx.getStorageSync('rightsCases') || []
    const discussionPosts = wx.getStorageSync('discussionPosts') || []
    
    this.setData({
      'stats.rightsCases': rightsCases.length,
      'stats.posts': discussionPosts.length
    })
  },

  login() {
    console.log('Login button clicked')
    
    wx.showLoading({
      title: 'Logging in...'
    })

    wx.getUserInfo({
      success: (res) => {
        console.log('Get user info success', res)
        const userInfo = {
          avatar: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName,
          phone: ''
        }

        this.setData({
          userInfo,
          isLogin: true
        })

        wx.setStorageSync('userInfo', userInfo)
        app.globalData.userInfo = userInfo

        wx.hideLoading()
        wx.showToast({
          title: 'Login successful',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('Get user info failed', err)
        wx.hideLoading()
        
        const userInfo = {
          avatar: '/images/default-avatar.png',
          nickname: 'Renter' + Math.floor(Math.random() * 1000),
          phone: ''
        }

        this.setData({
          userInfo,
          isLogin: true
        })

        wx.setStorageSync('userInfo', userInfo)
        app.globalData.userInfo = userInfo

        wx.showToast({
          title: 'Login successful',
          icon: 'success'
        })
      }
    })
  },

  editProfile() {
    if (!this.data.isLogin) {
      this.login()
      return
    }
    
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Edit Profile',
      content: 'Feature in development',
      showCancel: false
    })
  },

  navigateTo(e) {
    const { page } = e.currentTarget.dataset
    
    if (page) {
      wx.navigateTo({
        url: page
      })
    } else {
      wx.showToast({
        title: 'Feature in development',
        icon: 'none'
      })
    }
  },

  onSettingTap(e) {
    const { action, title } = e.currentTarget.dataset
    
    if (action === 'clearCache') {
      wx.showModal({
        cancelText: 'No',
        title: 'Clear Cache',
        content: 'Are you sure you want to clear cache?',
        confirmText: 'Wipe',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({ title: 'Clearing...' })
            setTimeout(() => {
              wx.hideLoading()
              wx.showToast({
                title: 'Cache cleared',
                icon: 'success'
              })
            }, 1500)
          }
        }
      })
    } else if (title === 'Notifications') {
      wx.showModal({
        cancelText: 'No',
        title: 'Notifications',
        content: 'Enable push notifications?',
        confirmText: 'Turn',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: 'Enabled',
              icon: 'success'
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: 'Feature in development',
        icon: 'none'
      })
    }
  },

  viewNotification(e) {
    const id = e.currentTarget.dataset.id
    const notification = this.data.notifications.find(item => item.id === id)
    
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: notification.title,
      content: notification.content,
      showCancel: false
    })
    
    const notifications = this.data.notifications
    const index = notifications.findIndex(item => item.id === id)
    if (index !== -1) {
      notifications[index].isRead = true
      this.setData({ notifications })
    }
  },

  markAllRead() {
    const notifications = this.data.notifications.map(item => ({
      ...item,
      isRead: true
    }))
    this.setData({ notifications })
    
    wx.showToast({
      title: 'All marked as read',
      icon: 'success'
    })
  },

  logout() {
    wx.showModal({
      cancelText: 'No',
      title: 'Logout',
      content: 'Are you sure you want to logout?',
      confirmText: 'Exit',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          app.globalData.userInfo = null
          
          this.setData({
            isLogin: false,
            userInfo: {
              avatar: '',
              nickname: 'Not logged in',
              phone: ''
            }
          })
          
          wx.showToast({
            title: 'Logged out',
            icon: 'success'
          })
        }
      }
    })
  }
})
