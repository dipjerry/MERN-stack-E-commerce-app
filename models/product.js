const getdb = require('../util/database').getDb;
const mongo = require('mongodb');
class Product {
    constructor(title, price, description, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this._id = id ? new mongo.ObjectID(id) : null;
        this.userId = userId;
    }
    save() {
        const db = getdb();
        let dbOp;
        if (this._id) {
            console.log("got id");
            dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this });

        } else {
            console.log("no id");
            console.log(this);
            dbOp = db.collection('products').insertOne(this);
        }
        return dbOp
            .then(
                // result => console.log(result)
            )
            .catch(
                err => console.log(err)
            );

    }

    static deleteById(prodId) {
        const db = getdb();
        return db.collection('products').deleteOne({ _id: new mongo.ObjectID(prodId) })
            .then(result => console.log("Product deleted"))
            .catch(err => console.log(err));
    }
    static fetchAll() {
        const db = getdb();
        return db.collection('products').find().toArray()
            .then(products => {
                // console.log(products);
                return products;
            })
            .catch(err => console.log(err));
    }

    static findById(prodId) {
        const db = getdb();
        return db.collection('products').find({ _id: new mongo.ObjectID(prodId) }).next()
            .then(product => {
                console.log(product);
                return product;
            })
            .catch(err => console.log(err));
    }
}

module.exports = Product;