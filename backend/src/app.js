"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
// import storeRoutes from "./routes/store.routes";
// import couponRoutes from "./routes/coupon.routes";
// import reviewRoutes from "./routes/review.routes";
// import orderRoutes from "./routes/order.routes";
// import paymentsRoutes from "./routes/payments.routes";
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const episode_routes_1 = __importDefault(require("./routes/episode.routes"));
const schedule_routes_1 = __importDefault(require("./routes/schedule.routes"));
const station_routes_1 = __importDefault(require("./routes/station.routes"));
const podcast_routes_1 = __importDefault(require("./routes/podcast.routes"));
const author_routes_1 = __importDefault(require("./routes/author.routes")); // ✅ Author routes
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// Load env
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // ✅ Frontend URL
    credentials: true, // ✅ Allow cookies and credentials
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // ✅ Explicit methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Headers allowed
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, cookie_parser_1.default)());
// ✅ Rate Limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
app.use(limiter);
// ✅ Routes
app.use("/api/auth", auth_routes_1.default);
// app.use("/api/payments", paymentsRoutes); // ✅ Payment routes
app.use("/api/products", product_routes_1.default); // ✅ Product routes
// app.use("/api/stores", storeRoutes); // ✅ Store routes
app.use("/api/categories", category_routes_1.default); // ✅ Category routes
app.use("/api/authors", author_routes_1.default); // ✅ Author routes
app.use("/api/news", news_routes_1.default); // ✅ News routes
// app.use("/api/orders", orderRoutes); // ✅ Order routes
// app.use("/api/coupons", couponRoutes); // ✅ Coupon routes
// app.use("/api/reviews", reviewRoutes); // ✅ Review routes
app.use("/api/users", user_routes_1.default); // ✅ User routes (for admin)
app.use("/api/stations", station_routes_1.default);
app.use("/api/schedules", schedule_routes_1.default);
app.use("/api/podcasts", podcast_routes_1.default);
app.use("/api/episodes", episode_routes_1.default);
// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Tetemeko media group is running... ✅");
});
exports.default = app;
