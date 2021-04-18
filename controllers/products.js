const Product = require('../models/product');
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        docTitle: 'Add Product',
        path: 'add_product',
        folder: 'admin',
        editing: false
    });
}
exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const price = req.body.price
    const description = req.body.description
    req.user.createProduct({
            title: title,
            price: price,
            description: description
        })
        .then(result => {
            console.log('product Added')
            res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })
}
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    // Product.findPk(prodId)
    req.user
        .getProducts({ where: { id: prodId } })
        .then(products => {
            const product = products[0]
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
        })
        .catch(err => {
            console.log(err)
        })
}
exports.postEditProduct = (req, res, next) => {
        const id = req.body.productId
        const updatedTitle = req.body.title
        const updatedPrice = req.body.price
        const updatedDescription = req.body.description
            // Product.findAll({ where: { id: id } })
        Product.findByPk(id)
            .then(product => {
                product.id = id;
                product.title = updatedTitle;
                product.price = updatedPrice;
                product.description = updatedDescription;
                return product.save();
            })
            .then(result => {
                console.log('Updated Product');
                res.redirect('/admin/products')
            })
            .catch(err => {
                console.log(err);
                res.redirect('/admin/products')
            })
    }
    // exports.postEditProduct = (req, res, next) => {
    //     const prodId = req.body.productId;
    //     const updatedTitle = req.body.title;
    //     const updatedPrice = req.body.price;
    //     const updatedImageUrl = req.body.imageUrl;
    //     const updatedDesc = req.body.description;
    //     Product.findById(prodId)
    //         .then(product => {
    //             product.title = updatedTitle;
    //             product.price = updatedPrice;
    //             product.description = updatedDesc;
    //             product.imageUrl = updatedImageUrl;
    //             return product.save();
    //         })
    //         .then(result => {
    //             console.log('UPDATED PRODUCT!');
    //             res.redirect('/admin/products');
    //         })
    //         .catch(err => console.log(err));
    // };

exports.deleteProduct = (req, res, next) => {
    const id = req.body.productId
        // Product.deleteById(id);
    Product.findByPk(id)
        .then(product => {
            return product.destroy()
        })
        .then(result => {
            console.log('Product destoyed')
                // res.redirect('/admin/products')
        })
        .catch(err => {
            console.log(err)
        })

    res.redirect('/admin/products');
}
exports.getProducts = (req, res, next) => {
    req.user
        .getProducts()
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
            console.log(err)
        });
}