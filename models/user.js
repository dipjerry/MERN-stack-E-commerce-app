const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(items => {
        return items.productId.toString() != productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};
module.exports = mongoose.model('User', userSchema);
// const getdb = require('../util/database').getDb;
// const mongo = require('mongodb');

// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//     save() {
//         const db = getdb();
//         return db.collection('users').insertOne(this);
//         // .then(result => console.log(result))
//         // .catch(err => console.log(err));
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             console.log("productId = ");
//             console.log(cp);
//             return cp.productId.toString() === product._id.toString();
//         });

//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         } else {
//             updatedCartItems.push({ productId: new mongo.ObjectID(product._id), quantity: newQuantity });
//         }
//         const updatedCart = {
//             items: updatedCartItems
//         };
//         // const updatedCart = { items: [{ productId: new mongo.ObjectID(product._id), quantity: 1 }] };
//         const db = getdb();
//         // return db.collection('users').updateOne({ _id: new mongo.ObjectID(this._id) }, { $set: { cart: updatedCart } });
//         return db.collection('users').updateOne({ _id: new mongo.ObjectID(this._id) }, { $set: { cart: updatedCart } });

//     }

//     getCart() {
//         const db = getdb();
//         const productsIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db
//             .collection('products').find({ _id: { $in: productsIds } }).toArray()
//             .then(products => {
//                 console.log(products);
//                 return products.map(p => {
//                     return {...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             })
//             .catch(err => console.log(err));
//     }
//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getdb();
//         return db.collection('users').updateOne({ _id: new mongo.ObjectID(this._id) }, { $set: { cart: { items: updatedCartItems } } });
//     }

//     addOrder() {
//         const db = getdb();
//         return this.getCart().then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new mongo.ObjectID(this._id),
//                         name: this.name
//                     }
//                 };
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(
//                 result => {
//                     this.cart = { items: [] };
//                     return db.collection('users')
//                         .updateOne({ _id: new mongo.ObjectID(this._id) }, { $set: { cart: { items: [] } } });
//                 }
//             );
//     }

//     getOrders() {
//         const db = getdb();
//         return db.collection('orders')
//             .find({ 'user._id': new mongo.ObjectID(this._id) }).toArray();
//     }

//     static getUserById(prodId) {
//         // console.log(prodId);
//         const db = getdb();
//         return db.collection('users').findOne({ _id: new mongo.ObjectID(prodId) })
//             .then(product => {
//                 console.log(product);
//                 return product;
//             })
//             .catch(err => console.log(err));
//     }
// }

// module.exports = User;