import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import propertyRouter from "./routes/propertyRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ serve uploaded images
app.use("/uploads", express.static("uploads"));

// routes
app.get("/", (req, res) => res.send("server is running"));

app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);

await connectDB();

app.listen(PORT, () => console.log(`server running on port ${PORT}`));