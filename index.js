let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let cors = require('cors');
let dotenv = require('dotenv');
dotenv.config();
let port = process.env.PORT || 3000;
let mongo = require('mongodb');
const { query } = require('express');
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
//stay on the basis of price filter low to high
app.get('/reviews', (req, res) => {
    db.collection('listingsAndReviews').find({ "price": { $gt: 3000, $lt: 5000 } }).sort({ "price": 1 }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
// stay on the basis of amenities
app.get('/amenities', (req, res) => {
    // { "amenities": { $elemMatch: { $in: ["Beachfront"] } } }

    if (req.query.spec1 && req.query.spec2 && req.query.spec3 && req.query.spec4) {
        db.collection('listingsAndReviews').find({ $and: [{ "amenities": { $in: [req.query.spec1] } }, { "amenities": { $in: [req.query.spec2] } }, { "amenities": { $in: [req.query.spec3] } }, { "amenities": { $in: [req.query.spec4] } }] }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (req.query.spec1 && req.query.spec2 && req.query.spec3) {
        db.collection('listingsAndReviews').find({ $and: [{ "amenities": { $in: [req.query.spec1] } }, { "amenities": { $in: [req.query.spec2] } }, { "amenities": { $in: [req.query.spec3] } }] }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    } else if (req.query.spec1 && req.query.spec2) {
        db.collection('listingsAndReviews').find({ $and: [{ "amenities": { $in: [req.query.spec1] } }, { "amenities": { $in: [req.query.spec2] } }] }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        })
    } else if (req.query.spec1) {
        db.collection('listingsAndReviews').find({ $and: [{ "amenities": { $in: [req.query.spec1] } }] }).toArray((err, result) => {
            if (err) throw err;
            res.send(result);
        });
    }
});
//stay on the basis of number of beds
app.get('/beds', (req, res) => {
    db.collection('listingsAndReviews').find({ "beds": { $gt: 15 } }).sort({ "price": 1 }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
//All stay on the basis of country
app.get('/region/:country', (req, res) => {
    db.collection('listingsAndReviews').find({ "address.country": req.params.country }).sort({ "price": 1 }).toArray((err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
//this api is to get sorted cost data on the basis or country
app.get('/regionWithFilter/:country', (req, res) => {
    db.collection('listingsAndReviews').find({ $and: [{ "address.country": req.params.country }, { "price": { $gt: Number(req.query.lowCost), $lt: Number(req.query.highCost) } }] }).sort({ "price": 1 }).toArray((err, result) => {
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
    });
});
// {$and:[{"address.country":{$ne:"Turkey"}},{"address.country":{$ne:"Australia"}},{"address.country":{$ne:"United States"}},{"address.country":{$ne:"Portugal"}},{"address.country":{$ne:"Spain"}},{"address.country":{$ne:"Hong Kong"}},{"address.country":{$ne:"Canada"}},{"address.country":{$ne:"Brazil"}}]}