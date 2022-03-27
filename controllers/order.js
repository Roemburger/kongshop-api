const { ValidationResult } = require("express-validator");

const Order = require("../models/order");
const Product = require("../models/product");
const OrderLine = require("../models/orderLine");
const User = require("../models/user");
const order = require("../models/order");

exports.createOrder = async (req, res, next) => {
    const cart = JSON.parse(req.body.cart);
    const orderLines = await storeOrder(cart);
    const totalPrice = req.body.totalPrice;

    User.findById(req.userId)
        .then((user) => {
            if (!user) {
                const error = new Error("User does not exist.");
                error.statusCode = 401;
                throw error;
            }
            const order = new Order({
                userId: req.userId,
                firstName: this.firstName,
                lastName: this.lastName,
                street: this.street,
                number: this.number,
                postalCode: this.postalCode,
                city: this.city,
                region: this.region,
                country: this.country,
                orderLines: orderLines,
                totalPrice: totalPrice
            });
            order
                .save()
                .then((result) => {
                    user.orders.push(order);
                    return user.save();
                })
                .then((result) => {
                    res.status(201).json({
                        message: "Order has been created.",
                        order: order,
                    });
                })
                .catch((error) => {
                    throw error;
                });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getOrderById = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                const error = new Error("Order does not exist.");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({
                message: "Order has been fetched.",
                order: order,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getAllOrders = (req, res, next) => {
    User.findById(req.userId).then((user) => {
        if (!user) {
            const error = new Error("User does not exist.");
            error.statusCode = 401;
            throw error;
        }
        if (req.isAdmin) {
            Order.find()
                .populate([
                    {
                        path: "orderLines",
                        populate: { path: "product", model: "Product" },
                    }
                ])
                .then((result) => {
                    res.status(200).json({
                        message: "Orders has been fetched.",
                        orders: result,
                    });
                })
                .catch((error) => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }
                    next(error);
                });
        } else {
            Order.find()
                .where("userId", req.userId)
                .populate([
                    {
                        path: "orderLines",
                        populate: { path: "product", model: "Product" },
                    }
                ])
                .then((result) => {
                    res.status(200).json({
                        message: "Orders has been fetched.",
                        orders: result,
                    });
                })
                .catch((error) => {
                    if (!error.statusCode) {
                        error.statusCode = 500;
                    }
                    next(error);
                });
        }
    });
};

storeOrder = async (cart) => {
    const promises = cart.map(async (cartItem) => {
        const orderLine = new OrderLine({
            product: cartItem.product._id,
            amount: cartItem.amount,
        });
        return await orderLine.save().then((result) => {
            return result._id;
        });
    });
    return await Promise.all(promises);
};

exports.updateOrder = (req, res, next) => {
    if (!req.isAdmin) {
        const error = new Error("Unauthorized request");
        error.statusCode = 403;
        throw error;
    }
    const orderId = req.params.orderId;
    const totalPrice = req.body.totalPrice;

    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                const error = new Error("Order does not exist.");
                error.statusCode = 404;
                throw error;
            }
            order.totalPrice = totalPrice;
            return order.save();
        })
        .then((result) => {
            res.status(200).json({
                message: "Order updated.",
                order: result,
            });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.deleteOrder = (req, res, next) => {
    if (!req.isAdmin) {
        const error = new Error("Unauthorized request");
        error.statusCode = 403;
        throw error;
    }
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then((order) => {
            if (!order) {
                const error = new Error("Order does not exist.");
                error.statusCode = 404;
                throw error;
            }
            return Order.findByIdAndRemove(orderId);
        })
        .then((result) => {
            res.status(200).json({ message: "Order has been deleted." });
        })
        .catch((error) => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};