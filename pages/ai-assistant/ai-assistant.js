// pages/ai-assistant/ai-assistant.js
Page({
  data: {
    messages: [],
    inputText: '',
    commonQuestions: [
      'How to verify landlord identity?',
      'What to do if deposit is not returned?',
      'How to protect rights for excessive utilities?',
      'How to verify property legitimacy?',
      'What pitfalls in rental contracts?'
    ],
    isLoading: false
  },

  onLoad(options) {
    console.log('AI Assistant page loaded', options);
    // Set different common questions based on type parameter
    if (options.type === 'law') {
      this.setData({
        commonQuestions: [
          'Civil Code provisions on rental deposits',
          'Urban Housing Rental Management Measures',
          'What are tenant rights?',
          'Landlord obligations and responsibilities',
          'How to determine contract validity?'
        ]
      });
    }
  },

  // Input handler
  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // Send message
  sendMessage() {
    const text = this.data.inputText.trim();
    if (!text) {
      return;
    }

    // Add user message
    const userMessage = {
      type: 'user',
      content: text,
      timestamp: new Date().getTime()
    };

    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: ''
    });

    // Call API
    this.callXinghuoAPI(text);

    // Scroll to bottom
    this.scrollToBottom();
  },

  // Select common question
  selectQuestion(e) {
    const question = e.currentTarget.dataset.question;
    this.setData({
      inputText: question
    });
    this.sendMessage();
  },

  // Call API
  callXinghuoAPI(message) {
    const config = require('../../utils/api-config');
    
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
      'lora_id': config.resourceId
    });

    const that = this;
    console.log('Starting API call...');
    
    wx.request({
      url: `${config.baseUrl}/chat/completions`,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
        'lora_id': config.resourceId
      },
      data: requestData,
      success: (res) => {
        console.log('API response status:', res.statusCode);
        console.log('API response headers:', res.header);
        console.log('API response data:', res.data);
        
        if (res.statusCode === 200) {
          if (res.data && res.data.choices && res.data.choices[0] && res.data.choices[0].message) {
            const lawyerResponse = res.data.choices[0].message.content;
            
            const updatedMessages = [...that.data.messages, {
              type: 'lawyer',
              content: lawyerResponse,
              timestamp: new Date().getTime()
            }];
            
            that.setData({
              messages: updatedMessages
            });
            
            that.scrollToBottom();
          } else {
            console.error('API response format error:', res.data);
            that.useMockData(message);
          }
        } else {
          console.error('API call failed, status:', res.statusCode);
          console.error('API error message:', res.data);
          that.useMockData(message);
        }
      },
      fail: (err) => {
        console.error('API call failed:', err);
        console.error('Error message:', err.errMsg);
        console.error('Error code:', err.statusCode);
        console.error('Complete error:', JSON.stringify(err));
        
        if (err.errMsg.includes('domain not in list')) {
          console.error('Error: API domain not configured in mini program backend');
        }
        
        that.useMockData(message);
      },
      complete: () => {
        console.log('API call completed');
      }
    });
  },

  // Use mock data as fallback
  useMockData(message) {
    console.log('Using mock response:', message);
    const that = this;
    setTimeout(() => {
      let lawyerResponse = '';
      if (message.includes('1+1') || message.includes('2+1')) {
        lawyerResponse = 'Hello! 2+1 equals 3. This is a basic math problem. If you have other legal questions, I am happy to help.';
      } else if (message.includes('who are you') || message.includes('hello') || message.includes('hi')) {
        lawyerResponse = 'Hello! I am a professional legal consultation assistant specializing in rental rights protection. I am supported by a professional legal team to provide you with professional and accurate legal advice.';
      } else if (message.includes('deposit')) {
        lawyerResponse = 'Hello! Regarding deposit non-refund issues, according to the Civil Code and Urban Housing Rental Management Measures, it is illegal for landlords to withhold deposits without reason. You can take the following measures: 1. Negotiate with the landlord; 2. File a complaint with the local housing authority; 3. Contact consumer protection association; 4. File a lawsuit. For more detailed legal advice, please provide your specific situation.';
      } else if (message.includes('sue') || message.includes('court') || message.includes('lawsuit')) {
        lawyerResponse = 'Hello! Regarding filing a lawsuit, you can follow these steps: 1. Prepare complaint and evidence (lease contract, payment receipts, communication records, etc.); 2. File with the local people\'s court where the property is located; 3. Pay litigation fees; 4. Wait for court notification. It is recommended to consult a professional lawyer before filing. For more detailed legal advice, please provide your specific situation.';
      } else if (message.includes('contract')) {
        lawyerResponse = 'Hello! Regarding rental contracts, according to the Civil Code, the contract should clearly specify lease term, rent and payment method, deposit, maintenance responsibilities, etc. If you encounter contract disputes, carefully review the contract terms and preserve evidence. For more detailed legal advice, please provide your specific situation.';
      } else if (message.includes('sublandlord') || message.includes('secondary landlord')) {
        lawyerResponse = 'Hello! Regarding sublandlords, according to the Civil Code, sublandlords need written consent from the original landlord to sublease. If sublandlord disappears, contact the original landlord and preserve evidence. For more detailed legal advice, please provide your specific situation.';
      } else {
        lawyerResponse = 'Hello! Thank you for your consultation. As a professional real estate and rental law expert, I can provide legal consultation on rental rights protection. How may I assist you today?';
      }
      
      const updatedMessages = [...that.data.messages, {
        type: 'lawyer',
        content: lawyerResponse,
        timestamp: new Date().getTime()
      }];
      
      that.setData({
        messages: updatedMessages
      });
      
      that.scrollToBottom();
    }, 500);
  },

  // Scroll to bottom
  scrollToBottom() {
    setTimeout(() => {
      wx.pageScrollTo({
        scrollTop: 999999,
        duration: 300
      });
    }, 100);
  }
});
