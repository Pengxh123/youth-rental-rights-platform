Component({
  properties: {
    currentPage: {
      type: String,
      value: 'index'
    }
  },
  methods: {
    switchTab(e) {
      const page = e.currentTarget.dataset.page;
      const url = `/pages/${page}/${page}`;
      wx.switchTab({
        url: url,
        fail: () => {
          wx.navigateTo({
            url: url
          });
        }
      });
    }
  }
});
