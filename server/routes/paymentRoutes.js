import { Router } from "express";
import {
  createOrder,
  getLandlordSummary,
  getPaymentHistory,
  verifyPayment,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/role.js";
import { getPaymentStatus } from "../controllers/propertyController.js";

const paymentRouter = Router();

paymentRouter.post(
  "/create-order",
  verifyToken,
  authorizeRoles("tenant"),
  createOrder
);

paymentRouter.post(
  "/verify",
  verifyToken,
  authorizeRoles("tenant"),
  verifyPayment
);

paymentRouter.get(
  "/status",
  verifyToken,
  authorizeRoles("tenant"),
  getPaymentStatus
);

paymentRouter.get(
  "/history",
  verifyToken,
  authorizeRoles("tenant"),
  getPaymentHistory
);

paymentRouter.get(
  "/landlord-summary",
  verifyToken,
  authorizeRoles("landlord"),
  getLandlordSummary
);

export default paymentRouter;