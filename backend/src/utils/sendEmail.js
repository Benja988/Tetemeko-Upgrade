import nodemailer from 'nodemailer';
import sanitize from 'sanitize-html';
import logger from './logger.js';
import { config } from 'dotenv';

// Load environment variables
config();

// Email configuration with defaults
const EMAIL_CONFIG = {
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465',
  user: process.env.EMAIL_USER || 'no-reply@tetemeko.com',
  pass: process.env.EMAIL_PASS || '',
  from: process.env.EMAIL_FROM || '"Tetemeko Media Group" <no-reply@tetemeko.com>',
  maxRetries: Number(process.env.EMAIL_MAX_RETRIES) || 3,
  retryDelay: Number(process.env.EMAIL_RETRY_DELAY) || 1000, // ms
  maxEmailsPerMinute: Number(process.env.EMAIL_RATE_LIMIT) || 100
};

// Validate required environment variables
if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.EMAIL_FROM) {
  logger.error('Missing required email environment variables', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER
  });
  throw new Error('Missing required email environment variables');
}

// Create email transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  secure: EMAIL_CONFIG.secure,
  auth: {
    user: EMAIL_CONFIG.user,
    pass: EMAIL_CONFIG.pass
  },
  tls: {
    rejectUnauthorized: false // Handle self-signed certificates
  },
  pool: true, // Enable connection pooling for high volume
  maxMessages: 100, // Limit messages per connection
  rateLimit: EMAIL_CONFIG.maxEmailsPerMinute
});

// Simple in-memory queue for email sending
const emailQueue = [];
let isProcessingQueue = false;

/**
 * Validate email content and recipients
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} [text] - Plain text content
 */
const validateEmail = (to, subject, html, text) => {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  
  // Validate recipients
  const recipients = Array.isArray(to) ? to : [to];
  if (!recipients.every(email => emailRegex.test(email))) {
    throw new Error('Invalid recipient email address');
  }

  // Validate subject
  if (!subject || typeof subject !== 'string' || subject.length > 998) {
    throw new Error('Invalid or too long subject line');
  }

  // Validate content
  if (!html && !text) {
    throw new Error('Email content (HTML or text) is required');
  }

  // Sanitize inputs
  return {
    to: recipients.map(email => sanitize(email, { allowedTags: [] })),
    subject: sanitize(subject, { allowedTags: [] }),
    html: html ? sanitize(html, { allowedTags: ['div', 'p', 'a', 'h2', 'strong', 'em', 'hr'] }) : undefined,
    text: text ? sanitize(text, { allowedTags: [] }) : html ? html.replace(/<[^>]+>/g, '') : undefined
  };
};

/**
 * Process email queue
 */
const processQueue = async () => {
  if (isProcessingQueue || emailQueue.length === 0) return;

  isProcessingQueue = true;
  while (emailQueue.length > 0) {
    const { mailOptions, resolve, reject, retries = 0 } = emailQueue.shift();

    try {
      const info = await transporter.sendMail({
        ...mailOptions,
        headers: {
          'X-Correlation-ID': mailOptions.correlationId || uuidv4(),
          'X-Priority': mailOptions.priority || '3' // Normal priority
        }
      });

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: mailOptions.to,
        subject: mailOptions.subject,
        correlationId: mailOptions.correlationId
      });

      resolve(info);
    } catch (error) {
      if (retries < EMAIL_CONFIG.maxRetries) {
        logger.warn('Retrying email send', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          retryCount: retries + 1,
          error: error.message
        });

        setTimeout(() => {
          emailQueue.push({ mailOptions, resolve, reject, retries: retries + 1 });
        }, EMAIL_CONFIG.retryDelay);
      } else {
        logger.error('Failed to send email after retries', {
          to: mailOptions.to,
          subject: mailOptions.subject,
          error: error.message,
          correlationId: mailOptions.correlationId
        });
        reject(error);
      }
    }
  }

  isProcessingQueue = false;
};

/**
 * Send email with retry and queueing
 * @param {string|string[]} to - Recipient email(s)
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {Object} [options] - Additional options
 * @param {string} [options.text] - Plain text content
 * @param {string|string[]} [options.cc] - CC recipient(s)
 * @param {string|string[]} [options.bcc] - BCC recipient(s)
 * @param {string} [options.correlationId] - Correlation ID for tracking
 * @param {string} [options.priority] - Email priority (1-5)
 * @returns {Promise} Resolves with email info or rejects with error
 */
export const sendEmail = async (to, subject, html, options = {}) => {
  const { text, cc, bcc, correlationId, priority } = options;

  try {
    // Validate and sanitize inputs
    const validated = validateEmail(to, subject, html, text);

    // Prepare mail options
    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to: validated.to,
      subject: validated.subject,
      html: validated.html,
      text: validated.text,
      cc: cc ? (Array.isArray(cc) ? cc.map(email => sanitize(email, { allowedTags: [] })) : sanitize(cc, { allowedTags: [] })) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.map(email => sanitize(email, { allowedTags: [] })) : sanitize(bcc, { allowedTags: [] })) : undefined,
      correlationId,
      priority
    };

    // Return promise for queue processing
    return new Promise((resolve, reject) => {
      emailQueue.push({ mailOptions, resolve, reject });
      processQueue();
    });
  } catch (error) {
    logger.error('Email validation error', {
      to,
      subject,
      error: error.message,
      correlationId
    });
    throw error;
  }
};

// Initialize logger with email service info
logger.info('Email service initialized', {
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  from: EMAIL_CONFIG.from
});