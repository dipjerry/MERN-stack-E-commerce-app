const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        docTitle: 'Add Product',
        path: 'add_product',
        folder: 'admin',
        editing: false
    });
};
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null, title, price, description);
    product.save();
    res.redirect('/shop');
};
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/add-product', {
            docTitle: 'Edit Product',
            path: 'add_product',
            folder: 'admin',
            editing: editMode,
            product: product
        });
    });
};
exports.postEditProduct = (req, res, next) => {
    const id = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    const updatedProduct = new Product(id, updatedTitle, updatedPrice, updatedDescription);
    updatedProduct.save();
    res.redirect('/admin/products');
};
exports.deleteProduct = (req, res, next) => {
    const id = req.body.productId;
    Product.deleteById(id);
    res.redirect('/admin/products');
};



exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('admin/product', {
            prods: products,
            docTitle: 'shop',
            path: 'shop',
            hasProduct: products.length > 0,
            img_url: 'https://loremflickr.com/320/240/',
            folder: 'admin'
        });
    });
};