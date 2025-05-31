import { Request, Response, NextFunction, RequestHandler } from 'express'
import User, { IUser, UserRole } from '../models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { sendEmail } from '../utils/sendEmail'
import { AuthenticatedRequest } from '../middlewares/auth.middleware'
import { generateVerificationEmail } from '../utils/emailTemplate'
import { sendVerificationSuccessEmail } from '../utils/emailTemplate'
import { generateResetPasswordEmail } from '../utils/emailTemplate'
import { generatePasswordResetSuccessEmail } from '../utils/emailTemplate'
import { generateAdminRegistrationSuccessEmail } from '../utils/emailTemplate'

// Helper to generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: '7d' }
  )
}

// ✅ Register User
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, profilePictureUrl } = req.body

    if (await User.findOne({ email })) {
      res.status(400).json({ message: 'Email already registered' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = crypto.randomBytes(32).toString('hex')

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.WEB_USER,
      isVerified: false,
      verificationToken,
      profilePictureUrl: profilePictureUrl || '',
    })

    await newUser.save()

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

    const emailContent = generateVerificationEmail(name, verificationLink)

    await sendEmail(
      email,
      'Welcome to Tetemeko Media! Please Verify Your Email',
      emailContent
    )

    res
      .status(201)
      .json({ message: 'User registered. Please verify your email.' })
  } catch (err) {
    console.error('Registration error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Verify Email
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.query

    if (!token || typeof token !== 'string') {
      res.status(400).json({ message: 'Invalid verification link' })
      return
    }

    const user = await User.findOne({ verificationToken: token })

    if (!user) {
      res.status(400).json({ message: 'Invalid or expired verification token' })
      return
    }

    user.isVerified = true
    user.verificationToken = undefined
    await user.save()

    // Send verification success email
    const emailContent = sendVerificationSuccessEmail(user.name, user.email)
    await sendEmail(user.email, "You're Verified! 🎉", emailContent)

    res
      .status(200)
      .json({ message: 'Email verified successfully. You can now log in.' })
  } catch (error) {
    console.error('Error verifying email:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' })
      return
    }

    const user = await User.findOne({ email })

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    if (!user.isVerified) {
      res.status(403).json({ message: 'Please verify your email first' })
      return
    }

    // ✅ Generate access token
    const token = generateToken(user)

    // ✅ Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_SECRET as string,
      { expiresIn: '7d' }
    )

    // ✅ Save refresh token to DB
    user.refreshToken = refreshToken
    await user.save()

    // ✅ Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

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
    })

    console.log(`🔑 Login successful for user: ${user.email}`)
    
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}


// ✅ Invite Manager
export const inviteManager = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const invitationCode = crypto.randomBytes(8).toString('hex') // Shorter code
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    console.log(`📩 Sending invitation to: ${email}`)
    console.log(`📌 Invitation Code: ${invitationCode}`)

    await sendEmail(
      email,
      "You're Invited to Join as a Manager!",
      `
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
      `
    )

    res.json({ message: 'Invitation sent successfully.' })
  } catch (err) {
    console.error('❌ Server error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Admin Registration (Most Secure Method)
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, adminSecret, profilePictureUrl } = req.body;

    if (!name || !email || !password || !adminSecret) {
      res.status(400).json({ message: 'All fields are required.' });
      return;
    }

    if (await User.findOne({ email })) {
      res.status(400).json({ message: 'Email already registered.' });
      console.log('⚠️ Email already registered:', email);
      
      return;
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      res.status(403).json({ message: 'Invalid admin secret.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true,
      profilePictureUrl: profilePictureUrl || '',
    });

    await newAdmin.save();

    // Send admin registration success email
    const emailContent = generateAdminRegistrationSuccessEmail(name);
    await sendEmail(email, "Welcome to Tetemeko Admin Panel", emailContent);

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    console.error('❌ Admin Registration Error:', err);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
};

// ✅ Register Manager with Invitation Code
export const registerManager = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, invitationCode, profilePictureUrl } = req.body

    if (!invitationCode) {
      res.status(400).json({ message: 'Invalid invitation code' })
      return
    }

    if (await User.findOne({ email })) {
      res.status(400).json({ message: 'Email already registered' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')

    const newManager = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.MANAGER,
      isVerified: false,
      verificationToken, // Store token in DB
      profilePictureUrl: profilePictureUrl || '',
    })

    await newManager.save()

    // Use environment variable for domain
    const domain = process.env.CLIENT_URL || 'https://yourdomain.com'
    const verificationLink = `${domain}/auth/verify-email?token=${verificationToken}`

    await sendEmail(
      email,
      'Verify Your Email',
      `<p>Hello ${name},</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>`
    )

    res
      .status(201)
      .json({
        message: 'Manager registered. Check email to verify your account.',
      })
  } catch (err) {
    console.error('❌ Registration error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Promote Manager to Admin
export const promoteToAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (user.role !== UserRole.MANAGER) {
      res.status(400).json({ message: 'User is not a manager' })
      return
    }

    user.role = UserRole.ADMIN
    await user.save()

    res.status(200).json({ message: 'User promoted to Admin' })
  } catch (err) {
    console.error('Error in promoteToAdmin:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Forgot Password
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    await user.save()

    const emailContent = generateResetPasswordEmail(user.name, resetToken)
    await sendEmail(user.email, 'Reset Your Password', emailContent)

    res.status(200).json({ message: 'Password reset email sent successfully' })
  } catch (err) {
    console.error('Error in forgotPassword:', err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ✅ Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
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

    const user = await User.findOne({
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
    user.password = await bcrypt.hash(newPassword, 10);

    // 🧹 Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    // 💾 Save updated user
    await user.save();
    console.log("✅ Password updated successfully for:", user.email);

    // 📧 Send confirmation email
    const emailContent = generatePasswordResetSuccessEmail(user.name || "User");

    try {
      await sendEmail(user.email, "Password Reset Successful", emailContent);
      console.log(`✅ Confirmation email sent to ${user.email}`);
    } catch (emailError) {
      console.error("❌ Failed to send confirmation email:", emailError);
    }

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("🔥 Error in resetPassword handler:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Logout (Invalidate refresh tokens)
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0) })
    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Resend Email Verification
export const resendVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body

    if (!email) {
      res.status(400).json({ message: 'Email is required' })
      return
    }

    const user = await User.findOne({ email })

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    if (user.isVerified) {
      res.status(400).json({ message: 'User is already verified' })
      return
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    user.verificationToken = verificationToken
    await user.save()

    // Construct verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`

    await sendEmail(
      email,
      'Verify Your Email',
      `Click the link to verify your email: ${verificationLink}`
    )

    res.status(200).json({ message: 'Verification email resent successfully' })
  } catch (error) {
    console.error('Error resending verification email:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// ✅ Get User Profile
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest

  try {
    if (!authReq.user) {
      res
        .status(401)
        .json({ message: 'Unauthorized: No user found in request' })
      return
    }

    const user = await User.findById(authReq.user.id).select('-password')

    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    res.status(200).json(user)
  } catch (err) {
    console.error('Error fetching profile:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Update Profile
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest // Ensure req is treated as AuthenticatedRequest

  try {
    if (!authReq.user) {
      res
        .status(401)
        .json({ message: 'Unauthorized: No user found in request' })
      return
    }

    const user = await User.findById(authReq.user.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const { name, password } = req.body
    if (name) user.name = name
    if (password) user.password = await bcrypt.hash(password, 10)

    await user.save()
    res.status(200).json({ message: 'Profile updated successfully' })
  } catch (err) {
    console.error('Error updating profile:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Deactivate Account (Soft Delete)
export const deactivateAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as AuthenticatedRequest // Ensure req is treated as AuthenticatedRequest

  try {
    if (!authReq.user) {
      res
        .status(401)
        .json({ message: 'Unauthorized: No user found in request' })
      return
    }

    const user = await User.findById(authReq.user.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    user.isActive = false // Assuming `isActive` exists in your User model
    await user.save()
    res.status(200).json({ message: 'Account deactivated' })
  } catch (err) {
    console.error('Error deactivating account:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ✅ Refresh Token (Generate new JWT)
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body // ✅ POSTed in body

    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET as string,
      (err: Error | null, decoded: any) => {
        if (err || !decoded) {
          res.status(403).json({ message: 'Invalid refresh token' })
          return
        }

        // ✅ Create a new access token
        const newToken = jwt.sign(
          { id: decoded.id, role: decoded.role },
          process.env.JWT_SECRET as string,
          { expiresIn: '1h' } // short-lived access token
        )

        res.status(200).json({ token: newToken })
      }
    )
  } catch (err) {
    console.error('Error refreshing token:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

