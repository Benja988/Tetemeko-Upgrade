import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  order: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  amount: number;
  method: 'card' | 'paypal' | 'mobileMoney';
  status: 'initiated' | 'completed' | 'failed';
  transactionId: string;
  currency: string;
  providerResponse?: object;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ['card', 'paypal', 'mobileMoney'],
      required: true,
    },
    status: {
      type: String,
      enum: ['initiated', 'completed', 'failed'],
      default: 'initiated',
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    providerResponse: {
      type: Schema.Types.Mixed, // To store full gateway response like Stripe, PayPal, etc.
    },
  },
  {
    timestamps: true, // createdAt and updatedAt
  }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
