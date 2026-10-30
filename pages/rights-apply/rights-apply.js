// pages/rights-apply/rights-apply.js
Page({
  data: {
    types: ['Deposit Not Returned', 'Overcharging', 'Fake Listing', 'Contract Dispute', 'Other'],
    typeValues: ['deposit', 'fee', 'fake', 'breach', 'other'],
    typeIndex: 0,
    title: '',
    description: '',
    amount: '',
    contractImage: '',
    proofImages: [],
    name: '',
    phone: '',
    idCard: ''
  },

  onLoad(options) {
    // Rights protection type passed from previous page
    if (options.type) {
      const typeIndex = parseInt(options.type);
      this.setData({ typeIndex });
    }
  },

  onTypeChange(e) {
    this.setData({ typeIndex: parseInt(e.detail.value) });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value });
  },

  onAmountInput(e) {
    this.setData({ amount: e.detail.value });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onIdCardInput(e) {
    this.setData({ idCard: e.detail.value });
  },

  uploadContract() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.setData({ contractImage: tempFilePaths[0] });
      }
    });
  },

  uploadProof() {
    const remain = 6 - this.data.proofImages.length;
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const proofImages = [...this.data.proofImages, ...res.tempFilePaths];
        this.setData({ proofImages });
      }
    });
  },

  previewProof(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.proofImages[index],
      urls: this.data.proofImages
    });
  },

  deleteProof(e) {
    const index = e.currentTarget.dataset.index;
    const proofImages = this.data.proofImages.filter((_, i) => i !== index);
    this.setData({ proofImages });
  },

  submitApply() {
    const { typeIndex, title, description, name, phone } = this.data;

    if (!title) {
      wx.showToast({
        title: 'Please fill in the title',
        icon: 'none'
      });
      return;
    }

    if (!description) {
      wx.showToast({
        title: 'Please fill in the detailed description',
        icon: 'none'
      });
      return;
    }

    if (!name) {
      wx.showToast({
        title: 'Please fill in the name',
        icon: 'none'
      });
      return;
    }

    if (!phone) {
      wx.showToast({
        title: 'Please fill in the phone number',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: 'Please enter a valid phone number',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: 'Submitting...'
    });

    setTimeout(() => {
      wx.hideLoading();

      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const orderNo = `WQ${timestamp}${random}`;

      const record = {
        id: Date.now(),
        orderNo: orderNo,
        type: this.data.typeValues[typeIndex],
        typeText: this.data.types[typeIndex],
        title: this.data.title,
        description: this.data.description,
        amount: this.data.amount,
        createTime: new Date().toLocaleString('en-US'),
        status: 'pending',
        statusText: 'Pending Review'
      };

      try {
        let records = wx.getStorageSync('rightsRecords') || [];
        records.unshift(record);
        wx.setStorageSync('rightsRecords', records);
      } catch (e) {
        console.error('Save failed', e);
      }

      wx.showModal({
        cancelText: 'No',
        title: 'Submitted Successfully',
        content: `Your rights protection application has been submitted successfully!\n\nCase Number: ${orderNo}\n\nPlease save your case number for progress inquiry.`,
        confirmText: 'OK',
        showCancel: false
      });

      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1500);
  }
})
