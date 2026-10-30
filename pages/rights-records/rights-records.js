// pages/rights-records/rights-records.js
Page({
  data: {
    records: []
  },

  onLoad() {
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    try {
      const records = wx.getStorageSync('rightsRecords') || [];

      // Add type icons and progress information
      const enrichedRecords = records.map(record => {
        const statusConfig = {
          pending: { progress: 10 },
          processing: { progress: 60 },
          completed: { progress: 100 },
          rejected: { progress: 0 }
        };

        const config = statusConfig[record.status] || statusConfig.pending;
        const typeIconMap = {
          'deposit': '💰',
          'fee': '🔢',
          'fake': '🏠',
          'breach': '📝',
          'other': '📋'
        };

        return {
          ...record,
          ...config,
          typeIcon: typeIconMap[record.type] || '📋'
        };
      });

      this.setData({ records: enrichedRecords });
    } catch (e) {
      console.error('Failed to load records', e);
    }
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/report-detail/report-detail?id=${id}`
    });
  },

  goToApply() {
    wx.navigateTo({
      url: '/pages/rights-apply/rights-apply'
    });
  }
})
