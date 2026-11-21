import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import Property from "../models/Property.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";
import User from "../models/User.js";
import { getUnpaidMonths } from "../utils/rent.js";

export const createOrder = async (req, res) => {
  try {
    const { propertyId } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (
      property.status !== "rented" ||
      property.tenant?.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this property",
      });
    }

    // Oldest unpaid month is chosen on the server so it can't be tampered with
    const unpaid = await getUnpaidMonths(property, req.user.id);

    if (unpaid.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No pending rent to pay",
      });
    }

    const target = unpaid[0];

    const order = await razorpay.orders.create({
      amount: property.rent * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      tenant: req.user.id,
      landlord: property.landlord,
      property: property._id,
      amount: property.rent,
      orderId: order.id,
      status: "created",
      month: target.month,
      year: target.year,
    });

    res.status(201).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      billingMonth: { month: target.month, year: target.year },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Payment record must belong to the logged-in tenant
    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
      tenant: req.user.id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.paymentId = razorpay_payment_id;
    payment.signature = razorpay_signature;
    payment.status = "paid";
    payment.paidAt = new Date();

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({
      tenant: req.user.id,
      status: "paid",
    })
      .populate("property", "title")
      .sort({
        year: -1,
        month: -1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getLandlordSummary = async (req, res) => {
  try {
    const landlordId = req.user.id;

    // Aggregation does not auto-cast strings to ObjectId
    const landlordObjectId = new mongoose.Types.ObjectId(landlordId);

    const date = new Date();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Total properties
    const totalProperties = await Property.countDocuments({
      landlord: landlordId,
    });

    // Total tenants
    const totalTenants = await User.countDocuments({
      role: "tenant",
      createdBy: landlordId,
      isActive: true,
    });

    // Monthly income
    const incomeResult = await Payment.aggregate([
      {
        $match: {
          landlord: landlordObjectId,
          status: "paid",
          month,
          year,
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const monthlyIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;

    // Pending rent: every unpaid month of every rented property
    const rentedProperties = await Property.find({
      landlord: landlordId,
      status: "rented",
      tenant: { $ne: null },
    });

    const unpaidPerProperty = await Promise.all(
      rentedProperties.map((property) =>
        getUnpaidMonths(property, property.tenant),
      ),
    );

    const pendingRent = unpaidPerProperty.reduce(
      (sum, months) =>
        sum + months.reduce((total, m) => total + Number(m.amount || 0), 0),
      0,
    );

    // Recent payments (latest paid first)
    const payments = await Payment.find({
      landlord: landlordId,
      status: "paid",
    })
      .populate("tenant", "name email")
      .populate("property", "title")
      .sort({
        paidAt: -1,
        createdAt: -1,
      })
      .limit(10);

    res.status(200).json({
      success: true,

      stats: {
        totalProperties,
        totalTenants,
        monthlyIncome,
        pendingRent,
      },

      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("tenant", "name email")
      .populate("property", "title city")
      .populate("landlord", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalTenants = await User.countDocuments({
      role: "tenant",
    });

    const totalLandlords = await User.countDocuments({
      role: "landlord",
    });

    const totalProperties = await Property.countDocuments();

    const revenueResult = await Payment.aggregate([
      {
        $match: {
          status: "paid",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const pendingPayments = await Payment.countDocuments({
      status: "created",
    });

    const recentPayments = await Payment.find()
      .populate("tenant", "name")
      .populate("property", "title")
      .sort({
        createdAt: -1,
      })
      .limit(5);

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalTenants,
        totalLandlords,
        totalProperties,
        revenue,
        pendingPayments,
      },

      activities: recentPayments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};