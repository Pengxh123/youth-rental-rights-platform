const { db, cloudInitialized } = require('./cloud.js')

const DB = {
  users: 'users',
  rightsCases: 'rights_cases',
  houseRecords: 'house_records',
  favorites: 'favorites'
}

const UserService = {
  async getUserInfo(openid) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, returning empty user info')
      return null
    }

    try {
      const res = await db.collection(DB.users).where({
        _openid: openid
      }).get()
      return res.data[0] || null
    } catch (error) {
      console.error('Failed to get user info:', error)
      throw error
    }
  },

  async createUserInfo(userInfo) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, cannot create user info')
      return null
    }

    try {
      const res = await db.collection(DB.users).add({
        data: {
          ...userInfo,
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
      return res._id
    } catch (error) {
      console.error('Failed to create user info:', error)
      throw error
    }
  },

  async updateUserInfo(openid, updateData) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, cannot update user info')
      return 0
    }

    try {
      const res = await db.collection(DB.users).where({
        _openid: openid
      }).update({
        data: {
          ...updateData,
          updateTime: db.serverDate()
        }
      })
      return res.stats.updated
    } catch (error) {
      console.error('Failed to update user info:', error)
      throw error
    }
  }
}

const RightsService = {
  async createRightsCase(caseData) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, cannot create rights record')
      return null
    }

    try {
      const res = await db.collection(DB.rightsCases).add({
        data: {
          ...caseData,
          status: 'pending',
          createTime: db.serverDate(),
          updateTime: db.serverDate()
        }
      })
      return res._id
    } catch (error) {
      console.error('Failed to create rights record:', error)
      throw error
    }
  },

  async getRightsCases(openid, status = null) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, returning empty rights records')
      return []
    }

    try {
      let query = db.collection(DB.rightsCases).where({
        _openid: openid
      })
      
      if (status) {
        query = query.where({ status })
      }
      
      const res = await query.orderBy('createTime', 'desc').get()
      return res.data
    } catch (error) {
      console.error('Failed to get rights records:', error)
      throw error
    }
  },

  async updateRightsCase(caseId, updateData) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, cannot update rights record')
      return 0
    }

    try {
      const res = await db.collection(DB.rightsCases).doc(caseId).update({
        data: {
          ...updateData,
          updateTime: db.serverDate()
        }
      })
      return res.stats.updated
    } catch (error) {
      console.error('Failed to update rights record:', error)
      throw error
    }
  }
}

const HouseService = {
  async saveHouseRecord(recordData) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, cannot save house record')
      return null
    }

    try {
      const res = await db.collection(DB.houseRecords).add({
        data: {
          ...recordData,
          createTime: db.serverDate()
        }
      })
      return res._id
    } catch (error) {
      console.error('Failed to save house record:', error)
      throw error
    }
  },

  async getHouseRecords(openid) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, returning empty house records')
      return []
    }

    try {
      const res = await db.collection(DB.houseRecords).where({
        _openid: openid
      }).orderBy('createTime', 'desc').get()
      return res.data
    } catch (error) {
      console.error('Failed to get house records:', error)
      throw error
    }
  }
}

const FavoriteService = {
  async addFavorite(favoriteData) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, cannot add favorite')
      return null
    }

    try {
      const res = await db.collection(DB.favorites).add({
        data: {
          ...favoriteData,
          createTime: db.serverDate()
        }
      })
      return res._id
    } catch (error) {
      console.error('Failed to add favorite:', error)
      throw error
    }
  },

  async removeFavorite(favoriteId) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, cannot remove favorite')
      return 0
    }

    try {
      const res = await db.collection(DB.favorites).doc(favoriteId).remove()
      return res.stats.removed
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      throw error
    }
  },

  async getFavorites(openid) {
    if (!cloudInitialized || !db) {
      console.warn('Cloud not initialized, returning empty favorites')
      return []
    }

    try {
      const res = await db.collection(DB.favorites).where({
        _openid: openid
      }).orderBy('createTime', 'desc').get()
      return res.data
    } catch (error) {
      console.error('Failed to get favorites:', error)
      throw error
    }
  }
}

module.exports = {
  UserService,
  RightsService,
  HouseService,
  FavoriteService
}
