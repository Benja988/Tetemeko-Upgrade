import mongoose, { Schema, Document } from 'mongoose';

interface ICartItem {
  product: mongoose.Types.ObjectId;
  title: string;
  price: number;
  image: string;
  quantity: number;
  variant?: {
    color?: string;
    size?: string;
    [key: string]: any;
  };
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema<ICartItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    color: { type: String },
    size: { type: String },
  },
});

const CartSchema: Schema = new Schema<ICart>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, default: 0 },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
