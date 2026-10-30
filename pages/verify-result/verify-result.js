// pages/verify-result/verify-result.js
Page({
  data: {
    records: [],
    currentView: 'list', // list or detail
    currentRecord: null,
    negotiationText: ''
  },

  onLoad(options) {
    // If data param passed, show single detail (from fee-check page)
    if (options.data) {
      const resultData = JSON.parse(decodeURIComponent(options.data));
      const negotiationText = options.negotiation ? decodeURIComponent(options.negotiation) : '';
      this.setData({
        currentView: 'detail',
        result: resultData,
        negotiationText
      });
    } else {
      // Otherwise show list (from profile page)
      this.loadRecords();
    }
  },

  onShow() {
    // If list view, reload records
    if (this.data.currentView === 'list') {
      this.loadRecords();
    }
  },

  loadRecords() {
    try {
      const records = wx.getStorageSync('feeCheckRecords') || [];
      // Sort by time descending
      records.sort((a, b) => b.createTime - a.createTime);
      this.setData({
        records,
        currentView: 'list'
      });
    } catch (e) {
      console.error('Failed to load records', e);
    }
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    const records = this.data.records;
    const record = records.find(r => r.id == id);

    if (record) {
      // Build result data for detail display
      const result = {
        isOverpriced: record.isOverpriced,
        officialPrice: record.officialPrice,
        landlordPrice: record.landlordPrice,
        overPricePercent: record.isOverpriced ? '10' : '0',
        monthlyFee: (record.landlordPrice * 30).toFixed(2),
        yearDiff: record.isOverpriced ? ((record.landlordPrice - record.officialPrice) * 365).toFixed(2) : '0',
        feeUnit: record.feeType.includes('electric') ? 'CNY/kWh' : 'CNY/m³'
      };

      const negotiationText = `Hello, according to the official standard for ${record.city} ${record.feeType}, the price is ${record.officialPrice}${result.feeUnit}. Your proposed ${record.landlordPrice}${result.feeUnit} exceeds the official standard by ${result.overPricePercent}%, resulting in extra annual cost of ${result.yearDiff} yuan. Please charge according to the official standard.`;

      this.setData({
        currentView: 'detail',
        currentRecord: record,
        result,
        negotiationText
      });
    }
  },

  copyNegotiation() {
    wx.setClipboardData({
      data: this.data.negotiationText,
      success: () => {
        wx.showToast({
          title: 'Copied',
          icon: 'success'
        });
      }
    });
  },

  deleteRecord(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Delete Record',
      content: 'Are you sure you want to delete this verification record?',
      success: (res) => {
        if (res.confirm) {
          try {
            let records = wx.getStorageSync('feeCheckRecords') || [];
            records = records.filter(r => r.id != id);
            wx.setStorageSync('feeCheckRecords', records);

            this.loadRecords();
            wx.showToast({
              title: 'Deleted',
              icon: 'success'
            });
          } catch (e) {
            console.error('Delete failed', e);
          }
        }
      }
    });
  },

  goBack() {
    if (this.data.currentView === 'detail' && this.data.currentRecord) {
      // Return from detail to list
      this.setData({
        currentView: 'list',
        currentRecord: null
      });
    } else {
      // Otherwise go back to previous page
      wx.navigateBack();
    }
  },

  goToNewVerify() {
    wx.navigateTo({
      url: '/pages/fee-check/fee-check'
    });
  }
})
