const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  const { items, total } = req.body;
  const userId = req.user; // 사용자 인증 미들웨어가 있다고 가정

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      // res.json을 호출하지 않고 일찍 반환
      return res.status(400).json({ error: '장바구니가 비어 있습니다.' });
    }

    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({ product: item.product, quantity: item.quantity })),
      total,
    });

    await order.save();
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    // 주문이 저장되고 카트가 업데이트된 후에 응답을 보냅니다.
    res.json({ message: '주문이 성공적으로 완료되었습니다.' });
  } catch (error) {
    res.status(500).json({ error: '내부 서버 오류' });
  }
};