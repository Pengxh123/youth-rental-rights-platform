// pages/rights-protect/rights-protect.js
const app = getApp()

Page({
  data: {
    rightsRecords: [],
    typeStats: [
      { type: 'Deposit Not Returned', count: 1245, percent: 35, color: '#ff4d4f' },
      { type: 'Overcharging', count: 876, percent: 25, color: '#faad14' },
      { type: 'Fake Listings', count: 654, percent: 18, color: '#1890ff' },
      { type: 'Contract Disputes', count: 543, percent: 15, color: '#52c41a' },
      { type: 'Other', count: 234, percent: 7, color: '#722ed1' }
    ],
    processSteps: [
      { id: 1, title: 'Submit Application', desc: 'Fill in rights protection info, upload evidence' },
      { id: 2, title: 'Platform Review', desc: 'Staff reviews materials and verifies situation' },
      { id: 3, title: 'Mediation', desc: 'Contact involved parties to resolve dispute' },
      { id: 4, title: 'Progress Follow-up', desc: 'Real-time updates on processing progress' },
      { id: 5, title: 'Result Feedback', desc: 'Rights protection result notification and satisfaction survey' }
    ],
    successCases: [
      {
        id: 1,
        title: '3-month deposit withheld, successfully recovered through platform',
        desc: 'User was deducted 8000 yuan deposit without reason during checkout. Successfully recovered full deposit through platform rights protection.',
        amount: '8,000',
        time: 'December 2025'
      },
      {
        id: 2,
        title: 'Utilities overcharging, difference refunded after mediation',
        desc: 'Landlord charged at commercial electricity rate. Confirmed as violation after verification. Difference of 5000 yuan refunded after mediation.',
        amount: '5,000',
        time: 'November 2025'
      },
      {
        id: 3,
        title: 'Fake listing scam, assisted police report',
        desc: 'User encountered fake listing scam. Platform assisted in collecting evidence and reporting to police. Lost 15000 yuan recovered.',
        amount: '15,000',
        time: 'October 2025'
      }
    ]
  },

  onLoad(options) {
    this.loadRightsRecords();
  },

  onShow() {
    this.loadRightsRecords();
  },

  loadRightsRecords() {
    try {
      const records = wx.getStorageSync('rightsRecords') || [];
      this.setData({ rightsRecords: records });
    } catch (e) {
      console.error('Failed to load rights records', e);
    }
  },

  goToApply() {
    console.log('Rights application clicked');
    wx.navigateTo({
      url: '/pages/rights-apply/rights-apply'
    });
  },

  goToTools() {
    console.log('Rights tools clicked');
    wx.navigateTo({
      url: '/pages/rights-tools/rights-tools'
    });
  },

  goToQuery() {
    console.log('Progress query clicked');
    wx.navigateTo({
      url: '/pages/rights-query/rights-query'
    });
  },

  goToHelp() {
    console.log('Rights guide clicked');
    wx.navigateTo({
      url: '/pages/rights-guide/rights-guide'
    });
  },

  viewAllRecords() {
    wx.navigateTo({
      url: '/pages/rights-records/rights-records'
    });
  },

  viewRecord(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/report-detail/report-detail?id=${id}`
    });
  },

  viewCase(e) {
    const id = e.currentTarget.dataset.id;
    const caseInfo = this.data.successCases.find(item => item.id === id);
    wx.showModal({
      cancelText: 'No',
      title: caseInfo ? caseInfo.title : 'Success Case',
      content: caseInfo ? caseInfo.desc : '',
      confirmText: 'OK',
      showCancel: false
    });
  },

  callLawyer() {
    wx.navigateTo({
      url: '/pages/lawyer-chat/lawyer-chat'
    });
  },

  viewContract() {
    wx.navigateTo({
      url: '/pages/contract-template/contract-template'
    });
  },

  viewChannels() {
    wx.showModal({
      cancelText: 'No',
      title: 'Rights Protection Channels',
      content: 'National Rights Hotline: 12345\nHousing Department: 12319\nEmergency: 110\n\nYou can use the above channels for rights protection consultation and complaints.',
      confirmText: 'OK',
      showCancel: false
    });
  },

  onApplyClick() {
    console.log('Apply for rights protection clicked');
    wx.navigateTo({
      url: '/pages/rights-apply/rights-apply'
    });
  }
})
