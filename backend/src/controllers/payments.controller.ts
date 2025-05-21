import { Request, Response } from 'express';
import { Payment } from '../models/Payment';

// Create a new payment
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      order,
      amount,
      method,
      transactionId,
      currency = 'USD',
      providerResponse,
    } = req.body;

    const userId = req.user?.id; // Assuming user ID from auth middleware

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newPayment = new Payment({
      order,
      user: userId,
      amount,
      method,
      transactionId,
      currency,
      providerResponse,
      status: 'initiated',
    });

    const savedPayment = await newPayment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
};

// Get all payments (admin only)
export const getAllPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const payments = await Payment.find()
      .populate('order')
      .populate('user', 'name email');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
};

// Get payments for current user
export const getMyPayments = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const payments = await Payment.find({ user: userId }).populate('order');
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your payments', error });
  }
};

// Get payment by ID
export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id)
      .populate('order')
      .populate('user', 'name email');

    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    // Only owner or admin can view payment
    if (payment.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
};

// Update payment status (admin)
export const updatePaymentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, providerResponse } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    if (status) payment.status = status;
    if (providerResponse) payment.providerResponse = providerResponse;

    payment.updatedAt = new Date();

    const updatedPayment = await payment.save();
    res.status(200).json(updatedPayment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error });
  }
};

// Delete payment (admin)
export const deletePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Payment.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Payment not found' });
      return;
    }

    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error });
  }
};
