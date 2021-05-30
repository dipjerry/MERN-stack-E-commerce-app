const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
// mail transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'coderrat.blog@gmail.com',
        pass: 'Groot@coderrat12'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});
// mailer function 
mailOptions = (email, subject, message) => {
    let mails = {
        from: 'coderrat.blog@gmail.com',
        to: email,
        subject: subject,
        html: message
    };
    return mails;
};

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    let notification = req.flash('successMessage');
    if (notification.length > 0) {
        notification = notification[0];
    } else {
        notification = null;
    }
    console.log(req.flash('successMessage'));
    res.render('auth/login', {
        docTitle: 'Index',
        path: 'index',
        editing: false,
        errorMessage: message,
        notificationMessage: notification,
        oldInput: {
            name: '',
            password: ''
        },
        validationError: []
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    let notification = req.flash('notification');
    if (notification.length > 0) {
        notification = notification[0];
    } else {
        notification = null;
    }
    res.render('auth/signup', {
        docTitle: 'Index',
        path: 'index',
        editing: false,
        errorMessage: message,
        notificationMessage: notification,
        oldInput: {
            email: '',
            name: '',
            password: ''
        },
        validationError: []
    });
};

exports.postLogin = (req, res, next) => {
    const name = req.body.name;
    const password = req.body.password;
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(422).render('auth/login', {
            docTitle: 'Index',
            path: 'index',
            editing: false,
            errorMessage: error.array()[0].msg,
            notificationMessage: '',
            oldInput: {
                name: name,
                password: password
            },
            validationError: error.array()

        });
    }
    User.findOne({ name: name })
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    docTitle: 'Index',
                    path: 'index',
                    editing: false,
                    errorMessage: 'User does not exist!!',
                    notificationMessage: '',
                    oldInput: {
                        name: name,
                        password: password
                    },
                    validationError: [{ param: 'name' }]

                });
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(save => {
                            res.redirect('/');
                        });

                    }
                    return res.status(422).render('auth/login', {
                        docTitle: 'Index',
                        path: 'index',
                        editing: false,
                        errorMessage: 'Password do not match',
                        notificationMessage: '',
                        oldInput: {
                            name: name,
                            password: password
                        },
                        validationError: [{ param: 'password' }]

                    });
                })
                .catch(err => {
                    console.log(err);
                });
        });
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const error = validationResult(req);
    if (!error.isEmpty()) {
        console.log(error.array());
        return res.status(422).render('auth/signup', {
            docTitle: 'Index',
            path: 'index',
            editing: false,
            errorMessage: error.array()[0].msg,
            oldInput: {
                email: email,
                name: name,
                password: password
            },
            validationError: error.array()
        });
    }
    bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                name: name,
                password: hashedPassword,
                cart: { items: [] }
            });
            return user.save();
        })
        .then(mail => {
            res.redirect('/login');
            transporter.sendMail(
                mailOptions(
                    'kaxyapdip@gmail.com',
                    'Sign up successfull',
                    '<h3>dear ' + name + '</h3>you have <b>Signup successfully</b><ul><li>username : ' + name + '</li><li>password' + password + '</li></ul>'),
                (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        // req.session.isLoggedIn = false;
        res.redirect('/login');
    });
};
exports.getPasswordReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        docTitle: 'Password reset',
        path: 'index',
        errorMessage: message
    });
};
exports.postPasswordReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/passwordReset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    console.log('failed');
                    req.flash('error', 'No account with that email found');
                    return res.redirect('/passwordReset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                req.flash('successMessage', 'An email with password reset link has been sent to your  email');
                res.redirect('/login');
                transporter.sendMail(
                    mailOptions(
                        req.body.email,
                        'Password Reset',
                        `
                        <p>You requested for a password resent link</p>
                        <p>click this <a href="http://127.0.0.1:3000/reset/${token}">Link to set a new password</a></p>
                        `
                    ),
                    (error, info) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            });
    });
};

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            let notification = req.flash('notification');
            if (notification.length > 0) {
                notification = notification[0];
            } else {
                notification = null;
            }
            console.log('got 2');
            res.render('auth/newPassword', {
                path: '/new-password',
                docTitle: 'Reset Password',
                errorMessage: message,
                notificationMessage: notification,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.newpassword;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({
            resetToken: passwordToken,
            resetTokenExpiration: { $gt: Date.now() },
            _id: userId
        })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12);
        }).then(
            hashedPassword => {
                resetUser.password = hashedPassword;
                resetUser.resetToken = null;
                resetUser.resetTokenExpiration = undefined;
                return resetUser.save();
            }
        )
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};