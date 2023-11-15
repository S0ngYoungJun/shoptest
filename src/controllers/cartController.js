const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user
    const cart = await Cart.findOne({ user: userId }).populate('items.product','_id name price quantity');
    if (!res.headersSent) {
      res.json(cart || { items: [], total: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ error: '유효하지 않은 상품 ID입니다.' });
  }

  // quantity가 숫자인지 확인
  if (isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: '유효하지 않은 수량입니다.' });
  }
  
  try {
    const product = await Product.findOneAndUpdate(
      { _id: productId, quantity: { $gte: quantity } }, // 수량이 0보다 큰 경우에만 업데이트
      { $inc: { quantity: -quantity  } }, // 수량 1 감소
      { new: true } // 업데이트 이후의 문서 반환
    );
  
    if (!product) {
      return res.status(400).json({ error: '상품을 찾을 수 없거나 수량이 부족합니다.' });
    }

    let cart = await Cart.findOne({ user: userId })
    
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }
    // 재고 확인
    if (product.quantity < quantity) {
      return res.status(400).json({ error: '상품 재고가 부족합니다.' });
    }

    const existingItem = cart.items.find(item => String(item.product) === String(productId));

    if (existingItem) {
      // 상품이 이미 카트에 있는 경우 수량을 업데이트
      existingItem.quantity += quantity;
    } else {
      // 새로운 상품 추가
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    // 서버 응답 전에 로컬 카트에 상품 추가


    // 서버 응답을 받은 후에 로컬 카트에 상품 추가
    const updatedCartResponse = await fetch('http://localhost:3000/api/cart');
    const updatedCart = await updatedCartResponse.json();
    displayCart(updatedCart);
    res.json({ message: '상품이 성공적으로 추가되었습니다.', cart });
    }catch (error) {
    console.error('addToCart에서 오류:', error);
    return res.status(500).json({ error: '내부 서버 오류', message: error.message });
    }};