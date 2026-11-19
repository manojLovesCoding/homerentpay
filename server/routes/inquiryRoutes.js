import { Router } from "express";

import {
  addInquiry,
  getLandlordInquiries,
} from "../controllers/inquiryController.js";

import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";

const inquiryRouter = Router();

// Public user submits an inquiry
inquiryRouter.post("/add", addInquiry);

// Landlord retrieves inquiries for their properties
inquiryRouter.get(
  "/landlord",
  verifyToken,
  authorizeRoles("landlord"),
  getLandlordInquiries,
);

export default inquiryRouter;
