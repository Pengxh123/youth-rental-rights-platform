// pages/about/about.js
Page({
  data: {

  },

  onLoad(options) {

  },

  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: 'Youth Rental Rights Protection Service Platform - Avoid pitfalls when choosing, rights protection with me',
      path: '/pages/index/index'
    };
  }
})
