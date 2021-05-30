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
const config = require('./config');
const MONGODB_URI = 'mongodb+srv://' + config.mongoUser + ':' + config.mongoPass + '@cluster0.eolis.mongodb.net/ecom';
// Models import
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
// security
const csrf = require('csurf');
// feedbaacks
const flash = require('connect-flash');

const store = new mongoDbStore({
    uri: MONGODB_URI,
    collection: 'session'
});
// adding csrf
const csrfProtection = csrf();

//EJS - templete engines
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// setting up session
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));
// initialise csrf middleware
app.use(csrfProtection);
// initialise notification
app.use(flash());

//user 
app.use((req, res, next) => {
    // console.log("user = ");
    // console.log(req);
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => { console.log(err); });
});
// include csrf token and authorization status in every request
app.use((req, res, next) => {
    res.locals.isLoggedin = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

// get routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.error404);

mongoose.connect(MONGODB_URI)

.then(result => {
        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    })
    .catch(err => console.log(err));