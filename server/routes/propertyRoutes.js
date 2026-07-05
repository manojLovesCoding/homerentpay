import { Router } from "express";
import { addProperty } from "../controllers/propertyController.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const propertyRouter = Router();

propertyRouter.post(
  "/add",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  addProperty,
);

export default propertyRouter;
