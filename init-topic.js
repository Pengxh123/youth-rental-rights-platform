// Initialize sample topic data to local storage
const myTopics = [
  {
    id: 1738729200000,
    author: 'Renter',
    avatar: '',
    time: 'Just now',
    title: 'What to note when renting for the first time?',
    summary: 'Just graduated and preparing to rent. I heard there are many pitfalls. I would like to ask everyone what to pay attention to when renting for the first time, such as contracts, deposits, utility fees, etc. I hope to get your experience sharing!',
    category: 'House Selection Help',
    type: 'help',
    tags: ['First-time renter', 'Help', 'Experience'],
    images: [],
    views: 156,
    comments: 3,
    likes: 23,
    favorites: 5,
    isHot: false,
    isTop: false
  }
];

// Save to local storage
if (typeof wx !== 'undefined') {
  wx.setStorageSync('myTopics', myTopics);
  console.log('Sample topic created!');
} else {
  console.log('Please run this script in WeChat DevTools');
}
