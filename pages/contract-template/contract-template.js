// pages/contract-template/contract-template.js
Page({
  onLoad(options) {
  },

  previewFull() {
    wx.navigateTo({
      url: '/pages/contract-preview/contract-preview'
    });
  },

  downloadContract() {
    wx.showLoading({
      title: 'Downloading...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: 'Download successful',
        icon: 'success'
      });

      const contract = {
        type: 'contract',
        title: 'Anti-Pitfall Rental Contract Template',
        createTime: new Date().getTime()
      };

      try {
        let favorites = wx.getStorageSync('favorites') || [];
        favorites.push(contract);
        wx.setStorageSync('favorites', favorites);
      } catch (e) {
        console.error('Save failed', e);
      }
    }, 1500);
  }
})
