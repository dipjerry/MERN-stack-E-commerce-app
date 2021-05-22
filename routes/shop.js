const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
router.get('/', shopController.getIndex);
router.get('/shop', shopController.getProduct);
router.post('/cart', isAuth, shopController.postCart);
router.get('/cart', isAuth, shopController.getCart);
router.get('/order', isAuth, shopController.getCheckoutDetails);
router.post('/checkout', isAuth, shopController.postCheckout);
router.get('/product/:productId', shopController.getProductDetails);
router.post('/cart-delete-item', isAuth, shopController.cartDeleteItem);
router.get('/invoice/:orderId', isAuth, shopController.getInvoice);

module.exports = router;