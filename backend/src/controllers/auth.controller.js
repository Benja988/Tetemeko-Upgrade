"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.deactivateAccount = exports.updateProfile = exports.getProfile = exports.resendVerification = exports.logout = exports.resetPassword = exports.forgotPassword = exports.promoteToAdmin = exports.registerManager = exports.registerAdmin = exports.inviteManager = exports.login = exports.verifyEmail = exports.registerUser = void 0;
const User_1 = __importStar(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../utils/sendEmail");
// import { AuthenticatedRequest } from '../middlewares/auth.middleware'
const emailTemplate_1 = require("../utils/emailTemplate");
const emailTemplate_2 = require("../utils/emailTemplate");
const emailTemplate_3 = require("../utils/emailTemplate");
const emailTemplate_4 = require("../utils/emailTemplate");
const emailTemplate_5 = require("../utils/emailTemplate");
// Helper to generate JWT token
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
// ✅ Register User
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, profilePictureUrl } = req.body;
        if (yield User_1.default.findOne({ email })) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const newUser = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: User_1.UserRole.WEB_USER,
            isVerified: false,
            verificationToken,
            profilePictureUrl: profilePictureUrl || '',
        });
        yield newUser.save();
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailContent = (0, emailTemplate_1.generateVerificationEmail)(name, verificationLink);
        yield (0, sendEmail_1.sendEmail)(email, 'Welcome to Tetemeko Media! Please Verify Your Email', emailContent);
        res
            .status(201)
            .json({ message: 'User registered. Please verify your email.' });
    }
    catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerUser = registerUser;
// ✅ Verify Email
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            res.status(400).json({ message: 'Invalid verification link' });
            return;
        }
        const user = yield User_1.default.findOne({ verificationToken: token });
        if (!user) {
            res.status(400).json({ message: 'Invalid or expired verification token' });
            return;
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        yield user.save();
        // Send verification success email
        const emailContent = (0, emailTemplate_2.sendVerificationSuccessEmail)(user.name, user.email);
        yield (0, sendEmail_1.sendEmail)(user.email, "You're Verified! 🎉", emailContent);
        res
            .status(200)
            .json({ message: 'Email verified successfully. You can now log in.' });
    }
    catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.verifyEmail = verifyEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        if (!user.isVerified) {
            res.status(403).json({ message: 'Please verify your email first' });
            return;
        }
        // ✅ Generate access token
        const token = generateToken(user);
        // ✅ Generate refresh token
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
        // ✅ Save refresh token to DB
        user.refreshToken = refreshToken;
        yield user.save();
        // ✅ Set refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        // ✅ Send response
        res.status(200).json({
            message: 'Login successful',
            token,
            refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
        console.log(`🔑 Login successful for user: ${user.email}`);
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.login = login;
// ✅ Invite Manager
const inviteManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const invitationCode = crypto_1.default.randomBytes(8).toString('hex'); // Shorter code
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        console.log(`📩 Sending invitation to: ${email}`);
        console.log(`📌 Invitation Code: ${invitationCode}`);
        yield (0, sendEmail_1.sendEmail)(email, "You're Invited to Join as a Manager!", `
      <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        <h2 style="color: #333; text-align: center;">🎉 Invitation to Join</h2>
        <p>Hello,</p>
        <p>You have been invited to join as a <strong>Manager</strong>. Use the following invitation code to register:</p>
        
        <div style="text-align: center; padding: 15px; background: #007bff; color: white; font-size: 18px; font-weight: bold; border-radius: 5px;">
          ${invitationCode}
        </div>
        
        <p style="margin-top: 15px;">This code will expire on <strong>${expiresAt.toDateString()}</strong>.</p>
        <p>To complete your registration, click the button below:</p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:3000/register?invitation=${invitationCode}" style="padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">Register Now</a>
        </div>
        
        <p style="margin-top: 15px;">If you did not request this invitation, please ignore this email.</p>
        
        <hr>
        <p style="font-size: 12px; color: #555;">Best Regards, <br> Your Company Team</p>
      </div>
      `);
        res.json({ message: 'Invitation sent successfully.' });
    }
    catch (err) {
        console.error('❌ Server error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.inviteManager = inviteManager;
// ✅ Admin Registration (Most Secure Method)
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, adminSecret, profilePictureUrl } = req.body;
        if (!name || !email || !password || !adminSecret) {
            res.status(400).json({ message: 'All fields are required.' });
            return;
        }
        if (yield User_1.default.findOne({ email })) {
            res.status(400).json({ message: 'Email already registered.' });
            console.log('⚠️ Email already registered:', email);
            return;
        }
        if (adminSecret !== process.env.ADMIN_SECRET) {
            res.status(403).json({ message: 'Invalid admin secret.' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newAdmin = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: User_1.UserRole.ADMIN,
            isVerified: true,
            profilePictureUrl: profilePictureUrl || '',
        });
        yield newAdmin.save();
        // Send admin registration success email
        const emailContent = (0, emailTemplate_5.generateAdminRegistrationSuccessEmail)(name);
        yield (0, sendEmail_1.sendEmail)(email, "Welcome to Tetemeko Admin Panel", emailContent);
        res.status(201).json({ message: 'Admin registered successfully' });
    }
    catch (err) {
        console.error('❌ Admin Registration Error:', err);
        res.status(500).json({ message: 'Internal server error. Please try again later.' });
    }
});
exports.registerAdmin = registerAdmin;
// ✅ Register Manager with Invitation Code
const registerManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, invitationCode, profilePictureUrl } = req.body;
        if (!invitationCode) {
            res.status(400).json({ message: 'Invalid invitation code' });
            return;
        }
        if (yield User_1.default.findOne({ email })) {
            res.status(400).json({ message: 'Email already registered' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Generate verification token
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        const newManager = new User_1.default({
            name,
            email,
            password: hashedPassword,
            role: User_1.UserRole.MANAGER,
            isVerified: false,
            verificationToken, // Store token in DB
            profilePictureUrl: profilePictureUrl || '',
        });
        yield newManager.save();
        // Use environment variable for domain
        const domain = process.env.CLIENT_URL || 'https://yourdomain.com';
        const verificationLink = `${domain}/auth/verify-email?token=${verificationToken}`;
        yield (0, sendEmail_1.sendEmail)(email, 'Verify Your Email', `<p>Hello ${name},</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>`);
        res
            .status(201)
            .json({
            message: 'Manager registered. Check email to verify your account.',
        });
    }
    catch (err) {
        console.error('❌ Registration error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.registerManager = registerManager;
// ✅ Promote Manager to Admin
const promoteToAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (user.role !== User_1.UserRole.MANAGER) {
            res.status(400).json({ message: 'User is not a manager' });
            return;
        }
        user.role = User_1.UserRole.ADMIN;
        yield user.save();
        res.status(200).json({ message: 'User promoted to Admin' });
    }
    catch (err) {
        console.error('Error in promoteToAdmin:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.promoteToAdmin = promoteToAdmin;
// ✅ Forgot Password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        yield user.save();
        const emailContent = (0, emailTemplate_3.generateResetPasswordEmail)(user.name, resetToken);
        yield (0, sendEmail_1.sendEmail)(user.email, 'Reset Your Password', emailContent);
        res.status(200).json({ message: 'Password reset email sent successfully' });
    }
    catch (err) {
        console.error('Error in forgotPassword:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.forgotPassword = forgotPassword;
// ✅ Reset Password
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;
        console.log("Reset Password Request:");
        console.log("Token:", token);
        console.log("New Password:", newPassword ? "Provided" : "Not Provided");
        if (!token || typeof token !== "string") {
            res.status(400).json({ message: "No or invalid reset token provided." });
            return;
        }
        if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
            res.status(400).json({ message: "Password must be at least 6 characters." });
            return;
        }
        console.log("Current Date:", new Date());
        const user = yield User_1.default.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            console.warn("⚠️ Invalid or expired reset token.");
            res.status(400).json({ message: "Invalid or expired reset token." });
            return;
        }
        console.log("✅ User found:", user.email);
        // 🔒 Hash new password
        user.password = yield bcryptjs_1.default.hash(newPassword, 10);
        // 🧹 Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        // 💾 Save updated user
        yield user.save();
        console.log("✅ Password updated successfully for:", user.email);
        // 📧 Send confirmation email
        const emailContent = (0, emailTemplate_4.generatePasswordResetSuccessEmail)(user.name || "User");
        try {
            yield (0, sendEmail_1.sendEmail)(user.email, "Password Reset Successful", emailContent);
            console.log(`✅ Confirmation email sent to ${user.email}`);
        }
        catch (emailError) {
            console.error("❌ Failed to send confirmation email:", emailError);
        }
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (err) {
        console.error("🔥 Error in resetPassword handler:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.resetPassword = resetPassword;
// ✅ Logout (Invalidate refresh tokens)
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
        res.json({ message: 'Logged out successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.logout = logout;
// ✅ Resend Email Verification
const resendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Email is required' });
            return;
        }
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        if (user.isVerified) {
            res.status(400).json({ message: 'User is already verified' });
            return;
        }
        // Generate new verification token
        const verificationToken = crypto_1.default.randomBytes(32).toString('hex');
        user.verificationToken = verificationToken;
        yield user.save();
        // Construct verification link
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;
        yield (0, sendEmail_1.sendEmail)(email, 'Verify Your Email', `Click the link to verify your email: ${verificationLink}`);
        res.status(200).json({ message: 'Verification email resent successfully' });
    }
    catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.resendVerification = resendVerification;
// ✅ Get User Profile

const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res
                .status(401)
                .json({ message: "Unauthorized: No user found in request" });
            return;
        }
        const foundUser = yield User_1.default.findById(user.id).select("-password");
        if (!foundUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(foundUser);
    }
    catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getProfile = getProfile;
// ✅ Update Profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFromToken = req.user;
        if (!userFromToken) {
            res
                .status(401)
                .json({ message: 'Unauthorized: No user found in request' });
            return;
        }
        const user = yield User_1.default.findById(userFromToken._id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const { name, password } = req.body;
        if (name)
            user.name = name;
        if (password)
            user.password = yield bcryptjs_1.default.hash(password, 10);
        yield user.save();
        res.status(200).json({ message: 'Profile updated successfully' });
    }
    catch (err) {
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateProfile = updateProfile;
// ✅ Deactivate Account (Soft Delete)
const deactivateAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Unauthorized: No user found in request" });
            return;
        }
        const existingUser = yield User_1.default.findById(user._id);
        if (!existingUser) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        existingUser.isActive = false; // Ensure your User model has `isActive` field
        yield existingUser.save();
        res.status(200).json({ message: "Account deactivated" });
    }
    catch (err) {
        console.error("Error deactivating account:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.deactivateAccount = deactivateAccount;
// ✅ Refresh Token (Generate new JWT)
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body; // ✅ POSTed in body
        if (!refreshToken) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
            if (err || !decoded) {
                res.status(403).json({ message: 'Invalid refresh token' });
                return;
            }
            // ✅ Create a new access token
            const newToken = jsonwebtoken_1.default.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: '1h' } // short-lived access token
            );
            res.status(200).json({ token: newToken });
        });
    }
    catch (err) {
        console.error('Error refreshing token:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.refreshToken = refreshToken;
