const config = require('./api-config.js')

class ApiRequest {
  constructor() {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
    this.appId = config.appId
  }

  // Fix API request endpoint format
  getEndpoint(path) {
    // Ensure endpoint starts with slash
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return path
  }

  generateAuthHeader() {
    const timestamp = Date.now()
    const signature = this.generateSignature(timestamp)
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'X-App-Id': this.appId,
      'X-Timestamp': timestamp,
      'Content-Type': 'application/json'
    }
  }

  generateSignature(timestamp) {
    // Use simpler signing method to ensure API works
    if (config.debug) {
      console.log('Generated signature params:', {
        appId: this.appId,
        timestamp: timestamp,
        apiKey: this.apiKey
      })
    }
    
    const signStr = `${this.appId}${timestamp}${this.apiKey}`
    let hash = 0
    for (let i = 0; i < signStr.length; i++) {
      const char = signStr.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return hash.toString(16)
  }

  request(endpoint, data = {}, method = 'POST') {
    const finalEndpoint = this.getEndpoint(endpoint)
    
    if (config.debug) {
      console.log('API request details:', {
        url: `${this.baseUrl}${finalEndpoint}`,
        method: method,
        data: data,
        headers: this.generateAuthHeader()
      })
    }
    
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}${finalEndpoint}`,
        method: method,
        data: data,
        header: this.generateAuthHeader(),
        timeout: config.timeout,
        success: (res) => {
          if (config.debug) {
            console.log('API response status code:', res.statusCode)
            console.log('API response data:', res.data)
          }
          
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            const errorMsg = `Request failed: ${res.statusCode} ${res.data?.message || 'Unknown error'}`
            reject(new Error(errorMsg))
          }
        },
        fail: (err) => {
          const errorMsg = `Network request failed: ${err.errMsg || 'Network error'}`
          if (config.debug) {
            console.error('API request failed details:', err)
          }
          reject(new Error(errorMsg))
        }
      })
    })
  }

  async getRentPrice(city, district, roomType, area) {
    try {
      const response = await this.request('/chat', {
        model: 'xop3qwen1b7',
        messages: [
          {
            role: 'system',
            content: 'You are a professional real estate data query assistant, providing accurate rent and utility fee information.'
          },
          {
            role: 'user',
            content: `Please query the current market rent price for ${roomType} in ${city} ${district}, area ${area} sqm, and return JSON format data containing: avgPrice (average price), minPrice (lowest price), maxPrice (highest price), unit, updateTime`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
      
      const content = response.choices?.[0]?.message?.content || '{}'
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return null
    } catch (error) {
      console.error('Failed to get rent data:', error)
      throw error
    }
  }

  async getUtilityRates(city) {
    try {
      const response = await this.request('/chat', {
        model: 'xop3qwen1b7',
        messages: [
          {
            role: 'system',
            content: 'You are a professional utility rate query assistant, providing accurate water and electricity fee standards.'
          },
          {
            role: 'user',
            content: `Please query the current water and electricity fee standards in ${city}, and return JSON format data containing: waterPrice (water price, including civil residential and commercial), elecPrice (electricity price, including civil residential and commercial), gasPrice (gas price), unit, updateTime`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      })
      
      const content = response.choices?.[0]?.message?.content || '{}'
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return null
    } catch (error) {
      console.error('Failed to get utility data:', error)
      throw error
    }
  }

  async getCityRentData(city) {
    try {
      const response = await this.request('/chat', {
        model: 'xop3qwen1b7',
        messages: [
          {
            role: 'system',
            content: 'You are a professional real estate data query assistant.'
          },
          {
            role: 'user',
            content: `Please provide rental market data for ${city}, including average rent by area, rent ranges, market trends, etc., return in JSON format`
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      })
      
      const content = response.choices?.[0]?.message?.content || '{}'
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      }
      return null
    } catch (error) {
      console.error('Failed to get city rental data:', error)
      throw error
    }
  }
}

module.exports = new ApiRequest()
