// pages/favorite-detail/favorite-detail.js
Page({
  data: {
    topic: {},
    isFavorited: true
  },

  onLoad(options) {
    if (options.data) {
      try {
        const topic = JSON.parse(decodeURIComponent(options.data));
        this.setData({ topic });
      } catch (e) {
        console.error('Failed to parse data', e);
        wx.showToast({
          title: 'Failed to load data',
          icon: 'none'
        });
      }
    }
  },

  toggleFavorite() {
    const isFavorited = !this.data.isFavorited;
    this.setData({ isFavorited });

    try {
      let favorites = wx.getStorageSync('favorites') || [];
      const topicId = this.data.topic.id;

      if (isFavorited) {
        // Add to favorites
        if (!favorites.some(f => f.targetId == topicId)) {
          favorites.unshift({
            id: topicId,
            targetId: topicId,
            type: 'topic',
            title: this.data.topic.title,
            time: this.formatDate(new Date().getTime()),
            content: this.data.topic.content,
            author: this.data.topic.author,
            avatar: this.data.topic.avatar,
            createTime: this.data.topic.createTime,
            category: this.data.topic.category,
            tags: this.data.topic.tags,
            images: this.data.topic.images,
            likes: this.data.topic.likes,
            comments: this.data.topic.comments
          });
        }
        wx.setStorageSync('favorites', favorites);
        wx.showToast({ title: 'Favorited', icon: 'success' });
      } else {
        // Remove from favorites
        favorites = favorites.filter(item => item.targetId != topicId);
        wx.setStorageSync('favorites', favorites);
        wx.showToast({ title: 'Unfavorited', icon: 'success' });
      }
    } catch (e) {
      console.error('Favorite operation failed', e);
    }
  },

  toggleLike() {
    const topic = this.data.topic;
    topic.likes = (topic.likes || 0) + 1;
    this.setData({ topic });
    wx.showToast({
      title: 'Liked',
      icon: 'success'
    });
  },

  formatDate(timestamp) {
    const date = new Date(timestamp);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hour}:${minute}`;
  },

  followAuthor() {
    wx.showToast({
      title: 'Followed',
      icon: 'success'
    });
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.topic.images || []
    });
  },

  onShareAppMessage() {
    return {
      title: this.data.topic.title,
      path: `/pages/favorite-detail/favorite-detail?data=${encodeURIComponent(JSON.stringify(this.data.topic))}`
    };
  }
})
