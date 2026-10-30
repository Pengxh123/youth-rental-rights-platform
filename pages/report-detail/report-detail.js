// pages/report-detail/report-detail.js
Page({
  data: {
    reportId: '',
    report: {},
    progressSteps: []
  },

  onLoad(options) {
    const reportId = options.id;
    this.setData({ reportId });
    this.loadReportDetail(reportId);
  },

  loadReportDetail(reportId) {
    try {
      const records = wx.getStorageSync('rightsRecords') || [];
      const report = records.find(item => item.id === parseInt(reportId));

      if (report) {
        const steps = this.generateProgressSteps(report);

        this.setData({
          report,
          progressSteps: steps
        });
      }
    } catch (e) {
      console.error('Failed to load rights detail', e);
    }
  },

  generateProgressSteps(report) {
    const steps = [
      {
        id: 1,
        title: 'Submit Application',
        time: report.createTime,
        status: 'completed'
      },
      {
        id: 2,
        title: 'Platform Review',
        time: report.auditTime || '',
        status: report.status === 'pending' ? 'active' : 'completed'
      }
    ];

    if (report.status === 'processing') {
      steps.push({
        id: 3,
        title: 'Processing',
        time: '',
        status: 'active'
      });
    } else if (report.status === 'success' || report.status === 'failed') {
      steps.push({
        id: 3,
        title: 'Coordinating',
        time: report.processTime || '',
        status: 'completed'
      });
      steps.push({
        id: 4,
        title: report.status === 'success' ? 'Completed' : 'Failed',
        time: report.completeTime || '',
        status: report.status === 'success' ? 'completed' : 'failed'
      });
    }

    return steps;
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.report.evidences
    });
  },

  contactService() {
    wx.showModal({
      cancelText: 'No',
      title: 'Contact Service',
      content: 'Service Hotline: 400-123-4567\nWorking Hours: 9:00-18:00',
      confirmText: 'Call',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4001234567'
          });
        }
      }
    });
  },

  cancelReport() {
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Cancel Application',
      content: 'Are you sure you want to cancel this rights application?',
      success: (res) => {
        if (res.confirm) {
          try {
            let records = wx.getStorageSync('rightsRecords') || [];
            records = records.map(item => {
              if (item.id === parseInt(this.data.reportId)) {
                return { ...item, status: 'cancelled', statusText: 'Cancelled', statusIcon: '❌' };
              }
              return item;
            });

            wx.setStorageSync('rightsRecords', records);

            wx.showToast({
              title: 'Cancelled Successfully',
              icon: 'success'
            });

            this.loadReportDetail(this.data.reportId);
          } catch (e) {
            console.error('Failed to cancel', e);
          }
        }
      }
    });
  }
})
