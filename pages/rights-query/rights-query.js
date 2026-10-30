// pages/rights-query/rights-query.js
Page({
  data: {
    orderNo: '',
    records: []
  },

  onLoad(options) {
    // Order number passed from previous page
    if (options.orderNo) {
      this.setData({ orderNo: options.orderNo });
    }
    this.loadRecords();
  },

  onShow() {
    this.loadRecords();
  },

  onSearchInput(e) {
    this.setData({ orderNo: e.detail.value });
  },

  searchOrder() {
    if (!this.data.orderNo) {
      wx.showToast({
        title: 'Please enter rights protection order number',
        icon: 'none'
      });
      return;
    }

    // Simulating search
    wx.showLoading({
      title: 'Searching...'
    });

    setTimeout(() => {
      wx.hideLoading();
      this.loadRecords();
    }, 1000);
  },

  loadRecords() {
    try {
      const records = wx.getStorageSync('rightsRecords') || [];

      // Add mock timeline and progress
      const enrichedRecords = records.map(record => {
        const statusConfig = {
          pending: { progress: 10, timeline: [
            { title: 'Submit Application', time: record.createTime, completed: true }
          ] },
          processing: { progress: 60, timeline: [
            { title: 'Submit Application', time: record.createTime, completed: true },
            { title: 'Review Approved', time: '2025-01-15 14:30', completed: true },
            { title: 'Mediation in Progress', time: '2025-01-16 09:00', completed: false }
          ] },
          completed: { progress: 100, timeline: [
            { title: 'Submit Application', time: record.createTime, completed: true },
            { title: 'Review Approved', time: '2025-01-15 14:30', completed: true },
            { title: 'Mediation in Progress', time: '2025-01-16 09:00', completed: true },
            { title: 'Rights Protection Successful', time: '2025-01-20 16:00', completed: true }
          ] },
          rejected: { progress: 0, timeline: [
            { title: 'Submit Application', time: record.createTime, completed: true },
            { title: 'Review Not Approved', time: '2025-01-15 14:30', completed: true }
          ] }
        };

        const config = statusConfig[record.status] || statusConfig.pending;
        // Type mapping: English class -> English display text and icon
        const typeMap = {
          'deposit': { text: 'Deposit Not Returned', icon: '💰' },
          'fee': { text: 'Overcharging', icon: '🔢' },
          'fake': { text: 'Fake Listing', icon: '🏠' },
          'breach': { text: 'Contract Dispute', icon: '📝' },
          'other': { text: 'Other', icon: '📋' }
        };

        const typeInfo = typeMap[record.type] || typeMap.other;

        return {
          ...record,
          ...config,
          typeText: typeInfo.text,
          typeIcon: typeInfo.icon
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

  applyRights() {
    wx.navigateTo({
      url: '/pages/rights-apply/rights-apply'
    });
  }
})
