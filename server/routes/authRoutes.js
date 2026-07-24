import { Router } from "express";
import {
  register,
  login,
  createTenant,
  getTenants,
  deactivateTenant,
  updateTenant,
  updateTenantPassword,
  getUsers,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
//import { protect } from "../middleware/auth.js";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post(
  "/create-tenant",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  createTenant,
);

authRouter.get(
  "/users",
  verifyToken,
  authorizeRoles("admin"),
  getUsers
);

authRouter.get(
  "/tenants",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  getTenants,
);
authRouter.put(
  "/tenant/:id",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  updateTenant,
);

authRouter.patch(
  "/tenant/:id/deactivate",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  deactivateTenant,
);

authRouter.put(
  "/tenant/:id/password",
  verifyToken,
  authorizeRoles("admin", "landlord"),
  updateTenantPassword,
);

export default authRouter;
