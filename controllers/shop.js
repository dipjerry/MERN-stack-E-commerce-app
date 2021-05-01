const Product = require('../models/product');
const Order = require('../models/order');

exports.getProduct = (req, res, next) => {
    Product.find().then(products => {
            res.render('shop/shop', {
                prods: products,
                docTitle: 'Index',
                path: 'index',
                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: products.length > 0,
                // isLoggedin: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.find().then(products => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Index',
                path: 'index',
                hasProduct: products.length > 0,
                // isLoggedin: req.session.isLoggedIn,
                // csrfToken: req.csrfToken()
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-details', {
                prods: product,
                docTitle: 'Shop',
                path: 'Shop',
                img_url: 'https://loremflickr.com/320/240/',
                // isLoggedin: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            console.log(user.cart.items);
            res.render('shop/cart', {
                path: '/cart',
                docTitle: 'Your Cart',
                hasProduct: products.length > 0,
                img_url: 'https://loremflickr.com/320/240/',
                prods: products,
                // isLoggedin: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.postCheckout = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: {...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products: products
            });

            console.log(order);
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();

        })
        .then(() => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
};

exports.getCheckoutDetails = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id })
        .then(orders => {
            console.log("orders = ");
            console.log(orders);
            res.render('shop/orders', {
                prods: orders,
                docTitle: 'orders',
                path: 'co',
                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: orders.length > 0,
                // isLoggedin: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};

exports.cartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};