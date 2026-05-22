const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoute");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// ✅ IMPORTANT: your frontend URLs (ADD ALL YOU USE)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://task-manager-production-d2e2.up.railway.app"
];

// ✅ CORS FIX (production-safe)
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
    credentials: true
}));

// ✅ Preflight support (VERY IMPORTANT for login POST)
app.options("*", cors());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Root test route
app.get("/", (req, res) => {
    res.send("API Running");
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Port (Railway injects PORT automatically)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});