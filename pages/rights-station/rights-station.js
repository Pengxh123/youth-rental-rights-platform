// pages/rights-station/rights-station.js
const app = getApp()

Page({
  data: {
    activeTab: 0,
    tabs: ['Apply', 'Resources', 'My Cases'],
    
    isAnonymous: false,
    rightsType: '',
    rightsTypes: ['Deposit Not Refunded', 'Overcharging', 'False Listing', 'Facility Damage', 'Other Issues'],
    description: '',
    images: [],
    contact: '',
    
    myCases: [],
    
    tools: [
      {
        icon: '📄',
        title: 'Contract Template',
        desc: 'Standard rental contract template',
        action: 'downloadContract'
      },
      {
        icon: '⚖️',
        title: 'Legal Provisions',
        desc: 'Rental rights related laws',
        action: 'viewLegal'
      },
      {
        icon: '📍',
        title: 'Complaint Channels',
        desc: 'Contact info for housing authorities',
        action: 'viewChannels'
      },
      {
        icon: '👨‍⚖️',
        title: 'Lawyer Consultation',
        desc: 'Free legal consultation',
        action: 'consultLawyer'
      },
      {
        icon: '📖',
        title: 'Process Guide',
        desc: 'Step-by-step rights guide',
        action: 'viewProcess'
      },
      {
        icon: '📞',
        title: 'Hotline Numbers',
        desc: 'Useful complaint hotlines',
        action: 'viewPhones'
      }
    ]
  },

  onLoad() {
    this.loadMyCases()
  },

  onShow() {
    this.loadMyCases()
  },

  loadMyCases() {
    const cases = wx.getStorageSync('rightsCases') || []
    this.setData({ myCases: cases })
  },

  toggleAnonymous() {
    this.setData({
      isAnonymous: !this.data.isAnonymous
    })
  },

  onRightsTypeChange(e) {
    const index = e.detail.value
    this.setData({
      rightsType: this.data.rightsTypes[index]
    })
  },

  chooseImage() {
    const maxCount = 3
    const currentCount = this.data.images.length

    if (currentCount >= maxCount) {
      wx.showToast({
        title: 'Max 3 images',
        icon: 'none'
      })
      return
    }

    wx.chooseImage({
      count: maxCount - currentCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.images, ...res.tempFilePaths]
        this.setData({ images: newImages })
      }
    })
  },

  deleteImage(e) {
    const index = e.currentTarget.dataset.index
    const images = this.data.images
    images.splice(index, 1)
    this.setData({ images })
  },

  submitRights() {
    const { rightsType, description, images, contact, isAnonymous } = this.data

    if (!rightsType) {
      wx.showToast({
        title: 'Please select rights type',
        icon: 'none'
      })
      return
    }

    if (!description) {
      wx.showToast({
        title: 'Please describe the issue',
        icon: 'none'
      })
      return
    }

    if (!contact && !isAnonymous) {
      wx.showToast({
        title: 'Please enter contact info',
        icon: 'none'
      })
      return
    }

    const newCase = {
      id: 'R' + Date.now(),
      type: rightsType,
      description: description,
      images: images,
      contact: isAnonymous ? 'Anonymous' : contact,
      status: 'Processing',
      createTime: new Date().toLocaleString(),
      isAnonymous: isAnonymous,
      progress: 20
    }

    const cases = wx.getStorageSync('rightsCases') || []
    cases.unshift(newCase)
    wx.setStorageSync('rightsCases', cases)

    app.globalData.rightsCases = cases

    wx.showModal({
      cancelText: 'No',
      title: 'Submitted',
      content: 'Case ID: ' + newCase.id + '\nWe will process your application soon',
      confirmText: 'View',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            activeTab: 2
          })
        } else {
          this.resetForm()
        }
      }
    })
  },

  resetForm() {
    this.setData({
      rightsType: '',
      description: '',
      images: [],
      contact: '',
      isAnonymous: false
    })
  },

  useTool(e) {
    const action = e.currentTarget.dataset.action

    if (action === 'downloadContract') {
      wx.showModal({
        cancelText: 'No',
        title: 'Download Contract',
        content: 'Downloading rental contract template',
        confirmText: 'Load',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: 'Downloading...',
              icon: 'loading'
            })
            setTimeout(() => {
              wx.showToast({
                title: 'Downloaded',
                icon: 'success'
              })
            }, 2000)
          }
        }
      })
    } else if (action === 'consultLawyer') {
      wx.showModal({
        cancelText: 'No',
        title: 'Lawyer Consultation',
        content: 'Redirecting to lawyer consultation page',
        confirmText: 'Go'
      })
    } else {
      wx.showToast({
        title: 'Feature in development',
        icon: 'none'
      })
    }
  },

  viewCaseDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Case Details',
      content: 'Case ID: ' + id,
      showCancel: false
    })
  },

  addEvidence(e) {
    const id = e.currentTarget.dataset.id
    wx.chooseImage({
      count: 1,
      success: () => {
        wx.showToast({
          title: 'Evidence added',
          icon: 'success'
        })
      }
    })
  },

  contactService() {
    wx.showModal({
      cancelText: 'No',
      title: 'Contact Support',
      content: 'Working hours: 9:00-18:00\nSupport Hotline: 400-123-4567',
      confirmText: 'Call',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-123-4567'
          })
        }
      }
    })
  }
})
