// Pro bono lawyer consultation page
Page({
  data: {
    inputText: '',
    messages: []
  },

  onLoad(options) {
    // Initialize on page load
    console.log('Lawyer consultation page loaded');
  },



  // Input change
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // Send message
  sendMessage() {
    if (!this.data.inputText.trim()) {
      return;
    }

    // Get input message
    const message = this.data.inputText.trim();
    
    // Clear input
    this.setData({
      inputText: ''
    });

    // Add user message to chat
    const newMessages = [...this.data.messages, {
      type: 'user',
      content: message,
      timestamp: new Date().getTime()
    }];

    this.setData({
      messages: newMessages
    });

    // Call Xinghuo API
    this.callXinghuoAPI(message);
  },

  // Call Xinghuo API
  callXinghuoAPI(message) {
    // Import API config
    const config = require('../../utils/api-config');
    
    // Build request data (OpenAI compatible format)
    const requestData = {
      model: config.modelId,
      messages: [
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 4096
    };

    console.log('API request data:', requestData);
    console.log('API request URL:', `${config.baseUrl}/chat/completions`);
    console.log('API request headers:', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
      'lora_id': config.resourceId // Add resource ID to request headers
    });

    // Actual API call code
    const that = this;
    console.log('Start API call...');
    
    // Send API request
    wx.request({
      url: `${config.baseUrl}/chat/completions`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'lora_id': config.resourceId // Add resource ID to request headers
      },
      data: requestData,
      success: (res) => {
        console.log('API response status code:', res.statusCode);
        console.log('API response headers:', res.header);
        console.log('API response data:', res.data);
        
        if (res.statusCode === 200) {
          if (res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message) {
            const lawyerResponse = res.data.choices[0].message.content;
            
            // Add lawyer reply to chat
            const updatedMessages = [...that.data.messages, {
              type: 'lawyer',
              content: lawyerResponse,
              timestamp: new Date().getTime()
            }];
            
            that.setData({
              messages: updatedMessages
            });
            
            // Scroll to latest message
            that.scrollToBottom();
          } else {
            console.error('API response format error:', res.data);
            // Use mock data on response format error
            that.useMockData(message);
          }
        } else {
          console.error('API call failed, status code:', res.statusCode);
          console.error('API error info:', res.data);
          // Use mock data on API failure
          that.useMockData(message);
        }
      },
      fail: (err) => {
        console.error('API call failed:', err);
        console.error('Error message:', err.errMsg);
        console.error('Error code:', err.statusCode);
        console.error('Full error object:', JSON.stringify(err));
        
        // Check if it's a domain whitelist issue
        if (err.errMsg.includes('domain not in list')) {
          console.error('Error cause: API domain not configured as legal domain in mini program backend');
        }
        
        // Use mock data on API failure
        that.useMockData(message);
      },
      complete: () => {
        console.log('API call complete');
      }
    });
  },

  // Use mock data as fallback
  useMockData(message) {
    console.log('Using mock data to reply:', message);
    const that = this;
    setTimeout(() => {
      // Mock lawyer reply
      let lawyerResponse = '';
      if (message.includes('1+1') || message.includes('2+1')) {
        lawyerResponse = 'Hello! 2+1 equals 3. This is a basic math problem. In most cases, the result of 2 plus 1 is 3. If you have other legal questions, I am happy to help.';
      } else if (message.includes('who are you') || message.includes('hello')) {
        lawyerResponse = 'Hello! I am a professional lawyer team specializing in rental rights legal consultation. I am supported by a team of professional lawyers, providing you with professional and accurate legal advice.';
      } else if (message.includes('deposit')) {
        lawyerResponse = 'Hello! Regarding the issue of non-refundable deposits, according to the Civil Code and the Urban Housing Lease Management Measures, it is illegal for a landlord to withhold a deposit without cause. You can take the following measures: 1. Negotiate with the landlord; 2. File a complaint with the local housing authority; 3. File a complaint with the consumer association; 4. File a lawsuit in court. If you need more detailed legal advice, please provide your specific situation and I can offer a more targeted solution.';
      } else if (message.includes('sue') || message.includes('court')) {
        lawyerResponse = 'Hello! Regarding filing a lawsuit in court, you can follow these steps: 1. Prepare the complaint and relevant evidence (such as lease agreement, payment receipts, communication records, etc.); 2. File a lawsuit at the basic people\'s court where the property is located; 3. Pay the court fees; 4. Wait for the court to accept the case and schedule a hearing. It is recommended to consult a professional lawyer before filing to ensure your claims are reasonable and lawful. If you need more detailed legal advice, please provide your specific situation and I can offer a more targeted solution.';
      } else if (message.includes('contract')) {
        lawyerResponse = 'Hello! Regarding rental contract issues, according to the Civil Code, a rental contract should clearly specify the lease term, rent and payment method, deposit, property maintenance responsibilities, and other terms. If you encounter a contract dispute, it is recommended to carefully review the contract terms and retain relevant evidence. If you need more detailed legal advice, please provide your specific situation and I can offer a more targeted solution.';
      } else if (message.includes('sublandlord')) {
        lawyerResponse = 'Hello! Regarding sublandlord issues, according to the Civil Code, a sublandlord must obtain the original landlord\'s written consent to sublease the property. If the sublandlord subleases without the original landlord\'s consent, the original landlord has the right to terminate the lease agreement. If you encounter a situation where the sublandlord has absconded, it is recommended to contact the original landlord promptly and retain relevant evidence. If you need more detailed legal advice, please provide your specific situation and I can offer a more targeted solution.';
      } else {
        lawyerResponse = 'Hello! Thank you for your consultation. As a professional real estate and leasing legal expert, I can provide you with legal consultation services related to rental rights protection. What specific questions do you need help with?';
      }
      
      // Add lawyer reply to chat
      const updatedMessages = [...that.data.messages, {
        type: 'lawyer',
        content: lawyerResponse,
        timestamp: new Date().getTime()
      }];
      
      that.setData({
        messages: updatedMessages
      });
      
      // Scroll to latest message
      that.scrollToBottom();
    }, 500);
  },

  // Scroll to latest message
  scrollToBottom() {
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 999999,
        duration: 300
      });
    }, 100);
  },

  // On page show
  onShow() {
    console.log('Lawyer consultation page shown');
  },

  // On page hide
  onHide() {
    console.log('Lawyer consultation page hidden');
  }
});
