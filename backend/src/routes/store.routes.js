"use strict";
// import { Router } from 'express';
// import {
//   createStore,
//   getAllStores,
//   getStoreById,
//   updateStore,
//   deleteStore,
// } from '../controllers/store.controller';
// import { authenticateJWT, authorize } from '../middlewares/auth.middleware';
// import { UserRole } from '../models/User';
// const router = Router();
// // Public routes
// router.get('/', getAllStores);
// router.get('/:id', getStoreById);
// // Protected routes
// router.post(
//   '/',
//   authenticateJWT,
//   authorize([UserRole.WEB_USER, UserRole.ADMIN]), // Allow authenticated users & admins to create stores
//   createStore
// );
// router.put(
//   '/:id',
//   authenticateJWT,
//   authorize([UserRole.WEB_USER, UserRole.ADMIN]), // Owner or admin - logic handled in controller
//   updateStore
// );
// router.delete(
//   '/:id',
//   authenticateJWT,
//   authorize([UserRole.WEB_USER, UserRole.ADMIN]), // Owner or admin - logic handled in controller
//   deleteStore
// );
// export default router;
