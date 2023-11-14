const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const userId = req.user; // Assuming you have user authentication middleware
    const cart = await Cart.findOne({ user: userId }).populate('items.product','_id name price');
    if (!res.headersSent) {
      res.json(cart || { items: [], total: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user; // 사용자 인증 미들웨어가 있다고 가정

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
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
    console.log('Successfully added to cart')
    if (!res.headersSent) {
      res.json({ message: '상품이 장바구니에 성공적으로 추가되었습니다.' });
    }
  } catch (error) {
    console.error('addToCart에서 오류:', error);
    return res.status(500).json({ error: '내부 서버 오류', message: error.message });
  }
};