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
  createLandlord,
  getLandlords,
  updateLandlord,
  deactivateLandlord,
  updateLandlordPassword,
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


// ADMIN - CREATE LANDLORD
authRouter.post(
  "/create-landlord",
  verifyToken,
  authorizeRoles("admin"),
  createLandlord
);

// ADMIN - GET ALL LANDLORDS
authRouter.get(
  "/landlords",
  verifyToken,
  authorizeRoles("admin"),
  getLandlords
);

// ADMIN - UPDATE LANDLORD
authRouter.put(
  "/landlord/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateLandlord
);

// ADMIN - DEACTIVATE LANDLORD
authRouter.patch(
  "/landlord/:id/deactivate",
  verifyToken,
  authorizeRoles("admin"),
  deactivateLandlord
);

// ADMIN - UPDATE LANDLORD PASSWORD
authRouter.put(
  "/landlord/:id/password",
  verifyToken,
  authorizeRoles("admin"),
  updateLandlordPassword
);


export default authRouter;
