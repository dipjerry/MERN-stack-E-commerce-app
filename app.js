const express = require('express');
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 3000;
const app = express();
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error.js');
const { resolveSoa } = require('dns');
// Models import
// const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
const mongoose = require('mongoose');

//EJS - templete engines
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//user 
app.use((req, res, next) => {
    User.findById('6083e27398dcbd02940b4fbb')
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
app.use(authRoutes);
app.use(errorController.error404);

mongoose.connect('mongodb+srv://groot:grootMongo12@cluster0.eolis.mongodb.net/ecom?retryWrites=true&w=majority')

.then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Dip',
                    email: 'kaxyapdip@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });

        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    })
    .catch(err => console.log(err));