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

  try {
    switch (action) {
      case 'approve':
        // Approve
        const approveResult = await db.collection('houses')
          .doc(data.id)
          .update({
            data: {
              status: 'approved',
              updateTime: new Date().getTime(),
              auditNote: ''
            }
          })
        return {
          success: true,
          data: approveResult,
          message: 'Approved'
        }

      case 'reject':
        // Reject
        const rejectResult = await db.collection('houses')
          .doc(data.id)
          .update({
            data: {
              status: 'rejected',
              updateTime: new Date().getTime(),
              auditNote: data.auditNote || 'Rejected'
            }
          })
        return {
          success: true,
          data: rejectResult,
          message: 'Rejected'
        }

      case 'pending':
        // Set as pending
        const pendingResult = await db.collection('houses')
          .doc(data.id)
          .update({
            data: {
              status: 'pending',
              updateTime: new Date().getTime()
            }
          })
        return {
          success: true,
          data: pendingResult,
          message: 'Set to pending'
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
