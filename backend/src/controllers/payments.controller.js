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
exports.deletePayment = exports.updatePaymentStatus = exports.getPaymentById = exports.getMyPayments = exports.getAllPayments = exports.createPayment = void 0;
const Payment_1 = require("../models/Payment");
// Create a new payment
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { order, amount, method, transactionId, currency = 'USD', providerResponse, } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming user ID from auth middleware
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const newPayment = new Payment_1.Payment({
            order,
            user: userId,
            amount,
            method,
            transactionId,
            currency,
            providerResponse,
            status: 'initiated',
        });
        const savedPayment = yield newPayment.save();
        res.status(201).json(savedPayment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating payment', error });
    }
});
exports.createPayment = createPayment;
// Get all payments (admin only)
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield Payment_1.Payment.find()
            .populate('order')
            .populate('user', 'name email');
        res.status(200).json(payments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching payments', error });
    }
});
exports.getAllPayments = getAllPayments;
// Get payments for current user
const getMyPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const payments = yield Payment_1.Payment.find({ user: userId }).populate('order');
        res.status(200).json(payments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching your payments', error });
    }
});
exports.getMyPayments = getMyPayments;
// Get payment by ID
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const payment = yield Payment_1.Payment.findById(id)
            .populate('order')
            .populate('user', 'name email');
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        // Only owner or admin can view payment
        if (payment.user.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'admin') {
            res.status(403).json({ message: 'Forbidden' });
            return;
        }
        res.status(200).json(payment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching payment', error });
    }
});
exports.getPaymentById = getPaymentById;
// Update payment status (admin)
const updatePaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, providerResponse } = req.body;
        const payment = yield Payment_1.Payment.findById(id);
        if (!payment) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        if (status)
            payment.status = status;
        if (providerResponse)
            payment.providerResponse = providerResponse;
        payment.updatedAt = new Date();
        const updatedPayment = yield payment.save();
        res.status(200).json(updatedPayment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating payment', error });
    }
});
exports.updatePaymentStatus = updatePaymentStatus;
// Delete payment (admin)
const deletePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleted = yield Payment_1.Payment.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: 'Payment not found' });
            return;
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting payment', error });
    }
});
exports.deletePayment = deletePayment;
