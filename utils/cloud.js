let db = null
let cloudInitialized = false

if (wx.cloud) {
  try {
    wx.cloud.init({
      env: 'YOUR_CLOUD_ENV_ID',
      traceUser: true
    })
    db = wx.cloud.database()
    cloudInitialized = true
  } catch (error) {
    console.error('Cloud development init failed:', error)
  }
}

module.exports = {
  db,
  cloudInitialized
}
