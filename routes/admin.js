const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');
const products = [];
// /admin/add-product => GET
router.get('/add-product', productController.getAddProduct);
// /admin/add-product => POST
router.post('/add-product', productController.postAddProduct);

router.get('/edit-product/:productId', productController.getEditProduct);
router.post('/edit-product', productController.postEditProduct);
router.post('/delete-product', productController.deleteProduct);
// /admin/add-product => POST

router.get('/products', productController.getProducts);
exports.routes = router;
exports.products = products;
module.exports = router;