import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  rateProduct,
} from '../controllers/products.controller';

import { authenticateJWT, authorize } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User'; // adjust if your UserRole is defined elsewhere

const router = Router();

// Public Routes
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Product rating (Authenticated users only)
router.post(
  '/:productId/rate',
  authenticateJWT,
  authorize([UserRole.WEB_USER, UserRole.ADMIN, UserRole.MANAGER]),
  rateProduct
);

// Protected Routes (Admins and Sellers)
// Note: Adjust the roles as per your application logic
// Admins and Managers can create, update, and delete products
router.post(
  '/',
  authenticateJWT,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  createProduct
);

router.put(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  updateProduct
);

router.delete(
  '/:id',
  authenticateJWT,
  authorize([UserRole.ADMIN, UserRole.MANAGER]),
  deleteProduct
);

export default router;
