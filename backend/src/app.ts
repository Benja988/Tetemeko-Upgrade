import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/category.routes";
import authorRoutes from "./routes/author.routes"; // ✅ Author routes
import newsRoutes from "./routes/news.routes";
import cookieParser from "cookie-parser";

// Load env
dotenv.config();

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ Frontend URL
    credentials: true,               // ✅ Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Explicit methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Headers allowed
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes); // ✅ Category routes
app.use("/api/authors", authorRoutes); // ✅ Author routes
app.use("/api/news", newsRoutes); // ✅ News routes
app.use("/api/users", userRoutes); // ✅ User routes (for admin)

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Tetemeko media group is running... ✅");
});

export default app;
