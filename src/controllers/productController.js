const Product = require('../models/Product');

exports.getProducts = async () => {
  try {
    await Product.deleteMany({});
    const productsData = [
      { name: 'Product 1', price: 30 },
      { name: 'Product 2', price: 25 },
      { name: 'Product 3', price: 40 },
      { name: 'Product 4', price: 15 },
      { name: 'Product 5', price: 50 },
      { name: 'Product 6', price: 35 },
      { name: 'Product 7', price: 22 },
      { name: 'Product 8', price: 45 },
    ];
    await Product.insertMany(productsData);

    return productsData; // 응답을 직접 보내는 대신 제품을 반환합니다
  } catch (error) {
    console.error('getProducts에서 오류 발생:', error);
    throw error;
  }
};