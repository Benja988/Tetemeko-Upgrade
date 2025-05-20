import mongoose, { Document, Schema } from "mongoose";

export enum UserRole {
  WEB_USER = "web_user",
  MANAGER = "manager",
  ADMIN = "admin",
}

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  refreshToken?: string;
  invitationCode?: string;
  invitationCodeExpires?: Date;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  failedLoginAttempts: number;
  lockUntil?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true, 
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.WEB_USER,
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, unique: true, sparse: true }, // For JWT refresh token

    // ✅ Invitation system
    invitationCode: { type: String, unique: true, sparse: true }, 
    invitationCodeExpires: { type: Date },

    // ✅ Email verification
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },

    // ✅ Security features
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// ✅ Auto-set expiration for invitation codes (7 days)
UserSchema.pre<IUser>("save", function (next) {
  if (this.invitationCode && !this.invitationCodeExpires) {
    this.invitationCodeExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  next();
});

// ✅ Auto-set expiration for verification tokens (24 hours)
UserSchema.pre<IUser>("save", function (next) {
  if (this.verificationToken && !this.verificationTokenExpires) {
    this.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

// ✅ Brute-force protection
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

UserSchema.methods.incrementFailedLogins = async function () {
  if (this.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    this.lockUntil = new Date(Date.now() + LOCK_TIME);
  } else {
    this.failedLoginAttempts += 1;
  }
  await this.save();
};

UserSchema.methods.resetFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

// ✅ Only keep the necessary index
UserSchema.index({ verificationToken: 1 }, { sparse: true });

export default mongoose.model<IUser>("User", UserSchema);
