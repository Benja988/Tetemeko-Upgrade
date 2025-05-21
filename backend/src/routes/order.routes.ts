import express from 'express';
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/order.controller';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = express.Router();

// 🔒 All routes require authentication
router.use(authenticateJWT);

// 🛒 Create a new order (user)
router.post('/', authorize([UserRole.WEB_USER]), createOrder);

// 👤 Get orders for the logged-in user
router.get('/my-orders', authorize([UserRole.WEB_USER]), getMyOrders);

// 📦 Get all orders (admin only)
router.get('/', authorize([UserRole.ADMIN]), getAllOrders);

// 🔍 Get order by ID (admin or user if it's their order)
// You can enhance this with order ownership check middleware
router.get('/:id', authorize([UserRole.ADMIN, UserRole.WEB_USER]), getOrderById);

// 🔁 Update order status and/or payment status (admin only)
router.put('/:id', authorize([UserRole.ADMIN]), updateOrderStatus);

// ❌ Delete order (admin only)
router.delete('/:id', authorize([UserRole.ADMIN]), deleteOrder);

export default router;
