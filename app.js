const express = require('express');
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 3000;
const app = express();
const path = require('path');
const sequelize = require('./util/database');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error.js');
// Models import
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
//EJS - templete engines
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(
            err => { console.log(err); });
});
// get routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.error404);
// relations setup
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });


sequelize
// .sync({ force: true })
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: ' KaxyapDip',
                email: 'dipjerry6@gmail.com'
            });
        }
        return user;
    })
    .then(user => {
        // console.log(user)
        return user.createCart();

    })
    .then(cart => {
        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    })
    .catch(err => {
        console.log(err);
    });