// Cloud function entry file
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// Cloud function entry
exports.main = async (event, context) => {
  const { action, data } = event
  const wxContext = cloud.getWXContext()

  try {
    switch (action) {
      case 'add':
        // Add housing
        const houseData = {
          ...data,
          _openid: wxContext.OPENID, // Associate user ID
          createTime: new Date().getTime(),
          updateTime: new Date().getTime(),
          status: data.status || 'pending', // Default pending review
          viewCount: 0,
          favoriteCount: 0
        }
        const result = await db.collection('houses').add({
          data: houseData
        })
        return {
          success: true,
          data: result,
          message: 'Published successfully'
        }

      case 'update':
        // Update housing
        const updateResult = await db.collection('houses')
          .doc(data.id)
          .update({
            data: {
              ...data,
              updateTime: new Date().getTime()
            }
          })
        return {
          success: true,
          data: updateResult,
          message: 'Updated successfully'
        }

      case 'delete':
        // Delete housing
        const deleteResult = await db.collection('houses')
          .doc(data.id)
          .remove()
        return {
          success: true,
          data: deleteResult,
          message: 'Deleted successfully'
        }

      case 'get':
        // Get housing detail
        const house = await db.collection('houses')
          .doc(data.id)
          .get()
        return {
          success: true,
          data: house.data,
          message: 'Fetched successfully'
        }

      default:
        return {
          success: false,
          message: 'Unknown operation'
        }
    }
  } catch (err) {
    console.error('[Cloud Function Error]', err)
    return {
      success: false,
      message: err.message || 'Operation failed',
      error: err
    }
  }
}
