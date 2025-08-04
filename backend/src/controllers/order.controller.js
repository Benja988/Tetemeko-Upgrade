"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrder = exports.updateOrderStatus = exports.getOrderById = exports.getMyOrders = exports.getAllOrders = exports.createOrder = void 0;
const Order_1 = require("../models/Order"); // Adjust the path based on your project structure
// Create a new order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { products, totalAmount, discountAmount, finalAmount, couponCode, shippingAddress, paymentMethod, transactionId, } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Make sure you're attaching user in authenticateJWT middleware
        const newOrder = new Order_1.Order({
            user: userId,
            products,
            totalAmount,
            discountAmount,
            finalAmount,
            couponCode,
            shippingAddress,
            paymentMethod,
            transactionId,
            paymentStatus: 'pending',
            orderStatus: 'pending',
        });
        const savedOrder = yield newOrder.save();
        res.status(201).json(savedOrder);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating order', error });
    }
});
exports.createOrder = createOrder;
// Get all orders (admin)
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield Order_1.Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'title price');
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});
exports.getAllOrders = getAllOrders;
// Get orders for current user
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const orders = yield Order_1.Order.find({ user: userId }).populate('products.product');
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching your orders', error });
    }
});
exports.getMyOrders = getMyOrders;
// Get order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield Order_1.Order.findById(id)
            .populate('user', 'name email')
            .populate('products.product');
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching order', error });
    }
});
exports.getOrderById = getOrderById;
// Update order status (admin)
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { orderStatus, paymentStatus } = req.body;
        const order = yield Order_1.Order.findById(id);
        if (!order) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        if (orderStatus)
            order.orderStatus = orderStatus;
        if (paymentStatus)
            order.paymentStatus = paymentStatus;
        order.updatedAt = new Date();
        const updated = yield order.save();
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Delete order (admin)
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Order_1.Order.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: 'Order not found' });
            return;
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting order', error });
    }
});
exports.deleteOrder = deleteOrder;
