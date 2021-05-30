const Product = require('../models/product.js');
exports.getProduct = (req, res, next) => {
    Product.findAll().then(products => {
            res.render('shop/shop', {
                prods: products,
                docTitle: 'Index',
                path: 'index',
                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: products.length > 0,
                folder: 'shop'
            });
        })
        .catch(err => {
            console.log(err);
        });
};
exports.getIndex = (req, res, next) => {
    Product.findAll().then(products => {
            res.render('shop/index', {
                prods: products,
                docTitle: 'Index',
                path: 'index',
                hasProduct: products.length > 0,
                folder: 'shop'
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart
                .getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        docTitle: 'Your Cart',
                        hasProduct: products.length > 0,
                        img_url: 'https://loremflickr.com/320/240/',
                        prods: products
                    });
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
                console.log('success success 3');
            }
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                console.log('success success 0');
                return product;
            }
            return Product.findByPk(prodId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            });
        })
        .then(() => {
            console.log('success redirest');
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
    // res.redirect('/product/' + prodId);
};
exports.postCheckout = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {

            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            // console.log(products)
            return req.user
                .createOrder()
                .then(order => {
                    // console.log(order)
                    return order.addProducts(
                        products.map(product => {
                            console.log(product);
                            product.orderItem = { quantity: product.cartItem.quantity };
                            return product;
                        })
                    );
                })
                .then(product => {
                    console.log(product);
                })
                .catch(err => console.log(err));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/order');
        })
        .catch(err => console.log(err));
};
exports.getCheckoutDetails = (req, res, next) => {
    req.user
        .getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders', {
                prods: orders,
                docTitle: 'orders',
                path: 'co',
                folder: 'shop',
                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: orders.length > 0,

            });
        })
        .catch(err => console.log(err));
};
exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    // console.log(product);
    Product.findAll({ where: { id: productId } }).then(products => {
            res.render('shop/product-details', {
                prods: products[0],
                docTitle: 'Shop',
                path: 'Shop',
                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: products.length > 0,
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.cartDeleteItem = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};