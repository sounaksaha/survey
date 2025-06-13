import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import connectDB from "./config/db.js";
import "./config/passport.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// import userRoutes from "./routes/userRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:3000", // or the actual domain of your frontend
  credentials: true
}));
connectDB();

app.use(express.json());
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api",uploadRoutes)

// app.use("/api/user", userRoutes);
// app.use("/api/admin", adminRoutes);

export default app;
