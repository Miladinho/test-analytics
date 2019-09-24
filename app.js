require('dotenv').config();

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const expressip = require('express-ip');

const mongoURL = 'mongodb://localhost:27017';
const dbName = 'testpage';

const app = express();
const port = process.env.PORT || 3000;

app.use(expressip().getIpInfoMiddleware);

app.get('/', (req, res) => {
    res.sendfile('index.html');
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    MongoClient.connect(mongoURL, function(err, client) {
        const db = client.db(dbName);
        db.collection('Visitor').insertOne({
            IP: ip,
            //city: req.getIpInfoMiddleware.city,
            //country: req.getMaxListeners.country,
            createdAt: new Date()
        });
        client.close();
    });
});

app.get('/stats', (req,res) => {
    MongoClient.connect(mongoURL, function(err, client) {
        const db = client.db(dbName);

        const cursor = db.collection('Visitor').find();
        let data = []
        cursor.each((err,doc) => data.push(doc));
        console.log(data);
        res.send("hi");
        client.close();
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});