import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";

import authRouter from "./routes/authRoutes.js";
import propertyRouter from "./routes/propertyRoutes.js";
import connectCloudinary from "./config/cloudinary.js";
import paymentRouter from "./routes/paymentRoutes.js";
import dns from "dns";

const app = express();
const PORT = process.env.PORT || 4000;

dns.setServers(["1.1.1.1","8.8.8.8"])

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// routes
app.get("/", (req, res) => res.send("server is running"));

app.use("/api/auth", authRouter);
app.use("/api/property", propertyRouter);
app.use("/api/payment", paymentRouter);

await connectDB();
connectCloudinary();

app.listen(PORT, () => console.log(`server running on port ${PORT}`));