const express = require('express');
const router = express.Router();
const productController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
// const products = [];
// /admin/add-product => GET
router.get('/add-product', isAuth, productController.getAddProduct);
// /admin/add-product => POST
router.post('/add-product', isAuth, productController.postAddProduct);

router.get('/edit-product/:productId', isAuth, productController.getEditProduct);
router.post('/edit-product', isAuth, productController.postEditProduct);
router.post('/delete-product', isAuth, productController.deleteProduct);

// /admin/add-product => POST

router.get('/products', productController.getProducts);
// exports.routes = router;
// exports.products = products;
module.exports = router;