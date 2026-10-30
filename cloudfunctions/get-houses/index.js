// Cloud function entry file
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// Cloud function entry
exports.main = async (event, context) => {
  const { action, data } = event

  try {
    switch (action) {
      case 'list':
        // Get housing list
        const { page = 1, pageSize = 10, status, keyword, rentType, houseType, priceRange } = data
        
        let query = db.collection('houses')
        
        // Status filter
        if (status && status !== 'all') {
          query = query.where({
            status: status
          })
        }
        
        // Keyword search
        if (keyword) {
          query = query.where({
            title: db.RegExp({
              regexp: keyword,
              options: 'i'
            })
          })
        }
        
        // Rent type filter
        if (rentType) {
          query = query.where({
            rentType: rentType
          })
        }
        
        // House type filter
        if (houseType) {
          query = query.where({
            houseType: houseType
          })
        }
        
        // Price range filter
        if (priceRange) {
          const [minPrice, maxPrice] = priceRange.split('-').map(Number)
          if (minPrice === 0) {
            query = query.where({
              price: _.lt(maxPrice)
            })
          } else if (maxPrice === 0) {
            query = query.where({
              price: _.gte(minPrice)
            })
          } else {
            query = query.where({
              price: _.gte(minPrice).and(_.lte(maxPrice))
            })
          }
        }
        
        // Sort (newest first)
        query = query.orderBy('createTime', 'desc')
        
        // Pagination
        const result = await query
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .get()
        
        // Get total count
        const countResult = await query.count()
        
        return {
          success: true,
          data: {
            list: result.data,
            total: countResult.total,
            page: page,
            pageSize: pageSize
          },
          message: 'Fetched successfully'
        }

      case 'nearby':
        // Get nearby housing
        const { latitude, longitude, radius = 5000 } = data
        
        // Calculate distance (simplified version, using circular area)
        const nearbyResult = await db.collection('houses')
          .where({
            status: 'approved',
            latitude: db.command.gte(latitude - 0.01).and(db.command.lte(latitude + 0.01)),
            longitude: db.command.gte(longitude - 0.01).and(db.command.lte(longitude + 0.01))
          })
          .orderBy('createTime', 'desc')
          .limit(20)
          .get()
        
        // Calculate distance for each housing
        const housesWithDistance = nearbyResult.data.map(house => {
          const distance = calculateDistance(latitude, longitude, house.latitude, house.longitude)
          return {
            ...house,
            distance: Math.round(distance)
          }
        })
        
        // Sort by distance
        housesWithDistance.sort((a, b) => a.distance - b.distance)
        
        return {
          success: true,
          data: {
            list: housesWithDistance,
            total: housesWithDistance.length
          },
          message: 'Fetched successfully'
        }

      case 'my':
        // Get my housing
        const wxContext = cloud.getWXContext()
        const { myPage = 1, myPageSize = 10, myStatus } = data
        
        let myQuery = db.collection('houses').where({
          _openid: wxContext.OPENID
        })
        
        if (myStatus && myStatus !== 'all') {
          myQuery = myQuery.where({
            status: myStatus
          })
        }
        
        const myResult = await myQuery
          .orderBy('createTime', 'desc')
          .skip((myPage - 1) * myPageSize)
          .limit(myPageSize)
          .get()
        
        return {
          success: true,
          data: {
            list: myResult.data,
            total: myResult.data.length
          },
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

// Calculate distance between two points (meters)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000 // Earth radius (meters)
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
