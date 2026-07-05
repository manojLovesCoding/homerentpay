import { Router } from "express";
import { register, login } from "../controllers/authController.js";
//import { protect } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
