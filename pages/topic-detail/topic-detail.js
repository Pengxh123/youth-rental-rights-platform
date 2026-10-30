// pages/topic-detail/topic-detail.js
Page({
  data: {
    topicId: '',
    type: '',
    topic: {},
    isFollowing: false,
    isLiked: false,
    isFavorited: false,
    comments: [],
    commentCount: 0,
    commentText: '',
    replyTo: '',
    replyToId: ''
  },

  onLoad(options) {
    console.log('onLoad options:', options);
    const topicId = options.id || '3';
    const from = options.from || '';
    const type = options.type || '';
    console.log('onLoad:', { topicId, from, type });
    this.setData({ topicId, type });
    this.loadTopicDetail(topicId, from);
    this.loadComments(topicId);
    this.checkFavoriteStatus(topicId);
  },

  checkFavoriteStatus(topicId) {
    try {
      const favorites = wx.getStorageSync('favorites') || [];
      const isFavorited = favorites.some(item => item.targetId == topicId);
      this.setData({ isFavorited });
    } catch (e) {
      console.error('Failed to check favorite status', e);
    }
  },

  loadTopicDetail(topicId, from) {
    console.log('loadTopicDetail:', { topicId, from });
    const id = Number(topicId);
    console.log('Converted id:', id);
    console.log('Type of id:', typeof id);

    const topicMap = {
      1: {
        id: 1,
        author: 'Newbie',
        avatar: 'https://via.placeholder.com/80',
        createTime: '2 hours ago',
        title: 'Which is better for a new graduate: Pay 1+3 or 1+1 deposit?',
        category: 'Rental Help',
        tags: ['1+3 Deposit', '1+1 Deposit', 'Budget'],
        content: 'New graduate preparing to rent, would like to ask everyone whether paying 1+3 or 1+1 deposit is more cost-effective?\n\nMy situation:\n1. Just graduated, not much savings\n2. Stable job, will rent for at least 1 year\n3. Monthly income around 8000 yuan\n4. Budget within 3000 yuan\n\nWhat I understand:\n- 1+3 deposit: monthly rent is about 10% cheaper, but higher down payment pressure\n- 1+1 deposit: monthly rent is more expensive, but lower down payment pressure, more flexible\n\nWould like to hear everyone\'s suggestions, especially experienced renters:\n1. Which payment method is more cost-effective?\n2. What are the pros and cons of each?\n3. Are there any other things to pay attention to?\n\nThank you!',
        images: [],
        likes: 234,
        comments: 89,
        favorites: 56
      },
      2: {
        id: 2,
        author: 'Rights Advocate',
        avatar: 'https://via.placeholder.com/80',
        createTime: '5 hours ago',
        title: 'Success story: Got my deposit back after 3 months!',
        category: 'Success Cases',
        tags: ['Rights', 'Deposit', 'Success'],
        content: 'Finally got my deposit back today! Sharing my rights protection experience, hoping to help friends who have encountered the same problem.\n\nWhat happened:\nIn July this year, I moved out of an apartment in Chaoyang District. The landlord refused to return my 5000 yuan deposit citing "scratches on the wall" and "furniture damage". After multiple unsuccessful communications, I decided to resolve it through legal means.\n\nRights protection steps:\n\n1. Collect evidence\n- Took photos of the apartment when moving out\n- Kept the rental contract and transfer records\n- Recorded phone calls with the landlord\n- Invited a third party to do a house inspection report\n\n2. Communication and negotiation\n- First sent a written demand letter to the landlord\n- Listed legal basis, clearly informed them it was illegal\n- Gave a 7-day rectification period\n\n3. Complaints and reports\n- Complained to the housing authority\n- Called 12345 citizen hotline\n- Exposed on rental platforms\n\n4. Legal litigation\n- Filed a lawsuit at the court\n- Applied for property preservation\n- Successfully mediated after 2 months\n\nResult:\nFinally, under court mediation, the landlord agreed to return the full deposit of 5000 yuan and bear the litigation costs.\n\nLessons learned:\n- Always carefully inspect the property when moving out\n- Keep all relevant evidence\n- Don\'t compromise easily when encountering problems\n- Read contract terms carefully\n- Seek legal help when necessary\n\nHope everyone meets good landlords, and if you encounter problems, be brave to protect your rights!',
        images: [],
        likes: 423,
        comments: 156,
        favorites: 89
      },
      3: {
        id: 3,
        author: 'Veteran Renter',
        avatar: 'https://via.placeholder.com/80',
        createTime: 'Yesterday',
        title: '3 years renting in Beijing: These pitfalls must be avoided!',
        category: 'Tips',
        tags: ['Avoid Pitfalls', 'Experience'],
        content: 'From internship to work, I have rented in Beijing for 3 years and experienced various tricks. Today I will share the 10 most common rental pitfalls to help everyone.\n\n1. Deposit issues\nMany landlords will deduct the deposit. Be sure to clarify the conditions and timing of deposit return when signing the contract.\n\n2. Utility bill traps\nConfirm whether utilities are civil or commercial, there is a big price difference.\n\n3. Agency fees\nAgency fees usually do not exceed 50% of monthly rent. Complain if it exceeds.\n\n4. Sublandlord running away\nAlways check the property certificate to confirm it is the real landlord, avoid sublandlords running away.\n\n5. Fake listings\nOnline listings differ greatly from reality. Always view the property in person before signing.\n\n6. Contract traps\nRead contract terms carefully, especially regarding liability for breach of contract and early termination.\n\n7. Aging facilities\nCheck if air conditioners, water heaters, gas stoves, etc. are working properly.\n\n8. Noise issues\nCheck the surrounding environment, avoid noisy areas near construction sites or main roads.\n\n9. Transportation convenience\nConfirm commute time to work, whether subway and bus are convenient.\n\n10. Safety issues\nCheck if door locks and windows are intact, how is the community security.\n\nHope everyone avoids detours and rents smoothly!',
        images: [],
        likes: 567,
        comments: 234,
        favorites: 123
      },
      4: {
        id: 4,
        author: 'Victim A',
        avatar: 'https://via.placeholder.com/80',
        createTime: '2 days ago',
        title: 'Sublandlord ran away, what should I do?',
        category: 'Experiences',
        tags: ['Sublandlord', 'Scam', 'Help'],
        content: 'Help! The sublandlord of my rented house ran away, what should I do now?\n\nWhat happened:\nLast month, I saw a very cheap house on a rental platform, only 1800 yuan per month, 500 yuan cheaper than the market price. After contacting the person, they claimed to be a sublandlord who rented the house from the real landlord and subleased it to me.\n\nI was very satisfied with the house. The person showed me the rental contract with the real landlord (later found to be forged), so I signed the contract and paid 1+3 deposit, totaling 7200 yuan.\n\nNow the problem:\n\n1. Someone knocked on the door yesterday, claiming to be the real landlord collecting rent\n2. I realized the sublandlord has been unreachable for several days\n3. The real landlord said I was scammed, he only received one month\'s rent from the sublandlord\n4. The sublandlord took 3 months\' rent and ran away\n\nI am now facing:\n- Paid 7200 yuan rent, only lived for half a month\n- Real landlord wants me to move out\n- Don\'t know who the sublandlord is, only have a phone number that can\'t be reached\n\nWhat I have done:\n1. Reported to police, they said it\'s an economic dispute, told me to sue\n2. Called 12345 citizen hotline, they said they will help mediate\n3. Found a lawyer, preparing to sue the sublandlord\n\nWould like to ask everyone:\n1. Can I continue living in this situation?\n2. How can I get my rent back?\n3. Any friends who have encountered similar situations?\n\nReally desperate, hope to get everyone\'s help!',
        images: [
          'https://via.placeholder.com/300'
        ],
        likes: 89,
        comments: 67,
        favorites: 23
      },
      5: {
        id: 5,
        author: 'New Renter',
        avatar: 'https://via.placeholder.com/80',
        createTime: '3 days ago',
        title: 'Looking for rental near Beijing CBD, budget under 3000',
        category: 'Rental Help',
        tags: ['Beijing', 'Internship', 'Shared'],
        content: 'Interning near CBD, looking for a single room or shared apartment, budget around 3000, hope it\'s close to subway.\n\nMy requirements:\n1. Location: Near CBD, commute time within 40 minutes\n2. Budget: Within 3000 yuan\n3. Type: Single room or shared master bedroom\n4. Facilities: Hope to have air conditioner, washing machine\n5. Move-in: Early January\n\nAny reliable communities or agencies to recommend? What I saw online is quite different from reality, hope to get some real recommendations!\n\nAlso, what should I pay special attention to when renting? First time renting with no experience.',
        images: [],
        likes: 23,
        comments: 45,
        favorites: 12
      },
      6: {
        id: 6,
        author: 'Experienced Renter',
        avatar: 'https://via.placeholder.com/80',
        createTime: '3 days ago',
        title: '5 details to check when viewing a house, avoid pitfalls!',
        category: 'Tips',
        tags: ['House Viewing', 'Inspection', 'Tips'],
        content: 'Sharing 5 years of rental experience, from water/electricity meters to door/window checks, these details determine how comfortable you will live.\n\n1. Check water and electricity meter readings\nBe sure to take photos of water and electricity meter readings before signing the contract to avoid being charged for previous tenants\' fees. Better confirm the starting readings with the landlord in person.\n\n2. Test all appliances\n- Air conditioner cooling/heating function\n- Water heater temperature stability\n- Gas stove ignition\n- Washing machine operation\n\n3. Check door and window safety\n- Door locks condition\n- Window operation\n- Air leakage or water leakage\n- Balcony guardrail stability\n\n4. Check water and electricity facilities\n- Faucet leakage\n- Drainage blockage\n- Socket power supply\n- Light fixtures\n\n5. Check surrounding environment\n- Visit both day and night to avoid noise at night\n- Kitchen and bathroom odors\n- Cleanliness and safety of corridors\n- Community access control\n\nThese details seem small but directly affect living experience, be sure to check carefully!',
        images: [],
        likes: 234,
        comments: 98,
        favorites: 67
      },
      7: {
        id: 7,
        author: 'Legal Advisor',
        avatar: 'https://via.placeholder.com/80',
        createTime: '1 week ago',
        title: 'Successfully sued black landlord, got double deposit back!',
        category: 'Success Cases',
        tags: ['Legal', ' Lawsuit', 'Rights'],
        content: 'Encountered malicious deposit deduction, I did not give up, successfully protected my rights through legal means. Hope my experience can help more people.\n\nWhat happened:\nLast August, I moved out of an apartment in Haidian District. The landlord refused to return my 5000 yuan deposit for various reasons. Specific reasons include:\n- "Furniture depreciation fee" 3000 yuan\n- "Wall cleaning fee" 1000 yuan\n- "Breach of contract fee" 1000 yuan\n\nBut these fees are not in the contract at all!\n\nRights protection process:\n\n1. Evidence collection\n- Took comparison photos of the apartment when moving in and out\n- Kept transfer records and contract\n- Recorded calls with the landlord\n- Found a third-party inspection company to do an assessment\n\n2. Negotiation failed\n- First communicated, landlord was tough\n- Sent a lawyer\'s letter, ignored\n\n3. Filed a lawsuit\n- Filed at Haidian Court\n- Submitted all evidence\n- Judge organized two mediations\n\n4. Judgment result\n- Court ruled landlord\'s charges have no basis\n- Ordered to return 5000 yuan deposit\n- Pay interest for delayed refund\n- Bear litigation costs\n\nLessons learned:\n1. Always keep all evidence\n2. Read contract terms carefully\n3. Don\'t be afraid of trouble when encountering problems\n4. Legal means are the most effective\n\nHope everyone can protect their rights!',
        images: [],
        likes: 567,
        comments: 203,
        favorites: 134
      },
      8: {
        id: 8,
        author: 'Graduate Wang',
        avatar: 'https://via.placeholder.com/80',
        createTime: '4 days ago',
        title: 'Looking for rental in Minhang District, close to Xuhui',
        category: 'Rental Help',
        tags: ['Shanghai', 'Graduate', 'Help'],
        content: 'Just graduated and working in Xuhui District, looking for a house in Minhang District, budget around 3500, recommend reliable communities or agencies.\n\nMy situation:\n1. Work: Near Caohejing, Xuhui District\n2. Requirement: Commute time within 1 hour\n3. Budget: Within 3500 yuan\n4. Type: Shared second bedroom or small single room\n5. Move-in: Before the end of this month\n\nConsidering Minhang because rent is relatively cheaper, but not familiar with Shanghai, not sure which areas are suitable.\n\nWould like to ask:\n1. Which communities in Minhang have convenient commute to Xuhui?\n2. Any reliable agencies or platforms to recommend?\n3. What rental pitfalls should I watch out for?\n\nThank you!',
        images: [],
        likes: 18,
        comments: 32,
        favorites: 8
      },
      9: {
        id: 9,
        author: 'Scammed Renter',
        avatar: 'https://via.placeholder.com/80',
        createTime: '5 days ago',
        title: 'Documenting my entire rights protection process, for reference',
        category: 'Experiences',
        tags: ['Rights', 'Documentation', 'Experience'],
        content: 'From being refused 1+3 deposit to having deposit deducted, to applying for legal aid, every step is documented.\n\nBackground:\nLast March, I rented a one-bedroom apartment in Chaoyang District. At that time, I agreed with the landlord to pay 1+3 deposit. When moving out, the landlord refused to return the deposit for various reasons.\n\nRights protection timeline:\n\nMarch 15: Signed rental contract, paid deposit and rent\n\nJune 15: Moved out, landlord requested property inspection\n\nJune 20: Landlord sent deduction list, deducted entire deposit\n- Furniture wear: 3000 yuan\n- Wall stains: 1500 yuan\n- Early termination penalty: 500 yuan\n\nJune 22: I raised objections, refused to accept\n\nJune 25: First negotiation, landlord was tough\n\nJune 30: I found a third-party inspection, results showed facilities normal\n\nJuly 5: Sent lawyer\'s letter to landlord\n\nJuly 10: Landlord still not responding\n\nJuly 15: Filed lawsuit at court\n\nAugust 20: Court ruled to return full deposit\n\nSeptember 1: Successfully got deposit back\n\nKey lessons:\n1. Keep all evidence, including photos, recordings, chat records\n2. Don\'t compromise easily, stand up for your rights\n3. Seek professional legal help when necessary\n4. Court mediation is faster than litigation\n\nHope my experience can help friends who encounter the same problems!',
        images: [
          'https://via.placeholder.com/300'
        ],
        likes: 145,
        comments: 78,
        favorites: 34
      },
      10: {
        id: 10,
        author: 'Law Student Zhang',
        avatar: 'https://via.placeholder.com/80',
        createTime: '6 days ago',
        title: 'Unfair contract clauses in rental contracts, how to identify and respond',
        category: 'Experiences',
        tags: ['Contract', 'Legal', 'Avoid Pitfalls'],
        content: 'As a law student, I compiled common unfair clauses in rental contracts, teaching everyone how to identify and avoid being scammed.\n\nCommon unfair clauses:\n\n1. "Deposit non-refundable clause"\n❌ Typical wording: "Deposit is non-refundable under any circumstances"\n✅ Correct approach: Clearly specify deposit refund conditions and timing\n\n2. "Full compensation clause"\n❌ Typical wording: "Tenant must compensate at market price for any damage"\n✅ Correct approach: Reasonably agree on compensation standards, distinguish between natural wear and tear and intentional damage\n\n3. "Unlimited withholding clause"\n❌ Typical wording: "Landlord has the right to withhold deposit indefinitely until inspection is completed"\n✅ Correct approach: Clearly specify inspection time, generally no more than 3 working days\n\n4. "Unilateral price increase clause"\n❌ Typical wording: "Landlord has the right to adjust rent at any time"\n✅ Correct approach: Clearly specify rent is fixed during contract period\n\n5. "Prohibition of rights protection clause"\n❌ Typical wording: "Tenant shall not resolve disputes through legal means"\n✅ Correct approach: Contract cannot exclude legal remedies\n\nResponse strategies:\n\n1. Read contract carefully\nEspecially clauses about deposit, liability for breach of contract, early termination, etc.\n\n2. Mark unreasonable clauses\nMark questionable parts with a pen, request modification\n\n3. Keep original contract\nTake photos for backup, prevent tampering\n\n4. Refuse to sign unfair clauses\nIf the other party refuses to modify, consider changing the listing\n\n5. Consult professionals\nFor complex clauses, consult a lawyer or legal aid\n\nRemember: Contracts protect both parties, not just one side!',
        images: [],
        likes: 267,
        comments: 112,
        favorites: 89
      },
      999: {
        id: 999,
        author: 'Newbie',
        avatar: 'https://via.placeholder.com/80',
        createTime: 'Just now',
        title: 'Which is better for a new graduate: Pay 1+3 or 1+1 deposit?',
        category: 'Rental Help',
        tags: ['1+3 Deposit', '1+1 Deposit', 'Budget'],
        content: 'New graduate preparing to rent, would like to ask everyone whether paying 1+3 or 1+1 deposit is more cost-effective?\n\nMy situation:\n1. Just graduated, not much savings\n2. Stable job, will rent for at least 1 year\n3. Monthly income around 8000 yuan\n4. Budget within 3000 yuan\n\nWhat I understand:\n- 1+3 deposit: monthly rent is about 10% cheaper, but higher down payment pressure\n- 1+1 deposit: monthly rent is more expensive, but lower down payment pressure, more flexible\n\nWould like to hear everyone\'s suggestions, especially experienced renters:\n1. Which payment method is more cost-effective?\n2. What are the pros and cons of each?\n3. Are there any other things to pay attention to?\n\nThank you!',
        images: [],
        likes: 234,
        comments: 89,
        favorites: 56
      }
    };

    console.log('TopicMap keys:', Object.keys(topicMap));
    console.log('topicMap[999]:', topicMap[999]);

    let topic = topicMap[id];
    console.log('Initial topic:', topic);
    if (!topic) {
      if (from === 'my-topics') {
        topic = topicMap[999];
      } else {
        topic = topicMap[3];
      }
    }
    console.log('Selected topic:', topic);

    this.setData({ topic });
  },

  loadComments(topicId) {
    console.log('loadComments called with topicId:', topicId);
    const id = Number(topicId);
    console.log('Converted id:', id);

    const commentsMap = {
      1: [
        {
          id: 1,
          author: 'Experienced Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Recommend 1+3 deposit. First, monthly rent is cheaper, and since you have a stable job, it\'s more cost-effective for long-term living.',
          time: '30 minutes ago',
          likes: 56
        },
        {
          id: 2,
          author: 'Finance Girl',
          avatar: 'https://via.placeholder.com/80',
          content: 'I also just graduated and chose 1+1. Lower down payment pressure, more flexible if job changes.',
          time: '1 hour ago',
          likes: 42
        },
        {
          id: 3,
          author: 'Beijing Landlord',
          avatar: 'https://via.placeholder.com/80',
          content: 'As a landlord, I prefer tenants who pay 1+3. But it depends on your savings situation.',
          time: '2 hours ago',
          likes: 38
        }
      ],
      2: [
        {
          id: 1,
          author: 'Legal Advisor',
          avatar: 'https://via.placeholder.com/80',
          content: 'Well done! Many tenants give up when encountering this situation. Your perseverance in protecting rights is worth learning.',
          time: '2 hours ago',
          likes: 89
        },
        {
          id: 2,
          author: 'Rental Victim',
          avatar: 'https://via.placeholder.com/80',
          content: 'I also encountered a similar situation, saved your rights protection process, going to try!',
          time: '5 hours ago',
          likes: 67
        },
        {
          id: 3,
          author: 'Justice Passerby',
          avatar: 'https://via.placeholder.com/80',
          content: 'This kind of black landlord should be exposed, let more people know!',
          time: 'Yesterday',
          likes: 54
        }
      ],
      3: [
        {
          id: 1,
          author: 'New Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Very practical! Just graduated and need this experience, thank you for sharing!',
          time: '2 hours ago',
          likes: 45
        },
        {
          id: 2,
          author: 'Rights Advocate',
          avatar: 'https://via.placeholder.com/80',
          content: 'I have deep experience with point 2 about utility bill traps, almost got scammed',
          time: '5 hours ago',
          likes: 32
        },
        {
          id: 3,
          author: 'New Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Can the blogger recommend which areas in Beijing are suitable for renting? Budget around 3000',
          time: 'Yesterday',
          likes: 18
        }
      ],
      4: [
        {
          id: 1,
          author: 'Lawyer Friend',
          avatar: 'https://via.placeholder.com/80',
          content: 'First contact the real landlord to see if an agreement can be reached. The sublandlord issue needs to sue him.',
          time: '10 minutes ago',
          likes: 78
        },
        {
          id: 2,
          author: 'Landlord Lao Wang',
          avatar: 'https://via.placeholder.com/80',
          content: 'Encountering this is really distressing. Suggest first communicate with the real landlord to see if you can continue living.',
          time: '30 minutes ago',
          likes: 65
        },
        {
          id: 3,
          author: '3 Years in Beijing',
          avatar: 'https://via.placeholder.com/80',
          content: 'Always check the property certificate! Don\'t trust sublandlords easily, learn from mistakes.',
          time: '1 hour ago',
          likes: 52
        }
      ],
      5: [
        {
          id: 1,
          author: 'CBD Office Worker',
          avatar: 'https://via.placeholder.com/80',
          content: 'Recommend Shuangjing area, subway line 10 directly to CBD, shared rent around 2500-3000.',
          time: '30 minutes ago',
          likes: 45
        },
        {
          id: 2,
          author: 'Rental Agent Li',
          avatar: 'https://via.placeholder.com/80',
          content: 'I also do rentals in the CBD area, contact me if you have suitable listings.',
          time: '1 hour ago',
          likes: 32
        },
        {
          id: 3,
          author: 'Intern Zhang',
          avatar: 'https://via.placeholder.com/80',
          content: 'I also intern at CBD, live in Dawanglu, 25 minutes to work, rent 2800, very convenient!',
          time: '2 hours ago',
          likes: 28
        }
      ],
      6: [
        {
          id: 1,
          author: 'New Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Very practical! Especially the water and electricity meter reading check, almost got scammed.',
          time: '20 minutes ago',
          likes: 67
        },
        {
          id: 2,
          author: 'Experienced',
          avatar: 'https://via.placeholder.com/80',
          content: 'Add one point: Must go see at night to avoid noise affecting sleep.',
          time: '1 hour ago',
          likes: 54
        },
        {
          id: 3,
          author: 'Landlord Mr. Zhang',
          avatar: 'https://via.placeholder.com/80',
          content: 'As a landlord, I think these checks are necessary, both parties can save trouble.',
          time: '3 hours ago',
          likes: 43
        }
      ],
      7: [
        {
          id: 1,
          author: 'Legal Aid',
          avatar: 'https://via.placeholder.com/80',
          content: 'Excellent! Your experience has given many people the courage to protect their rights.',
          time: '10 minutes ago',
          likes: 89
        },
        {
          id: 2,
          author: 'Also Scammed',
          avatar: 'https://via.placeholder.com/80',
          content: 'Saved! I will also go to court to sue, hope I can succeed like you.',
          time: '30 minutes ago',
          likes: 76
        },
        {
          id: 3,
          author: 'Justice Messenger',
          avatar: 'https://via.placeholder.com/80',
          content: 'This kind of black landlord should be punished, support you!',
          time: '1 hour ago',
          likes: 65
        }
      ],
      8: [
        {
          id: 1,
          author: 'Shanghai Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Recommend Xinzhuang, subway line 1 to Xuhui is convenient, shared rent under 3000 can be found.',
          time: '40 minutes ago',
          likes: 38
        },
        {
          id: 2,
          author: 'Graduate Zhou',
          avatar: 'https://via.placeholder.com/80',
          content: 'I also work in Caohejing, live in Meilong, commute 50 minutes, rent 3200.',
          time: '1 hour ago',
          likes: 29
        },
        {
          id: 3,
          author: 'Shanghai Agent',
          avatar: 'https://via.placeholder.com/80',
          content: 'Many good communities in Minhang, let me know where you want to live, can contact me.',
          time: '2 hours ago',
          likes: 21
        }
      ],
      9: [
        {
          id: 1,
          author: 'Rights Helper',
          avatar: 'https://via.placeholder.com/80',
          content: 'Very detailed record! Helpful for those who encounter similar situations.',
          time: '30 minutes ago',
          likes: 45
        },
        {
          id: 2,
          author: 'New Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Saved, hope I never need it but good to know.',
          time: '1 hour ago',
          likes: 32
        },
        {
          id: 3,
          author: 'Lawyer Li',
          avatar: 'https://via.placeholder.com/80',
          content: 'Well done! Evidence is the most important in rights protection.',
          time: '2 hours ago',
          likes: 28
        }
      ],
      10: [
        {
          id: 1,
          author: 'Law Student',
          avatar: 'https://via.placeholder.com/80',
          content: 'Very professional! As a law student, I agree with all points.',
          time: '15 minutes ago',
          likes: 56
        },
        {
          id: 2,
          author: 'Rental Victim',
          avatar: 'https://via.placeholder.com/80',
          content: 'Unfortunately, I signed an unfair contract before, will pay attention next time.',
          time: '30 minutes ago',
          likes: 43
        },
        {
          id: 3,
          author: 'Experienced Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Very practical, will share with friends who are renting.',
          time: '1 hour ago',
          likes: 32
        }
      ],
      999: [
        {
          id: 1,
          author: 'Experienced Renter',
          avatar: 'https://via.placeholder.com/80',
          content: 'Recommend 1+3 deposit. First, monthly rent is cheaper, and since you have a stable job, it\'s more cost-effective for long-term living.',
          time: '30 minutes ago',
          likes: 56
        },
        {
          id: 2,
          author: 'Finance Girl',
          avatar: 'https://via.placeholder.com/80',
          content: 'I also just graduated and chose 1+1. Lower down payment pressure, more flexible if job changes.',
          time: '1 hour ago',
          likes: 42
        }
      ]
    };

    let comments = commentsMap[id];
    if (!comments) {
      comments = commentsMap[3];
    }

    this.setData({
      comments,
      commentCount: comments.length
    });
  },

  onLike() {
    this.setData({ isLiked: !this.data.isLiked });
    if (this.data.isLiked) {
      wx.showToast({ title: 'Liked', icon: 'success' });
    }
  },

  onFavorite() {
    const { isFavorited, topic } = this.data;
    
    if (isFavorited) {
      try {
        let favorites = wx.getStorageSync('favorites') || [];
        favorites = favorites.filter(item => item.targetId != topic.id);
        wx.setStorageSync('favorites', favorites);
        this.setData({ isFavorited: false });
        wx.showToast({ title: 'Removed from favorites', icon: 'none' });
      } catch (e) {
        console.error('Failed to remove favorite', e);
      }
    } else {
      try {
        const favorites = wx.getStorageSync('favorites') || [];
        favorites.push({
          targetId: topic.id,
          type: 'topic',
          title: topic.title,
          createTime: new Date().toISOString()
        });
        wx.setStorageSync('favorites', favorites);
        this.setData({ isFavorited: true });
        wx.showToast({ title: 'Added to favorites', icon: 'success' });
      } catch (e) {
        console.error('Failed to add favorite', e);
      }
    }
  },

  onFollow() {
    this.setData({ isFollowing: !this.data.isFollowing });
    wx.showToast({ 
      title: this.data.isFollowing ? 'Followed' : 'Unfollowed', 
      icon: 'none' 
    });
  },

  onShare() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  onCommentInput(e) {
    this.setData({ commentText: e.detail.value });
  },

  submitComment() {
    const { commentText } = this.data;
    if (!commentText.trim()) {
      wx.showToast({ title: 'Please enter comment content', icon: 'none' });
      return;
    }

    const newComment = {
      id: Date.now(),
      author: 'Me',
      avatar: 'https://via.placeholder.com/80',
      content: commentText,
      time: 'Just now',
      likes: 0
    };

    const comments = [...this.data.comments, newComment];
    this.setData({
      comments,
      commentCount: comments.length,
      commentText: ''
    });

    wx.showToast({ title: 'Comment submitted', icon: 'success' });
  },

  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: this.data.topic.images
    });
  }
});
