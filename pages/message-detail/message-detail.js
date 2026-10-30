// pages/message-detail/message-detail.js
Page({
  data: {
    type: '',
    title: '',
    message: '',
    createTime: '',
    comments: [],
    showComments: false
  },

  onLoad(options) {
    const type = options.type || '';
    this.setData({ type });
    this.loadMessage(type);
    this.clearMessageBadge(type);
  },

  onUnload() {
    // Clear message badge on page unload
    this.clearMessageBadge(this.data.type);
  },

  loadMessage(type) {
    let title = '';
    let message = '';
    let comments = [];

    switch (type) {
      case 'rights':
        title = 'Rights Protection Progress';
        message = 'You have a rights protection application processed';
        break;
      case 'interactive':
        title = 'Interactive Message';
        message = 'Your topic received new interactions';
        comments = [
          {
            id: 1,
            user: 'Rental Scam Prevention Expert',
            avatar: '👤',
            content: 'Make sure to confirm utility fee rates before signing, recommend taking photos of meter readings!',
            time: '10 min ago',
            likes: 23,
            liked: false
          },
          {
            id: 2,
            user: 'Recent Grad Renter',
            avatar: '👤',
            content: 'First time renting, learned a lot, took notes!',
            time: '20 min ago',
            likes: 12,
            liked: true
          },
          {
            id: 3,
            user: 'Veteran Renter Wang',
            avatar: '👤',
            content: 'One more tip: check furniture and appliances for damage, take photos as evidence when moving in.',
            time: '30 min ago',
            likes: 18,
            liked: false
          }
        ];
        break;
      case 'system':
        title = 'System Announcement';
        message = '1. New Favorites Feature\n   - Bookmark popular topics and listings\n   - View favorites list with one tap\n\n2. Improved Rights Protection\n   - Real-time progress notifications\n   - New rights record query\n\n3. Topic Discussion Upgrade\n   - New comment interaction\n   - Like and reply to comments\n\n4. UX Optimization\n   - Faster page loading\n   - Bug fixes and stability improvements\n\nThank you for your support!'
        break;
      default:
        title = 'Message Detail';
        message = 'No messages';
    }

    const createTime = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    this.setData({
      type,
      title,
      message,
      createTime,
      comments
    });
  },

  goBack() {
    wx.navigateBack();
  },

  goToRightsRecords() {
    wx.redirectTo({
      url: '/pages/rights-records/rights-records'
    });
  },

  toggleComments() {
    this.setData({
      showComments: !this.data.showComments
    });
  },

  likeComment(e) {
    const id = e.currentTarget.dataset.id;
    const comments = this.data.comments.map(comment => {
      if (comment.id === id) {
        const isLiked = !comment.liked;
        return {
          ...comment,
          likes: isLiked ? comment.likes + 1 : comment.likes - 1,
          liked: isLiked
        };
      }
      return comment;
    });
    this.setData({ comments });
  },

  clearMessageBadge(type) {
    try {
      const messageBadges = wx.getStorageSync('messageBadges') || {
        rights: 0,
        interactive: 0,
        system: 0
      };

      if (messageBadges[type] > 0) {
        messageBadges[type] = 0;
        wx.setStorageSync('messageBadges', messageBadges);
      }
    } catch (e) {
      console.error('Failed to clear message badge', e);
    }
  },

  onShareAppMessage() {
    return {
      title: 'Youth Rental Rights Platform - Rent Smart, Protect Your Rights',
      path: '/pages/index/index'
    };
  }
})
