exports.error404 = (req, res, next) => {
<<<<<<< HEAD
    res.status(404).render('404', { docTitle: 'Error 404 Page not found', path: '/404', folder: 'error' });
}
=======
    res.status(404).render('404', {
        docTitle: 'Error 404 Page not found',
        path: '/404',
        folder: 'error',
        isLoggedin: req.session.isLoggedIn
    });
};
exports.error500 = (req, res, next) => {
    res.status(500).render('500', {
        docTitle: 'Error 500 Page not found',
        path: '/500',
        folder: 'error',
        isLoggedin: req.session.isLoggedIn
    });
};
>>>>>>> 91cfbb6e3c98144217752bae3eb0b68726326acf
