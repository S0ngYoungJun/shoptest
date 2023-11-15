const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  const { items} = req.body;
  const userId = mongoose.Types.ObjectId(req.user);

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      // res.json을 호출하지 않고 일찍 반환
      return res.status(400).json({ error: '장바구니가 비어 있습니다.' });
    }
    const total = calculateTotal(cart.items);
    const order = new Order({
      user: userId,
      items: cart.items.map(item => ({ productId: item.product, quantity: item.quantity })),
      total,
    });
    // 주문 저장
    await order.save();

    // 카트 업데이트 (기존 카트 아이템 삭제)
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

    // 주문이 저장되고 카트가 업데이트된 후에 응답을 보냅니다.
    res.json({ message: '주문이 성공적으로 완료되었습니다.' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
};