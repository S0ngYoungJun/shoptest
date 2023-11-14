const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const orderController = require('../controllers/orderController');

// CORS 설정
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

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
    return next(error); // 응답을 보내지 않고 에러만 전달
  }
});

router.post('/cart/add', async (req, res, next) => {
  try {
    const result = await cartController.addToCart(req, res);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/cart/add:', error);
     next(error); // 응답을 보내지 않고 에러만 전달
  }
});

router.post('/order', async (req, res, next) => {
  try {
    const result = await orderController.createOrder(req, res);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/order:', error);
    next(error); // 에러를 다음 미들웨어로 전달
  }
});

// 에러 핸들링 미들웨어
router.use((err, req, res, next) => {
  if (!res.headersSent) {
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});

module.exports = router;