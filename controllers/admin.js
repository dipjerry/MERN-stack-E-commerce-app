const Product = require('../models/product');
const mongodb = require('mongodb');
const { validationResult } = require('express-validator/check');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        docTitle: 'Add Product',
        path: 'add_product',
        folder: 'admin',
        hasError: false,
        editing: false,
        errorMessage: null,
        validationError: null
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const error = validationResult(req);
    if (!error.isEmpty()) {

        return res.status(422).render('admin/add-product', {
            docTitle: 'Edit Product',
            path: 'add_product',
            folder: 'admin',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: error.array()[0].msg,
            validationError: error.array()
        });
    }
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then(products => {
            res.render('admin/product', {
                prods: products,
                docTitle: 'Admin',
                path: 'admin',

                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: products.length > 0,
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
                hasError: false,
                errorMessage: null,
                product: product,
                validationError: null
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).render('admin/add-product', {
            docTitle: 'Edit Product',
            path: 'add_product',
            folder: 'admin',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDescription,
                _id: id
            },
            errorMessage: error.array()[0].msg,
            validationError: error.array()

        });
    }
    Product.findById(id).then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/admin/products');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDescription;
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
    res.redirect('/admin/products');
};