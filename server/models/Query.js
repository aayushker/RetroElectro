const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
  rawQuery: {
    type: String,
    required: true,
    trim: true
  },
  parsedFields: {
    category: String,
    budget: Number,
    feature: String,
    otherRequirements: [String]
  },
  matchedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Query', QuerySchema); 