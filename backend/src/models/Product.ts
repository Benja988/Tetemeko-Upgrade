import mongoose, { Schema, Document } from 'mongoose';

export interface IProductRating {
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  discount?: number;
  stock: number;
  category: mongoose.Types.ObjectId;
  tags: string[];
  ratings: IProductRating[];
  averageRating?: number;
  seller: mongoose.Types.ObjectId;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductRatingSchema: Schema<IProductRating> = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const ProductSchema: Schema<IProduct> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    ratings: {
      type: [ProductRatingSchema],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
