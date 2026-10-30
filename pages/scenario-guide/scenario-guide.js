// pages/scenario-guide/scenario-guide.js
const app = getApp()

Page({
  data: {
    type: '',
    scenarioInfo: {}
  },

  onLoad(options) {
    const type = options.type || 'internship';
    this.setData({ type });
    this.loadScenarioData(type);
  },

  loadScenarioData(type) {
    const scenarios = {
      internship: {
        title: 'Internship Rental',
        icon: '🎓',
        desc: 'Suitable for short-term transition, focus on transportation convenience',
        tips: [
          'Choose properties near metro lines to reduce commute time',
          'Prioritize short-term or quarterly payments to reduce deposit pressure',
          'Note utility calculation methods to avoid commercial rates',
          'Confirm if internet and furniture appliances are included',
          'Check property safety and avoid roommate risks'
        ],
        criteria: [
          { name: 'Transportation', value: '⭐⭐⭐⭐⭐', desc: 'Within 30 min by metro' },
          { name: 'Reasonable Rent', value: '⭐⭐⭐⭐', desc: 'Monthly 2000-3500 CNY' },
          { name: 'Complete Facilities', value: '⭐⭐⭐⭐', desc: 'Basic appliances included' },
          { name: 'Flexible Term', value: '⭐⭐⭐⭐⭐', desc: 'Short-term supported' }
        ],
        recommend: [
          { type: 'Studio', area: '25-35㎡', price: '2500-3500 CNY', reason: 'Low cost, suitable for single' },
          { type: 'Shared Room', area: '12-18㎡', price: '1800-2800 CNY', reason: 'Good value, social opportunities' }
        ]
      },
      share: {
        title: 'Shared Rental',
        icon: '👥',
        desc: 'Reduce rental costs, note roommate matching',
        tips: [
          'Understand roommates work and living habits',
          'Clarify rules for shared spaces',
          'Confirm utility cost sharing method',
          'Check door locks and personal storage space',
          'Agree on guest and noise control requirements'
        ],
        criteria: [
          { name: 'Roommate Match', value: '⭐⭐⭐⭐⭐', desc: 'Personality and lifestyle' },
          { name: 'Rent Split', value: '⭐⭐⭐⭐', desc: 'Per person 1500-2500 CNY' },
          { name: 'Common Space', value: '⭐⭐⭐⭐', desc: 'Spacious living room and kitchen' },
          { name: 'Privacy', value: '⭐⭐⭐', desc: 'Good door locks and soundproofing' }
        ],
        recommend: [
          { type: 'Shared Master Room', area: '18-25㎡', price: '2000-3000 CNY', reason: 'Spacious, good privacy' },
          { type: 'Shared Regular Room', area: '12-18㎡', price: '1500-2200 CNY', reason: 'Economical, cost sharing' }
        ]
      },
      alone: {
        title: 'Solo Living',
        icon: '🏠',
        desc: 'More privacy, focus on safe environment',
        tips: [
          'Prioritize residential areas with complete security',
          'Check door and window lock safety',
          'Confirm property services and emergency contacts',
          'Understand nearby security and nighttime lighting',
          'Prepare simple security equipment'
        ],
        criteria: [
          { name: 'Safety', value: '⭐⭐⭐⭐⭐', desc: '24-hour security guard' },
          { name: 'Private Space', value: '⭐⭐⭐⭐⭐', desc: 'Complete independent facilities' },
          { name: 'Comfort', value: '⭐⭐⭐⭐', desc: 'Complete surrounding facilities' },
          { name: 'Reasonable Rent', value: '⭐⭐⭐', desc: 'Monthly 3500-6000 CNY' }
        ],
        recommend: [
          { type: '1BR1LR', area: '40-50㎡', price: '3500-5000 CNY', reason: 'Moderate space, complete functions' },
          { type: 'Small 2BR', area: '60-70㎡', price: '4500-6000 CNY', reason: 'Enough space, can be study room' }
        ]
      }
    };

    this.setData({ scenarioInfo: scenarios[type] || scenarios.internship });
  },

  goBack() {
    wx.navigateBack();
  }
})
