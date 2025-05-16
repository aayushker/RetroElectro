const axios = require('axios');
const Product = require('../models/Product');
const Query = require('../models/Query');

// @desc    Get product recommendations based on user query
// @route   POST /api/recommend
// @access  Public
exports.getRecommendations = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Please provide a search query' });
    }

    // Save the raw query
    const queryRecord = new Query({
      rawQuery: query
    });

    // Call the ML service to parse the query and get recommendations
    // This is a placeholder and will be replaced with actual ML service call
    let parsedQuery;
    try {
      // Attempt to call ML service
      const mlResponse = await axios.post(process.env.ML_SERVICE_URL, { query });
      parsedQuery = mlResponse.data;
    } catch (error) {
      console.error('ML Service error:', error.message);
      
      // Fallback: Simple parsing logic if ML service is unavailable
      parsedQuery = simpleQueryParser(query);
    }

    // Update query record with parsed fields
    queryRecord.parsedFields = {
      category: parsedQuery.category,
      budget: parsedQuery.budget,
      feature: parsedQuery.feature,
      otherRequirements: parsedQuery.otherRequirements || []
    };

    // Find products matching the criteria
    let productsQuery = {};
    
    if (parsedQuery.category) {
      productsQuery.category = parsedQuery.category.toLowerCase();
    }
    
    if (parsedQuery.budget) {
      productsQuery.price = { $lte: parsedQuery.budget };
    }

    // Find products
    let products = await Product.find(productsQuery);

    // Further filter products based on features if available
    if (parsedQuery.feature && products.length > 0) {
      products = products.filter(product => {
        // Check if any tag contains the feature
        if (product.tags && product.tags.some(tag => tag.toLowerCase().includes(parsedQuery.feature.toLowerCase()))) {
          return true;
        }
        
        // Check if any spec contains the feature
        if (product.specs) {
          return Object.values(product.specs).some(spec => 
            spec && typeof spec === 'string' && spec.toLowerCase().includes(parsedQuery.feature.toLowerCase())
          );
        }
        
        return false;
      });
    }

    // Save product references to the query record
    queryRecord.matchedProducts = products.map(product => product._id);
    await queryRecord.save();

    res.status(200).json({ 
      success: true, 
      count: products.length, 
      data: {
        products,
        query: parsedQuery
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Log user query
// @route   POST /api/query-log
// @access  Public
exports.logQuery = async (req, res) => {
  try {
    const { query, selectedProducts } = req.body;
    
    if (!query) {
      return res.status(400).json({ success: false, error: 'Please provide a search query' });
    }

    const queryLog = await Query.create({
      rawQuery: query,
      matchedProducts: selectedProducts || []
    });

    res.status(201).json({ success: true, data: queryLog });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Simple fallback query parser for when ML service is unavailable
const simpleQueryParser = (query) => {
  const lowercaseQuery = query.toLowerCase();
  const result = {
    category: null,
    budget: null,
    feature: null,
    otherRequirements: []
  };

  // Extract category
  const categories = ['smartphone', 'phone', 'laptop', 'headphone', 'smartwatch', 'camera', 'tablet', 'speaker', 'tv', 'television'];
  for (const category of categories) {
    if (lowercaseQuery.includes(category)) {
      result.category = category === 'phone' ? 'smartphone' : 
                       category === 'tv' ? 'television' : 
                       category;
      break;
    }
  }

  // Extract budget
  const budgetRegex = /under\s+(\d+)k?|(\d+)k?\s+budget|budget\s+(\d+)k?|(\d+)\s*rupees|rs\.?\s*(\d+)/i;
  const budgetMatch = lowercaseQuery.match(budgetRegex);
  
  if (budgetMatch) {
    const budgetValue = parseInt(
      budgetMatch[1] || budgetMatch[2] || budgetMatch[3] || budgetMatch[4] || budgetMatch[5]
    );
    
    // Convert to actual value if 'k' is used (like 30k = 30000)
    if (lowercaseQuery.includes('k') && budgetValue < 1000) {
      result.budget = budgetValue * 1000;
    } else {
      result.budget = budgetValue;
    }
  }

  // Extract feature focus
  const features = ['battery', 'camera', 'performance', 'gaming', 'storage', 'display', 'sound', 'processor', 'ram'];
  for (const feature of features) {
    if (lowercaseQuery.includes(feature)) {
      result.feature = feature;
      break;
    }
  }

  return result;
}; 