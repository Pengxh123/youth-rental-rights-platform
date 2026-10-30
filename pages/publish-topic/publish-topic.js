// pages/publish-topic/publish-topic.js
Page({
  data: {
    title: '',
    content: '',
    category: '',
    tags: [],
    images: [],
    currentTag: '',
    categories: [
      { id: 'fraud', name: 'Scam Experience' },
      { id: 'success', name: 'Success Case' },
      { id: 'tips', name: 'Rental Tips' },
      { id: 'help', name: 'Help Request' },
      { id: 'experience', name: 'Experience Sharing' }
    ],
    showCategoryModal: false,
    isAnonymous: false
  },

  onLoad() {
    try {
      const settings = wx.getStorageSync('settings') || {};
      this.setData({ isAnonymous: settings.anonymous || false });
    } catch (e) {
      console.error('Failed to load settings', e);
    }

    this.onLoadDraft();
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onTagInput(e) {
    this.setData({ currentTag: e.detail.value });
  },

  onAddTag() {
    const tag = this.data.currentTag.trim();
    if (tag && !this.data.tags.includes(tag)) {
      if (this.data.tags.length < 5) {
        this.setData({
          tags: [...this.data.tags, tag],
          currentTag: ''
        });
      } else {
        wx.showToast({
          title: 'Maximum 5 tags allowed',
          icon: 'none'
        });
      }
    }
  },

  onDeleteTag(e) {
    const index = e.currentTarget.dataset.index;
    const tags = this.data.tags.filter((_, i) => i !== index);
    this.setData({ tags });
  },

  onChooseCategory(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ category });
  },

  showCategoryPicker() {
    this.setData({ showCategoryModal: true });
  },

  hideCategoryPicker() {
    this.setData({ showCategoryModal: false });
  },

  onChooseImage() {
    wx.chooseMedia({
      count: 9 - this.data.images.length,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = [...this.data.images, ...res.tempFiles.map(file => file.tempFilePath)];
        this.setData({ images });
      }
    });
  },

  onPreviewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.images,
      current: this.data.images[index]
    });
  },

  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== index);
    this.setData({ images });
  },

  onAnonymousChange(e) {
    this.setData({ isAnonymous: e.detail.value });
  },

  onPublish() {
    if (!this.data.title.trim()) {
      wx.showToast({
        title: 'Please enter title',
        icon: 'none'
      });
      return;
    }

    if (this.data.title.length < 5 || this.data.title.length > 50) {
      wx.showToast({
        title: 'Title should be 5-50 characters',
        icon: 'none'
      });
      return;
    }

    if (!this.data.content.trim()) {
      wx.showToast({
        title: 'Please enter content',
        icon: 'none'
      });
      return;
    }

    if (!this.data.category) {
      wx.showToast({
        title: 'Please select category',
        icon: 'none'
      });
      return;
    }

    if (this.data.tags.length === 0) {
      wx.showToast({
        title: 'Please add at least one tag',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: 'Publishing...'
    });

    setTimeout(() => {
      const topic = {
        id: Date.now(),
        author: this.data.isAnonymous ? 'Anonymous User' : 'Rental User',
        avatar: '',
        time: 'Just now',
        title: this.data.title,
        summary: this.data.content.substring(0, 100) + '...',
        category: this.getCategoryName(this.data.category),
        type: this.data.category,
        tags: this.data.tags,
        images: this.data.images,
        views: 0,
        comments: 0,
        likes: 0,
        favorites: 0,
        isHot: false,
        isTop: false
      };

      try {
        const myTopics = wx.getStorageSync('myTopics') || [];
        myTopics.unshift(topic);
        wx.setStorageSync('myTopics', myTopics);
      } catch (e) {
        console.error('Failed to save topic', e);
      }

      wx.hideLoading();

      wx.showToast({
        title: 'Published successfully',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    }, 1000);
  },

  getCategoryName(categoryId) {
    const category = this.data.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Other';
  },

  onSaveDraft() {
    if (!this.data.title.trim() && !this.data.content.trim()) {
      wx.showToast({
        title: 'No content to save',
        icon: 'none'
      });
      return;
    }

    try {
      const draft = {
        title: this.data.title,
        content: this.data.content,
        category: this.data.category,
        tags: this.data.tags,
        images: this.data.images,
        saveTime: new Date().getTime()
      };

      wx.setStorageSync('topicDraft', draft);

      wx.showToast({
        title: 'Draft saved',
        icon: 'success'
      });
    } catch (e) {
      console.error('Failed to save draft', e);
      wx.showToast({
        title: 'Save failed',
        icon: 'none'
      });
    }
  },

  onLoadDraft() {
    try {
      const draft = wx.getStorageSync('topicDraft');
      if (draft) {
        this.setData({
          title: draft.title || '',
          content: draft.content || '',
          category: draft.category || '',
          tags: draft.tags || [],
          images: draft.images || []
        });
      }
    } catch (e) {
      console.error('Failed to load draft', e);
    }
  },

  onShareAppMessage() {
    return {
      title: 'Post Rental Topic - Share Experience, Help Each Other Avoid Pitfalls',
      path: '/pages/discussion/discussion'
    };
  }
})
