export const generateVerificationEmail = (name: string, verificationLink: string): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border-radius: 8px; background-color: #f1f4f6; color: #07131F;">
    <h2 style="color: #07131F;">Welcome to Tetemeko Media Group, ${name}!</h2>
    <p style="font-size: 16px; line-height: 1.5;">
      Thanks for joining our community. To get started, please verify your email address by clicking the button below:
    </p>
    <a href="${verificationLink}" style="display: inline-block; padding: 14px 28px; margin: 20px 0; background-color: #07131F; color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 6px;">
      Verify My Email
    </a>
    <p style="font-size: 14px; line-height: 1.5; margin-top: 20px;">
      If you didn’t create an account, no worries — you can safely ignore this email.
    </p>
    <p style="font-size: 14px; margin-top: 24px; font-style: italic;">This verification link is valid for the next 24 hours.</p>
    <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;">
    <p style="font-size: 14px; color: #4b5c6b;">
      Need help? Reach out to us at 
      <a href="mailto:support@tetemeko.com" style="color: #07131F; text-decoration: underline;">support@tetemeko.com</a>
    </p>
    <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Tetemeko Media Group. All rights reserved.</p>
  </div>
`;


export const sendVerificationSuccessEmail = (name: string, email: string): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border-radius: 8px; background-color: #f1f4f6; color: #07131F;">
    <h2 style="color: #07131F;">Email Verified Successfully, ${name}!</h2>
    <p style="font-size: 16px; line-height: 1.6;">
      Your email has been successfully verified. You can now log in to your Tetemeko Media Group account and start exploring our services, streaming content, and more.
    </p>
    <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 14px 28px; margin: 20px 0; background-color: #07131F; color: #ffffff; font-weight: bold; text-decoration: none; border-radius: 6px;">
      Login to My Account
    </a>
    <p style="font-size: 14px; margin-top: 20px;">
      If you have any questions or need help, please contact our support team at 
      <a href="mailto:support@tetemeko.com" style="color: #07131F; text-decoration: underline;">support@tetemeko.com</a>
    </p>
    <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;">
    <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Tetemeko Media Group. All rights reserved.</p>
  </div>
`;


export const generateResetPasswordEmail = (name: string, resetToken: string): string => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border-radius: 8px; background-color: #f1f4f6; color: #07131F;">
      <h2 style="color: #07131F;">Reset Your Password</h2>
      <p>Hello ${name || "User"},</p>
      <p>We received a request to reset your password for your Tetemeko Media Group account. You can reset your password by clicking the button below:</p>
      <a href="${resetLink}" style="display: inline-block; padding: 14px 28px; margin: 20px 0; background-color: #07131F; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
      <p>This link will expire in 1 hour. If you didn’t request a password reset, you can safely ignore this email.</p>
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;">
      <p style="font-size: 14px; color: #999;">Need help? Contact us at <a href="mailto:support@tetemeko.com" style="color: #07131F;">support@tetemeko.com</a></p>
      <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Tetemeko Media Group. All rights reserved.</p>
    </div>
  `;
};

export const generatePasswordResetSuccessEmail = (name: string): string => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border-radius: 8px; background-color: #f1f4f6; color: #07131F;">
      <h2 style="color: #07131F;">Your Password Was Reset</h2>
      <p>Hi ${name || "User"},</p>
      <p>This is a confirmation that your password has been successfully reset. You can now log in with your new password.</p>
      <a href="${process.env.FRONTEND_URL}/login" style="display: inline-block; padding: 14px 28px; margin: 20px 0; background-color: #07131F; color: #ffffff; text-decoration: none; border-radius: 6px;">Go to Login</a>
      <p>If you did not perform this action, please contact our support team immediately.</p>
      <hr style="margin: 40px 0; border: none; border-top: 1px solid #ccc;">
      <p style="font-size: 14px; color: #999;">Need help? Email us at <a href="mailto:support@tetemeko.com" style="color: #07131F;">support@tetemeko.com</a></p>
      <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Tetemeko Media Group. All rights reserved.</p>
    </div>
  `;
};


// utils/emailTemplate.ts

export const generateAdminRegistrationSuccessEmail = (name: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #07131F; color: #f0f0f0; border-radius: 8px;">
    <h2 style="color: #59a6ff;">Welcome aboard, ${name}!</h2>
    <p>Congratulations! Your admin account has been successfully created and verified.</p>
    <p>You can now log in to the admin dashboard and start managing your platform.</p>
    <a href="${process.env.FRONTEND_URL}/admin/login" style="display: inline-block; padding: 12px 24px; margin: 20px 0; background-color: #59a6ff; color: #07131F; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Admin Login</a>
    <p>If you did not register for an admin account, please contact support immediately.</p>
    <hr style="border-color: #2e3c50; margin: 30px 0;">
    <p style="font-size: 14px; color: #a0a0a0;">Need help? Reach out at <a href="mailto:support@tetemeko.com" style="color: #59a6ff;">support@tetemeko.com</a></p>
    <p style="font-size: 12px; color: #777;">&copy; ${new Date().getFullYear()} Tetemeko Media Group. All rights reserved.</p>
  </div>
`


