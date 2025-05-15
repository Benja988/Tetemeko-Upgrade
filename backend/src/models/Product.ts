// import mongoose, { Schema, Document } from "mongoose";

// /** ================================
//  *       INTERFACE DEFINITION
// ================================= */
// export interface IReview {
//   user: mongoose.Types.ObjectId;
//   rating: number;
//   comment: string;
//   createdAt: Date;
// }

// export interface IProduct extends Document {
//   name: string;
//   slug: string;
//   description: string;
//   price: number;
//   discountPrice?: number;
//   stock: number;
//   category: string;
//   subCategory?: string;
//   tags: string[];
//   images: string[];
//   videos?: string[];
//   ratingsAverage: number;
//   reviews: IReview[];
//   isDeleted: boolean;
//   seller: mongoose.Types.ObjectId;
//   createdAt: Date;
//   updatedAt: Date;
// }

// **/** ================================
//  *       REVIEW SCHEMA
// ================================= */
// const ReviewSchema = new Schema<IReview>(
//   {
//     user: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     rating: { type: Number, required: true, min: 1, max: 5 },
//     comment: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//   },
//   { _id: false }
// );

// **/** ================================
//  *       PRODUCT SCHEMA
// ================================= */
// const ProductSchema = new Schema<IProduct>(
//   {
//     name: { type: String, required: true, trim: true },
//     slug: { type: String, unique: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true, min: 0 },
//     discountPrice: {
//       type: Number,
//       validate: {
//         validator: function (this: IProduct, value: number) {
//           return value < this.price;
//         },
//         message: "Discount price must be less than the original price",
//       },
//     },
//     stock: { type: Number, required: true, min: 0 },
//     category: { type: String, required: true },
//     subCategory: { type: String },
//     tags: {
//       type: [String],
//       default: [],
//       validate: {
//         validator: (v: string[]) => v.length <= 10,
//         message: "Maximum 10 tags allowed.",
//       },
//     },
//     images: {
//       type: [String],
//       required: true,
//       validate: {
//         validator: (v: string[]) => v.length > 0,
//         message: "At least one image is required.",
//       },
//     },
//     videos: {
//       type: [String],
//       validate: {
//         validator: (v: string[]) => v.every(url => /^https?:\/\/.+\.(mp4|webm|ogg)$/i.test(url)),
//         message: "Video URLs must be valid.",
//       },
//     },
//     ratingsAverage: { type: Number, default: 0 },
//     reviews: { type: [ReviewSchema], default: [] },
//     isDeleted: { type: Boolean, default: false },
//     seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   },
//   { timestamps: true, versionKey: "version" }
// );

// **/** ================================
//  *       MIDDLEWARES & HOOKS
// ================================= */

// // 🔄 Generate Slug from Product Name
// ProductSchema.pre("save", function (next) {
//   if (!this.slug || this.slug.trim() === "") {
//     this.slug = this.name
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   }
//   next();
// });

// // 🚫 Filter out soft-deleted products from queries
// ProductSchema.pre(/^find/, function (next) {
//   this.find({ isDeleted: false });
//   next();
// });

// // 🏷️ Auto-populate seller details
// ProductSchema.pre("findOne", function () {
//   this.populate("seller", "name email");
// });

// /** ================================
//  *       EXPORT THE MODEL
// ================================= */
// export default mongoose.model<IProduct>("Product", ProductSchema);
