import mongoose from "mongoose";

import Inquiry from "../models/Inquiry.js";
import Property from "../models/Property.js";

// ==========================================
// ADD PROPERTY INQUIRY (PUBLIC)
// ==========================================

export const addInquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    // Validate required fields
    if (!propertyId || !name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate property ID
    if (!mongoose.isValidObjectId(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID",
      });
    }

    // Validate user input
    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();
    const cleanMessage = String(message).trim();

    if (!cleanName || !cleanEmail || !cleanPhone || !cleanMessage) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (
      cleanName.length > 100 ||
      cleanEmail.length > 254 ||
      cleanPhone.length > 20 ||
      cleanMessage.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length",
      });
    }

    // Find property
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property: property._id,
      landlord: property.landlord,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      message: cleanMessage,
    });

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully",
      inquiry,
    });
  } catch (error) {
    console.error("Add Inquiry Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit inquiry",
    });
  }
};

// ==========================================
// GET LANDLORD INQUIRIES (PROTECTED)
// ==========================================

export const getLandlordInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({
      landlord: req.user.id,
    })
      .populate({
        path: "property",
        select: "title address city rent image",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: inquiries.length,
      inquiries,
    });
  } catch (error) {
    console.error("Get Landlord Inquiries Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch inquiries",
    });
  }
};
