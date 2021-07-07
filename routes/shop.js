const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');
router.get('/', shopController.getIndex);
router.get('/shop', shopController.getProduct);
router.post('/cart', isAuth, shopController.postCart);
router.get('/cart', isAuth, shopController.getCart);
router.get('/order', isAuth, shopController.getOrder);
// router.post('/postOrder', isAuth, shopController.postOrder);
router.get('/product/:productId', shopController.getProductDetails);
router.post('/cart-delete-item', isAuth, shopController.cartDeleteItem);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/checkout/success', shopController.getCheckoutSuccess);
router.get('/checkout/cancel', shopController.getCheckout);

// router.post('/checkout', isAuth, shopController.postCheckout);
router.get('/invoice/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
