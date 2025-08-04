"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("../controllers/products.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const User_1 = require("../models/User"); // adjust if your UserRole is defined elsewhere
const router = (0, express_1.Router)();
// Public Routes
router.get('/', products_controller_1.getAllProducts);
router.get('/:slug', products_controller_1.getProductBySlug);
// Product rating (Authenticated users only)
router.post('/:productId/rate', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.WEB_USER, User_1.UserRole.ADMIN, User_1.UserRole.MANAGER]), products_controller_1.rateProduct);
// Protected Routes (Admins and Sellers)
// Note: Adjust the roles as per your application logic
// Admins and Managers can create, update, and delete products
router.post('/', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN, User_1.UserRole.MANAGER]), products_controller_1.createProduct);
router.put('/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN, User_1.UserRole.MANAGER]), products_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorize)([User_1.UserRole.ADMIN, User_1.UserRole.MANAGER]), products_controller_1.deleteProduct);
exports.default = router;
