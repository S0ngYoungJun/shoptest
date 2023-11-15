const Product = require('../models/Product');

exports.getProducts = async () => {
  try {
    // 데이터베이스에서 모든 제품을 가져옵니다
    const products = await Product.find({}, '_id name price quantity');
    return products; // 응답을 직접 보내는 대신 제품 목록을 반환합니다
  } catch (error) {
    console.error('getProducts에서 오류 발생:', error);
    throw error;
  }
};