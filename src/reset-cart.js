const mongoose = require('mongoose');
const Cart = require('./models/Cart');

async function initCartCollection() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true });

    // Remove all documents from the Cart collection
    await Cart.deleteMany({});

    console.log('Cart collection cleared successfully.');
  } catch (error) {
    console.error('Error clearing Cart collection:', error);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

// Call the function to initialize the Cart collection
initCartCollection();