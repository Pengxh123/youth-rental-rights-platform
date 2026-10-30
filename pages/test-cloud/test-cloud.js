// pages/test-cloud/test-cloud.js
const app = getApp()

Page({
  data: {
    cloudEnv: '',
    cloudStatus: 'unknown',
    cloudStatusText: 'Checking...',
    testResult: 'Waiting for test...',
    dbResult: 'Waiting for test...'
  },

  onLoad() {
    this.setData({
      cloudEnv: app.globalData.cloudEnv || 'Not configured'
    })
    this.checkCloudStatus()
  },

  checkCloudStatus() {
    try {
      wx.cloud.init({
        env: app.globalData.cloudEnv,
        traceUser: true
      })
      this.setData({
        cloudStatus: 'success',
        cloudStatusText: 'Connected'
      })
    } catch (err) {
      console.error('[Cloud init failed]', err)
      this.setData({
        cloudStatus: 'error',
        cloudStatusText: 'Connection failed: ' + err.message
      })
    }
  },

  testCloudFunction() {
    this.setData({ testResult: 'Testing...' })

    wx.cloud.callFunction({
      name: 'get-houses',
      data: {
        action: 'list',
        data: {
          page: 1,
          pageSize: 5
        }
      },
      success: (res) => {
        console.log('[Cloud function called successfully]', res)
        const result = res.result
        if (result.success) {
          this.setData({
            testResult: `Success! Retrieved ${result.data.total} listings`
          })
        } else {
          this.setData({
            testResult: `Failed: ${result.message}`
          })
        }
      },
      fail: (err) => {
        console.error('[Cloud function call failed]', err)
        this.setData({
          testResult: `Failed: ${err.errMsg || 'Unknown error'}`
        })
      }
    })
  },

  testDatabase() {
    this.setData({ dbResult: 'Adding...' })

    const testHouse = {
      title: 'Test Listing-' + Date.now(),
      rentType: 'whole',
      houseType: '2',
      area: 80,
      floor: 'Mid-floor',
      decoration: 'Fine decorated',
      price: 3500,
      address: 'Test address',
      latitude: 23.1296,
      longitude: 113.3839,
      images: [],
      facilities: ['Air conditioning', 'Refrigerator'],
      description: 'This is a test listing',
      publisher: {
        name: 'Test user',
        avatar: '',
        phone: '138****8888'
      },
      status: 'approved'
    }

    wx.cloud.callFunction({
      name: 'add-house',
      data: {
        action: 'add',
        data: testHouse
      },
      success: (res) => {
        console.log('[Listing added successfully]', res)
        if (res.result.success) {
          this.setData({
            dbResult: `Success! Listing ID: ${res.result.data._id}`
          })
        } else {
          this.setData({
            dbResult: `Failed: ${res.result.message}`
          })
        }
      },
      fail: (err) => {
        console.error('[Add listing failed]', err)
        this.setData({
          dbResult: `Failed: ${err.errMsg || 'Unknown error'}`
        })
      }
    })
  },

  testGetHouses() {
    this.setData({ dbResult: 'Getting...' })

    wx.cloud.callFunction({
      name: 'get-houses',
      data: {
        action: 'list',
        data: {
          page: 1,
          pageSize: 5
        }
      },
      success: (res) => {
        console.log('[Got listings successfully]', res)
        const result = res.result
        if (result.success) {
          const count = result.data.list.length
          const titles = result.data.list.map(h => h.title).join(', ')
          this.setData({
            dbResult: `Success! Total ${result.data.total} listings\nFirst ${count}: ${titles}`
          })
        } else {
          this.setData({
            dbResult: `Failed: ${result.message}`
          })
        }
      },
      fail: (err) => {
        console.error('[Get listing failed]', err)
        this.setData({
          dbResult: `Failed: ${err.errMsg || 'Unknown error'}`
        })
      }
    })
  }
})