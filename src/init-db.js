const mongoose = require('mongoose');
const Product = require('./models/Product');

async function initProductCollection() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true });

    // Remove all documents from the Product collection
    await Product.deleteMany({});
    
    console.log('Product collection cleared successfully.');
  } catch (error) {
    console.error('Error clearing Product collection:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Call the function to initialize the Product collection
initProductCollection();