const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 100, // 초기 재고는 100개로 설정
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;