const express = require('express')
const bodyParser = require('body-parser')
const hostname = '127.0.0.1'
const port = 3000
const app = express()
const path = require('path')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const errorController = require('./controllers/error.js')
    //PUG
    // which templete engines to use and where to finds the templete 
    // app.set('view engine', 'pug'); // templete engine 
    // app.set('views', 'views'); // the templet folder

//HANDLEBARS
// const expressHbs = require('express-handlebars');
// app.engine(
//     'hbs',
//     expressHbs({
//         layoutsDir: 'views/layout/',
//         defaultLayout: 'main-layout',
//         extname: 'hbs'
//     })
// );
// app.set('view engine', 'hbs')
// app.set('views', 'views')

//EJS
app.set('view engine', 'ejs');
app.set('views', 'views');
// db.execute('SELECT * FROM  products')
//     .then(result => {
//         console.log(result);
//     })
//     .catch(err => {
//         console.log(err);
//     });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/admin', adminData.routes);
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.error404);
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});