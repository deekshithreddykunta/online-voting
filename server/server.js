const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

const adminRoutes = require("./routes/adminRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const officerRoutes = require("./routes/officerRoutes");
const voterRoutes = require("./routes/voterRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const positionRoutes = require("./routes/positionRoutes");
const electionRoutes = require("./routes/electionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const voteRoutes = require("./routes/voteRoutes");
const candidatePortalRoutes = require("./routes/candidatePortalRoutes");
const officerPortalRoutes = require("./routes/officerPortalRoutes");
const app = express();

// =========================
// Middleware
// =========================

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// =========================
// Static Upload Folder
// =========================

const uploadsPath = path.join(__dirname, "uploads");

console.log("Uploads Folder:", uploadsPath);

app.use("/uploads", express.static(uploadsPath));

// =========================
// Public Routes
// =========================

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);

// =========================
// Admin Routes
// =========================

app.use("/api/admin", adminRoutes);
app.use("/api/admin", dashboardRoutes);
app.use("/api/admin/officers", officerRoutes);
app.use("/api/admin/voters", voterRoutes);
app.use("/api/admin/candidates", candidateRoutes);
app.use("/api/admin/positions", positionRoutes);
app.use("/api/admin/elections", electionRoutes);
app.use("/api/admin/results", resultRoutes);
app.use("/api/candidate", candidatePortalRoutes);
app.use("/api/officer", officerPortalRoutes);
// =========================
// Voter Routes
// =========================

app.use("/api/vote", voteRoutes);

// =========================
// Test Route
// =========================

app.get("/", (req, res) => {
    res.send("Secure Online Voting System Backend Running...");
});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server Running on Port ${PORT}`);
});