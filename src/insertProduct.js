const mongoose = require('mongoose');
const Product = require('./models/Product'); // 모델 경로에 맞게 수정

mongoose.connect('mongodb://127.0.0.1:27017/shop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async() => {
    await Product.deleteMany({})
    const productsData = [
      { name: 'Product 1', price: 30, quantity: 100 },
      { name: 'Product 2', price: 25, quantity: 100 },
      { name: 'Product 3', price: 40, quantity: 100 },
      { name: 'Product 4', price: 15, quantity: 100 },
      { name: 'Product 5', price: 50, quantity: 100 },
      { name: 'Product 6', price: 35, quantity: 100 },
      { name: 'Product 7', price: 22, quantity: 100 },
      { name: 'Product 8', price: 45, quantity: 100 }
    ];

    return Product.insertMany(productsData);
  })
  .then(() => {
    console.log('Products inserted successfully.');
    mongoose.connection.close();
  })
  .catch(error => {
    console.error('Error inserting products:', error);
    mongoose.connection.close();
  });