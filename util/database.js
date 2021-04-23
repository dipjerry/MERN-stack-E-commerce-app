const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let _bd;
const MongoConnect = callback => {
    MongoClient.connect('mongodb+srv://groot:grootMongo12@cluster0.eolis.mongodb.net/ecom?retryWrites=true&w=majority')
        .then(
            client => {
                console.log('Connected to MongoDB');
                _db = client.db();
                callback();
            }
        )
        .catch(err => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database found';
};

exports.mongoConnect = MongoConnect;
exports.getDb = getDb;