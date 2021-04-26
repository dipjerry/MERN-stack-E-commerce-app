exports.getLogin = (req, res, next) => {
    res.render('shop/login', {
        prods: products,
        docTitle: 'Index',
        path: 'index',
        hasProduct: products.length > 0,
        folder: 'shop'
    });
};