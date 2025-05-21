import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  logo?: string;
  description?: string;
  address: {
    addressLine1: string;
    city: string;
    state?: string;
    country: string;
  };
  isVerified: boolean;
  createdAt: Date;
}

const StoreSchema: Schema<IStore> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    logo: {
      type: String, // URL (e.g., Cloudinary)
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    address: {
      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        required: true,
        trim: true,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Store = mongoose.model<IStore>('Store', StoreSchema);
