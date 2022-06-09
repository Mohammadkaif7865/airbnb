let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors');
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 3000;
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let mongoUrl = process.env.liveUrl;
// let mongoUrl = process.env.localUrl;
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());
let db = express();
//middleware (supporting lib)
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Express server default');
});
// db.test.find({'array':{$elemMatch:{value:"value2"}})
app.get('/reviews', (req, res) => {
    db.collection('listingsAndReviews').find({ "price": { $gt: 2500, $lt: 5000 } }).sort({ "price": 1 }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
app.get('/amenities', (req, res) => {
    db.collection('listingsAndReviews').find({ "amenities": {} }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) {
        console.error(`Error while connecting to MongoDB: ${err}`);
    }
    db = client.db('sample_airbnb');
    app.listen(port, (err) => {
        if (err) throw err;
        console.log(`Express Server listening on port ${port}`);
    })
})