import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User, { UserRole } from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';
import { 
  generateVerificationEmail, 
  sendVerificationSuccessEmail,
  generateResetPasswordEmail,
  generatePasswordResetSuccessEmail,
  generateAdminRegistrationSuccessEmail 
} from '../utils/emailTemplate.js';
import sanitize from 'sanitize-html';

// Custom error class for better error handling
class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Helper to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profilePictureUrl } = req.body;

    // Input validation
    if (!name || !email || !password) {
      throw new APIError('Name, email, and password are required', 400);
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitize(name, { allowedTags: [] }),
      email: sanitize(email, { allowedTags: [] }),
      password,
      profilePictureUrl: profilePictureUrl ? sanitize(profilePictureUrl, { allowedTags: [] }) : ''
    };

    const existingUser = await User.findOne({ email: sanitizedData.email });
    if (existingUser) {
      throw new APIError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(sanitizedData.password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      ...sanitizedData,
      password: hashedPassword,
      role: UserRole.WEB_USER,
      isVerified: false,
      verificationToken
    });

    await newUser.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailContent = generateVerificationEmail(sanitizedData.name, verificationLink);
    await sendEmail(sanitizedData.email, 'Welcome to Tetemeko Media! Please Verify Your Email', emailContent);

    return res.status(201).json({ message: 'User registered. Please verify your email.' });
  } catch (error) {
    console.error('Registration error:', { error: error.message, email: req.body.email });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Verify email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      throw new APIError('Invalid verification link', 400);
    }

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      throw new APIError('Invalid or expired verification token', 400);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const emailContent = sendVerificationSuccessEmail(user.name, user.email);
    await sendEmail(user.email, "You're Verified! 🎉", emailContent);

    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Error verifying email:', { error: error.message });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new APIError('Email and password are required', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new APIError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await user.incrementFailedLogins();
      throw new APIError('Invalid credentials', 401);
    }

    if (!user.isVerified) {
      throw new APIError('Please verify your email first', 403);
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new APIError('Account is temporarily locked', 403);
    }

    await user.resetFailedLogins();
    const token = generateToken(user);
    const refreshToken = jwt.sign({ id: user._id, role: user.role }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', { error: error.message, email: req.body.email });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Invite manager
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const inviteManager = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new APIError('Email is required', 400);
    }

    const sanitizedEmail = sanitize(email, { allowedTags: [] });
    const invitationCode = crypto.randomBytes(8).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const newUser = new User({
      email: sanitizedEmail,
      invitationCode,
      invitationCodeExpires: expiresAt,
      role: UserRole.MANAGER
    });
    await newUser.save();

    await sendEmail(
      sanitizedEmail,
      "You're Invited to Join as a Manager!",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #333; text-align: center;">🎉 Manager Invitation</h2>
          <p>Hello,</p>
          <p>You have been invited to join Tetemeko Media as a Manager. Use the following invitation code to register:</p>
          <div style="text-align: center; padding: 15px; background: #007bff; color: white; font-size: 18px; font-weight: bold; border-radius: 5px;">
            ${invitationCode}
          </div>
          <p style="margin-top: 15px;">This code will expire on <strong>${expiresAt.toLocaleDateString()}</strong>.</p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.FRONTEND_URL}/register?invitation=${invitationCode}" style="padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; font-weight: bold; border-radius: 5px;">Register Now</a>
          </div>
          <p style="margin-top: 15px;">If you did not request this invitation, please ignore this email.</p>
          <hr>
          <p style="font-size: 12px; color: #555;">Best Regards, <br> Tetemeko Media Team</p>
        </div>
      `
    );

    return res.json({ message: 'Invitation sent successfully.' });
  } catch (error) {
    console.error('Invite manager error:', { error: error.message, email: req.body.email });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Register admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret, profilePictureUrl } = req.body;

    if (!name || !email || !password || !adminSecret) {
      throw new APIError('All fields are required', 400);
    }

    const sanitizedData = {
      name: sanitize(name, { allowedTags: [] }),
      email: sanitize(email, { allowedTags: [] }),
      profilePictureUrl: profilePictureUrl ? sanitize(profilePictureUrl, { allowedTags: [] }) : ''
    };

    if (await User.findOne({ email: sanitizedData.email })) {
      throw new APIError('Email already registered', 400);
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      throw new APIError('Invalid admin secret', 403);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      ...sanitizedData,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true
    });

    await newAdmin.save();

    const emailContent = generateAdminRegistrationSuccessEmail(sanitizedData.name);
    await sendEmail(sanitizedData.email, 'Welcome to Tetemeko Admin Panel', emailContent);

    return res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin registration error:', { error: error.message, email: req.body.email });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Register manager with invitation code
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const registerManager = async (req, res) => {
  try {
    const { name, email, password, invitationCode, profilePictureUrl } = req.body;

    if (!name || !email || !password || !invitationCode) {
      throw new APIError('All fields are required', 400);
    }

    const sanitizedData = {
      name: sanitize(name, { allowedTags: [] }),
      email: sanitize(email, { allowedTags: [] }),
      profilePictureUrl: profilePictureUrl ? sanitize(profilePictureUrl, { allowedTags: [] }) : ''
    };

    const user = await User.findOne({ 
      email: sanitizedData.email,
      invitationCode,
      invitationCodeExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new APIError('Invalid or expired invitation code', 400);
    }

    if (await User.findOne({ email: sanitizedData.email, invitationCode: { $ne: invitationCode } })) {
      throw new APIError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    user.name = sanitizedData.name;
    user.password = hashedPassword;
    user.verificationToken = verificationToken;
    user.profilePictureUrl = sanitizedData.profilePictureUrl;
    user.invitationCode = undefined;
    user.invitationCodeExpires = undefined;
    
    await user.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      sanitizedData.email,
      'Verify Your Email',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Verify Your Email</h2>
          <p>Hello ${sanitizedData.name},</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>Or copy and paste this link: ${verificationLink}</p>
        </div>
      `
    );

    return res.status(201).json({ message: 'Manager registered. Check email to verify your account.' });
  } catch (error) {
    console.error('Manager registration error:', { error: error.message, email: req.body.email });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Promote manager to admin
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new APIError('User not found', 404);
    }

    if (user.role !== UserRole.MANAGER) {
      throw new APIError('User is not a manager', 400);
    }

    user.role = UserRole.ADMIN;
    await user.save();

    return res.status(200).json({ message: 'User promoted to Admin' });
  } catch (error) {
    console.error('Promote to admin error:', { error: error.message, userId: req.params.userId });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Forgot password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new APIError('Email is required', 400);
    }

    const sanitizedEmail = sanitize(email, { allowedTags: [] });
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      throw new APIError('User not found', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const emailContent = generateResetPasswordEmail(user.name, resetToken);
    await sendEmail(sanitizedEmail, 'Reset Your Password', emailContent);

    return res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', { error: error.message, email: req.body.email });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Reset password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { newPassword } = req.body;

    if (!token || typeof token !== 'string') {
      throw new APIError('No or invalid reset token provided', 400);
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      throw new APIError('Password must be at least 6 characters', 400);
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new APIError('Invalid or expired reset token', 400);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const emailContent = generatePasswordResetSuccessEmail(user.name || 'User');
    await sendEmail(user.email, 'Password Reset Successful', emailContent);

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', { error: error.message });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Logout user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', { error: error.message });
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Resend verification email
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new APIError('Email is required', 400);
    }

    const sanitizedEmail = sanitize(email, { allowedTags: [] });
    const user = await User.findOne({ email: sanitizedEmail });

    if (!user) {
      throw new APIError('User not found', 404);
    }

    if (user.isVerified) {
      throw new APIError('User is already verified', 400);
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      sanitizedEmail,
      'Verify Your Email',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px;">
          <h2>Verify Your Email</h2>
          <p>Hello ${user.name},</p>
          <p>Please click the button below to verify your email address:</p>
          <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>Or copy and paste this link: ${verificationLink}</p>
        </div>
      `
    );

    return res.status(200).json({ message: 'Verification email resent successfully' });
  } catch (error) {
    console.error('Resend verification error:', { error: error.message, email: req.body.email });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Internal server error' });
  }
};

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      throw new APIError('Unauthorized: No user found in request', 401);
    }

    const user = await User.findById(req.user.id).select('-password -refreshToken -verificationToken -resetPasswordToken');
    if (!user) {
      throw new APIError('User not found', 404);
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', { error: error.message, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      throw new APIError('Unauthorized: No user found in request', 401);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new APIError('User not found', 404);
    }

    const { name, password, profilePictureUrl } = req.body;
    if (!name && !password && !profilePictureUrl) {
      throw new APIError('At least one field is required', 400);
    }

    const sanitizedData = {
      name: name ? sanitize(name, { allowedTags: [] }) : undefined,
      profilePictureUrl: profilePictureUrl ? sanitize(profilePictureUrl, { allowedTags: [] }) : undefined
    };

    if (sanitizedData.name) user.name = sanitizedData.name;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (sanitizedData.profilePictureUrl) user.profilePictureUrl = sanitizedData.profilePictureUrl;

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', { error: error.message, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Deactivate account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deactivateAccount = async (req, res) => {
  try {
    if (!req.user) {
      throw new APIError('Unauthorized: No user found in request', 401);
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new APIError('User not found', 404);
    }

    user.isActive = false;
    user.refreshToken = undefined;
    await user.save();

    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) });
    return res.status(200).json({ message: 'Account deactivated' });
  } catch (error) {
    console.error('Deactivate account error:', { error: error.message, userId: req.user?.id });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};

/**
 * Refresh token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new APIError('Refresh token is required', 401);
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
        if (err || !decoded) {
          reject(new APIError('Invalid refresh token', 403));
        } else {
          resolve(decoded);
        }
      });
    });

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      throw new APIError('Invalid refresh token', 403);
    }

    const newToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Refresh token error:', { error: error.message });
    const status = error.statusCode || 500;
    return res.status(status).json({ message: error.message || 'Server error' });
  }
};