const Product = require('../models/product');
const mongodb = require('mongodb');
const { validationResult } = require('express-validator');
const fileHelper = require('../util/file');
const ITEMS_PER_PAGE = 5;


exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        docTitle: 'Add Product',
        path: 'add_product',
        folder: 'admin',
        hasError: false,
        editing: false,
        errorMessage: null,
        validationError: []
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file;
    const error = validationResult(req);

    console.log(image);
    if (!image) {
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
            errorMessage: 'attached image is not an image',
            validationError: []
        });
    }
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
    const imageUrl = image.path;
    const product = new Product({
        title: title,
        price: price,
        imageurl: imageUrl,
        description: description,
        userId: req.user
    });
    console.log(product);
    product.save()
        .then(result => {
            console.log('product Added');
            res.redirect('/admin/products');
        })

    .catch(err => {
        // console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};

exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems = 0;
    Product.find().countDocuments().then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('admin/product', {
                prods: products,
                docTitle: 'Admin',
                path: 'admin',

                img_url: 'https://loremflickr.com/320/240/',
                hasProduct: products.length > 0,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                previousPage: page - 1,
                nextPage: page + 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)

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
                validationError: []
            });
        })
        .catch(err => {
            console.log(err);
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
    // const updatedImage = req.file;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error);
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
            if (image) {
                fileHelper.deleteFile(product.imageurl);
                product.image = updatedImage.path;
            }
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
    const id = req.params.productId;
    Product.findById(id).then(product => {
            if (!product) {
                return next(new Error('Product not found'));
            }
            fileHelper.deleteFile(product.imageurl);
            return Product.findByIdAndRemove(id);
        })
        .then(() => {
            console.log('Product destoyed');
            res.status(200).json({ message: "success!" });
        })
        .catch(err => {
            res.status(500).json({ message: "Deleteing product failed." });
        });
};