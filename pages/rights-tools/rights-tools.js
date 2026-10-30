// pages/rights-tools/rights-tools.js
Page({
  data: {
    evidenceList: [
      { id: 1, title: 'Rental Contract', desc: 'Complete lease agreement with signatures and dates from both parties', checked: false },
      { id: 2, title: 'Payment Receipts', desc: 'Bank transfer records or receipts for rent and deposit', checked: false },
      { id: 3, title: 'Property Certificate', desc: 'Landlord property ownership certificate copy or purchase contract', checked: false },
      { id: 4, title: 'ID Copy', desc: 'Landlord ID card copy', checked: false },
      { id: 5, title: 'Chat Records', desc: 'Screenshots of communication with landlord', checked: false },
      { id: 6, title: 'Property Photos', desc: 'Comparison photos of property before and after move-out', checked: false },
      { id: 7, title: 'Utility Bills', desc: 'Actual utility payment receipts', checked: false },
      { id: 8, title: 'Police Reports', desc: 'Police report if there is a dispute', checked: false }
    ]
  },

  useContract() {
    wx.navigateTo({
      url: '/pages/contract-template/contract-template'
    });
  },

  toggleEvidence(e) {
    const id = e.currentTarget.dataset.id;
    const evidenceList = this.data.evidenceList.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    this.setData({ evidenceList });
  },

  exportEvidence() {
    const checkedItems = this.data.evidenceList.filter(item => item.checked);
    if (checkedItems.length === 0) {
      wx.showToast({
        title: 'Please select at least one item',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: 'Exporting...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: 'Export successful',
        icon: 'success'
      });
    }, 1000);
  },

  consultLawyer() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Lawyer Consultation',
      content: 'About to connect to public interest lawyer online consultation, continue?',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: 'Connecting...'
          });

          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: 'Arranging lawyer for you',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  searchLaw() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Laws & Regulations',
      content: 'About to navigate to laws and regulations page, continue?',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/help-center/help-center'
          });
        }
      }
    });
  },

  viewCases() {
    wx.navigateTo({
      url: '/pages/success-cases/success-cases'
    });
  }
})
