"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User");
const router = express_1.default.Router();
// 🔒 All routes require authentication
router.use(auth_middleware_1.authenticateJWT);
// 🛒 Create a new order (user)
router.post('/', (0, auth_middleware_1.authorize)([User_1.UserRole.WEB_USER]), order_controller_1.createOrder);
// 👤 Get orders for the logged-in user
router.get('/my-orders', (0, auth_middleware_1.authorize)([User_1.UserRole.WEB_USER]), order_controller_1.getMyOrders);
// 📦 Get all orders (admin only)
router.get('/', (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), order_controller_1.getAllOrders);
// 🔍 Get order by ID (admin or user if it's their order)
// You can enhance this with order ownership check middleware
router.get('/:id', (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN, User_1.UserRole.WEB_USER]), order_controller_1.getOrderById);
// 🔁 Update order status and/or payment status (admin only)
router.put('/:id', (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), order_controller_1.updateOrderStatus);
// ❌ Delete order (admin only)
router.delete('/:id', (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN]), order_controller_1.deleteOrder);
exports.default = router;
