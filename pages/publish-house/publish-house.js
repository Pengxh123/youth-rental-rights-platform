// pages/publish-house/publish-house.js
Page({
  /**
   * Page initial data
   */
  data: {
    // Listing form
    formData: {
      title: '',
      rentType: '', // whole:Whole, share:Shared, single:Single
      rentTypeLabel: '',
      houseType: '', // 1,2,3,4
      houseTypeLabel: '',
      area: '',
      floor: '',
      floorLabel: '',
      decoration: '',
      decorationLabel: '',
      price: '',
      address: '',
      longitude: '',
      latitude: '',
      description: '',
      facilities: [],
      images: []
    },
    
    // Rent type options
    rentTypeOptions: [
      { label: 'Whole', value: 'whole' },
      { label: 'Shared', value: 'share' },
      { label: 'Single', value: 'single' }
    ],
    
    // House type options
    houseTypeOptions: [
      { label: '1 Bedroom', value: '1' },
      { label: '2 Bedrooms', value: '2' },
      { label: '3 Bedrooms', value: '3' },
      { label: '4+ Bedrooms', value: '4' }
    ],
    
    // Floor options
    floorOptions: [
      { label: 'Ground floor', value: 'Ground floor' },
      { label: 'Low floor', value: 'Low floor' },
      { label: 'Mid floor', value: 'Mid floor' },
      { label: 'High floor', value: 'High floor' },
      { label: 'Top floor', value: 'Top floor' }
    ],
    
    // Decoration options
    decorationOptions: [
      { label: 'Bare', value: 'Bare' },
      { label: 'Simple', value: 'Simple' },
      { label: 'Moderate', value: 'Moderate' },
      { label: 'Fully furnished', value: 'Fully furnished' },
      { label: 'Luxury', value: 'Luxury' }
    ],
    
    // Facility options
    facilityOptions: [
      { label: 'AC', value: 'AC', icon: '❄️' },
      { label: 'Washer', value: 'Washer', icon: '🧺' },
      { label: 'Fridge', value: 'Fridge', icon: '🧊' },
      { label: 'Water Heater', value: 'Water Heater', icon: '🚿' },
      { label: 'WiFi', value: 'WiFi', icon: '📶' },
      { label: 'TV', value: 'TV', icon: '📺' },
      { label: 'Sofa', value: 'Sofa', icon: '🛋️' },
      { label: 'Bed', value: 'Bed', icon: '🛏️' },
      { label: 'Wardrobe', value: 'Wardrobe', icon: '👔' },
      { label: 'Desk', value: 'Desk', icon: '📚' },
      { label: 'Gas Stove', value: 'Gas Stove', icon: '🔥' },
      { label: 'Range Hood', value: 'Range Hood', icon: '💨' },
      { label: 'En-suite Bathroom', value: 'En-suite Bathroom', icon: '🚽' },
      { label: 'Balcony', value: 'Balcony', icon: '☀️' },
      { label: 'Elevator', value: 'Elevator', icon: '🛗' },
      { label: 'Parking', value: 'Parking', icon: '🚗' }
    ],
    
    // Current location
    currentLocation: {
      address: '',
      longitude: '',
      latitude: ''
    },
    
    // Form validation
    rules: {
      title: 'Please enter listing title',
      rentType: 'Please select rent type',
      houseType: 'Please select house type',
      area: 'Please enter area',
      floor: 'Please select floor',
      decoration: 'Please select decoration',
      price: 'Please enter rent price',
      address: 'Please select address',
      description: 'Please enter description'
    },
    
    // Submit status
    submitting: false,
    
    // Max image upload count
    maxImages: 6,
    
    // Draft list
    houseDrafts: []
  },

  /**
   * Lifecycle - on page load
   */
  onLoad(options) {
    this.getUserLocation();
    this.loadDrafts();
  },
  
  /**
   * Lifecycle - on page show
   */
  onShow() {
    this.loadDrafts();
  },
  
  /**
   * Load draft list
   */
  loadDrafts() {
    try {
      const drafts = wx.getStorageSync('houseDrafts') || [];
      this.setData({ houseDrafts: drafts });
      console.log('Drafts loaded:', drafts);
      
      // If drafts exist, load latest draft like WeChat Moments
      if (drafts.length > 0) {
        // Sort by save time, get latest draft
        const latestDraft = [...drafts].sort((a, b) => new Date(b.saveTime) - new Date(a.saveTime))[0];
        this.setData({ formData: latestDraft });
        console.log('Loaded latest draft:', latestDraft);
      }
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  },

  /**
   * Get user current location
   */
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          'formData.longitude': res.longitude,
          'formData.latitude': res.latitude
        });
        
        // Reverse geocoding
        this.reverseGeocode(res.latitude, res.longitude);
      },
      fail: (err) => {
        wx.showToast({
          title: 'Failed to get location',
          icon: 'none'
        });
      }
    });
  },

  /**
   * Reverse geocoding
   */
  reverseGeocode(lat, lng) {
    try {
      const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
      let qqmapsdk = new QQMapWX({
        key: 'YOUR_QQ_MAP_KEY'
      });
      
      qqmapsdk.reverseGeocoder({
        location: { latitude: lat, longitude: lng },
        success: (res) => {
          this.setData({
            'formData.address': res.result.address,
            'currentLocation.address': res.result.address,
            'currentLocation.longitude': lng,
            'currentLocation.latitude': lat
          });
        },
        fail: (err) => {
          console.error('Reverse geocoding failed:', err);
        }
      });
    } catch (error) {
      console.error('Map SDK load failed:', error);
    }
  },

  /**
   * Choose location
   */
  chooseLocation() {
    console.log('chooseLocation called');
    wx.chooseLocation({
      success: (res) => {
        console.log('Location chosen successfully:', res);
        this.setData({
          'formData.address': res.address,
          'formData.longitude': res.longitude,
          'formData.latitude': res.latitude
        });
        console.log('Location data updated');
      },
      fail: (err) => {
        console.error('Failed to choose location:', err);
      }
    });
  },

  /**
   * Form input change
   */
  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  /**
   * Picker change
   */
  onPickerChange(e) {
    const { field } = e.currentTarget.dataset;
    const index = e.detail.value;
    const options = this.data[`${field}Options`];
    const selected = options[index];
    const value = selected.value;
    const label = selected.label;
    
    // Set corresponding label by field type
    const updateData = {};
    updateData[`formData.${field}`] = value;
    updateData[`formData.${field}Label`] = label;
    
    this.setData(updateData);
  },

  /**
   * Toggle facility
   */
  toggleFacility(e) {
    console.log('toggleFacility called:', e);
    const { value } = e.currentTarget.dataset;
    console.log('Facility value:', value);
    let facilities = [...this.data.formData.facilities];
    console.log('Current facilities:', facilities);
    const index = facilities.indexOf(value);
    console.log('Index:', index);
    
    if (index === -1) {
      facilities.push(value);
      console.log('Added facility, new facilities:', facilities);
    } else {
      facilities.splice(index, 1);
      console.log('Removed facility, new facilities:', facilities);
    }
    
    this.setData({
      'formData.facilities': facilities
    });
    console.log('SetData completed');
  },

  /**
   * Choose image
   */
  chooseImage() {
    const maxCount = this.data.maxImages - this.data.formData.images.length;
    
    wx.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const images = [...this.data.formData.images, ...res.tempFilePaths];
        this.setData({
          'formData.images': images
        });
      }
    });
  },

  /**
   * Preview image
   */
  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.formData.images[index],
      urls: this.data.formData.images
    });
  },

  /**
   * Delete image
   */
  deleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.formData.images];
    images.splice(index, 1);
    
    this.setData({
      'formData.images': images
    });
  },

  /**
   * Form validation
   */
  validateForm() {
    const formData = this.data.formData;
    const rules = this.data.rules;
    
    for (let key in rules) {
      if (!formData[key] || (key === 'facilities' && formData[key].length === 0)) {
        wx.showToast({
          title: rules[key],
          icon: 'none'
        });
        return false;
      }
    }
    
    return true;
  },

  /**
   * Submit form
   */
  async submitForm() {
    // Validate form
    if (!this.validateForm()) {
      return;
    }
    
    // Get user info
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    // Check if user is logged in (check nickName or nickname)
    if (!userInfo.nickName && !userInfo.nickname) {
      wx.showModal({
        cancelText: 'No',
        title: 'Notice',
        content: 'Please login before publishing listing',
        confirmText: 'Sign',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({
              url: '/pages/profile/profile'
            });
          }
        }
      });
      return;
    }
    
    this.setData({ submitting: true });
    
    try {
      console.log('[Start submitting listing]', this.data.formData);
      
      // Upload images to cloud storage (with error handling)
      wx.showLoading({ title: 'Uploading images...' });
      const imageUrls = [];
      let uploadSuccess = true;
      
      console.log('[Start uploading images]', this.data.formData.images.length, 'images');
      
      try {
        for (let i = 0; i < this.data.formData.images.length; i++) {
          const imagePath = this.data.formData.images[i];
          const cloudPath = `house-images/${Date.now()}_${i}.jpg`;
          
          console.log('[Upload image]', i, imagePath, cloudPath);
          
          const res = await wx.cloud.uploadFile({
            cloudPath,
            filePath: imagePath
          });
          
          console.log('[Image uploaded]', res.fileID);
          imageUrls.push(res.fileID);
        }
      } catch (uploadError) {
        console.error('[Image upload failed]', uploadError);
        uploadSuccess = false;
        // If image upload fails, continue with empty array
        // So listing info can still be saved even if image upload fails
      }
      
      console.log('[Image upload result]', { uploadSuccess, imageCount: imageUrls.length });
      
      wx.hideLoading();
      wx.showLoading({ title: 'Submitting...' });
      
      // Submit listing to cloud function
      const submitData = {
        title: this.data.formData.title,
        rentType: this.data.formData.rentType,
        houseType: this.data.formData.houseType,
        area: this.data.formData.area,
        floor: this.data.formData.floor,
        decoration: this.data.formData.decoration,
        price: this.data.formData.price,
        address: this.data.formData.address,
        latitude: this.data.formData.latitude,
        longitude: this.data.formData.longitude,
        images: imageUrls,
        facilities: this.data.formData.facilities,
        description: this.data.formData.description,
        publisher: {
          name: userInfo.nickName || userInfo.nickname || 'Anonymous',
          avatar: userInfo.avatarUrl || userInfo.avatar || '',
          phone: userInfo.phone || userInfo.mobile || ''
        }
      };
      
      console.log('[Ready to call cloud function]', submitData);
      
      try {
        // Call cloud function to save listing (with retry)
        let result;
        const maxRetries = 2;
        let retryCount = 0;
        
        while (retryCount <= maxRetries) {
          try {
            result = await wx.cloud.callFunction({
              name: 'add-house',
              data: {
                action: 'add',
                data: submitData
              }
            });
            break; // Success, exit loop
          } catch (retryError) {
            retryCount++;
            if (retryCount > maxRetries) {
              throw retryError; // Retries exhausted, throw error
            }
            console.warn('[Cloud function failed, retrying]', retryCount, retryError);
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        console.log('[Cloud function result]', result);
        
        wx.hideLoading();
        
        if (result.result && result.result.success) {
          wx.showToast({
            title: 'Submitted, pending review',
            icon: 'success'
          });
          
          // Clear form
          this.setData({
            formData: {
              title: '',
              rentType: '',
              rentTypeLabel: '',
              houseType: '',
              houseTypeLabel: '',
              area: '',
              floor: '',
              floorLabel: '',
              decoration: '',
              decorationLabel: '',
              price: '',
              address: '',
              longitude: '',
              latitude: '',
              description: '',
              facilities: [],
              images: []
            },
            submitting: false
          });
          
          // Navigate to listing management page
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/house-audit/house-audit'
            });
          }, 1500);
          
        } else {
          console.error('[Cloud function returned failure]', result);
          throw new Error(result.result?.message || result.result?.error || 'Submit failed');
        }
      } catch (cloudError) {
        console.error('[Cloud function call failed]', cloudError);
        wx.hideLoading();
        
        // Fallback: save as local draft
        wx.showModal({
          title: 'Network Issue',
          content: 'Cannot connect to cloud, save as local draft?',
          confirmText: 'Save',
          cancelText: 'No',
          success: (res) => {
            if (res.confirm) {
              // Call save draft method
              this.saveDraft();
            }
          }
        });
        
        this.setData({ submitting: false });
      }
      
    } catch (err) {
      console.error('[Submit listing failed]', err);
      console.error('[Error details]', JSON.stringify(err));
      wx.hideLoading();
      
      // Show different messages by error type
      let errorMessage = 'Submit failed, please retry';
      if (err.errMsg && err.errMsg.includes('cloud function')) {
        errorMessage = 'Cloud function call failed, check network or cloud config';
      } else if (err.errMsg && err.errMsg.includes('uploadFile')) {
        errorMessage = 'Image upload failed, check size or network';
      } else if (err.errMsg && err.errMsg.includes('collection')) {
        errorMessage = 'Database operation failed, check database config';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      wx.showToast({
        title: errorMessage,
        icon: 'none',
        duration: 3000
      });
      
      this.setData({ submitting: false });
    }
  },

  /**
   * Upload images
   */
  uploadImages() {
    const images = this.data.formData.images;
    const uploadPromises = images.map(img => {
      return new Promise((resolve, reject) => {
        // Simulate upload
        setTimeout(() => {
          resolve(img);
        }, 500);
      });
    });
    
    return Promise.all(uploadPromises);
  },

  /**
   * Save draft
   */
  saveDraft() {
    const formData = this.data.formData;
    const drafts = wx.getStorageSync('houseDrafts') || [];
    
    drafts.push({
      ...formData,
      draftId: Date.now(),
      saveTime: new Date().toISOString()
    });
    
    wx.setStorageSync('houseDrafts', drafts);
    
    wx.showToast({
      title: 'Draft saved',
      icon: 'success'
    });
  },

  /**
   * Load draft
   */
  loadDraft(e) {
    const { id } = e.currentTarget.dataset;
    const drafts = wx.getStorageSync('houseDrafts') || [];
    const draft = drafts.find(d => d.draftId === id);
    
    if (draft) {
      this.setData({ formData: draft });
      wx.showToast({
        title: 'Draft loaded',
        icon: 'success'
      });
    }
  },

  /**
   * Delete draft
   */
  deleteDraft(e) {
    const { id } = e.currentTarget.dataset;
    let drafts = wx.getStorageSync('houseDrafts') || [];
    drafts = drafts.filter(d => d.draftId !== id);
    
    wx.setStorageSync('houseDrafts', drafts);
    
    wx.showToast({
      title: 'Draft deleted',
      icon: 'success'
    });
  }
});
