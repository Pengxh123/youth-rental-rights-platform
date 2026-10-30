// pages/my-favorites/my-favorites.js
Page({
  data: {
    favorites: []
  },

  onLoad(options) {
    this.loadFavorites();
  },

  onShow() {
    this.loadFavorites();
  },

  loadFavorites() {
    try {
      const favorites = wx.getStorageSync('favorites') || [];
      this.setData({ favorites });
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  },

  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (item.type === 'topic') {
      // If complete content exists, pass directly to detail page
      if (item.content) {
        wx.navigateTo({
          url: `/pages/favorite-detail/favorite-detail?data=${encodeURIComponent(JSON.stringify(item))}`
        });
      } else {
        // No complete data, navigate to original topic detail
        wx.navigateTo({
          url: `/pages/topic-detail/topic-detail?id=${item.targetId}`
        });
      }
    } else if (item.type === 'house') {
      // Navigate to map page with house details
      wx.navigateTo({
        url: `/pages/house-map/house-map?houseDetail=${encodeURIComponent(JSON.stringify(item))}`
      });
    } else if (item.type === 'contract') {
      // Navigate to contract template page
      wx.navigateTo({
        url: `/pages/contract-template/contract-template`
      });
    } else {
      wx.showToast({
        title: 'View Details',
        icon: 'none'
      });
    }
  },

  removeFavorite(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Remove Favorite',
      content: 'Are you sure you want to remove this favorite?',
      success: (res) => {
        if (res.confirm) {
          try {
            let favorites = wx.getStorageSync('favorites') || [];
            favorites = favorites.filter(item => item.id != id && item.targetId != id);
            wx.setStorageSync('favorites', favorites);
            this.setData({ favorites });

            wx.showToast({
              title: 'Removed',
              icon: 'success'
            });
          } catch (e) {
            console.error('Failed to remove favorite', e);
          }
        }
      }
    });
  },

  clearAll() {
    wx.showModal({
      cancelText: 'No',
      title: 'Clear All Favorites',
      content: 'Are you sure you want to clear all favorites? This action cannot be undone.',
      confirmText: 'Wipe',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync('favorites');
            this.setData({ favorites: [] });

            wx.showToast({
              title: 'All cleared',
              icon: 'success'
            });
          } catch (e) {
            console.error('Failed to clear', e);
          }
        }
      }
    });
  },

  goToExplore() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  onShareAppMessage() {
    return {
      title: 'My Favorites - Youth Rental Rights',
      path: '/pages/my-favorites/my-favorites'
    };
  }
})
