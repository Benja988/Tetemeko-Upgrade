import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;

// Validate required environment variables
if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
  throw new Error("Missing required email environment variables.");
}

// Create transporter with better type safety
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: Number(EMAIL_PORT), // Ensure it's a number
  secure: EMAIL_PORT === "465", // Convert string to boolean
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Prevent certificate validation errors
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const info = await transporter.sendMail({
      from: `"Tetemeko Media Group" <${EMAIL_USER}>`, // Use authenticated email
      to,
      subject,
      text: html.replace(/<[^>]+>/g, ""), // Strip HTML tags as fallback
      html,
    });
    console.log(`✅ Email sent successfully: ${info.messageId}`);
  } catch (error: any) {
    console.error(`❌ Error sending email: ${error.message || error}`);
  }
};

