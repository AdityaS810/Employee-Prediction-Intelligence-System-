require("dotenv").config();

const bcrypt = require("bcryptjs");
const app = require("./app");
const connectDB = require("./config/db");
const User = require("./models/User");

async function ensureDefaultHR() {
  const { DEFAULT_HR_EMAIL, DEFAULT_HR_NAME, DEFAULT_HR_PASSWORD } = process.env;

  if (!DEFAULT_HR_EMAIL || !DEFAULT_HR_PASSWORD || !DEFAULT_HR_NAME) {
    return;
  }

  const existing = await User.findOne({ email: DEFAULT_HR_EMAIL.toLowerCase() });
  if (existing) {
    return;
  }

  const password = await bcrypt.hash(DEFAULT_HR_PASSWORD, 10);
  await User.create({
    name: DEFAULT_HR_NAME,
    email: DEFAULT_HR_EMAIL,
    password,
    role: "hr"
  });

  console.log(`Default HR account created for ${DEFAULT_HR_EMAIL}`);
}

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

async function startServer() {
  try {
    await connectDB();
    await ensureDefaultHR();
    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
