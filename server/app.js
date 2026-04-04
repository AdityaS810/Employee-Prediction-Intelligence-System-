const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const hrRoutes = require("./routes/hrRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api", employeeRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api", performanceRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

module.exports = app;
