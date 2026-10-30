// pages/legal-consult/legal-consult.js
// Xinghuo API config
const XF_API_BASE = 'https://maas-api.cn-huabei-1.xf-yun.com/v2'
const XF_MODEL_ID = 'xop3qwen1b7'
const XF_API_KEY = 'YOUR_XF_API_KEY'
const XF_API_SECRET = 'YOUR_XF_API_SECRET'

// Local legal knowledge base - used when API returns unsatisfactory results or fails
const lawKnowledgeBase = {
  'deposit': {
    conclusion: 'According to the law, the deposit shall be refunded without interest after the lease term ends',
    laws: 'Civil Code Article 577: If a party fails to perform its contractual obligations or performs them inconsistently with the agreement, it shall bear the liability for breach of contract such as continuing performance, taking remedial measures, or compensating for losses.\nCivil Code Article 584: If a party fails to perform its contractual obligations or performs them inconsistently with the agreement, causing losses to the other party, the amount of compensation for losses shall be equivalent to the losses caused by the breach, including the benefits that can be obtained after the contract is performed; however, it shall not exceed the losses that the breaching party foresaw or should have foreseen at the time of contracting.',
    steps: '1. Review the deposit clause in the lease agreement\n2. Collect relevant evidence such as chat records, payment receipts, etc.\n3. Negotiate with the landlord\n4. File a complaint with the local consumer association\n5. Apply for arbitration or file a lawsuit in court',
    contact: 'Recommended to call the 12348 legal service hotline or local legal aid center'
  },
  'non-refund': {
    conclusion: 'The landlord refusing to refund the deposit without justifiable reason constitutes a breach of contract',
    laws: 'Civil Code Article 577: If a party fails to perform its contractual obligations or performs them inconsistently with the agreement, it shall bear the liability for breach of contract such as continuing performance, taking remedial measures, or compensating for losses.',
    steps: '1. First negotiate with the landlord\n2. File a complaint with the housing authority or market supervision department\n3. Apply for arbitration\n4. File a lawsuit in court to demand return of the deposit',
    contact: 'Can contact the local housing authority or legal aid center'
  },
  'breach': {
    conclusion: 'The landlord has committed a breach of contract and should bear the corresponding liability',
    laws: 'Civil Code Article 577: If a party fails to perform its contractual obligations or performs them inconsistently with the agreement, it shall bear the liability for breach of contract such as continuing performance, taking remedial measures, or compensating for losses.',
    steps: '1. Collect evidence proving the landlord breached the contract\n2. Send a written demand letter\n3. File a complaint with the relevant department\n4. File a lawsuit to claim compensation for losses',
    contact: 'Recommended to consult a professional lawyer or legal aid institution'
  },
  'contract': {
    conclusion: 'The lease agreement is legally binding and both parties should abide by the agreement',
    laws: 'Civil Code Article 465: A contract established in accordance with the law is protected by law.\nCivil Code Article 496: Standard terms are terms drafted in advance by a party for repeated use and not negotiated with the other party at the time of contracting.',
    steps: '1. Read the contract terms carefully\n2. Keep the original contract\n3. If disputed, apply for contract validity determination\n4. Seek legal assistance if necessary',
    contact: 'Can consult a local law firm'
  },
  'rights protection': {
    conclusion: 'You have the right to protect your legitimate rights and interests',
    laws: 'Consumer Rights Protection Law Article 39: If a consumer and a business operator have a dispute over consumer rights and interests, it may be resolved through the following channels:\n(1) Negotiate a settlement with the business operator;\n(2) Request mediation by the consumer association or other legally established mediation organizations;\n(3) File a complaint with the relevant administrative department;\n(4) Apply for arbitration based on the arbitration agreement reached with the business operator;\n(5) File a lawsuit in the people\'s court.',
    steps: '1. Collect evidence\n2. Negotiate with the other party\n3. File a complaint with the consumer association\n4. Report to the relevant department\n5. Apply for arbitration or file a lawsuit',
    contact: 'Can contact the 12315 consumer complaint hotline or legal aid center'
  }
}

Page({
  data: {
    inputText: '',
    chatMessages: [
      {
        id: 1,
        text: 'Hello! Welcome to consult the pro bono lawyer team. We will provide you with professional rental rights legal consultation services.',
        time: '10:30',
        isLawyer: true
      },
      {
        id: 2,
        text: 'What to do if the landlord absconds',
        time: '10:32',
        isLawyer: false
      },
      {
        id: 3,
        text: 'Based on your question, we recommend that you first review the relevant clauses in the lease agreement to confirm the rights and obligations of both parties. If the landlord has breached the contract, you can file a complaint with the local consumer association or housing authority.',
        time: '10:33',
        isLawyer: true
      },
      {
        id: 4,
        text: 'What is the phone number',
        time: '10:35',
        isLawyer: false
      },
      {
        id: 5,
        text: 'For your situation, you can collect relevant evidence such as chat records, payment receipts, etc., and then apply for help at the local legal aid center. According to the Civil Code, the landlord may not withhold the deposit without cause.',
        time: '10:36',
        isLawyer: true
      }
    ],
    isLoading: false,
    showTestButton: true,
    apiTestResult: '',
    showTipsModal: false
  },
  
  // Scam prevention tips data
  tipsData: [
    {
      title: 'Contract Traps',
      content: '1. Read the lease agreement carefully, paying attention to deposit, rent payment method, breach of contract liability, and other clauses\n2. Confirm whether the contract is an official document, avoid verbal agreements\n3. Keep the original contract, do not easily sign blank contracts'
    },
    {
      title: 'Deposit Issues',
      content: '1. The deposit should be refunded without interest within 7 days after the lease term ends\n2. Keep the deposit receipt or transfer voucher\n3. If the deposit is not refunded, you can protect your rights through legal channels'
    },
    {
      title: 'Property Quality',
      content: '1. Carefully inspect the property facilities before moving in, take photos for evidence\n2. Communicate with the landlord promptly if problems are found\n3. Keep maintenance records and communication evidence'
    },
    {
      title: 'Rent Payment',
      content: '1. Pay rent on time, keep payment receipts\n2. Confirm the receiving account information is correct\n3. Avoid paying through informal channels'
    },
    {
      title: 'Rights Protection Channels',
      content: '1. First negotiate with the landlord\n2. File a complaint with the local housing authority or consumer association\n3. Apply for arbitration or file a lawsuit in court\n4. Call the 12348 legal service hotline'
    }
  ],

  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  onSend() {
    const messageText = this.data.inputText.trim();
    if (!messageText) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      time: this.getCurrentTime(),
      isLawyer: false
    };

    console.log('Send user message:', messageText);

    // Add user message
    const newMessages = [...this.data.chatMessages, userMessage];
    this.setData({
      chatMessages: newMessages,
      inputText: ''
    });

    // Use API to get lawyer reply
    this.getLawyerReply(messageText);
  },

  /* Test API connection function removed */

  // Call Xinghuo API to get lawyer reply - using correct authentication method
  async callXFYunAPI(userMessage, retryCount = 0) {
    try {
      console.log(`Call Xinghuo API (attempt ${retryCount + 1}):`, userMessage)
      console.log('API config:', {
        base: XF_API_BASE,
        model: XF_MODEL_ID,
        apiKey: XF_API_KEY.substring(0, 5) + '...',
        secret: XF_API_SECRET.substring(0, 5) + '...'
      })
      
      // Xinghuo API requires a specific header format
      const response = await new Promise((resolve, reject) => {
        wx.request({
          url: XF_API_BASE,
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
            // Xinghuo uses X-Appid and Authorization headers
            'X-Appid': XF_API_KEY,
            'Authorization': 'Bearer ' + XF_API_SECRET
          },
          data: {
            model: XF_MODEL_ID,
            messages: [
              {
                role: 'system',
                content: 'You are a professional rental rights legal advisor, specializing in providing rental-related legal consultation services for young people. You need to provide professional, accurate, and practical legal advice based on the user\'s specific questions. Please be sure to include the following: 1. Relevant legal references (such as Civil Code provisions) 2. Specific rights protection steps 3. Evidence collection advice 4. Contact information suggestions (such as 12348 legal service hotline, local housing authority, etc.). Answers should be targeted and specific, not generic, and should specifically address rental rights protection issues.'
              },
              {
                role: 'user',
                content: userMessage
              }
            ],
            temperature: 0.7,
            max_tokens: 2048,
            stream: false,
            search_disable: true
          },
          success: resolve,
          fail: reject,
          timeout: 15000 // 15 second timeout
        })
      })

      console.log('API response status:', response.statusCode)
      console.log('API response data:', JSON.stringify(response.data))
      
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const assistantMessage = response.data.choices[0].message
        if (assistantMessage && assistantMessage.content) {
          console.log('API returned content:', assistantMessage.content)
          return assistantMessage.content.trim()
        }
      }
      
      console.error('API returned incorrect format:', response.data)
      
      // Check common API errors
      if (response.data && response.data.error) {
        console.error('API error details:', response.data.error)
      }
      
      return null
      
    } catch (error) {
      console.error('Failed to call Xinghuo API:', error)
      console.error('Error type:', typeof error)
      console.error('Error message:', error.message || error.errMsg)
      console.error('Error code:', error.errno || error.statusCode)
      
      // If it's a network error, try retrying once
      if (retryCount < 1 && (error.errMsg === 'request:fail' || error.errMsg === 'timeout')) {
        console.log('Network error, retrying...')
        return this.callXFYunAPI(userMessage, retryCount + 1)
      }
      
      return null
    }
  },

  // Main method to get lawyer reply
  async getLawyerReply(userMessage) {
    try {
      this.setData({ isLoading: true })
      
      console.log('Start getting lawyer reply, message:', userMessage)
      
      // First try calling the API
      let apiResponse = await this.callXFYunAPI(userMessage)
      if (apiResponse) {
        console.log('API call succeeded, returned content:', apiResponse.substring(0, 100) + '...')
        
        const lawyerMessage = {
          id: Date.now(),
          text: apiResponse,
          time: this.getCurrentTime(),
          isLawyer: true,
          isApiResponse: true
        };

        const newMessages = [...this.data.chatMessages, lawyerMessage];
        this.setData({
          chatMessages: newMessages,
          isLoading: false
        });

        // Scroll to bottom
        this.scrollToBottom();
        
        // Show API call success
        wx.showToast({
          title: 'Getting legal advice',
          icon: 'success',
          duration: 1000
        })
        
        return
      }
      
      console.warn('API call failed or returned empty, using local knowledge base')
      
      // If API call fails, use local knowledge base
      let knowledgeKey = Object.keys(lawKnowledgeBase).find(key => userMessage.includes(key))
      if (knowledgeKey) {
        console.log('Found knowledge base keyword:', knowledgeKey)
        const processedContent = this.formatKnowledgeResponse(lawKnowledgeBase[knowledgeKey])
        
        const lawyerMessage = {
          id: Date.now(),
          text: processedContent,
          time: this.getCurrentTime(),
          isLawyer: true,
          isApiResponse: false
        };

        const newMessages = [...this.data.chatMessages, lawyerMessage];
        this.setData({
          chatMessages: newMessages,
          isLoading: false
        });

        // Scroll to bottom
        this.scrollToBottom();
        
        // Show using local legal knowledge base
        wx.showToast({
          title: 'Using local legal knowledge base',
          icon: 'success',
          duration: 1000
        })
        
        return
      }
      
      console.warn('No matching knowledge base keyword found, using general legal advice')
      
      // If no exact keyword match, use general legal advice
      const generalAdvice = {
        conclusion: 'Based on your question, here is professional legal advice for you.',
        laws: 'Civil Code Article 577: If a party fails to perform its contractual obligations or performs them inconsistently with the agreement, it shall bear the liability for breach of contract such as continuing performance, taking remedial measures, or compensating for losses.\nCivil Code Article 584: If a party fails to perform its contractual obligations or performs them inconsistently with the agreement, causing losses to the other party, the amount of compensation for losses shall be equivalent to the losses caused by the breach, including the benefits that can be obtained after the contract is performed; however, it shall not exceed the losses that the breaching party foresaw or should have foreseen at the time of contracting.',
        steps: '1. Collect relevant evidence such as lease agreement, payment receipts, chat records, etc.\n2. Negotiate with the other party\n3. File a complaint with the local consumer association or housing authority\n4. Apply for mediation or arbitration\n5. File a lawsuit in court',
        contact: 'Can call the 12348 legal service hotline or contact the local legal aid center'
      }
      
      const processedContent = this.formatKnowledgeResponse(generalAdvice)
      
      const lawyerMessage = {
        id: Date.now(),
        text: processedContent,
        time: this.getCurrentTime(),
        isLawer: true,
        isApiResponse: false
      };

      const newMessages = [...this.data.chatMessages, lawyerMessage];
      this.setData({
        chatMessages: newMessages,
        isLoading: false
      });

      // Scroll to bottom
      this.scrollToBottom();
      
      // Show using local legal knowledge base
      wx.showToast({
        title: 'Using local legal knowledge base',
        icon: 'success',
        duration: 1000
      })
      
    } catch (error) {
      console.error('Failed to get lawyer reply:', error)
      console.error('Error type:', typeof error)
      console.error('Error message:', error.message || error.errMsg)
      console.error('Error stack:', error.stack)
      
      wx.showToast({
        title: 'Failed to get legal advice',
        icon: 'none',
        duration: 2000
      })
      
      // Use the most basic fallback reply
      const fallbackMessage = {
        id: Date.now(),
        text: 'Network request failed. We recommend you directly contact the local legal aid center or call the 12348 legal service hotline for help.\n\nAccording to Civil Code Article 577, if a party fails to perform its contractual obligations or performs them inconsistently with the agreement, it shall bear the liability for breach of contract such as continuing performance, taking remedial measures, or compensating for losses.\n\nYou can:\n1. Call the 12348 legal service hotline\n2. Contact the local legal aid center\n3. File a complaint with the housing authority\n4. File a lawsuit in court',
        time: this.getCurrentTime(),
        isLawyer: true,
        isApiResponse: false
      }
      
      const newMessages = [...this.data.chatMessages, fallbackMessage];
      this.setData({
        chatMessages: newMessages,
        isLoading: false
      })
      
      // Show error prompt
      wx.showToast({
        title: 'Failed to get legal advice',
        icon: 'none',
        duration: 3000
      })
    }
  },

  formatKnowledgeResponse(knowledge) {
    return `**Legal Conclusion:** ${knowledge.conclusion}\n\n**Relevant Legal Provisions:**\n${knowledge.laws}\n\n**Steps:**\n${knowledge.steps}\n\n**Contact:** ${knowledge.contact}`
  },

  processLawyerReply(content, userMessage) {
    // Clean API response content, ensure it contains specific legal advice
    const simpleResponses = [
      'Analyzing',
      'Received',
      'Thanks for consulting',
      'We will answer ASAP'
    ]
    
    const isSimpleResponse = simpleResponses.some(response => content.includes(response))
    
    if (isSimpleResponse || content.length < 100) {
      const knowledgeKey = Object.keys(lawKnowledgeBase).find(key => userMessage.includes(key))
      return knowledgeKey ? this.formatKnowledgeResponse(lawKnowledgeBase[knowledgeKey]) : content
    }
    
    return content
  },

  mockLawyerReply(userMessage) {
    // Now using real API, kept as backup
    this.getLawyerReply(userMessage)
  },

  getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + 
           now.getMinutes().toString().padStart(2, '0');
  },

  scrollToBottom() {
    wx.createSelectorQuery().select('.chat-container').boundingClientRect(rect => {
      if (rect) {
        wx.pageScrollTo({
          scrollTop: rect.bottom,
          duration: 300
        });
      }
    }).exec();
  },

  onShow() {
    this.scrollToBottom();
  },

  // Show scam prevention tips
  showTips() {
    this.setData({
      showTipsModal: true
    });
  },

  // Close scam prevention tips
  hideTips() {
    this.setData({
      showTipsModal: false
    });
  },

  // Stop event propagation
  catchTouch() {
    // Stop event propagation, prevent closing popup when clicking popup content
  },

  // Show scam prevention tips
  showTips() {
    this.setData({
      showTipsModal: true
    });
  },

  // Close scam prevention tips
  hideTips() {
    this.setData({
      showTipsModal: false
    });
  }
});
