import { Request, Response, NextFunction, RequestHandler } from "express";
import User, { IUser, UserRole } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

// Helper to generate JWT token
const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

// ✅ Register Web User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.WEB_USER,
      isVerified: false,
      verificationToken,
    });

    await newUser.save();

    // Construct verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;

    await sendEmail(email, "Verify Your Email", `Click the link to verify your email: ${verificationLink}`);

    res.status(201).json({ message: "User registered. Please verify your email." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Verify Email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query; // Read only the token from URL params

    if (!token) {
      res.status(400).json({ message: "Invalid verification link" });
      return;
    }

    // Find user by token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired verification token" });
      return;
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Login User
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ message: "Please verify your email first" });
      return;
    }

    // Generate authentication token
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Invite Manager
export const inviteManager = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const invitationCode = crypto.randomBytes(8).toString("hex"); // Shorter code
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    console.log(`📩 Sending invitation to: ${email}`);
    console.log(`📌 Invitation Code: ${invitationCode}`);

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
    );
    

    res.json({ message: "Invitation sent successfully." });
  } catch (err) {
    console.error("❌ Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Admin Registration (Most Secure Method)
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!name || !email || !password || !adminSecret) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    if (await User.findOne({ email })) {
      res.status(400).json({ message: "Email already registered." });
      return;
    }

    if (adminSecret !== process.env.ADMIN_SECRET) {
      res.status(403).json({ message: "Invalid admin secret." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isVerified: true,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("❌ Admin Registration Error:", err);
    res.status(500).json({ message: "Internal server error. Please try again later." });
  }
};


// ✅ Register Manager with Invitation Code
export const registerManager = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, invitationCode } = req.body;

    if (!invitationCode) {
      res.status(400).json({ message: "Invalid invitation code" });
      return;
    }

    if (await User.findOne({ email })) {
      res.status(400).json({ message: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newManager = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.MANAGER,
      isVerified: false,
      verificationToken,  // Store token in DB
    });

    await newManager.save();

    // Use environment variable for domain
    const domain = process.env.CLIENT_URL || "https://yourdomain.com";
    const verificationLink = `${domain}/auth/verify-email?token=${verificationToken}`;
    
    await sendEmail(
      email, 
      "Verify Your Email", 
      `<p>Hello ${name},</p>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>`
    );

    res.status(201).json({ message: "Manager registered. Check email to verify your account." });

  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Promote Manager to Admin
export const promoteToAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.role !== UserRole.MANAGER) {
      res.status(400).json({ message: "User is not a manager" });
      return;
    }

    user.role = UserRole.ADMIN;
    await user.save();

    res.status(200).json({ message: "User promoted to Admin" });
  } catch (err) {
    console.error("Error in promoteToAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiry
    await user.save();

    await sendEmail(email, "Reset Password", `Your reset code: ${resetToken}`);
    res.status(200).json({ message: "Reset code sent to email" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reset Password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, token, newPassword } = req.body;
    const user = await User.findOne({ email, resetPasswordToken: token });

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      res.status(400).json({ message: "Invalid or expired reset token" });
      return;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Logout (Invalidate refresh tokens)
export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Resend Email Verification
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User is already verified" });
      return;
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    // Construct verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${email}`;

    await sendEmail(email, "Verify Your Email", `Click the link to verify your email: ${verificationLink}`);

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get User Profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest;

  try {
    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized: No user found in request" });
      return;
    }

    const user = await User.findById(authReq.user.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update Profile
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest; // Ensure req is treated as AuthenticatedRequest

  try {
    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized: No user found in request" });
      return;
    }

    const user = await User.findById(authReq.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { name, password } = req.body;
    if (name) user.name = name;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Deactivate Account (Soft Delete)
export const deactivateAccount = async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest; // Ensure req is treated as AuthenticatedRequest

  try {
    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized: No user found in request" });
      return;
    }

    const user = await User.findById(authReq.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.isActive = false; // Assuming `isActive` exists in your User model
    await user.save();
    res.status(200).json({ message: "Account deactivated" });
  } catch (err) {
    console.error("Error deactivating account:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Refresh Token (Generate new JWT)
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, (err: Error | null, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "Invalid refresh token" });
        return;
      }

      const newToken = jwt.sign(
        { id: decoded.id, role: decoded.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      res.status(200).json({ token: newToken });
    });
  } catch (err) {
    console.error("Error refreshing token:", err);
    res.status(500).json({ message: "Server error" });
  }
};
