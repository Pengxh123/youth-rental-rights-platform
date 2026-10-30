// Create sample topic data
const topic = {
  id: Date.now(),
  author: 'Renter',
  avatar: '',
  time: 'Just now',
  title: 'What to note when renting for the first time?',
  summary: 'Just graduated and preparing to rent. I heard there are many pitfalls. I would like to ask everyone what to pay attention to when renting for the first time, such as contracts, deposits, utility fees, etc. I hope to get your experience sharing!',
  category: 'House Selection Help',
  type: 'help',
  tags: ['First-time renter', 'Help', 'Experience'],
  images: [],
  views: 0,
  comments: 0,
  likes: 0,
  favorites: 0,
  isHot: false,
  isTop: false
};

console.log('Created topic data:');
console.log(JSON.stringify(topic, null, 2));
