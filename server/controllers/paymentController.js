import razorpay from "../config/razorpay.js";
import Property from "../models/Property.js";
import Payment from "../models/Payment.js";
import crypto from "crypto";

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

    const options = {
      amount: property.rent * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    const currentDate = new Date();

await Payment.create({
  tenant: req.user.id,
  landlord: property.landlord,
  property: property._id,
  amount: property.rent,
  orderId: order.id,
  status: "created",

  month: currentDate.getMonth() + 1,
  year: currentDate.getFullYear(),
});

    res.status(201).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

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

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
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