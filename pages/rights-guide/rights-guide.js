// pages/rights-guide/rights-guide.js
Page({
  data: {
    faqs: [
      {
        question: 'What should I do if my deposit is not returned?',
        answer: 'First negotiate with the landlord to request deposit return; if negotiation fails, you can file a rights protection case through this platform or complain to the housing department; if necessary, you can collect evidence and file a lawsuit.',
        expanded: false
      },
      {
        question: 'How to protect my rights when utility fees are overcharged?',
        answer: 'First inform the landlord of the official utility rate standards and request billing at the standard rate; if they do not cooperate, you can complain to the utility company or file a rights protection case through this platform after verification.',
        expanded: false
      },
      {
        question: 'What should I do if the subletter disappears?',
        answer: 'Report to police immediately with evidence; contact the landlord platform or property management; file a rights protection case through this platform to assist in recovering losses; be vigilant against fake listings.',
        expanded: false
      },
      {
        question: 'Is my rental contract legally binding?',
        answer: 'As long as both parties have signed, terms are clear, and it does not violate laws or regulations, the rental contract is legally binding; please read the contract terms carefully before signing, especially regarding deposits and breach of contract responsibilities.',
        expanded: false
      },
      {
        question: 'How to verify if a landlord is legitimate?',
        answer: 'Request to see the landlord\'s property deed and ID; you can verify property information through the housing transaction center; be cautious of landlords who cannot provide proof.',
        expanded: false
      }
    ]
  },

  scrollTo(e) {
    const target = e.currentTarget.dataset.target;
    wx.createSelectorQuery().select(`#${target}`).boundingClientRect(rect => {
      wx.pageScrollTo({
        scrollTop: rect.top - 100,
        duration: 300
      });
    }).exec();
  },

  toggleFaq(e) {
    const index = e.currentTarget.dataset.index;
    const faqs = this.data.faqs.map((item, i) => {
      if (i === index) {
        return { ...item, expanded: !item.expanded };
      }
      // Collapse other expanded items
      return { ...item, expanded: false };
    });
    this.setData({ faqs });
  },

  call12345() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Call 12345 Hotline',
      content: 'Call the national rights protection hotline 12345?',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '12345' });
        }
      }
    });
  },

  gotoHelpCenter() {
    wx.navigateTo({
      url: '/pages/help-center/help-center'
    });
  },

  callPolice() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Call 110',
      content: 'Call emergency police hotline 110?',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '110' });
        }
      }
    });
  },


})
