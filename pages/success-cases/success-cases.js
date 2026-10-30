// pages/success-cases/success-cases.js
Page({
  data: {
    typeLabels: {
      deposit: 'Deposit',
      utility: 'Utilities',
      contract: 'Contract',
      sublandlord: 'Sub-landlord',
      fraud: 'Fraud'
    },
    originalCases: [
      {
        id: 1,
        title: 'Deposit withheld for 3 months, successfully recovered through platform',
        desc: 'User was deducted 8000 CNY deposit without reason during checkout, successfully recovered full deposit through platform rights protection.',
        amount: '8,000',
        time: 'December 2025',
        type: 'deposit',
        status: 'success',
        process: [
          { title: 'Submit Application', time: 'September 15, 2025' },
          { title: 'Platform Review', time: 'September 17, 2025' },
          { title: 'Mediation', time: 'October 5, 2025' },
          { title: 'Result Feedback', time: 'December 20, 2025' }
        ]
      },
      {
        id: 2,
        title: 'Utilities overcharging, difference refunded after coordination',
        desc: 'Landlord charged at commercial electricity rate, confirmed as violation, coordinated refund of 5000 CNY difference.',
        amount: '5,000',
        time: 'November 2025',
        type: 'utility',
        status: 'success',
        process: [
          { title: 'Submit Application', time: 'October 10, 2025' },
          { title: 'Platform Review', time: 'October 12, 2025' },
          { title: 'Verification', time: 'October 25, 2025' },
          { title: 'Result Feedback', time: 'November 15, 2025' }
        ]
      },
      {
        id: 3,
        title: 'Fake listing scam, assisted police report',
        desc: 'User encountered fake listing scam, platform assisted collecting evidence and reporting to police, recovered 15000 CNY.',
        amount: '15,000',
        time: 'October 2025',
        type: 'fraud',
        status: 'success',
        process: [
          { title: 'Submit Application', time: 'September 20, 2025' },
          { title: 'Platform Review', time: 'September 22, 2025' },
          { title: 'Police Assistance', time: 'September 28, 2025' },
          { title: 'Result Feedback', time: 'October 10, 2025' }
        ]
      },
      {
        id: 4,
        title: 'Unfair contract terms, successful rights protection refund',
        desc: 'Landlord set unreasonable terms in contract, user obtained 12000 CNY refund through legal channels.',
        amount: '12,000',
        time: 'September 2025',
        type: 'contract',
        status: 'success',
        process: [
          { title: 'Submit Application', time: 'August 5, 2025' },
          { title: 'Legal Consultation', time: 'August 10, 2025' },
          { title: 'Court Mediation', time: 'August 25, 2025' },
          { title: 'Result Feedback', time: 'September 5, 2025' }
        ]
      },
      {
        id: 5,
        title: 'Sub-landlord disappeared, platform helped recover rent',
        desc: 'Sub-landlord collected rent then disappeared, platform helped contact real landlord, successfully recovered 6000 CNY remaining rent.',
        amount: '6,000',
        time: 'August 2025',
        type: 'sublandlord',
        status: 'success',
        process: [
          { title: 'Submit Application', time: 'July 15, 2025' },
          { title: 'Platform Investigation', time: 'July 18, 2025' },
          { title: 'Coordination', time: 'July 28, 2025' },
          { title: 'Result Feedback', time: 'August 10, 2025' }
        ]
      },
      {
        id: 6,
        title: 'Deposit not returned, rights protection failed due to insufficient evidence',
        desc: 'Landlord withheld deposit during checkout, as user did not retain property handover evidence, could not prove property was intact, rights protection failed.',
        time: 'November 2025',
        type: 'deposit',
        status: 'failed',
        reason: 'Insufficient evidence',
        process: [
          { title: 'Submit Application', time: 'October 5, 2025' },
          { title: 'Platform Review', time: 'October 7, 2025' },
          { title: 'Mediation Failed', time: 'October 20, 2025' },
          { title: 'Result Feedback', time: 'November 10, 2025' }
        ]
      },
      {
        id: 7,
        title: 'Unclear contract terms, difficult rights protection',
        desc: 'Contract terms signed with landlord were vague, deposit refund conditions not clearly stated, court mediation failed.',
        time: 'October 2025',
        type: 'contract',
        status: 'failed',
        reason: 'Unclear contract terms',
        process: [
          { title: 'Submit Application', time: 'September 10, 2025' },
          { title: 'Legal Consultation', time: 'September 15, 2025' },
          { title: 'Court Mediation', time: 'September 28, 2025' },
          { title: 'Result Feedback', time: 'October 20, 2025' }
        ]
      },
      {
        id: 8,
        title: 'Sub-landlord fraud, missed best timing due to not reporting',
        desc: 'User encountered sub-landlord fraud but did not report to police promptly, by the time they realized, sub-landlord had disappeared, unable to recover losses.',
        time: 'September 2025',
        type: 'sublandlord',
        status: 'failed',
        reason: 'Did not report to police promptly',
        process: [
          { title: 'Submit Application', time: 'August 25, 2025' },
          { title: 'Platform Review', time: 'August 27, 2025' },
          { title: 'Investigation', time: 'September 5, 2025' },
          { title: 'Result Feedback', time: 'September 25, 2025' }
        ]
      }
    ],
    cases: [],
    activeFilter: 'all'
  },

  onLoad(options) {
    console.log('Success cases page loaded');
    this.setData({ cases: this.data.originalCases });
  },

  filterByType(e) {
    const type = e.currentTarget.dataset.type;
    console.log('Filter type:', type);

    if (type === 'all') {
      this.setData({ 
        cases: [...this.data.originalCases],
        activeFilter: type
      });
    } else {
      const filteredCases = this.data.originalCases.filter(item => item.type === type);
      this.setData({ 
        cases: filteredCases,
        activeFilter: type
      });
    }
  },

  viewCase(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/case-detail/case-detail?id=${id}`
    });
  },

  onShareAppMessage() {
    return {
      title: 'Rights Protection Case Library - Youth Rental Rights',
      path: '/pages/success-cases/success-cases'
    };
  }
})
