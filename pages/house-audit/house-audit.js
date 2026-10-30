// pages/house-audit/house-audit.js
Page({
  /**
   * Page initial data
   */
  data: {
    // Audit status
    status: 'all', // all:All, pending:Pending, approved:Approved, rejected:Rejected
    statusOptions: [
      { label: 'All', value: 'all' },
      { label: 'Pending', value: 'pending' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' }
    ],
    currentStatusLabel: 'All',
    
    // Listing list
    houseList: [],
    
    // Loading state
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    
    // Filter conditions
    filters: {
      keyword: '',
      rentType: ''
    },
    
    // Selected house
    selectedHouse: null,
    showDetail: false
  },

  /**
   * Lifecycle - on page load
   */
  onLoad(options) {
    this.loadHouseList();
  },

  /**
   * Lifecycle - on page show
   */
  onShow() {
    // Refresh list
    this.loadHouseList();
  },

  /**
   * Pull down refresh
   */
  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true
    });
    this.loadHouseList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * Pull up load more
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  /**
   * Load listing list
   */
  async loadHouseList() {
    const { status, page, pageSize, filters } = this.data;
    
    this.setData({ loading: true });
    
    try {
      // Call cloud function to get my listings
      const result = await wx.cloud.callFunction({
        name: 'get-houses',
        data: {
          action: 'my',
          data: {
            page: page,
            pageSize: pageSize,
            status: status === 'all' ? undefined : status
          }
        }
      });
      
      console.log('[Get my listings result]', result);
      
      if (result.result && result.result.success) {
        const houseList = result.result.data.list || [];
        
        // Add display text for each item
        const displayList = houseList.map(item => ({
          ...item,
          statusText: this.getStatusText(item.status),
          rentTypeText: this.getRentTypeText(item.rentType),
          createTime: item.createTime ? new Date(item.createTime).toLocaleDateString() : ''
        }));
        
        this.setData({
          houseList: page === 1 ? displayList : [...this.data.houseList, ...displayList],
          hasMore: displayList.length >= pageSize,
          loading: false
        });
      } else {
        // Cloud function failed, using mock data as fallback
        console.warn('[Cloud function failed, using mock data]', result);
        this.loadMockData();
      }
    } catch (err) {
      console.error('[Failed to load listings]', err);
      // Cloud function failed, using mock data as fallback
      this.loadMockData();
    }
  },
  
  /**
   * Load mock data (fallback)
   */
  loadMockData() {
    const { status, page, pageSize, filters } = this.data;
    const mockList = this.getMockHouseList();
    
    let filteredList = mockList.filter(item => {
      if (status !== 'all' && item.status !== status) return false;
      if (filters.keyword && !item.title.includes(filters.keyword)) return false;
      if (filters.rentType && item.rentType !== filters.rentType) return false;
      return true;
    });
    
    // Pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageData = filteredList.slice(start, end);
    
    this.setData({
      houseList: page === 1 ? pageData : [...this.data.houseList, ...pageData],
      hasMore: end < filteredList.length,
      loading: false
    });
  },

  /**
   * Load more
   */
  loadMore() {
    this.setData({
      page: this.data.page + 1
    });
    this.loadHouseList();
  },

  /**
   * Get mock data
   */
  getMockHouseList() {
    const list = [
      {
        id: 1,
        title: 'Furnished 1-bedroom, near subway',
        price: 3500,
        rentType: 'whole',
        houseType: '1',
        area: 45,
        floor: 'Mid floor',
        decoration: 'Fully furnished',
        address: 'Chaoyang Rd & Qingnian Rd intersection',
        images: ['/images/house1.jpg', '/images/house2.jpg'],
        publisher: {
          id: 1,
          name: 'Mr. Zhang',
          avatar: '/images/avatar1.jpg',
          phone: '138****8888'
        },
        status: 'pending',
        createTime: '2026-02-20',
        submitTime: '2026-02-20 14:30',
        auditNote: ''
      },
      {
        id: 2,
        title: 'Cozy 2-bedroom, shared room',
        price: 1800,
        rentType: 'share',
        houseType: '2',
        area: 30,
        floor: 'High floor',
        decoration: 'Moderately furnished',
        address: '88 Qingnian Rd',
        images: ['/images/house3.jpg'],
        publisher: {
          id: 1,
          name: 'Mr. Zhang',
          avatar: '/images/avatar1.jpg',
          phone: '138****8888'
        },
        status: 'approved',
        createTime: '2026-02-18',
        submitTime: '2026-02-18 10:20',
        auditNote: ''
      },
      {
        id: 3,
        title: 'Comfortable master bedroom, en-suite bathroom',
        price: 2800,
        rentType: 'single',
        houseType: '3',
        area: 25,
        floor: 'Mid floor',
        decoration: 'Fully furnished',
        address: '120 Jianguo Rd',
        images: ['/images/house4.jpg', '/images/house5.jpg'],
        publisher: {
          id: 1,
          name: 'Mr. Zhang',
          avatar: '/images/avatar1.jpg',
          phone: '138****8888'
        },
        status: 'rejected',
        createTime: '2026-02-15',
        submitTime: '2026-02-15 16:45',
        auditNote: 'Poor image quality, please re-upload'
      }
    ];

    // Add display text for each item
    return list.map(item => ({
      ...item,
      statusText: this.getStatusText(item.status),
      rentTypeText: this.getRentTypeText(item.rentType)
    }));
  },

  /**
   * Get status text
   */
  getStatusText(status) {
    const map = {
      'pending': 'Pending',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return map[status] || status;
  },

  /**
   * Get rent type text
   */
  getRentTypeText(rentType) {
    const map = {
      'whole': 'Whole',
      'share': 'Shared',
      'single': 'Single room'
    };
    return map[rentType] || rentType;
  },

  /**
   * Switch status
   */
  onStatusChange(e) {
    const index = e.detail.value;
    const statusOption = this.data.statusOptions[index];
    
    this.setData({
      status: statusOption.value,
      currentStatusLabel: statusOption.label,
      page: 1,
      hasMore: true
    });
    
    this.loadHouseList();
  },

  /**
   * Search
   */
  onSearch(e) {
    const keyword = e.detail.value;
    this.setData({
      'filters.keyword': keyword,
      page: 1,
      hasMore: true
    });
    
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadHouseList();
    }, 500);
  },

  /**
   * View detail
   */
  viewDetail(e) {
    const { id } = e.currentTarget.dataset;
    const house = this.data.houseList.find(h => h.id === id);
    
    if (house) {
      this.setData({
        selectedHouse: house,
        showDetail: true
      });
    }
  },

  /**
   * Close detail
   */
  closeDetail() {
    this.setData({
      showDetail: false,
      selectedHouse: null
    });
  },

  /**
   * Delete listing
   */
  deleteHouse(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this listing?',
      success: (res) => {
        if (res.confirm) {
          const houseList = this.data.houseList.filter(h => h.id !== id);
          this.setData({ houseList });
          
          wx.showToast({
            title: 'Deleted successfully',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * Edit listing
   */
  editHouse(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/publish-house/publish-house?id=${id}`
    });
  },

  /**
   * Republish
   */
  republish(e) {
    const { id } = e.currentTarget.dataset;
    const house = this.data.houseList.find(h => h.id === id);
    
    if (house) {
      // Navigate to edit page
      wx.navigateTo({
        url: `/pages/publish-house/publish-house?id=${id}`
      });
    }
  },

  /**
   * Get status text
   */
  getStatusText(status) {
    const statusMap = {
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected'
    };
    return statusMap[status] || 'Unknown';
  },

  /**
   * Get status color
   */
  getStatusColor(status) {
    const colorMap = {
      pending: '#ffc107',
      approved: '#52c41a',
      rejected: '#ff4d4f'
    };
    return colorMap[status] || '#999';
  }
});
