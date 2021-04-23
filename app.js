const express = require('express');
const bodyParser = require('body-parser');
const hostname = '127.0.0.1';
const port = 3000;
const app = express();
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error.js');
const { resolveSoa } = require('dns');
// Models import
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');
//EJS - templete engines
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// user selection
app.use((req, res, next) => {
    User.getUserById('60806bc9a38984090f780515')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(
            err => { console.log(err); });
});
// get routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.error404);


mongoConnect(() => {
    // console.log(client);
    app.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });
});