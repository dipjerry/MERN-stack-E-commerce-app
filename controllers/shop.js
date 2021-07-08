const Product = require('../models/product');
const Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const staticPath = require('../util/path');
const ITEMS_PER_PAGE = 3;
const stripe = require('stripe')(process.env.STRIPE_SK);

exports.getProduct = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems = 0;
  Product.find().countDocuments().then((numProducts) => {
    totalItems = numProducts;
    return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
  })
      .then((products) => {
        res.render('shop/shop', {
          prods: products,
          docTitle: 'Index',
          path: 'index',
          img_url: 'https://loremflickr.com/320/240/',
          hasProduct: products.length > 0,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          hasPreviousPage: page > 1,
          previousPage: page - 1,
          nextPage: page + 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render('shop/index', {
      prods: products,
      docTitle: 'Index',
      path: 'index',
      hasProduct: products.length > 0,
    });
  })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)
      .then((product) => {
        res.render('shop/product-details', {
          prods: product,
          docTitle: 'Shop',
          path: 'Shop',
          img_url: 'https://loremflickr.com/320/240/',
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getCart = (req, res, next) => {
  req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then((user) => {
        const products = user.cart.items;
        res.render('shop/cart', {
          path: '/cart',
          docTitle: 'Your Cart',
          hasProduct: products.length > 0,
          img_url: 'https://loremflickr.com/320/240/',
          prods: products,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
      .then((product) => {
        return req.user.addToCart(product);
      })
      .then((result) => {
        res.redirect('/cart');
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then((user) => {
        products = user.cart.items;
        // let total = 0;
        products.forEach((p) => {
          total += p.quantity * p.productId.price;
        });
        console.log('hello');
        console.log(user);
        return stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: products.map((p) => {
            return {
              name: p.productId.title,
              description: p.productId.description,
              amount: p.productId.price * 100,
              currency: 'inr',
              quantity: p.quantity,
            };
          }),
          success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
          cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',

        });
      })
      .then((session) => {
        res.render('shop/checkout', {
          path: '/checkout',
          docTitle: 'checkout',
          hasProduct: products.length > 0,
          img_url: 'https://loremflickr.com/320/240/',
          prods: products,
          totalSum: total,
          sessionId: session.id,
          stripe_pk: process.env.STRIPE_PK,
        });
      })
      .catch((err) => {
        console.log('err');
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then((user) => {
        const products = user.cart.items.map((i) => {
          return {quantity: i.quantity, product: {...i.productId._doc}};
        });
        const order = new Order({
          user: {
            name: req.user.name,
            userId: req.user,
          },
          products: products,
        });

        return order.save();
      })
      .then((result) => {
        return req.user.clearCart();
      })
      .then(() => {
        res.redirect('/order');
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getOrder = (req, res, next) => {
  Order.find({'user.userId': req.user._id})
      .then((orders) => {
        console.log('orders = ');
        console.log(orders);
        res.render('shop/orders', {
          prods: orders,
          docTitle: 'orders',
          path: 'co',
          img_url: 'https://loremflickr.com/320/240/',
          hasProduct: orders.length > 0,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.cartDeleteItem = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
      .removeFromCart(prodId)
      .then((result) => {
        res.redirect('/cart');
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId).then((order) => {
    console.log(order);
    if (!order) {
      return next(new Error('No order found'));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoice', invoiceName);
    const fonts = {
      Roboto: {
        normal: path.join(staticPath, 'public', 'fonts', 'Roboto-Regular.ttf'),
        bold: path.join(staticPath, 'public', 'fonts', 'Roboto-Medium.ttf'),
        italics: path.join(staticPath, 'public', 'fonts', 'Roboto-Italic.ttf'),
        bolditalics: path.join(staticPath, 'public',
            'fonts', 'Roboto-MediumItalic.ttf'),
      },
    };

    const PdfPrinter = require('pdfmake/src/printer');
    const printer = new PdfPrinter(fonts);

    const bodyData = [
      [{text: 'Product',
        style: 'subheader2'},
      {text: 'Quantity',
        style: 'subheader2'},
      {text: 'Price',
        style: 'subheader2'},
      {text: 'Total Price',
        style: 'subheader2'}],
    ];
    let totalPrice = 0;

    order.products.forEach((prod) => {
      totalPrice = totalPrice + (prod.quantity * prod.product.price);
      const dataRow = [];
      dataRow.push({text: prod.product.title, alignment: 'left'});
      dataRow.push(prod.quantity);
      dataRow.push(prod.product.price);
      dataRow.push(prod.product.price * prod.quantity);
      bodyData.push(dataRow);
    });
    const GST = ((totalPrice * 18) / 100);

    bodyData.push(['', '',
      {text: 'Subtotal', bold: true}, {text: totalPrice, bold: true}]);
    bodyData.push(['', '',
      {text: 'GST', italic: true}, {text: GST, italic: true}]);
    bodyData.push(['', '',
      {text: 'Total', bold: true}, {text: totalPrice + GST, bold: true}]);
    const docDefinition = {
      content: [{
        image: path.join(staticPath, 'public', 'images', 'logo_opt.png'),
        // 'data:image/jpeg;base64,...encodedContent...',
        fit: [80, 80],
        margin: [0, -20, 10, 0],
        alignment: 'justify',
      },
      {
        text: 'NodeEcom',
        fontSize: 14,
        alignment: 'right',
        bold: true,
        margin: [50, -80, 10, 16],
      },
      {
        text: 'Online market',
        fontSize: 10,
        alignment: 'right',
        margin: [50, -20, 10, 16],
      },
      {
        text: 'Invoice',
        fontSize: 14,
        alignment: 'justify',
        bold: true,
        decoration: 'underline',
        margin: [0, 70, 0, 16]},
      {
        text: 'Order id : ' + orderId,
        fontSize: 14,
        alignment: 'justify',
        bold: true,
        margin: [0, 0, 0, 16],
      },
      {
        text: 'Order date : ' + order.order_date,
        fontSize: 14,
        alignment: 'justify',
        italic: true,
        margin: [0, -10, 0, 16]},
      {
        style: 'tableExample',

        table: {
          widths: ['25%', '25%', '25%', '25%'],
          headerRows: 1,
          body: bodyData,
        },
        layout: 'noBorders',
      },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subRows: {
          alignment: 'center',

        },
        subheader2: {
          bold: true,
          fillColor: '#ae0000',
          padding: 5,
          color: 'white',
          alignment: 'center',
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableOpacityExample: {
          margin: [0, 5, 0, 15],
          fillColor: 'blue',
          fillOpacity: 0.3,
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'red',
        },
      },
      defaultStyle: {
        alignment: 'center',
      },
    };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
        'Content-Disposition',
        'inline;filename="' + invoiceName + '"');
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.end();
  }).catch((err) => next(err));
};
