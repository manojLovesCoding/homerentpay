import { Router } from "express";
import {
  addProperty,
  deleteProperty,
  getProperties,
  getHomeProperties,
  updateProperty,
  removeTenant,
  assignTenant,
  getAssignedTenants,
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


propertyRouter.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  upload.single("image"),
  updateProperty
);

propertyRouter.put(
  "/:id/assign-tenant",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  assignTenant
);

propertyRouter.put(
  "/:id/remove-tenant",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  removeTenant
);

propertyRouter.get(
  "/assigned-tenants",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  getAssignedTenants
);



export default propertyRouter;