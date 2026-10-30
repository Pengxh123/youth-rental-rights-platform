// pages/profile-edit/profile-edit.js
Page({
  data: {
    userInfo: {
      nickName: '',
      avatar: '',
      realName: '',
      mobile: ''
    },
    editing: {
      nickName: false,
      realName: false,
      mobile: false
    },
    tempAvatar: '',
    isSubmitting: false
  },

  onLoad(options) {
    this.loadUserInfo();
  },

  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo') || {
        nickName: 'Rental User',
        avatar: '',
        realName: '',
        mobile: ''
      };
      this.setData({ userInfo });
    } catch (e) {
      console.error('Failed to load user info', e);
      wx.showToast({
        title: 'Load failed',
        icon: 'none'
      });
    }
  },

  onNickNameTap() {
    this.setData({ 'editing.nickName': true });
  },

  onRealNameTap() {
    this.setData({ 'editing.realName': true });
  },

  onMobileTap() {
    this.setData({ 'editing.mobile': true });
  },

  onNickNameChange(e) {
    const userInfo = this.data.userInfo;
    userInfo.nickName = e.detail.value;
    this.setData({ userInfo });
  },

  onRealNameChange(e) {
    const userInfo = this.data.userInfo;
    userInfo.realName = e.detail.value;
    this.setData({ userInfo });
  },

  onMobileChange(e) {
    const userInfo = this.data.userInfo;
    userInfo.mobile = e.detail.value;
    this.setData({ userInfo });
  },

  onNickNameBlur() {
    this.setData({ 'editing.nickName': false });
    this.saveUserInfo();
  },

  onRealNameBlur() {
    this.setData({ 'editing.realName': false });
    this.saveUserInfo();
  },

  onMobileBlur() {
    this.setData({ 'editing.mobile': false });
    this.saveUserInfo();
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ 'tempAvatar': tempFilePath });
        this.uploadAvatar(tempFilePath);
      },
      fail: (err) => {
        console.error('Failed to select avatar', err);
      }
    });
  },

  uploadAvatar(tempFilePath) {
    wx.showLoading({
      title: 'Uploading...'
    });

    setTimeout(() => {
      const userInfo = this.data.userInfo;
      userInfo.avatar = tempFilePath;
      this.setData({ userInfo });
      this.saveUserInfo();
      wx.hideLoading();
      wx.showToast({
        title: 'Avatar updated successfully',
        icon: 'success'
      });
    }, 1000);
  },

  saveUserInfo() {
    try {
      wx.setStorageSync('userInfo', this.data.userInfo);
      const app = getApp();
      app.globalData.userInfo = this.data.userInfo;
    } catch (e) {
      console.error('Failed to save user info', e);
      wx.showToast({
        title: 'Save failed',
        icon: 'none'
      });
    }
  },

  bindMobile() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Phone Binding',
      content: 'Bind phone number?',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: 'Binding...'
          });

          setTimeout(() => {
            const userInfo = this.data.userInfo;
            userInfo.mobile = '138****8888';
            this.setData({ userInfo });
            this.saveUserInfo();
            wx.hideLoading();
            wx.showToast({
              title: 'Binding successful',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  unbindMobile() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Unbind',
      content: 'Are you sure you want to unbind your phone number?',
      success: (res) => {
        if (res.confirm) {
          const userInfo = this.data.userInfo;
          userInfo.mobile = '';
          this.setData({ userInfo });
          this.saveUserInfo();
          wx.showToast({
            title: 'Unbind successful',
            icon: 'success'
          });
        }
      }
    });
  },

  bindRealName() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Real Name Verification',
      content: 'Proceed with real name verification?',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: 'Verifying...'
          });

          setTimeout(() => {
            const userInfo = this.data.userInfo;
            userInfo.realName = 'Zhang San';
            this.setData({ userInfo });
            this.saveUserInfo();
            wx.hideLoading();
            wx.showToast({
              title: 'Verification successful',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  unbindRealName() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Unbind Verification',
      content: 'Are you sure you want to unbind real name verification?',
      success: (res) => {
        if (res.confirm) {
          const userInfo = this.data.userInfo;
          userInfo.realName = '';
          this.setData({ userInfo });
          this.saveUserInfo();
          wx.showToast({
            title: 'Unbind successful',
            icon: 'success'
          });
        }
      }
    });
  },

  onSubmit() {
    this.setData({ isSubmitting: true });
    this.saveUserInfo();

    setTimeout(() => {
      this.setData({ isSubmitting: false });
      wx.showToast({
        title: 'Saved successfully',
        icon: 'success'
      });
      wx.navigateBack();
    }, 1000);
  },

  onCancel() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    return {
      title: 'Edit Profile - Youth Rental Rights',
      path: '/pages/profile-edit/profile-edit'
    };
  }
});
