const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");

require("dotenv").config();
const app = express();

const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");

app.use(bodyParser.json());
app.use((req, res, next) => {
    var allowedDomains = ["http://localhost:4200", "http://kongshop.nl",];
    var origin = req.headers.origin;
    if (allowedDomains.indexOf(origin) > -1) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Content-Length, Authorization, X-Requested-With, Origin, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "PUT, GET, POST, PATCH, DELETE, OPTIONS"
    );

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

app.use("/auth", authRoute);
app.use("/product-list", productRoute);
app.use("/order-list", orderRoute);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

const httpsServer = https.createServer(options, app);

mongoose
    .connect('mongodb://127.0.0.1:27017/kongshop')
    .then((result) => {
        httpsServer.listen(8080, () => {
            console.log("listening on https port 8080");
        });
    })
    .catch((error) => console.log(error));

/*
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("we are connected to database");
});*/
