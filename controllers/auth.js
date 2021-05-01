const User = require('../models/user');
const bcrypt = require('bcryptjs');
exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        docTitle: 'Index',
        path: 'index',
        editing: false,
        errorMessage: message
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        docTitle: 'Index',
        path: 'index',
        editing: false,
        errorMessage: message
    });
};

exports.postLogin = (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    User.findOne({ name: name })
        .then(user => {
            if (!user) {
                req.flash('error', 'User does not exist!!');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Password do not match!!');
                    res.redirect('/login');

                })
                .catch(err => {
                    console.log(err);
                    // return res.redirect('/login');
                });
        });
};
exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ name: name })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'This user name is already taken');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        name: name,
                        password: hashedPassword,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(result => {
                    res.redirect('/login');
                });
        })
        .catch(err => console.log(err));
};
exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        // req.session.isLoggedIn = false;
        res.redirect('/login');
    });
};