const express = require('express');
const router = express.Router();
const productController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');
const {body} = require('express-validator');
// const products = [];
// /admin/add-product => GET
router.get('/add-product', isAuth, productController.getAddProduct);
// /admin/add-product => POST
router.post('/add-product', [
  body('title').isString().isLength({min: 3}).trim(),
  body('price').isFloat(),
  // body('image').isString(),
  body('description').isLength({min: 10, max: 400}).trim(),
],
isAuth, productController.postAddProduct);

router.get('/edit-product/:productId',
    isAuth,
    productController.getEditProduct);
router.post('/edit-product', [
  body('title').isString().isLength({min: 3}).trim(),
  body('price').isFloat(),
  body('description').isLength({min: 10, max: 400}).trim(),
],
isAuth, productController.postEditProduct);

router.delete('/product/:productId', isAuth, productController.deleteProduct);

// /admin/add-product => POST

router.get('/products', productController.getProducts);
// exports.routes = router;
// exports.products = products;
module.exports = router;
