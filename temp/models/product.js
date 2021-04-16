// // const products = [];
// const path = require('path')
// const fs = require('fs')
// const dir = require('../util/path');
// const Cart = require('./cart');
// const { json } = require('body-parser');
// const p = path.join(dir, 'data', 'products.json')
// const random = Math.floor(Math.random() * (2009999 - 2000001 + 1) + 2000001);
// const getProductsFromFile = cb => {
//     fs.readFile(p, (err, fileContent) => {
//         if (err) {
//             return cb([]);
//         } else { cb(JSON.parse(fileContent)); }
//     })
// }
// module.exports = class Product {

//     constructor(id, title, price, description) {

//         this.id = id;
//         this.title = title;
//         this.price = price;
//         this.description = description;
//     }
//     save() {
//         getProductsFromFile(products => {
//             if (this.id) {
//                 const existingProductIndex = products.findIndex(
//                     prod => prod.id === this.id
//                 );
//                 const updatedProducts = [...products];
//                 updatedProducts[existingProductIndex] = this;
//                 fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//                     console.log(err);
//                 });
//             } else {
//                 this.id = random.toString();
//                 products.push(this);
//                 fs.writeFile(p, JSON.stringify(products), err => {
//                     console.log(err);
//                 });
//             }
//         });
//     }

//     static deleteById(id) {
//         getProductsFromFile(products => {
//             const product = products.find(prod => prod.id === id);
//             const updatedProducts = products.filter(prod => prod.id !== id);
//             fs.writeFile(p, JSON.stringify(updatedProducts), err => {
//                 if (!err) {
//                     console.log('delete cart');
//                     Cart.deleteProduct(id, product.price);
//                 }
//             });
//         });
//     }

//     static fetchAll(cb) {
//         getProductsFromFile(cb);
//     }

//     static findById(id, cb) {
//         getProductsFromFile(products => {
//             const product = products.find(p => p.id === id);
//             cb(product);
//         });
//     }
// };
const Sequelize = require('sequelize');
const sequelize = require('../util/database')

const Product = sequelize.define('product', {

})