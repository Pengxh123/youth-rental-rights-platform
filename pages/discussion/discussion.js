// pages/discussion/discussion.js
Page({
  data: {
    currentCategory: '',
    showFilterModal: false,
    sortType: 'hot',
    timeRange: 'all',
    loading: false,
    hasMore: true,
    hotTags: [
      { id: 1, icon: '💡', tag: 'Deposit Trap' },
      { id: 2, icon: '⚠️', tag: 'Sublandlord' },
      { id: 3, icon: '🔍', tag: 'Viewing Tips' },
      { id: 4, icon: '📝', tag: 'Contract Tips' },
      { id: 5, icon: '💰', tag: 'Utilities' }
    ],
    topics: [
      {
        id: 1,
        author: 'Renter Newbie',
        avatar: 'https://via.placeholder.com/80',
        time: '2 hours ago',
        title: 'Got scammed renting after graduation, sharing my lessons!',
        summary: 'First time renting, did not understand anything, was tricked by agent and landlord together, lost 5000 yuan deposit...',
        category: 'Scam Experience',
        type: 'fraud',
        tags: ['Deposit', 'Agent', 'Tips'],
        images: [
          'https://via.placeholder.com/300',
          'https://via.placeholder.com/300'
        ],
        views: 3286,
        comments: 89,
        likes: 234,
        favorites: 56,
        isHot: true,
        isTop: false
      },
      {
        id: 4,
        author: 'Victim A',
        avatar: 'https://via.placeholder.com/80',
        time: '2 days ago',
        title: 'Sublandlord disappeared, what should I do?',
        summary: 'Rented from a sublandlord, now they are unreachable, cannot contact the original landlord, do not know what to do...',
        category: 'Scam Experience',
        type: 'fraud',
        tags: ['Sublandlord', 'Disappeared', 'Help'],
        images: [
          'https://via.placeholder.com/300'
        ],
        views: 2134,
        comments: 67,
        likes: 89,
        favorites: 23,
        isHot: true,
        isTop: false
      },
      {
        id: 3,
        author: 'Experience Sharer',
        avatar: 'https://via.placeholder.com/80',
        time: 'Yesterday',
        title: '3 Years Beijing Rental Experience Summary: These Traps Must Be Avoided!',
        summary: 'From internship to working, experienced various rental tricks, summarized the 10 most common rental traps, hope this helps everyone...',
        category: 'Rental Pitfall Avoidance Tips',
        type: 'tips',
        tags: ['Pitfall Avoidance', 'Beijing', 'Experience Summary'],
        images: [],
        views: 8942,
        comments: 234,
        likes: 567,
        favorites: 123,
        isHot: false,
        isTop: true
      },
      {
        id: 6,
        author: 'Rental Veteran',
        avatar: 'https://via.placeholder.com/80',
        time: '3 days ago',
        title: '5 Details You Must Pay Attention to When Viewing, Avoid Traps!',
        summary: 'Sharing 5 years of rental experience, from utility meters to door and window inspection, these details determine your comfort...',
        category: 'Pitfall Avoidance Tips',
        type: 'tips',
        tags: ['Viewing', 'Inspection', 'Tips'],
        images: [],
        views: 4321,
        comments: 98,
        likes: 234,
        favorites: 67,
        isHot: false,
        isTop: false
      },
      {
        id: 2,
        author: 'Rights Protection Expert',
        avatar: 'https://via.placeholder.com/80',
        time: '5 hours ago',
        title: 'Sharing Rights Protection Experience: Deposit Withheld for 3 Months, Finally Got It Back!',
        summary: 'Detailed record from having deposit withheld to successfully protecting rights, including evidence collection, negotiation tactics, rights protection channels...',
        category: 'Success Stories',
        type: 'success',
        tags: ['Rights Protection', 'Deposit', 'Success Story'],
        images: [],
        views: 5214,
        comments: 156,
        likes: 423,
        favorites: 89,
        isHot: true,
        isTop: false
      },
      {
        id: 7,
        author: 'Legal Consultant',
        avatar: 'https://via.placeholder.com/80',
        time: '1 week ago',
        title: 'Successfully Sued Black-Hearted Landlord, Got Double Deposit Back!',
        summary: 'Encountered malicious deposit withholding, I did not give up, successfully protected my rights through legal channels, hope my experience can help more people...',
        category: 'Success Stories',
        type: 'success',
        tags: ['Legal', 'Lawsuit', 'Rights Protection'],
        images: [],
        views: 6789,
        comments: 203,
        likes: 567,
        favorites: 134,
        isHot: false,
        isTop: false
      },
      {
        id: 5,
        author: 'New Tenant',
        avatar: 'https://via.placeholder.com/80',
        time: '3 days ago',
        title: 'Seeking Rental Recommendations for Internship in Chaoyang District, Beijing, Budget Under 3000',
        summary: 'Interning near Guomao, want to find a single room or shared housing, budget around 3000, hope it is close to the subway...',
        category: 'Housing Help',
        type: 'help',
        tags: ['Beijing', 'Internship', 'Shared Housing'],
        images: [],
        views: 1567,
        comments: 45,
        likes: 23,
        favorites: 12,
        isHot: false,
        isTop: false
      },
      {
        id: 8,
        author: 'Fresh Graduate Wang',
        avatar: 'https://via.placeholder.com/80',
        time: '4 days ago',
        title: 'Seeking Rental Help in Minhang District, Shanghai, Near Xuhui District',
        summary: 'Just graduated, working in Xuhui District, want to find housing in Minhang District, budget around 3500, seeking recommendations for reliable communities or agents...',
        category: 'Housing Help',
        type: 'help',
        tags: ['Shanghai', 'Fresh Graduate', 'Rental Help'],
        images: [],
        views: 1234,
        comments: 32,
        likes: 18,
        favorites: 8,
        isHot: false,
        isTop: false
      },
      {
        id: 9,
        author: 'Rental Victim',
        avatar: 'https://via.placeholder.com/80',
        time: '5 days ago',
        title: 'Documenting My Entire Rights Protection Process for Future Reference',
        summary: 'From being refused deposit return to deposit being withheld, to applying for legal aid, documented every step...',
        category: 'Rights Protection Experience',
        type: 'rights',
        tags: ['Rights Protection', 'Record', 'Experience'],
        images: [
          'https://via.placeholder.com/300'
        ],
        views: 2876,
        comments: 78,
        likes: 145,
        favorites: 34,
        isHot: false,
        isTop: false
      },
      {
        id: 10,
        author: 'Law Student Zhang',
        avatar: 'https://via.placeholder.com/80',
        time: '6 days ago',
        title: 'Unfair Contract Clauses in Rental Agreements, How to Identify and Respond',
        summary: 'As a law student, compiled common unfair contract clauses in rental agreements, teaching everyone how to identify and avoid being cheated...',
        category: 'Rights Protection Experience',
        type: 'rights',
        tags: ['Contract', 'Legal', 'Pitfall Avoidance'],
        images: [],
        views: 3456,
        comments: 112,
        likes: 267,
        favorites: 89,
        isHot: true,
        isTop: false
      }
    ]
  },

  onLoad(options) {
    const category = options.category || '';
    this.setData({ currentCategory: category });

    // Initialize sample topics (if there are no topics yet)
    this.initSampleTopic();
    this.loadTopics();
  },

  initSampleTopic() {
    try {
      let myTopics = wx.getStorageSync('myTopics') || [];
      if (myTopics.length === 0) {
        myTopics = [
          {
            id: 1738729200000,
            author: 'Career Beginner Xiao Lin',
            avatar: 'https://via.placeholder.com/80',
            time: 'Just now',
            title: 'Job-Related Housing Search in Shenzhen Nanshan District, Seeking Recommendations',
            summary: 'Just got a job offer in Shenzhen Nanshan District, starting next week, want to find a single room in Nanshan District, budget around 4000, seeking recommendations for conveniently located communities...',
            category: 'Housing Help',
            type: 'help',
            tags: ['Shenzhen', 'Nanshan District', 'Job Housing'],
            images: [],
            views: 156,
            comments: 3,
            likes: 23,
            favorites: 5,
            isHot: false,
            isTop: false
          }
        ];
        wx.setStorageSync('myTopics', myTopics);
      }
    } catch (e) {
      console.error('Failed to initialize sample topics', e);
    }
  },

  onPullDownRefresh() {
    this.loadTopics(true);
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadTopics();
    }
  },

  loadTopics(refresh = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    // Load user-published topics from local storage
    try {
      const myTopics = wx.getStorageSync('myTopics') || [];
      // Ensure myTopics is an array
      const userTopics = Array.isArray(myTopics) ? myTopics : [];
      // Add necessary fields to user topics
      const processedUserTopics = userTopics.map(topic => ({
        ...topic,
        id: 999, // Ensure user topic ID matches IDs in topicMap
        author: topic.author || 'Rental User',
        avatar: topic.avatar || 'https://via.placeholder.com/80',
        summary: topic.summary || topic.content.substring(0, 100) + '...',
        category: topic.category || 'Housing Help',
        type: topic.type || 'help',
        tags: topic.tags || ['New Tenant Housing', 'Help', 'Experience'],
        images: topic.images || [],
        isHot: topic.isHot || false,
        isTop: topic.isTop || false
      }));
      // Merge user topics and default topics, user topics displayed first
      const allTopics = [...processedUserTopics, ...this.data.topics];

      // Filter topics by current category
      let filteredTopics = allTopics;
      if (this.data.currentCategory) {
        filteredTopics = allTopics.filter(topic => topic.type === this.data.currentCategory);
      }

      this.setData({ topics: filteredTopics });
    } catch (e) {
      console.error('Failed to load topics', e);
    }

    setTimeout(() => {
      if (refresh) {
        wx.stopPullDownRefresh();
      }

      this.setData({
        loading: false,
        hasMore: this.data.topics.length < 20
      });
    }, 500);
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    if (keyword) {
      this.searchTopics(keyword);
    } else {
      this.setData({ searchResults: [] });
    }
  },

  onSearch(e) {
    const keyword = this.data.searchKeyword || '';
    if (keyword) {
      this.searchTopics(keyword);
    }
  },

  showFilter() {
    this.setData({ showFilterModal: true });
  },

  hideFilter() {
    this.setData({ showFilterModal: false });
  },

  stopPropagation() {
    // Prevent event bubbling
  },

  changeSort(e) {
    this.setData({ sortType: e.currentTarget.dataset.sort });
  },

  changeTimeRange(e) {
    this.setData({ timeRange: e.currentTarget.dataset.range });
  },

  applyFilter() {
    this.setData({ showFilterModal: false });
    this.loadTopics(true);
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ currentCategory: category });
    this.loadTopics(true);
  },

  searchTag(e) {
    const tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(tag)}`
    });
  },

  searchTopics(keyword) {
    // Search logic
    wx.navigateTo({
      url: `/pages/search/search?keyword=${encodeURIComponent(keyword)}`
    });
  },

  viewTopic(e) {
    const topicId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/topic-detail/topic-detail?id=${topicId}`
    });
  },

  goToPublish() {
    wx.navigateTo({
      url: '/pages/publish-topic/publish-topic'
    });
  },

  onShareAppMessage() {
    return {
      title: 'Youth Rental Discussion Forum - Share Experiences, Help Each Other Avoid Traps',
      path: '/pages/discussion/discussion'
    };
  }
})