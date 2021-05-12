const express = require('express');
const { check, body } = require('express-validator/check');
const router = express.Router();
const authController = require('../controllers/auth');
const User = require('../models/user');
// login routes
router.get('/login', authController.getLogin);
router.post('/login', [
    body('password', 'Password has to be valid')
    .isLength({ min: 5 })
    .isAlphanumeric()
    .trim()
], authController.postLogin);

// signup routes
router.get('/signup', authController.getSignup);
router.post(
    '/signup', [
        check('email').isEmail().withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
            // if (value === 'test@gmail.com') {
            //     throw new Error('This email is forbideen');
            // }
            return User.findOne({ email: value })
                .then(userDoc => {
                    if (userDoc) {
                        // req.flash('error', 'This email is already taken');
                        // return res.redirect('/signup');
                        return Promise.reject('É-mail already exist , please select a different one.');
                    }
                });
        })
        .normalizeEmail(),
        body('password', 'Password must contain minimum 5 alphanumeric character')
        .isLength({ min: 5 })
        .isAlphanumeric().trim(),
        body('confirmPassword')
        .trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password doesnot match!!');
            }
            return true;
        }),

    ],
    authController.postSignup
);
router.post('/logout', authController.postLogout);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
router.get('/passwordReset', authController.getPasswordReset);
router.post('/passwordReset', authController.postPasswordReset);


module.exports = router;
module.exports = router;