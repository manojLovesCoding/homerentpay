import { Router } from "express";
import { addProperty } from "../controllers/propertyController.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";


const propertyRouter = Router();

propertyRouter.post(
  "/add",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  upload.single("image"),
  addProperty
);

export default propertyRouter;