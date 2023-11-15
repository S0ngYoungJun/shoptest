const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');


router.get('/products', async (req, res, next) => {
  try {
    const products = await productController.getProducts(req, res);
    res.json(products);
  } catch (error) {
    console.error('/api/products에서 오류 발생:', error);
    next(error); // 에러를 다음 미들웨어로 전달합니다
  }
});

router.get('/cart', async (req, res, next) => {
  try {
    const cart = await cartController.getCart(req, res);
    res.json(cart);
  } catch (error) {
    console.error('Error in /api/cart:', error);
    if (!res.headersSent) {
      // 응답을 보내지 않은 경우에만 에러 응답을 보냅니다.
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
    next(error);
  }
});

router.post('/cart/add', async (req, res, next) => {
  try {
    const result = await cartController.addToCart(req, res);
    res.json(result);
  } catch (error) {
    console.error('/api/cart/add에서 오류 발생:', error);
    if (!res.headersSent) {
      // 응답을 보내지 않은 경우에만 에러 응답을 보냅니다.
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
    next(error);
  }
});

router.post('/order', async (req, res, next) => {
  try {
    const result = await orderController.createOrder(req, res);
    // checkout.html로 리디렉션
    res.redirect('/public/checkout.html');
  } catch (error) {
    console.error('/api/order에서 오류 발생:', error);
    next(error); // 에러를 다음 미들웨어로 전달
  }
});

// 에러 핸들링 미들웨어
// router.use((err, req, res, next) => {
//   if (!res.headersSent) {
//     res.status(500).json({ error: 'Internal Server Error', message: err.message });
//   }
// });

module.exports = router;