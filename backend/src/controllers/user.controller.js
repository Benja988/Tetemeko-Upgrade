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
exports.promoteToManager = exports.reactivateUser = exports.searchUsers = exports.adminResetPassword = exports.unlockUser = exports.lockUser = exports.deleteUsers = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = void 0;
const User_1 = __importStar(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const ITEMS_PER_PAGE = 20;
// Get paginated list of users (admin only)
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const roleFilter = req.query.role;
        const query = {};
        if (roleFilter)
            query.role = roleFilter;
        const totalUsers = yield User_1.default.countDocuments(query);
        const users = yield User_1.default.find(query)
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE)
            .select('-password -refreshToken -resetPasswordToken -verificationToken') // don't send sensitive info
            .sort({ createdAt: -1 });
        res.status(200).json({
            data: users,
            page,
            totalPages: Math.ceil(totalUsers / ITEMS_PER_PAGE),
            totalUsers,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});
exports.getUsers = getUsers;
// Get single user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        const user = yield User_1.default.findById(userId).select('-password -refreshToken -resetPasswordToken -verificationToken');
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
});
exports.getUserById = getUserById;
// Update user (role, isActive, name, email etc.)
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { name, email, role, isActive } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        // Validate role if provided
        if (role && !Object.values(User_1.UserRole).includes(role)) {
            res.status(400).json({ message: 'Invalid user role.' });
            return;
        }
        const updateData = {};
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email.toLowerCase();
        if (role)
            updateData.role = role;
        if (typeof isActive === 'boolean')
            updateData.isActive = isActive;
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, updateData, {
            new: true,
        }).select('-password -refreshToken -resetPasswordToken -verificationToken');
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json(updatedUser);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update user.' });
    }
});
exports.updateUser = updateUser;
// Delete user (or soft delete by setting isActive = false)
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        // Option 1: Hard delete
        // const deletedUser = await User.findByIdAndDelete(userId);
        // Option 2: Soft delete by deactivating account
        const deletedUser = yield User_1.default.findByIdAndUpdate(userId, { isActive: false }, { new: true });
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ message: 'User deactivated successfully.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to deactivate user.' });
    }
});
exports.deleteUser = deleteUser;
const deleteUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userIds } = req.body; // expect array of IDs in body
        if (!Array.isArray(userIds) || userIds.length === 0) {
            res.status(400).json({ message: 'No user IDs provided.' });
            return;
        }
        // Validate all IDs
        const invalidIds = userIds.filter(id => !mongoose_1.default.Types.ObjectId.isValid(id));
        if (invalidIds.length > 0) {
            res.status(400).json({ message: 'Some user IDs are invalid.', invalidIds });
            return;
        }
        // Soft delete all users by setting isActive to false
        const result = yield User_1.default.updateMany({ _id: { $in: userIds } }, { $set: { isActive: false } });
        // result.nModified or result.modifiedCount depending on Mongoose version
        res.status(200).json({
            message: `${result.modifiedCount || result.modifiedCount} user(s) deactivated successfully.`,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to deactivate users.' });
    }
});
exports.deleteUsers = deleteUsers;
// Lock user account manually (admin can lock user)
const lockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        const lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
        const user = yield User_1.default.findByIdAndUpdate(userId, { lockUntil, failedLoginAttempts: 5 }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ message: 'User account locked.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to lock user.' });
    }
});
exports.lockUser = lockUser;
// Unlock user account manually (admin can unlock user)
const unlockUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        // Use your model method or reset here
        yield user.resetFailedLogins();
        res.status(200).json({ message: 'User account unlocked.' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to unlock user.' });
    }
});
exports.unlockUser = unlockUser;
// Admin initiated password reset (generate reset token and send email)
const adminResetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        // Generate a reset token (random string)
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        // Set reset token and expiry (e.g. 1 hour)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
        yield user.save();
        // TODO: Send email with resetToken link to user.email
        res.status(200).json({
            message: 'Password reset token generated and email sent (simulate).',
            resetToken, // for testing purposes; remove in production
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to generate reset token.' });
    }
});
exports.adminResetPassword = adminResetPassword;
// Search users by email or name
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        if (!query || typeof query !== 'string') {
            res.status(400).json({ message: 'Query parameter required.' });
            return;
        }
        // Simple case-insensitive search for email or name
        const regex = new RegExp(query, 'i');
        const users = yield User_1.default.find({
            $or: [{ email: regex }, { name: regex }],
        })
            .limit(50)
            .select('-password -refreshToken -resetPasswordToken -verificationToken');
        res.status(200).json({ results: users });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Search failed.' });
    }
});
exports.searchUsers = searchUsers;
// Reactivate a deactivated user account
const reactivateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        const user = yield User_1.default.findByIdAndUpdate(userId, { isActive: true }, { new: true });
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        res.status(200).json({ message: 'User account reactivated.', user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to reactivate user.' });
    }
});
exports.reactivateUser = reactivateUser;
// Promote a user to Manager role
const promoteToManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid user ID.' });
            return;
        }
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }
        user.role = User_1.UserRole.MANAGER;
        yield user.save();
        res.status(200).json({ message: 'User promoted to Manager.', user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to promote user.' });
    }
});
exports.promoteToManager = promoteToManager;
