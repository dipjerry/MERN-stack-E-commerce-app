// const products = [];
const Cart = require('./cart');
const random = Math.floor(Math.random() * (2009999 - 2000001 + 1) + 2000001);
const db = require('../util/database')
module.exports = class Product {

    constructor(id, title, price, description) {
        this.id = random.toString();
        // this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
    }
    save() {
        db.execute('INSERT INTO products (title , description , prods_id , price) value (? , ?, ? ,?)', [
            this.title, this.description, this.id, this.price
        ]);
    }

    static deleteById(id) {}

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    }
};