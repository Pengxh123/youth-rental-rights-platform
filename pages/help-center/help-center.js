// pages/help-center/help-center.js
Page({
  data: {
    showGuideDetail: false,
    currentGuide: null,
    searchKeyword: '',
    showSearchResults: false,
    searchResults: [],
    hotFaqs: [
      {
        id: 1,
        question: 'How to verify landlord identity when renting?',
        answer: '1. Request to see landlord\'s ID card and property deed original documents\n2. Verify if the name on the property deed matches the ID card\n3. Verify landlord information through property management or neighborhood committee\n4. Request contact information and verify it',
        views: 12580
      },
      {
        id: 2,
        question: 'What to do if deposit is not returned?',
        answer: '1. First negotiate with landlord friendly, keep chat records\n2. Collect rental contract and transfer receipts as evidence\n3. File a complaint with 12345 hotline\n4. File a rights protection application through this platform\n5. File a lawsuit to court if necessary',
        views: 9860
      },
      {
        id: 3,
        question: 'How to protect rights when utility fees are overcharged?',
        answer: '1. Use the fee verification tool to confirm if it\'s overcharged\n2. Save utility bills and payment records\n3. File a complaint with housing department\n4. Request landlord to refund the difference',
        views: 7560
      },
      {
        id: 4,
        question: 'How to verify if a listing is legitimate?',
        answer: '1. Use official platforms or channels\n2. Verify listing authenticity and landlord identity\n3. Visit in person and check surrounding environment\n4. Be cautious of listings with unusually low prices\n5. Check reviews from other tenants',
        views: 6540
      }
    ],

    // Rights protection guide data
    guides: [
      {
        id: 1,
        title: 'Ten Rental Contract Traps',
        desc: 'When signing rental contracts, pay attention to these terms to avoid being cheated',
        type: 'Contract Pitfalls',
        content: `Ten Rental Contract Traps

When signing rental contracts, special attention needs to be paid to the following ten traps:

1. Unclear deposit return conditions
Many contracts have vague descriptions of deposit return conditions, easily causing disputes. It is recommended to clearly state in the contract:
- Specific conditions for deposit return
- Return timeframe (usually within 15 working days after moving out)
- Specific situations where deposits can be deducted

2. Utility fee standards not agreed upon
Contracts that do not specify utility fee rates may lead to overcharging. It is recommended:
- Clearly state utility fee rates (residential electricity approximately 0.5 yuan/kWh, commercial electricity is higher)
- Agree on meter reading times and payment cycles
- Request detailed fee statements

3. Excessive penalty clauses
Some contracts stipulate excessively high penalties, possibly reaching 2-3 months rent. It is recommended:
- Penalty should not exceed 1 month rent
- Clearly state both parties' breach responsibilities and compensation standards

4. Unclear housing repair responsibilities
Contracts that do not specify housing repair responsibilities may require tenants to bear all repair costs. It is recommended:
- Natural wear and tear should be repaired by landlord
- Tenant-caused damage should be repaired by tenant
- Specify repair response times

5. Harsh early termination clauses
Some contracts set harsh conditions for early termination. It is recommended:
- Allow termination with 30 days advance notice
- Clearly state fee settlement methods upon termination
- Retain the right to sublet

6. Incomplete inventory of facilities
Facility lists are not listed in contract attachments. It is recommended:
- Detailed facility list and current condition
- Take photos or videos on-site as evidence
- Both parties sign to confirm

7. Vague rent adjustment clauses
Contracts that do not specify whether rent can be adjusted and by how much. It is recommended:
- Clearly state that rent will not be adjusted during the lease term
- If adjustment is needed, provide 30 days advance notice and reach mutual agreement

8. Overly strict subletting restrictions
Some contracts completely prohibit subletting. It is recommended:
- Allow subletting with landlord's consent
- Clearly state subletting conditions and fee distribution

9. Unclear renovation clauses
Contracts that do not specify whether renovation is allowed and renovation standards. It is recommended:
- Clearly state whether renovation is allowed and the scope
- How renovations will be handled upon moving out
- No changes to main structural elements

10. Conflicting contract clauses
Contradictory clauses exist in the contract. It is recommended:
- Read every clause carefully
- Raise questions immediately and request modifications
- Important modifications must be confirmed in writing

Preparations before signing the contract:
1. View original property deed, verify landlord identity
2. Verify property information matches the property deed
3. Keep copies of the contract and payment receipts
4. Ideally have a third party present as witness`,
      },
      {
        id: 2,
        title: 'Complete Guide to Deposit Return',
        desc: 'How to successfully get your deposit back when moving out? Here is the complete process',
        type: 'Deposit Protection',
        content: `Preparations Before Moving Out

1. Review contract terms
- Read the deposit return clauses in the contract carefully
- Understand return conditions and timeframe
- Note possible situations where deposit may be deducted

2. Clean the property
- Clean the property according to contract requirements
- Keep all facilities in good condition
- Remove personal belongings and trash

3. Take photos and videos
- Photograph and video the entire property
- Focus on easily damaged facilities (air conditioning, refrigerator, washing machine, etc.)
- Ensure all facilities are working properly

4. Prepare documents
- Original rental contract
- Payment receipts (deposit receipt, transfer records)
- Copy of ID card

Moving Out Process

Step One: Notify landlord
- Notify landlord of moving out 30 days in advance
- Keep evidence of notification (WeChat, SMS, email)
- Confirm handover time and method

Step Two: Property handover
- Inspect property together with landlord
- Both parties confirm facility conditions
- Sign moving-out confirmation
- Return keys and access cards

Step Three: Settle fees
- Verify utilities, gas fees, etc.
- Confirm if there are other fees payable
- Request detailed fee statement

Step Four: Request deposit return
- Proactively contact landlord within 15 days after moving out
- Request deposit return timeframe
- Keep communication records

Common Disputes and Handling

1. Landlord deducts deposit without reason
Response measures:
- Request landlord to provide deduction proof
- Question the reasonableness of deductions
- Refuse unreasonable deductions

2. Landlord delays return
Response measures:
- Send multiple reminders and keep records
- Clearly state that further action will be taken
- Send formal payment demand letter

3. Landlord is unreachable
Response measures:
- Try multiple contact methods
- Seek help from property management or agent
- Report to police if necessary

Rights Protection Channels

1. Negotiation
- First communicate friendly
- Provide supporting evidence
- Seek win-win solutions

2. Complaints
- File complaint with 12345 hotline
- Report to housing department
- Report to market supervision department

3. Platform Rights Protection
- File rights protection application through this platform
- Submit evidence materials
- Enjoy professional rights protection services

4. Legal Action
- Prepare complete evidence materials
- File lawsuit to court
- Apply for property preservation

Important Reminders

1. Keep evidence: All communications, payments, and handovers must have written records
2. No cash transactions: Deposit is best transferred via bank with traceable records
3. Timely action: Handle discovered breaches promptly to avoid missing deadlines
4. Legal aid: Apply for legal aid if economically disadvantaged

Typical Cases

Case 1: 5000 yuan deposit deducted, successfully recovered
Tenant Wang's deposit was deducted for various reasons after moving out. Wang filed rights protection through the platform, submitted complete contracts and payment receipts, and successfully recovered the deposit.

Case 2: Delayed for half a year refusing to return
Tenant Li's deposit was delayed for half a year after moving out. Li filed 12345 complaint and court lawsuit, and the final judgment ordered landlord to return deposit plus interest.

Summary
Deposit return is an important part of the rental process. Preparing in advance, keeping complete evidence, and timely action are keys to successfully recovering your deposit.`,
      },
      {
        id: 3,
        title: 'How to Calculate Utility Fees Reasonably',
        desc: 'Understand the standard calculation methods for utility fees to avoid being overcharged...',
        type: 'Fee Verification',
        content: `# How to Calculate Utility Fees Reasonably

Understanding utility fee calculation methods can help you avoid being overcharged by landlords. Here is a detailed utility fee calculation guide:

 Electricity Calculation

 Residential electricity standards
- Tier 1 (0-260 kWh/month): approximately 0.5 yuan/kWh
- Tier 2 (261-600 kWh/month): approximately 0.55 yuan/kWh
- Tier 3 (601+ kWh/month): approximately 0.8 yuan/kWh

 Commercial electricity standards
- General commercial electricity: 1.2-1.5 yuan/kWh
- This standard is much higher than residential electricity

 Calculation formula
\`\`\`
Electricity fee = (current reading - previous reading) × unit price
\`\`\`

 Identifying unreasonable electricity fees
- Unit price exceeds 1.5 yuan/kWh (unless commercial electricity)
- Meter readings are clearly abnormal (e.g., 5000 kWh/month in summer)
- Fixed monthly electricity fee (e.g., fixed 300 yuan/month)

 Water Fee Calculation

 Residential water standards
- Tier 1 (0-20 m³/month): approximately 2.8 yuan/m³
- Tier 2 (21-30 m³/month): approximately 3.6 yuan/m³
- Tier 3 (30+ m³/month): approximately 6.0 yuan/m³

 Calculation formula
\`\`\`
Water fee = (current reading - previous reading) × unit price + sewage treatment fee
\`\`\`

 Sewage treatment fee
- Generally 30%-40% of water fee
- Usually calculated together with water fee

 Gas Fee Calculation

 Residential gas standards
- Tier 1: approximately 2.4 yuan/m³
- Tier 2: approximately 2.9 yuan/m³
- Tier 3: approximately 3.6 yuan/m³

 Calculation formula
\`\`\`
Gas fee = (current reading - previous reading) × unit price
\`\`\`

 Common Tricks

 1. Using commercial electricity rates for residential
Identification method:
- Ask landlord about electricity rate
- Check electricity bills
- Compare with local residential electricity standards

Response measures:
- Request billing at residential electricity standard
- Report to power supply department
- Keep payment receipts as evidence

 2. Falsely inflated usage
Identification method:
- Regularly read meter yourself
- Compare with bill usage
- Pay attention to seasonal electricity changes

Response measures:
- Request landlord to provide detailed bill
- Read meter yourself and take photos
- Use smart meters for real-time monitoring

 3. Bundled charging
Identification method:
- Ask for detailed breakdown of charges
- Refuse unreasonable bundled fees
- Verify if there is relevant basis

Response measures:
- Request itemized fee statement
- Refuse to pay fees without basis
- Keep all payment receipts

 Practical Tools

 1. Fee verification
Use this platform's fee verification function, input usage and rates to automatically determine if it's reasonable.

 2. Smart meters
- Can view electricity usage in real-time
- Remote meter reading is more transparent
- Prevents manual tampering

 3. Meter reading records
- Read meter yourself monthly
- Take photos for evidence
- Regularly verify bills

 Rights Protection Process

 Step One: Collect evidence
- Save all payment receipts
- Record meter readings
- Keep communication records with landlord

 Step Two: Verify bills
- If you have questions about usage, request detailed bill
- If you have questions about rates, check local standards
- Verify if all charges are reasonable

 Step Three: Friendly negotiation
- Communicate with landlord, raise questions
- Request refund of unreasonable charges
- Keep records of negotiation process

 Step Four: Complaints
- Report to power company/water company
- Call 12345 hotline
- Report to housing department

 Step Five: Legal rights protection
- Prepare complete evidence materials
- File lawsuit to court
- Apply for fee audit

 Energy Saving Tips

 Electricity saving
1. Use energy-saving light bulbs
2. Use air conditioning reasonably (above 26°C)
3. Turn off unnecessary appliances promptly
4. Use energy-efficient appliances

 Water saving
1. Turn off faucets promptly
2. Use water-saving fixtures
3. Use washing machine reasonably
4. Reduce unnecessary water use

 Summary
Understand reasonable utility fee standards, regularly verify bills, and promptly protect your rights to avoid being overcharged. If you discover unreasonable charges, be bold enough to raise questions and take rights protection measures.`,
      }
    ]
  },

  onLoad(options) {
    // If there's an id parameter, show guide detail
    if (options.id) {
      const guideId = parseInt(options.id);
      const guide = this.data.guides.find(g => g.id === guideId);
      if (guide) {
        this.setData({
          showGuideDetail: true,
          currentGuide: guide
        });
      }
    }
  },
  
  goToHelp(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/pages/help-list/help-list?type=${type}`
    });
  },

  viewFaq(e) {
    const faqId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/faq-detail/faq-detail?id=${faqId}`
    });
  },



  startChat() {
    wx.showToast({
      title: 'Connecting to customer service...',
      icon: 'loading'
    });
  },

  callService() {
    wx.showModal({
      cancelText: 'No',
      title: 'Customer Service Phone',
      content: 'Customer Service: 400-123-4567\nHours: 9:00-18:00',
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

  // Return to help center home
  backToHelpCenter() {
    this.setData({
      showGuideDetail: false,
      currentGuide: null
    });
  },

  // Search input
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // Search confirm
  onSearchConfirm(e) {
    const keyword = e.detail.value.trim();
    if (!keyword) {
      wx.showToast({
        title: 'Please enter search keywords',
        icon: 'none'
      });
      return;
    }

    this.setData({
      searchKeyword: keyword
    });

    // Perform search
    this.performSearch(keyword);
  },

  // Perform search
  performSearch(keyword) {
    const searchResults = [];
    const lowerKeyword = keyword.toLowerCase();

    // Search hot questions
    this.data.hotFaqs.forEach(faq => {
      if (faq.question.toLowerCase().includes(lowerKeyword) || 
          faq.answer.toLowerCase().includes(lowerKeyword)) {
        searchResults.push({
          id: faq.id,
          title: faq.question,
          answer: faq.answer,
          type: 'faq'
        });
      }
    });

    // Search guides
    this.data.guides.forEach(guide => {
      if (guide.title.toLowerCase().includes(lowerKeyword) || 
          guide.desc.toLowerCase().includes(lowerKeyword) || 
          guide.content.toLowerCase().includes(lowerKeyword)) {
        searchResults.push({
          id: guide.id,
          title: guide.title,
          desc: guide.desc,
          content: guide.content,
          type: 'guide'
        });
      }
    });



    this.setData({
      searchResults: searchResults,
      showSearchResults: true
    });
  },

  // View search result
  viewSearchResult(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;

    switch (type) {
      case 'faq':
        wx.navigateTo({
          url: `/pages/faq-detail/faq-detail?id=${id}`
        });
        break;
      case 'guide':
        this.setData({
          showGuideDetail: true,
          currentGuide: this.data.guides.find(g => g.id === id)
        });
        break;

    }
  },

  // Clear search
  clearSearch() {
    this.setData({
      searchKeyword: '',
      showSearchResults: false,
      searchResults: []
    });
  }
})
