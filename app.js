const express = require('express');
//parsers

const bodyParser = require('body-parser');
const multer = require('multer');
// host and port 
const hostname = '127.0.0.1';
const port = 3000;
const app = express();
//routes
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error.js');
const { resolveSoa } = require('dns');
// database
const MONGODB_URI = 'mongodb+srv://groot:grootMongo12@cluster0.eolis.mongodb.net/ecom';
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
//using parser 
// text only
app.use(bodyParser.urlencoded({ extended: false }));
// multiple
// app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
// static folder info
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
// disk object 
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimitype === 'image/jpg' || file.mimitype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
// initialise notification
app.use(flash());
// include csrf token and authorization status in every request
app.use((req, res, next) => {
    res.locals.isLoggedin = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});
//user 
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next(); // pass without user
            }
            req.user = user;
            next();
        })
        .catch(err => { next(new Error(err)); });
});
// get routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.get('/500', errorController.error500);
app.use(errorController.error404);

app.use((error, req, res, next) => {
    res.redirect('/500');
    res.status(500).render('500', {
        docTitle: 'Error 500 Page not found',
        path: '/500',
        folder: 'error',
        isLoggedin: req.session.isLoggedIn
    });
});
mongoose.connect(MONGODB_URI)

.then(result => {
        app.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    })
    .catch(err => console.log(err));