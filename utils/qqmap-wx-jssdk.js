/**
 * Tencent Map WeChat Mini Program JavaScript SDK
 * Download URL: https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview
 * 
 * Note: This is a simplified version, please download the full SDK from Tencent Location Service
 * Official site: https://lbs.qq.com/
 */

// Tencent Map Mini Program SDK placeholder
// In actual projects, please visit https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview to download the full SDK
// Put the downloaded js-sdk.js into utils directory and rename to qqmap-wx-jssdk.js

module.exports = class QQMapWX {
  constructor(options) {
    console.warn('Please download the full SDK from Tencent Location Service');
    console.log('Official site: https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview');
    this.key = options.key;
  }

  // Reverse geocoding
  reverseGeocoder(options) {
    if (typeof options.fail === 'function') {
      options.fail({
        status: 0,
        message: 'Please use the full Tencent Map SDK'
      });
    }
  }

  // Place search
  search(options) {
    if (typeof options.fail === 'function') {
      options.fail({
        status: 0,
        message: 'Please use the full Tencent Map SDK'
      });
    }
  }

  // Keyword input suggestion
  getSuggestion(options) {
    if (typeof options.fail === 'function') {
      options.fail({
        status: 0,
        message: 'Please use the full Tencent Map SDK'
      });
    }
  }
};

/* 
Usage instructions:

1. Visit https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview
2. Download the latest JavaScript SDK
3. Rename the downloaded file to qqmap-wx-jssdk.js
4. Replace current file
5. Apply for a key at Tencent Location Service
6. Replace 'YOUR_QQ_MAP_KEY' with your key in code

Example code:
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
let qqmapsdk = new QQMapWX({
  key: 'YOUR_QQ_MAP_KEY' // Required
});
*/
