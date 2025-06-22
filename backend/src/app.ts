import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
// import storeRoutes from "./routes/store.routes";
// import couponRoutes from "./routes/coupon.routes";
// import reviewRoutes from "./routes/review.routes";
// import orderRoutes from "./routes/order.routes";
// import paymentsRoutes from "./routes/payments.routes";
import categoryRoutes from "./routes/category.routes";
import episodeRoutes from "./routes/episode.routes";
import scheduleRoutes from "./routes/schedule.routes";
import stationRoutes from "./routes/station.routes";
import podcastRoutes from "./routes/podcast.routes";
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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // ✅ Explicit methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Headers allowed
  })
);
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ Routes
app.use("/api/auth", authRoutes);
// app.use("/api/payments", paymentsRoutes); // ✅ Payment routes
app.use("/api/products", productRoutes); // ✅ Product routes
// app.use("/api/stores", storeRoutes); // ✅ Store routes
app.use("/api/categories", categoryRoutes); // ✅ Category routes
app.use("/api/authors", authorRoutes); // ✅ Author routes
app.use("/api/news", newsRoutes); // ✅ News routes
// app.use("/api/orders", orderRoutes); // ✅ Order routes
// app.use("/api/coupons", couponRoutes); // ✅ Coupon routes
// app.use("/api/reviews", reviewRoutes); // ✅ Review routes
app.use("/api/users", userRoutes); // ✅ User routes (for admin)
app.use("/api/stations", stationRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/podcasts", podcastRoutes);
app.use("/api/episodes", episodeRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("Tetemeko media group is running... ✅");
});

export default app;
