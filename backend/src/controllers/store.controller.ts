import { Request, Response } from 'express';
import { Store } from '../models/Store'; // Adjust path as needed
import mongoose from 'mongoose';

// Create a new store
export const createStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, logo, description, address } = req.body;
    const ownerId = req.user?.id; // Assumes user attached by auth middleware

    if (!ownerId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Check if a store with the same name already exists
    const existing = await Store.findOne({ name });
    if (existing) {
      res.status(400).json({ message: 'Store name already exists' });
      return;
    }

    const newStore = new Store({
      name,
      owner: ownerId,
      logo,
      description,
      address,
      isVerified: false,
    });

    const savedStore = await newStore.save();
    res.status(201).json(savedStore);
  } catch (error) {
    res.status(500).json({ message: 'Error creating store', error });
  }
};

// Get all stores (optionally filter by owner or verified)
export const getAllStores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filters: any = {};

    // Optional query params: owner, isVerified
    if (req.query.owner && mongoose.Types.ObjectId.isValid(req.query.owner as string)) {
      filters.owner = req.query.owner;
    }
    if (req.query.isVerified !== undefined) {
      filters.isVerified = req.query.isVerified === 'true';
    }

    const stores = await Store.find(filters).populate('owner', 'name email');
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stores', error });
  }
};

// Get store by ID
export const getStoreById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid store ID' });
      return;
    }

    const store = await Store.findById(id).populate('owner', 'name email');
    if (!store) {
      res.status(404).json({ message: 'Store not found' });
      return;
    }

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store', error });
  }
};

// Update store info (only owner or admin allowed)
export const updateStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid store ID' });
      return;
    }

    const store = await Store.findById(id);
    if (!store) {
      res.status(404).json({ message: 'Store not found' });
      return;
    }

    // Only owner or admin can update
    if (store.owner.toString() !== userId && userRole !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    // Prevent changing owner or isVerified by non-admin
    if (updates.owner && userRole !== 'admin') {
      delete updates.owner;
    }
    if (updates.isVerified !== undefined && userRole !== 'admin') {
      delete updates.isVerified;
    }

    Object.assign(store, updates);
    await store.save();

    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Error updating store', error });
  }
};

// Delete store (only owner or admin)
export const deleteStore = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid store ID' });
      return;
    }

    const store = await Store.findById(id);
    if (!store) {
      res.status(404).json({ message: 'Store not found' });
      return;
    }

    if (store.owner.toString() !== userId && userRole !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    await store.deleteOne();
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting store', error });
  }
};
