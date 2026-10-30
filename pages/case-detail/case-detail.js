// pages/case-detail/case-detail.js
Page({
  data: {
    caseId: '',
    caseInfo: null
  },

  onLoad(options) {
    const id = options.id;
    this.setData({ caseId: id });
    this.loadCaseDetail(id);
  },

  loadCaseDetail(id) {
    const cases = [
      {
        id: 1,
        title: 'Successfully recovered 3 months deposit',
        desc: 'When checking out, the landlord withheld 8000 yuan deposit without reason. Through platform rights protection, the full deposit was successfully recovered.',
        amount: '8,000',
        time: 'December 2025',
        type: 'Deposit',
        status: 'success',
        process: [
          { title: 'Submit Claim', time: 'Sep 15, 2025' },
          { title: 'Platform Review', time: 'Sep 17, 2025' },
          { title: 'Coordination', time: 'Oct 5, 2025' },
          { title: 'Result', time: 'Dec 20, 2025' }
        ]
      },
      {
        id: 2,
        title: 'Overcharged utilities, refund received',
        desc: 'Landlord charged commercial electricity rates. After verification, it was confirmed as illegal. Successfully coordinated a 5000 yuan refund.',
        amount: '5,000',
        time: 'November 2025',
        type: 'Utilities',
        status: 'success',
        process: [
          { title: 'Submit Claim', time: 'Oct 10, 2025' },
          { title: 'Platform Review', time: 'Oct 12, 2025' },
          { title: 'Verification', time: 'Oct 25, 2025' },
          { title: 'Result', time: 'Nov 15, 2025' }
        ]
      },
      {
        id: 3,
        title: 'False listing scam, assisted with police report',
        desc: 'User encountered false listing scam. Platform assisted with evidence collection and police report, recovering 15000 yuan.',
        amount: '15,000',
        time: 'October 2025',
        type: 'Scam',
        status: 'success',
        process: [
          { title: 'Submit Claim', time: 'Sep 20, 2025' },
          { title: 'Platform Review', time: 'Sep 22, 2025' },
          { title: 'Assist Police', time: 'Sep 28, 2025' },
          { title: 'Result', time: 'Oct 10, 2025' }
        ]
      },
      {
        id: 4,
        title: 'Unfair contract terms, successful claim',
        desc: 'Landlord included unreasonable clauses in contract. User successfully claimed 12000 yuan through legal means.',
        amount: '12,000',
        time: 'September 2025',
        type: 'Contract',
        status: 'success',
        process: [
          { title: 'Submit Claim', time: 'Aug 5, 2025' },
          { title: 'Legal Consultation', time: 'Aug 10, 2025' },
          { title: 'Court Mediation', time: 'Aug 25, 2025' },
          { title: 'Result', time: 'Sep 5, 2025' }
        ]
      },
      {
        id: 5,
        title: 'Sub-landlord disappeared, rent recovered',
        desc: 'Sub-landlord collected rent and disappeared. Platform assisted in contacting the real landlord, recovering 6000 yuan remaining rent.',
        amount: '6,000',
        time: 'August 2025',
        type: 'Sub-landlord',
        status: 'success',
        process: [
          { title: 'Submit Claim', time: 'Jul 15, 2025' },
          { title: 'Platform Investigation', time: 'Jul 18, 2025' },
          { title: 'Coordination', time: 'Jul 28, 2025' },
          { title: 'Result', time: 'Aug 10, 2025' }
        ]
      }
    ];

    const caseInfo = cases.find(item => item.id === Number(id));
    this.setData({ caseInfo });
  },

  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: 'Success Case Detail - Youth Rental Rights',
      path: '/pages/success-cases/success-cases'
    };
  }
})
