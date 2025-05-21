import express from 'express';
import {
  createPayment,
  getAllPayments,
  getMyPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} from '../controllers/payments.controller';
import { authenticateJWT, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Create a payment (authenticated users)
router.post('/', authenticateJWT, createPayment);

// Get all payments (admin only)
router.get('/', authenticateJWT, authorize([UserRole.ADMIN]), getAllPayments);

// Get current user's payments
router.get('/me', authenticateJWT, getMyPayments);

// Get payment by ID (owner or admin)
router.get('/:id', authenticateJWT, getPaymentById);

// Update payment status (admin only)
router.patch('/:id', authenticateJWT, authorize([UserRole.ADMIN]), updatePaymentStatus);

// Delete payment (admin only)
router.delete('/:id', authenticateJWT, authorize([UserRole.ADMIN]), deletePayment);

export default router;
