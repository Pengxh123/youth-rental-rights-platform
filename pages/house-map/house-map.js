// pages/house-map/house-map.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

// Instantiate API core class
let qqmapsdk = new QQMapWX({
  key: 'YOUR_QQ_MAP_KEY' // Apply for key at Tencent Location Service
});

Page({
  /**
   * Page initial data
   */
  data: {
    longitude: 116.397428, // Longitude (default Beijing)
    latitude: 39.90923, // Latitude
    scale: 14, // Zoom level
    markers: [], // Map markers
    showLocation: true, // Show current location
    polyline: [], // Route
    circles: [], // Circle overlay (search radius)
    
    // Current location info
    currentLocation: {
      address: 'Getting location...',
      district: '',
      city: '',
      province: ''
    },
    
    // Search radius
    searchRadius: 3000, // meters
    radiusOptions: [
      { label: '1km', value: 1000 },
      { label: '2km', value: 2000 },
      { label: '3km', value: 3000 },
      { label: '5km', value: 5000 }
    ],
    
    // Listing list
    houseList: [],
    loading: false,
    
    // Filter conditions
    filters: {
      priceRange: '', // Price range
      houseType: '', // House type
      rentType: '', // Rent type
      keyword: '' // Keyword
    },
    
    // Rent type options
    rentTypeOptions: [
      { label: 'Whole', value: 'whole' },
      { label: 'Shared', value: 'share' },
      { label: 'Single', value: 'single' }
    ],
    
    houseTypeOptions: [
      { label: '1 Bedroom', value: '1' },
      { label: '2 Bedrooms', value: '2' },
      { label: '3 Bedrooms', value: '3' },
      { label: '4+ Bedrooms', value: '4' }
    ],
    
    priceRangeOptions: [
      { label: 'Under 2000', value: '0-2000' },
      { label: '2000-4000', value: '2000-4000' },
      { label: '4000-6000', value: '4000-6000' },
      { label: '6000-8000', value: '6000-8000' },
      { label: 'Over 8000', value: '8000-' }
    ],
    
    // View mode: 'map' or 'list'
    viewMode: 'map',
    
    // Selected listing detail
    selectedHouse: null,
    showDetail: false
  },

  /**
   * Lifecycle - on page load
   */
  onLoad(options) {
    this.initMap();
    this.getUserLocation();
    
    // Check if listing detail params passed
    if (options && options.houseDetail) {
      try {
        const houseDetail = JSON.parse(decodeURIComponent(options.houseDetail));
        if (houseDetail) {
          this.setData({
            selectedHouse: houseDetail,
            showDetail: true
          });
        }
      } catch (e) {
        console.error('Failed to parse listing detail params', e);
      }
    }
  },

  /**
   * Lifecycle - on first render complete
   */
  onReady() {
    // Get map context
    this.mapCtx = wx.createMapContext('houseMap', this);
  },

  /**
   * Lifecycle - on page show
   */
  onShow() {
    // Ensure mock data loaded on page show
    if (this.data.houseList.length === 0) {
      this.loadMockHouses();
    }
    // Refresh listing list on each show
    if (this.data.longitude && this.data.latitude) {
      this.searchNearbyHouses();
    }
  },

  /**
   * Back button tap (Mini Program native)
   */
  navigateBack() {
    // If currently list view, switch to map view
    if (this.data.viewMode === 'list') {
      this.setData({ viewMode: 'map' });
    } else {
      // If currently map view, default back
      wx.navigateBack({ delta: 1 });
    }
  },

  /**
   * Page navigation handler
   */
  onNavigatorBack() {
    this.navigateBack();
  },

  /**
   * Initialize map
   */
  initMap() {
    wx.showLoading({
      title: 'Loading map...'
    });
  },

  /**
   * Get user current location
   */
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res;
        this.setData({
          latitude,
          longitude,
          circles: [{
            latitude,
            longitude,
            radius: this.data.searchRadius,
            fillColor: '#FFC10730',
            strokeColor: '#FFC107',
            strokeWidth: 2
          }]
        });

        // Reverse geocode to get address info
        this.reverseGeocode(latitude, longitude);

        // Search nearby listings (from cloud)
        this.searchNearbyHouses();

        wx.hideLoading();
      },
      fail: (err) => {
        wx.hideLoading();
        wx.showModal({
          cancelText: 'No',
          title: 'Location failed',
          content: 'Cannot get your location, showing default',
          confirmText: 'Try',
          success: (res) => {
            if (res.confirm) {
              this.getUserLocation();
            }
          }
        });
      }
    });
  },

  /**
   * Reverse geocoding
   */
  reverseGeocode(lat, lng) {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lng
      },
      success: (res) => {
        const { address, address_component } = res.result;
        this.setData({
          'currentLocation.address': address,
          'currentLocation.city': address_component.city,
          'currentLocation.district': address_component.district,
          'currentLocation.province': address_component.province
        });
      },
      fail: (err) => {
        console.error('Reverse geocoding failed:', err);
      }
    });
  },

  /**
   * Search nearby listings (from cloud)
   */
  async searchNearbyHouses() {
    const { longitude, latitude, searchRadius, filters } = this.data;

    this.setData({ loading: true });

    try {
      // Try cloud function first for nearby listings
      const result = await wx.cloud.callFunction({
        name: 'get-houses',
        data: {
          action: 'nearby',
          data: {
            latitude,
            longitude,
            radius: searchRadius
          }
        }
      });

      if (result.result.success && result.result.data.list && result.result.data.list.length > 0) {
        const houses = result.result.data.list || [];
        this.processHouseMarkers(houses);
        this.setData({ loading: false });
        return;
      }
    } catch (err) {
      console.error('[Cloud function get listings failed]', err);
    }

    // If cloud has no data or failed, use Tencent Map POI search
    this.searchNearbyPOI();
  },

  /**
   * Use Tencent Map POI to search nearby rental places
   */
  searchNearbyPOI() {
    const { longitude, latitude, searchRadius } = this.data;

    // Rental related keywords
    const keywords = ['Rentals', 'Apartments', 'Youth Apartments', 'B&B', 'Rental Agency', 'Real Estate Agency', 'Housing Rental'];

    let searchIndex = 0;
    let allResults = [];

    // Recursively search multiple keywords
    const searchNext = () => {
      if (searchIndex >= keywords.length) {
        // All keywords searched
        if (allResults.length > 0) {
          this.processPOIMarkers(allResults);
          this.setData({ loading: false });
        } else {
          // If POI search also no results, use mock data
          this.loadMockHouses();
          this.setData({ loading: false });
        }
        return;
      }

      const keyword = keywords[searchIndex];

      qqmapsdk.search({
        keyword: keyword,
        location: `${latitude},${longitude}`,
        radius: searchRadius,
        page_size: 20,
        success: (res) => {
          console.log(`[POI search success] ${keyword}:`, res.data);
          if (res.data && res.data.length > 0) {
            // Filter duplicates
            res.data.forEach(poi => {
              if (!allResults.find(item => item.id === poi.id)) {
                allResults.push(poi);
              }
            });
          }
          searchIndex++;
          searchNext();
        },
        fail: (err) => {
          console.error(`[POI search failed] ${keyword}:`, err);
          searchIndex++;
          searchNext();
        }
      });
    };

    searchNext();
  },

  /**
   * Process POI results to listing format
   */
  processPOIMarkers(pois) {
    const houses = pois.map((poi, index) => {
      // Estimate price by category
      let estimatedPrice = 3000;
      let rentType = 'whole';
      let houseType = '2';

      if (poi.category && poi.category.includes('Apartment')) {
        estimatedPrice = 2500 + Math.floor(Math.random() * 2000);
        rentType = 'single';
        houseType = '1';
      } else if (poi.category && poi.category.includes('Agency')) {
        estimatedPrice = 4000 + Math.floor(Math.random() * 3000);
        rentType = 'whole';
        houseType = Math.floor(Math.random() * 3) + 2 + '';
      } else {
        estimatedPrice = 3000 + Math.floor(Math.random() * 2500);
      }

      return {
        id: poi.id,
        title: poi.title,
        price: estimatedPrice,
        rentType: rentType,
        houseType: houseType,
        area: 30 + Math.floor(Math.random() * 50),
        floor: ['Low floor', 'Mid floor', 'High floor'][Math.floor(Math.random() * 3)],
        decoration: ['Fully furnished', 'Moderately furnished', 'Simply furnished'][Math.floor(Math.random() * 3)],
        facilities: ['AC', 'Washer', 'Water Heater', 'WiFi'],
        images: ['/images/house1.jpg'],
        longitude: poi.location.lng,
        latitude: poi.location.lat,
        address: poi.address || poi.title,
        distance: Math.floor(Math.random() * searchRadius),
        publisher: {
          name: 'Listing Publisher',
          avatar: '/images/default-avatar.png',
          phone: '138****8888'
        },
        status: 'available',
        createTime: '2026-02-23',
        description: `Located at ${poi.title}, convenient transport, complete amenities`,
        isPOI: true // Marked as POI data
      };
    });

    this.processHouseMarkers(houses);

    wx.showToast({
      title: `Found ${houses.length} listings`,
      icon: 'success'
    });
  },

  /**
   * Process listing markers
   */
  processHouseMarkers(houses) {
    const markers = houses.map((house, index) => ({
      id: house.id,
      longitude: house.longitude,
      latitude: house.latitude,
      title: house.title,
      iconPath: this.getMarkerIcon(house.rentType, house.status),
      width: 36,
      height: 36,
      callout: {
        content: `${house.price}/mo`,
        color: '#333',
        fontSize: 12,
        borderRadius: 4,
        bgColor: '#FFF',
        padding: 4,
        display: 'BYCLICK'
      },
      customCallout: {
        anchorY: 0,
        anchorX: 0,
        display: 'BYCLICK'
      }
    }));
    
    this.setData({
      houseList: houses,
      markers,
      loading: false
    });
  },

  /**
   * Get marker icon by listing type
   */
  getMarkerIcon(rentType, status) {
    // Return different icons by status and type
    if (status === 'rented') {
      return '/images/house-rented.png'; // Rented
    }
    
    switch(rentType) {
      case 'whole':
        return '/images/house-whole.png'; // Whole
      case 'share':
        return '/images/house-share.png'; // Shared
      case 'single':
        return '/images/house-single.png'; // Single
      default:
        return '/images/house-default.png';
    }
  },

  /**
   * Load mock data
   */
  loadMockHouses() {
    const { longitude, latitude } = this.data;
    
    // Generate nearby mock listings
    const mockHouses = [
      {
        id: 1,
        title: 'Furnished 1-bedroom, near subway',
        price: 3500,
        rentType: 'whole',
        houseType: '1',
        area: 45,
        floor: 'Mid floor',
        decoration: 'Fully furnished',
        facilities: ['AC', 'Washer', 'Fridge', 'Water Heater', 'WiFi'],
        images: ['/images/house1.jpg', '/images/house2.jpg'],
        longitude: longitude + 0.005,
        latitude: latitude + 0.003,
        address: 'Chaoyang Rd & Qingnian Rd intersection',
        distance: 500,
        publisher: {
          name: 'Mr. Zhang',
          avatar: '/images/avatar1.jpg',
          phone: '138****8888'
        },
        status: 'available',
        createTime: '2026-02-20',
        description: 'South-facing with good light, convenient transport, 5 min walk to subway'
      },
      {
        id: 2,
        title: 'Cozy 2-bedroom, shared room',
        price: 1800,
        rentType: 'share',
        houseType: '2',
        area: 30,
        floor: 'High floor',
        decoration: 'Moderately furnished',
        facilities: ['AC', 'Washer', 'Water Heater'],
        images: ['/images/house3.jpg'],
        longitude: longitude - 0.003,
        latitude: latitude + 0.004,
        address: '88 Qingnian Rd',
        distance: 350,
        publisher: {
          name: 'Ms. Li',
          avatar: '/images/avatar2.jpg',
          phone: '139****6666'
        },
        status: 'available',
        createTime: '2026-02-19',
        description: 'Shared second bedroom, quiet and comfortable, roommates are professionals'
      },
      {
        id: 3,
        title: 'Comfortable master bedroom, en-suite bathroom',
        price: 2800,
        rentType: 'single',
        houseType: '3',
        area: 25,
        floor: 'Mid floor',
        decoration: 'Fully furnished',
        facilities: ['AC', 'Washer', 'Fridge', 'Water Heater', 'WiFi', 'En-suite Bathroom'],
        images: ['/images/house4.jpg', '/images/house5.jpg'],
        longitude: longitude + 0.004,
        latitude: latitude - 0.002,
        address: '120 Jianguo Rd',
        distance: 600,
        publisher: {
          name: 'Mr. Wang',
          avatar: '/images/avatar3.jpg',
          phone: '137****5555'
        },
        status: 'available',
        createTime: '2026-02-18',
        description: 'Master bedroom with en-suite bathroom, north-south ventilation, fully equipped'
      }
    ];
    
    this.processHouseMarkers(mockHouses);
  },

  /**
   * Map marker tap event
   */
  onMarkerTap(e) {
    const { markerId } = e.detail;
    const house = this.data.houseList.find(h => h.id === markerId);
    
    if (house) {
      this.setData({
        selectedHouse: house,
        showDetail: true
      });
      
      // Move map to listing location
      this.mapCtx.moveToLocation({
        latitude: house.latitude,
        longitude: house.longitude
      });
    }
  },

  /**
   * Switch view mode
   */
  switchViewMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      viewMode: mode
    });
  },

  /**
   * Search radius changed
   */
  onRadiusChange(e) {
    const index = e.detail.value;
    const radius = this.data.radiusOptions[index].value;
    
    this.setData({
      searchRadius: radius,
      circles: [{
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        radius: radius,
        fillColor: '#FFC10730',
        strokeColor: '#FFC107',
        strokeWidth: 2
      }]
    });
    
    this.searchNearbyHouses();
  },

  /**
   * Filter changed
   */
  onFilterChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`filters.${field}`]: value
    });
    
    // Delayed search
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.searchNearbyHouses();
    }, 500);
  },

  /**
   * Search keyword
   */
  onSearch(e) {
    this.setData({
      'filters.keyword': e.detail.value
    });
    
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.searchNearbyHouses();
    }, 500);
  },

  /**
   * Close detail popup
   */
  closeDetail() {
    this.setData({
      showDetail: false,
      selectedHouse: null
    });
  },

  /**
   * Contact landlord
   */
  contactLandlord(e) {
    const { phone } = e.currentTarget.dataset;
    wx.showModal({
      confirmText: 'OK', cancelText: 'No',
      title: 'Contact Landlord',
      content: 'Call ' + phone + '?',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: phone });
        }
      }
    });
  },

  /**
   * View listing detail
   */
  viewHouseDetail(e) {
    const { id } = e.currentTarget.dataset;
    const house = this.data.houseList.find(h => h.id === id);
    
    if (house) {
      this.setData({
        selectedHouse: house,
        showDetail: true
      });
    }
  },

  /**
   * Map region change event
   */
  onRegionChange(e) {
    if (e.type === 'end') {
      const { longitude, latitude } = e.detail.region;
      this.setData({
        longitude,
        latitude,
        circles: [{
          latitude,
          longitude,
          radius: this.data.searchRadius,
          fillColor: '#FFC10730',
          strokeColor: '#FFC107',
          strokeWidth: 2
        }]
      });
      
      // Reverse geocoding
      this.reverseGeocode(latitude, longitude);
      
      // Re-search
      this.searchNearbyHouses();
    }
  },

  /**
   * Relocate
   */
  relocate() {
    this.getUserLocation();
  },

  /**
   * Publish listing
   */
  publishHouse() {
    wx.navigateTo({
      url: '/pages/publish-house/publish-house'
    });
  },

  /**
   * Favorite listing
   */
  favoriteHouse(e) {
    const { id } = e.currentTarget.dataset;
    const favorites = wx.getStorageSync('favorites') || [];
    
    const index = favorites.findIndex(f => f.id === id);
    if (index === -1) {
      const house = this.data.houseList.find(h => h.id === id);
      if (house) {
        // Ensure favorite data format correct, with type and time fields
        const favoriteItem = {
          ...house,
          type: 'house',
          time: new Date().toISOString().split('T')[0]
        };
        favorites.push(favoriteItem);
        wx.setStorageSync('favorites', favorites);
        wx.showToast({
          title: 'Added to favorites',
          icon: 'success'
        });
      }
    } else {
      wx.showToast({
        title: 'Already favorited',
        icon: 'none'
      });
    }
  }
});
