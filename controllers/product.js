const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');

const Product = require('../models/product');

exports.createProduct = (req, res, next) => {
    if (!req.isAdmin) {
        const error = new Error("Unauthorized request");
        error.statusCode = 403;
        throw error;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation has failed.");
        error.statusCode = 422;
        throw error;
    }

    const name = req.body.name;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;

    const product = new Product({
        name,
        description,
        imageUrl,
        price
    });

    product
        .save()
        .then((result) => {
            res.status(201).json({
                message: "Product has been created.",
                product: product,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getAllProducts = (req, res, next) => {
    Product.find()
        .then((products) => {
            res.status(200).json({
                message: "Products have been fetched.",
                products: products,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getProductById = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error("Product does not exist.");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "Product has been fetched.",
                product: product,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.updateProduct = (req, res, next) => {
    if (!req.isAdmin) {
        const error = new Error("Unauthorized request");
        error.statusCode = 403;
        throw error;
    }

    const productId = req.params.productId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation has failed.");
        error.statusCode = 422;
        throw error;
    }
    const name = req.body.name;
    const description = req.body.description;
    const price = req.body.price;
    const type = req.body.type;
    const imageUrl = req.body.imageUrl;

    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error("Product does not exist.");
                error.statusCode = 404;
                throw error;
            }

            product.name = name;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Product has been updated.",
                product: result,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.deleteProduct = (req, res, next) => {
    if (!req.isAdmin) {
        const error = new Error("Unauthorized request");
        error.statusCode = 403;
        throw error;
    }
    const productId = req.params.productId;
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                const error = new Error("Product does not exist.");
                error.statusCode = 404;
                throw error;
            }
            return Product.findByIdAndRemove(productId);
        })
        .then((result) => {
            res.status(200).json({ message: "Product has been deleted." });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};