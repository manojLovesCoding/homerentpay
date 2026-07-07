import { Router } from "express";
import {
  addProperty,
  deleteProperty,
  getProperties,
  getHomeProperties,
} from "../controllers/propertyController.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { upload } from "../middleware/upload.js";

const propertyRouter = Router();

propertyRouter.get("/home", getHomeProperties);

propertyRouter.post(
  "/add",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  upload.single("image"),
  addProperty
);

propertyRouter.get("/", getProperties);

propertyRouter.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  deleteProperty
);

export default propertyRouter;