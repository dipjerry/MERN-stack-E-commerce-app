const Product = require('../models/product.js');
const Cart = require('../models/cart.js');
exports.getProduct = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/shop', {
            prods: products,
            docTitle: 'shop',
            path: 'shop',
            hasProduct: products.length > 0,
            img_url: 'https://loremflickr.com/320/240/',
            folder: 'shop'
        });
    });
};

exports.getIndex = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            docTitle: 'shop',
            path: 'shop',
            folder: 'shop',
            hasProduct: products.length > 0,

        });
    });
};
exports.getCart = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/cart', {
            prods: products,
            docTitle: 'Cart',
            path: 'cart',
            hasProduct: products.length > 0,
            folder: 'shop'
        });
    });
};
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price);
    });
    // res.redirect('/product/' + prodId);
    res.redirect('/cart');
};

exports.getCheckout = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/checkOut', {
            prods: products,
            docTitle: 'Checkout',
            path: 'checkout',
            hasProduct: products.length > 0,
        });
    });
};
exports.getCheckoutDetails = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('shop/checkOut', {
            prods: products,
            docTitle: 'Checkout',
            path: 'co',
            folder: 'shop',
            hasProduct: products.length > 0,
        });
    });
};
exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    // console.log(product);
    Product.findById(productId, product => {
        console.log(product);
        res.render('shop/product-details', {
            prods: product,
            docTitle: 'Product Details',
            path: 'Product_Dvetails',
            folder: 'product',
            img_url: 'https://loremflickr.com/320/240/',

        });
    });
};

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(prods => prods.id === product.id);
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty });
                }
            }

            res.render('shop/cart', {
                path: '/cart',
                docTitle: 'Cart',
                products: cartProducts,
                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: cartProducts.length > 0
            });
        });
    });

};
exports.cartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    console.log(prodId);
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    });
};