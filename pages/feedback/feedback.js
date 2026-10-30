// pages/feedback/feedback.js
Page({
  data: {
    feedbackType: 'bug',
    content: '',
    contact: '',
    image: ''
  },

  onLoad(options) {

  },

  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ feedbackType: type });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onContactInput(e) {
    this.setData({ contact: e.detail.value });
  },

  uploadImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ image: res.tempFiles[0].tempFilePath });
      }
    });
  },

  removeImage() {
    this.setData({ image: '' });
  },

  submitFeedback() {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: 'Please enter feedback content',
        icon: 'none'
      });
      return;
    }

    if (!this.data.feedbackType) {
      wx.showToast({
        title: 'Please select feedback type',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: 'Submitting...'
    });

    // Simulate submission
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: 'Submitted successfully, thank you for your feedback!',
        icon: 'success'
      });

      // Clear form
      this.setData({
        content: '',
        contact: '',
        image: ''
      });
    }, 1500);
  },

  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: 'Youth Rental Rights Protection Service - Feedback',
      path: '/pages/feedback/feedback'
    };
  }
})
