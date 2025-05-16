const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['smartphone', 'laptop', 'headphone', 'smartwatch', 'camera', 'tablet', 'speaker', 'television', 'other'],
    lowercase: true
  },
  specs: {
    battery: String,
    ram: String,
    storage: String,
    processor: String,
    camera: String,
    display: String,
    resolution: String,
    os: String,
    connectivity: String,
    dimensions: String,
    weight: String,
    additionalFeatures: [String]
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add text index for search functionality
ProductSchema.index({ title: 'text', tags: 'text' });

module.exports = mongoose.model('Product', ProductSchema); 