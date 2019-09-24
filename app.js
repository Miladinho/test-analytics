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

    console.log(req.ips);
    MongoClient.connect(mongoURL, function(err, client) {
        const db = client.db(dbName);
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        db.collection('Visitor').insertOne({
            IP: ip,
            //city: req.getIpInfoMiddleware.city,
            //country: req.getMaxListeners.country,
            createdAt: new Date()
        });
        client.close();
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});