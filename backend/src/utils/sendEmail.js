"use strict";
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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;
// Validate required environment variables
if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !EMAIL_FROM) {
    throw new Error("Missing required email environment variables.");
}
// Create transporter with better type safety
const transporter = nodemailer_1.default.createTransport({
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
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: `"Tetemeko Media Group" <${EMAIL_USER}>`, // Use authenticated email
            to,
            subject,
            text: html.replace(/<[^>]+>/g, ""), // Strip HTML tags as fallback
            html,
        });
        console.log(`✅ Email sent successfully: ${info.messageId}`);
    }
    catch (error) {
        console.error(`❌ Error sending email: ${error.message || error}`);
    }
});
exports.sendEmail = sendEmail;
