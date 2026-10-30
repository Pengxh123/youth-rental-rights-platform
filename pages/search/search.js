// pages/search/search.js
Page({
  data: {
    keyword: '',
    searchHistory: [],
    hotKeywords: ['Deposit', 'Utility Fees', 'Sublandlord', 'Contract', 'Rights Protection', 'Shared Rent', 'Intern Housing', 'Scam Prevention'],
    searchResults: [],
    loading: false,
    hasResults: false,
    noResults: false
  },

  onLoad(options) {
    let keyword = options.keyword || '';
    try {
      keyword = decodeURIComponent(keyword);
    } catch (e) {
      console.error('Failed to decode keyword', e);
    }
    if (keyword) {
      this.setData({ keyword });
      this.search(keyword);
    }
    this.loadSearchHistory();
  },

  loadSearchHistory() {
    try {
      let history = wx.getStorageSync('searchHistory') || [];
      // URL decode each history entry
      history = history.map(item => {
        try {
          return decodeURIComponent(item);
        } catch (e) {
          console.error('Failed to decode history', e);
          return item;
        }
      });
      // Deduplicate (using ES5 method)
      const uniqueHistory = [];
      for (let i = 0; i < history.length; i++) {
        if (uniqueHistory.indexOf(history[i]) === -1) {
          uniqueHistory.push(history[i]);
        }
      }
      history = uniqueHistory;
      this.setData({ searchHistory: history });
    } catch (e) {
      console.error('Failed to load search history', e);
    }
  },

  saveSearchHistory(keyword) {
    if (!keyword) return;
    
    try {
      let history = wx.getStorageSync('searchHistory') || [];
      // Deduplicate and limit count
      history = history.filter(item => item !== keyword);
      history.unshift(keyword);
      if (history.length > 10) {
        history = history.slice(0, 10);
      }
      wx.setStorageSync('searchHistory', history);
      this.setData({ searchHistory: history });
    } catch (e) {
      console.error('Failed to save search history', e);
    }
  },

  clearSearchHistory() {
    try {
      wx.removeStorageSync('searchHistory');
      this.setData({ searchHistory: [] });
    } catch (e) {
      console.error('Failed to clear search history', e);
    }
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    const { keyword } = this.data;
    console.log('onSearch called, current keyword:', keyword);
    if (keyword && keyword.trim()) {
      this.search(keyword.trim());
    } else {
      console.log('Search keyword is empty');
      wx.showToast({
        title: 'Please enter search content',
        icon: 'none'
      });
    }
  },

  search(keyword) {
    if (!keyword || !keyword.trim()) {
      return;
    }

    console.log('Search keyword:', keyword);

    // Save this reference
    var that = this;
    
    // Show loading state
    wx.showLoading({
      title: 'Searching...',
      mask: true
    });
    
    // Simulate search delay for better UX
    setTimeout(function() {
      // Get all searchable content
      var allContent = that.getAllSearchableContent();
      console.log('Total searchable content:', allContent.length);
      console.log('First 3 items:', allContent.slice(0, 3));

      // Get search results from multiple sources
      var searchKeyword = keyword.trim().toLowerCase();
      console.log('Processed keyword:', searchKeyword);

      // Use ES5 for loop instead of filter for compatibility
      var searchResults = [];
      for (var i = 0; i < allContent.length; i++) {
        var item = allContent[i];
        var matched = false;
        
        // Check title
        if (item.title && item.title.toLowerCase().indexOf(searchKeyword) !== -1) {
          matched = true;
          console.log('Matched (title):', item.title);
        }
        
        // Check description
        if (!matched && item.desc && item.desc.toLowerCase().indexOf(searchKeyword) !== -1) {
          matched = true;
          console.log('Matched (desc):', item.title);
        }
        
        // Check tags - enhanced matching
        if (!matched && item.tags && item.tags.length > 0) {
          for (var j = 0; j < item.tags.length; j++) {
            if (item.tags[j].toLowerCase().indexOf(searchKeyword) !== -1) {
              matched = true;
              console.log('Matched (tag):', item.title, 'tag:', item.tags[j]);
              break;
            }
          }
        }
        
        // Check title - enhanced matching
        if (!matched && item.title) {
          if (item.title.toLowerCase().indexOf(searchKeyword) !== -1) {
            matched = true;
            console.log('Matched (title):', item.title);
          }
        }
        
        // Check description - enhanced matching
        if (!matched && item.desc) {
          if (item.desc.toLowerCase().indexOf(searchKeyword) !== -1) {
            matched = true;
            console.log('Matched (desc):', item.title);
          }
        }
        
        // Check author
        if (!matched && item.author && item.author.toLowerCase().indexOf(searchKeyword) !== -1) {
          matched = true;
          console.log('Matched (author):', item.title);
        }
        
        // Check content
        if (!matched && item.content && item.content.toLowerCase().indexOf(searchKeyword) !== -1) {
          matched = true;
          console.log('Matched (content):', item.title);
        }
        
        // Check author
        if (!matched && item.author && item.author.toLowerCase().indexOf(searchKeyword) !== -1) {
          matched = true;
          console.log('Matched (author):', item.title);
        }
        
        // Check content
        if (!matched && item.content && item.content.toLowerCase().indexOf(searchKeyword) !== -1) {
          matched = true;
          console.log('Matched (content):', item.title);
        }
        
        if (matched) {
          searchResults.push(item);
        }
      }

      console.log('Filtered results count:', searchResults.length);
      console.log('Filtered results:', searchResults);

      // Set results
      that.setData({
        searchResults: searchResults,
        hasResults: searchResults.length > 0,
        noResults: searchResults.length === 0
      });

      // Save search history
      that.saveSearchHistory(keyword);

      // Hide loading state
      wx.hideLoading();

      console.log('Search complete, results:', searchResults.length);
    }, 300);
  },

  // Get all searchable content
  getAllSearchableContent() {
    // Topic content
    var topics = [];
    topics.push({
      id: 1,
      type: 'topic',
      title: 'Just graduated, is 1-month deposit 3-month rent or 1-month deposit 1-month rent better?',
      author: 'Newbie',
      time: '2 hours ago',
      views: 234,
      comments: 89,
      tags: ['1 deposit 3 rent', '1 deposit 1 rent', 'Rental budget'],
      desc: 'Just graduated and looking to rent, want to ask if 1 deposit 3 rent or 1 deposit 1 rent is better?'
    });
    topics.push({
      id: 2,
      type: 'topic',
      title: 'Sharing rights protection experience: deposit withheld for 3 months, finally got it back!',
      author: 'Rights Expert',
      time: '5 hours ago',
      views: 5214,
      comments: 156,
      tags: ['Rights Protection', 'Deposit', 'Success Case'],
      desc: 'Detailed record of how I recovered my withheld deposit through legal channels'
    });
    topics.push({
      id: 3,
      type: 'topic',
      title: '3 years renting in Beijing: avoid these traps!',
      author: 'Beijing Drifter',
      time: '1 day ago',
      views: 567,
      comments: 234,
      tags: ['Scam Prevention', 'Beijing Drifter', 'Experience Summary'],
      desc: 'From internship to work, I rented in Beijing for 3 years, experienced all kinds of tricks. Today sharing the 10 most common rental traps.'
    });
    topics.push({
      id: 4,
      type: 'topic',
      title: 'Sublandlord ran away, what should I do?',
      author: 'Victim A',
      time: '2 days ago',
      views: 89,
      comments: 67,
      tags: ['Sublandlord', 'Ran Away', 'Help'],
      desc: 'Help! The sublandlord of my rented apartment ran away, what should I do now?'
    });
    topics.push({
      id: 5,
      type: 'topic',
      title: 'Beijing Chaoyang intern rental recommendations, budget under 3000',
      author: 'House Hunter',
      time: '3 days ago',
      views: 23,
      comments: 45,
      tags: ['Beijing', 'Intern', 'Shared Rent'],
      desc: 'Interning near Guomao, looking for a single room or shared rent, budget around 3000, hope to be near subway.'
    });
    topics.push({
      id: 6,
      type: 'topic',
      title: '5 must-check details when viewing apartments, avoid traps!',
      author: 'Rental Veteran',
      time: '3 days ago',
      views: 234,
      comments: 98,
      tags: ['Viewing', 'Inspection', 'Tips'],
      desc: 'Sharing 5 years of rental experience, from utility meters to door/window checks, these details determine your comfort.'
    });

    // Tool content
    var tools = [];
    tools.push({
      id: 7,
      type: 'tool',
      title: 'Rental Contract Template',
      desc: 'Standard rental contract template with all necessary clauses',
      icon: '📝',
      tags: ['Contract', 'Template', 'Tool'],
      page: '/pages/contract-template/contract-template'
    });
tools.push({
    id: 8,
    type: 'tool',
    title: 'Fee Calculator',
    desc: 'Quickly calculate rental fees including utilities and gas',
    icon: '💰',
    tags: ['Calculate', 'Fees', 'Tool', 'Utilities'],
    page: '/pages/fee-calculator/fee-calculator'
  });
    tools.push({
      id: 9,
      type: 'tool',
      title: 'Fee Verification',
      desc: 'Verify if landlord charges are reasonable',
      icon: '📊',
      tags: ['Verify', 'Fees', 'Rights Protection'],
      page: '/pages/fee-check/fee-check'
    });

    // Guide content
    var guides = [];
    guides.push({
      id: 10,
      type: 'guide',
      title: 'Rental Scam Prevention Guide',
      desc: 'Must-read for first-time renters, avoid common traps',
      icon: '⚠️',
      tags: ['Scam Prevention', 'Guide', 'Beginner'],
      page: '/pages/rights-guide/rights-guide'
    });
    guides.push({
      id: 11,
      type: 'guide',
      title: 'Rights Protection Guide',
      desc: 'How to legally protect your rights in rental disputes',
      icon: '🛡️',
      tags: ['Rights Protection', 'Guide', 'Legal'],
      page: '/pages/rights-guide/rights-guide'
    });
    guides.push({
      id: 12,
      type: 'guide',
      title: 'Scenario Guide',
      desc: 'Strategies for different rental scenarios',
      icon: '📋',
      tags: ['Scenario', 'Guide', 'Experience'],
      page: '/pages/scenario-guide/scenario-guide'
    });

    // Help center content
    var helpCenter = [];
    helpCenter.push({
      id: 13,
      type: 'help',
      title: 'Deposit Refund Issues',
      desc: 'FAQ about rental deposit refunds',
      tags: ['Deposit', 'Refund', 'FAQ'],
      page: '/pages/help-center/help-center'
    });
helpCenter.push({
    id: 14,
    type: 'help',
    title: 'Utility Fee Calculation',
    desc: 'How to correctly calculate and verify utility fees',
    tags: ['Utilities', 'Calculate', 'Verify', 'Fees'],
    page: '/pages/help-center/help-center'
  });
    helpCenter.push({
      id: 15,
      type: 'help',
      title: 'Sublandlord Issues',
      desc: 'How to identify and deal with sublandlords',
      tags: ['Sublandlord', 'Identify', 'Deal'],
      page: '/pages/help-center/help-center'
    });

    // Success case content
    var successCases = [];
    successCases.push({
      id: 16,
      type: 'case',
      title: 'Deposit withheld 3 months, successfully recovered via platform',
      desc: 'When moving out, landlord withheld 8000 yuan deposit without cause, recovered full deposit through platform.',
      amount: '8,000',
      time: 'Dec 2025',
      caseType: 'Deposit',
      tags: ['Deposit', 'Rights Protection', 'Success Case'],
      page: '/pages/success-cases/success-cases'
    });
    successCases.push({
      id: 17,
      type: 'case',
      title: 'Overcharged utility fees, negotiated refund',
      desc: 'Landlord charged commercial electricity rates, verified as violation, negotiated 5000 yuan refund.',
      amount: '5,000',
      time: 'Nov 2025',
      caseType: 'Utility Fees',
      tags: ['Utilities', 'Overcharge', 'Rights Protection'],
      page: '/pages/success-cases/success-cases'
    });

    // Merge all content (using ES5 method)
    var allContent = [];
    for (var i = 0; i < topics.length; i++) {
      allContent.push(topics[i]);
    }
    for (var i = 0; i < tools.length; i++) {
      allContent.push(tools[i]);
    }
    for (var i = 0; i < guides.length; i++) {
      allContent.push(guides[i]);
    }
    for (var i = 0; i < helpCenter.length; i++) {
      allContent.push(helpCenter[i]);
    }
    for (var i = 0; i < successCases.length; i++) {
      allContent.push(successCases[i]);
    }
    return allContent;
  },

  selectHistory(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.search(keyword);
  },

  selectHotKeyword(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.search(keyword);
  },

  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    console.log('View detail:', item);
    console.log('Item type:', item.type, 'title:', item.title, 'page:', item.page);
    
    // If direct page path exists, navigate directly
    if (item.page) {
      try {
        console.log('Try navigate to:', item.page);
        wx.navigateTo({
          url: item.page,
          fail: (err) => {
            console.error('Page navigation failed:', err);
          }
        });
      } catch (err) {
        console.error('Page navigation error:', err);
      }
      return;
    }
    
    // Navigate to different pages by type
    try {
      if (item.type === 'topic') {
        wx.navigateTo({
          url: `/pages/topic-detail/topic-detail?id=${item.id}`
        });
      } else if (item.type === 'tool') {
        // Navigate to different pages by tool type
        if (item.title.includes('Contract Template')) {
          wx.navigateTo({
            url: '/pages/contract-template/contract-template'
          });
        } else if (item.title.includes('Fee Calculator')) {
          wx.navigateTo({
            url: '/pages/fee-calculator/fee-calculator'
          });
        } else if (item.title.includes('Fee Verification')) {
          wx.navigateTo({
            url: '/pages/fee-check/fee-check'
          });
        }
      } else if (item.type === 'guide') {
        if (item.title.includes('Scam Prevention')) {
          wx.navigateTo({
            url: '/pages/rights-guide/rights-guide'
          });
        } else if (item.title.includes('Scenario')) {
          wx.navigateTo({
            url: '/pages/scenario-guide/scenario-guide'
          });
        }
      } else if (item.type === 'help') {
        wx.navigateTo({
          url: '/pages/help-center/help-center'
        });
      } else if (item.type === 'case') {
        wx.navigateTo({
          url: '/pages/success-cases/success-cases'
        });
      }
    } catch (err) {
      console.error('Navigation error:', err);
      wx.showToast({
        title: 'Navigation failed, please retry',
        icon: 'none'
      });
    }
  },

  onClearInput() {
    this.setData({ keyword: '', searchResults: [], hasResults: false, noResults: false });
  },

  onShareAppMessage() {
    return {
      title: 'Search - Youth Rental Rights',
      path: '/pages/search/search'
    };
  }
});
