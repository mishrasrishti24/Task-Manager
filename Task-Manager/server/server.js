const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ─── CORS Configuration ────────────────────────────────────────────
// Build allowed origins list, filtering out undefined/empty values
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://task-manager-production-d2e2.up.railway.app",
    process.env.CLIENT_URL,
].filter(Boolean); // Remove undefined/null/empty entries

console.log("[CORS] Allowed origins:", allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman, health checks)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn(`[CORS] Blocked request from origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─── Body Parsing ──────────────────────────────────────────────────
app.use(express.json());

// ─── API Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// ─── Health Check ──────────────────────────────────────────────────
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        message: "API Running",
        timestamp: new Date().toISOString(),
    });
});

// ─── MongoDB Connection ────────────────────────────────────────────
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, // Fail fast if MongoDB is unreachable
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err.message);
        // In production, exit so Railway can restart the container
        process.exit(1);
    }
};

// Handle connection events for better observability
mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected. Attempting reconnect...");
});

mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB runtime error:", err.message);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ─── Start Server ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    });
});