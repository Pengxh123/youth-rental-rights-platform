// pages/my-topics/my-topics.js
Page({
  data: {
    topics: []
  },

  onLoad(options) {
    this.loadMyTopics()
  },

  loadMyTopics() {
    console.log('loadMyTopics called');
    // Load my topics data - show user's topics only
    const topics = [
      {
        id: 999,
        title: 'What should I pay attention to when renting for the first time?',
        content: 'Newly graduated and preparing to rent. I heard there are many pitfalls. Could you share what I should pay attention to? Like contracts, deposits, utilities, etc. Hope to get everyone\'s experience!',
        comments: 3,
        likes: 23,
        views: 156,
        status: 'active',
        time: 'Just now',
        image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Rental%20Tips'
      }
    ]
    console.log('topics data:', topics);
    this.setData({ topics });
    console.log('topics set successfully');
    
    // Save user's topics to local storage so they can be seen in discussion page
    try {
      wx.setStorageSync('myTopics', topics);
      console.log('myTopics saved to storage successfully');
    } catch (e) {
      console.error('Failed to save myTopics', e);
    }
  },

  goBack() {
    wx.navigateBack()
  },

  publishTopic() {
    wx.navigateTo({
      url: '/pages/publish-topic/publish-topic'
    })
  },

  goToTopicDetail(e) {
    console.log('goToTopicDetail event:', e);
    const topicId = e.currentTarget.dataset.topicId
    console.log('Topic clicked:', topicId)
    // Navigate to topic detail page
    wx.navigateTo({
      url: `/pages/topic-detail/topic-detail?id=${topicId}&from=my-topics`
    })
  },

  onShareAppMessage() {
    return {
      title: 'Youth Rental Rights - Avoid Pitfalls, Protect Your Rights',
      path: '/pages/index/index'
    }
  }
})
