const express = require('express');
const fs = require('fs');
const https = require('https');
//parsers

const bodyParser = require('body-parser');
const multer = require('multer');
// host and port 
const hostname = '127.0.0.1';
const port = 3000;
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

//routes
const path = require('path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const errorController = require('./controllers/error.js');
const { resolveSoa } = require('dns');
const config = require('./config');
// database
const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.eolis.mongodb.net/${process.env.DEFAULT_DB}`;
// const MONGODB_URI = `mongodb+srv://groot:grootMongo12@cluster0.eolis.mongodb.net/ecom`;
app.use(helmet());
app.use(compression());
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flag: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));
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

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');
//EJS - templete engines
app.set('view engine', 'ejs');
app.set('views', 'views');
//using parser 

// disk object
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname.replace(/\s/g, '_'));
    }
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// text only
app.use(bodyParser.urlencoded({ extended: false }));
// multiple
// app.use(
//     multer({ dest: 'images' }).single('image')
// );
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
// app.use(
//     multer().single('image')
// );

// static folder info
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

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
mongoose.set('useUnifiedTopology', true);
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
    .then(result => {
        https.createServer({key : privateKey , cert : certificate},app)
        .listen(process.env.PORT || 3000, hostname, () => {
            console.log(`Server running at http://${hostname}:${process.env.PORT || 3000}/`);
        });
    })
    .catch(err => console.log(err));