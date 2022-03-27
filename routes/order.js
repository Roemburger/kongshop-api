const express = require("express");
const { body } = require("express-validator");

const orderController = require("../controllers/order");

const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", [isAuth, isAdmin], orderController.getAllOrders);

router.get("/:orderId", isAuth, orderController.getOrderById);

router.post("/", isAuth, orderController.createOrder);

router.put("/:orderId", [isAuth, isAdmin], orderController.updateOrder);

router.delete("/:orderId", [isAuth, isAdmin], orderController.deleteOrder);

module.exports = router;