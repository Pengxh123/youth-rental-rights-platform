// pages/fee-calculator/fee-calculator.js
Page({
  data: {
    monthlyRent: '',
    propertyFee: '',
    waterFee: '',
    elecFee: '',
    gasFee: '',
    netFee: '',
    depositMonths: 1,
    showResult: false,
    currentPeriod: 'month',
    periodLabel: 'Monthly',
    totalAmount: 0,
    breakdown: {
      rent: 0,
      propertyFee: 0,
      utilities: 0,
      netFee: 0,
      deposit: 0
    },
    isLoading: false
  },

  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  async calculate() {
    const monthlyRent = parseFloat(this.data.monthlyRent) || 0;
    const propertyFee = parseFloat(this.data.propertyFee) || 0;
    const waterFee = parseFloat(this.data.waterFee) || 0;
    const elecFee = parseFloat(this.data.elecFee) || 0;
    const gasFee = parseFloat(this.data.gasFee) || 0;
    const netFee = parseFloat(this.data.netFee) || 0;
    const depositMonths = parseInt(this.data.depositMonths) || 1;

    if (monthlyRent === 0) {
      wx.showToast({
        title: 'Please enter monthly rent',
        icon: 'none'
      });
      return;
    }

    this.setData({ isLoading: true });

    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const utilitiesTotal = waterFee + elecFee + gasFee;
    const monthlyTotal = monthlyRent + propertyFee + utilitiesTotal + netFee;
    const depositTotal = monthlyRent * depositMonths;

    this.setData({
      showResult: true,
      isLoading: false,
      currentPeriod: 'month',
      periodLabel: 'Monthly',
      totalAmount: monthlyTotal.toFixed(2),
      breakdown: {
        rent: monthlyRent.toFixed(2),
        propertyFee: propertyFee.toFixed(2),
        waterFee: waterFee.toFixed(2),
        elecFee: elecFee.toFixed(2),
        gasFee: gasFee.toFixed(2),
        utilities: utilitiesTotal.toFixed(2),
        netFee: netFee.toFixed(2),
        deposit: depositTotal.toFixed(2)
      },
      calculatedValues: {
        monthly: monthlyTotal,
        quarterly: monthlyTotal * 3,
        yearly: monthlyTotal * 12
      }
    });
  },

  switchPeriod(e) {
    const period = e.currentTarget.dataset.period;
    let label = '';
    let total = 0;

    if (period === 'month') {
      label = 'Monthly';
      total = this.data.calculatedValues.monthly;
    } else if (period === 'quarter') {
      label = 'Quarterly';
      total = this.data.calculatedValues.quarterly;
    } else {
      label = 'Yearly';
      total = this.data.calculatedValues.yearly;
    }

    this.setData({
      currentPeriod: period,
      periodLabel: label,
      totalAmount: total.toFixed(2)
    });
  }
})
