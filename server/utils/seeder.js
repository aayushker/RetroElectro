const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample product data
const products = [
  {
    title: 'Samsung Galaxy S21 Ultra',
    price: 1199.99,
    category: 'smartphone',
    specs: {
      battery: '5000mAh',
      ram: '12GB',
      storage: '256GB',
      processor: 'Exynos 2100',
      camera: '108MP + 10MP + 10MP + 12MP',
      display: '6.8-inch Dynamic AMOLED 2X',
      resolution: '3200 x 1440 pixels',
      os: 'Android 11',
    },
    link: 'https://www.samsung.com/galaxy-s21-ultra',
    image: 'https://via.placeholder.com/300',
    tags: ['samsung', 'flagship', 'android', 'high-end', 'premium', 'good camera', 'large battery'],
    rating: 4.7,
    reviews: 2345
  },
  {
    title: 'iPhone 13 Pro Max',
    price: 1099.99,
    category: 'smartphone',
    specs: {
      battery: '4352mAh',
      ram: '6GB',
      storage: '256GB',
      processor: 'A15 Bionic',
      camera: '12MP + 12MP + 12MP',
      display: '6.7-inch Super Retina XDR',
      resolution: '2778 x 1284 pixels',
      os: 'iOS 15',
    },
    link: 'https://www.apple.com/iphone-13-pro',
    image: 'https://via.placeholder.com/300',
    tags: ['apple', 'iphone', 'flagship', 'ios', 'premium', 'good camera'],
    rating: 4.8,
    reviews: 3211
  },
  {
    title: 'Google Pixel 6 Pro',
    price: 899.99,
    category: 'smartphone',
    specs: {
      battery: '5003mAh',
      ram: '12GB',
      storage: '128GB',
      processor: 'Google Tensor',
      camera: '50MP + 48MP + 12MP',
      display: '6.7-inch LTPO OLED',
      resolution: '3120 x 1440 pixels',
      os: 'Android 12',
    },
    link: 'https://store.google.com/pixel-6-pro',
    image: 'https://via.placeholder.com/300',
    tags: ['google', 'pixel', 'android', 'excellent camera', 'good battery'],
    rating: 4.6,
    reviews: 1432
  },
  {
    title: 'Xiaomi Redmi Note 10 Pro',
    price: 299.99,
    category: 'smartphone',
    specs: {
      battery: '5020mAh',
      ram: '6GB',
      storage: '128GB',
      processor: 'Snapdragon 732G',
      camera: '108MP + 8MP + 5MP + 2MP',
      display: '6.67-inch AMOLED',
      resolution: '2400 x 1080 pixels',
      os: 'Android 11',
    },
    link: 'https://www.mi.com/redmi-note-10-pro',
    image: 'https://via.placeholder.com/300',
    tags: ['xiaomi', 'redmi', 'android', 'budget', 'good battery', 'affordable'],
    rating: 4.5,
    reviews: 1876
  },
  {
    title: 'MacBook Pro 14-inch M1 Pro',
    price: 1999.99,
    category: 'laptop',
    specs: {
      battery: 'Up to 17 hours',
      ram: '16GB',
      storage: '512GB SSD',
      processor: 'Apple M1 Pro',
      display: '14.2-inch Liquid Retina XDR',
      resolution: '3024 x 1964 pixels',
      os: 'macOS',
      connectivity: 'Wi-Fi 6, Bluetooth 5.0, 3x Thunderbolt 4',
    },
    link: 'https://www.apple.com/macbook-pro-14',
    image: 'https://via.placeholder.com/300',
    tags: ['apple', 'macbook', 'mac', 'high performance', 'premium', 'productivity'],
    rating: 4.9,
    reviews: 1845
  },
  {
    title: 'Dell XPS 15',
    price: 1499.99,
    category: 'laptop',
    specs: {
      battery: 'Up to 12 hours',
      ram: '16GB',
      storage: '512GB SSD',
      processor: 'Intel Core i7-11800H',
      display: '15.6-inch 4K OLED',
      resolution: '3840 x 2160 pixels',
      os: 'Windows 11',
      connectivity: 'Wi-Fi 6, Bluetooth 5.1, Thunderbolt 4',
    },
    link: 'https://www.dell.com/xps-15',
    image: 'https://via.placeholder.com/300',
    tags: ['dell', 'xps', 'windows', 'performance', 'premium', 'productivity'],
    rating: 4.7,
    reviews: 1237
  },
  {
    title: 'Sony WH-1000XM4',
    price: 349.99,
    category: 'headphone',
    specs: {
      battery: 'Up to 30 hours',
      connectivity: 'Bluetooth 5.0, 3.5mm jack',
      additionalFeatures: ['Active Noise Cancellation', 'Touch Controls', 'Multi-device connectivity']
    },
    link: 'https://www.sony.com/wh-1000xm4',
    image: 'https://via.placeholder.com/300',
    tags: ['sony', 'noise cancellation', 'wireless', 'premium audio', 'long battery'],
    rating: 4.8,
    reviews: 3456
  }
];

// Import data
const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    
    console.log('Data imported!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Run command based on argument
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import or -d to delete data');
  process.exit();
} 