const Product = require('../models/product');
const mongodb = require('mongodb');
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        docTitle: 'Add Product',
        path: 'add_product',
        folder: 'admin',
        editing: false,
        isLoggedin: req.session.isLoggedIn
    });
};
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        price: price,
        description: description,
        userId: req.user
    });
    product.save()
        .then(result => {
            console.log('product Added');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/product', {
                prods: products,
                docTitle: 'Admin',
                path: 'admin',
                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: products.length > 0,
                isLoggedin: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/add-product', {
                docTitle: 'Edit Product',
                path: 'add_product',
                folder: 'admin',
                editing: editMode,
                product: product,
                isLoggedin: req.session.isLoggedIn
            });
        })
        .catch(err => {
            console.log(err);
        });
};
exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findById(id).then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
            // product.userId = req.user;
            return product.save();
        })
        .then(result => {
            console.log('Updated Product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/products');
        });
};

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.findByIdAndRemove(id)
        .then(result => {
            console.log('Product destoyed');
        })
        .catch(err => {
            console.log(err);
        });
    res.redirect('/admin/products');
};