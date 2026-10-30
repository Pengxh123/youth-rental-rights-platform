// Cloud development utility
const app = getApp()

class CloudHelper {
  constructor() {
    this.initCloud()
  }

  // Initialize cloud development
  initCloud() {
    if (!wx.cloud) {
      console.error('Please use base library 2.2.3+ for cloud capabilities')
    } else {
      wx.cloud.init({
        env: app.globalData.cloudEnv || 'your-cloud-env-id', // Replace with your cloud env ID
        traceUser: true
      })
    }
  }

  // Call cloud function
  async callFunction(name, data = {}) {
    try {
      const res = await wx.cloud.callFunction({
        name,
        data
      })
      return res.result
    } catch (err) {
      console.error(`[Cloud function call failed] ${name}:`, err)
      wx.showToast({
        title: 'Network error, please retry',
        icon: 'none'
      })
      throw err
    }
  }

  // House related
  async addHouse(data) {
    return this.callFunction('add-house', {
      action: 'add',
      data
    })
  }

  async updateHouse(data) {
    return this.callFunction('add-house', {
      action: 'update',
      data
    })
  }

  async deleteHouse(id) {
    return this.callFunction('add-house', {
      action: 'delete',
      data: { id }
    })
  }

  async getHouse(id) {
    return this.callFunction('add-house', {
      action: 'get',
      data: { id }
    })
  }

  async getHouseList(data = {}) {
    return this.callFunction('get-houses', {
      action: 'list',
      data
    })
  }

  async getNearbyHouses(data = {}) {
    return this.callFunction('get-houses', {
      action: 'nearby',
      data
    })
  }

  async getMyHouses(data = {}) {
    return this.callFunction('get-houses', {
      action: 'my',
      data
    })
  }

  // Audit related
  async approveHouse(id) {
    return this.callFunction('audit-house', {
      action: 'approve',
      data: { id }
    })
  }

  async rejectHouse(id, auditNote) {
    return this.callFunction('audit-house', {
      action: 'reject',
      data: { id, auditNote }
    })
  }

  async pendingHouse(id) {
    return this.callFunction('audit-house', {
      action: 'pending',
      data: { id }
    })
  }

  // Upload image
  async uploadImage(filePath) {
    try {
      const cloudPath = `house-images/${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return res.fileID
    } catch (err) {
      console.error('[Image upload failed]:', err)
      wx.showToast({
        title: 'Image upload failed',
        icon: 'none'
      })
      throw err
    }
  }

  // Batch upload images
  async uploadImages(filePaths) {
    const promises = filePaths.map(path => this.uploadImage(path))
    const results = await Promise.all(promises)
    return results
  }
}

// Export singleton
const cloudHelper = new CloudHelper()
export default cloudHelper
