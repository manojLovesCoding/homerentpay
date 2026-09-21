import Property from "../models/Property.js";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/User.js";
import Payment from "../models/Payment.js";

export const addProperty = async (req, res) => {
  try {
    const { title, address, city, rent } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "properties",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const property = await Property.create({
      title,
      address,
      city,
      rent,
      image: imageUrl,
      landlord: req.user.id,
    });

    res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProperties = async (req, res) => {
  try {
    // Check if the user is a landlord, filter by their ID. Admins can see all.
    const filter = req.user.role === "admin" ? {} : { landlord: req.user.id };

    const properties = await Property.find(filter)
      .populate("landlord", "name email phone")
      .populate("tenant", "name email phone");

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getHomeProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .select("title address city rent image");

    res.json({
      success: true,
      properties,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const { title, address, city, rent } = req.body;

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    let imageUrl = property.image;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "properties",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    property.title = title;
    property.address = address;
    property.city = city;
    property.rent = rent;
    property.image = imageUrl;

    await property.save();

    res.json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignTenant = async (req, res) => {
  try {
    const { tenantId, dueDate } = req.body;

    if (!dueDate || dueDate < 1 || dueDate > 31) {
      return res.status(400).json({
        success: false,
        message: "Due date must be between 1 and 31",
      });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // landlord can assign only his property
    if (
      req.user.role !== "admin" &&
      property.landlord.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (property.status === "rented") {
      return res.status(400).json({
        success: false,
        message: "Property is already rented",
      });
    }

    // Find tenant
    const tenant = await User.findOne({
      _id: tenantId,
      role: "tenant",
      isActive: true,
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    // Check tenant belongs to landlord
    if (
      req.user.role !== "admin" &&
      tenant.createdBy.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Tenant does not belong to you",
      });
    }

    // Prevent multiple active assignments
    const alreadyAssigned = await Property.findOne({
      tenant: tenant._id,
      status: "rented",
    });

    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "Tenant is already assigned to another property",
      });
    }

    property.tenant = tenant._id;
    property.status = "rented";
    property.dueDate = Number(dueDate);

    await property.save();

    res.status(200).json({
      success: true,
      message: "Tenant assigned successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeTenant = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      property.landlord.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    property.tenant = null;
    property.status = "available";
    property.dueDate = null;

    await property.save();

    res.status(200).json({
      success: true,
      message: "Tenant removed successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAssignedTenants = async (req, res) => {
  try {
    const properties = await Property.find({
      landlord: req.user.id,
      status: "rented",
    })
      .populate({
        path: "tenant",
        select: "name email phone isActive",
      })
      .select("title address city rent status tenant");

    res.status(200).json({
      success: true,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTenantProperty = async (req, res) => {
  try {
    const property = await Property.findOne({
      tenant: req.user.id,
      status: "rented",
    })
      .populate({
        path: "landlord",
        select: "name email phone",
      })
      .select("title address city rent image status landlord dueDate");

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "No property assigned",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { propertyId } = req.query;

    const date = new Date();

    const payment = await Payment.findOne({
      tenant: req.user.id,
      property: propertyId,
      status: "paid",
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });

    res.status(200).json({
      success: true,
      paid: !!payment,
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPendingRent = async (req, res) => {
  try {
    const { propertyId } = req.query;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    const property = await Property.findOne({
      _id: propertyId,
      tenant: req.user.id,
      status: "rented",
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not assigned",
      });
    }

    const date = new Date();

    const payment = await Payment.findOne({
      tenant: req.user.id,
      property: propertyId,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      status: "paid",
    });

    if (payment) {
      return res.status(200).json({
        success: true,
        pending: false,
        message: "Rent already paid",
        amount: property.rent,
      });
    }

    res.status(200).json({
      success: true,
      pending: true,
      amount: property.rent,
      dueDate: property.dueDate,
      message: "Rent payment pending",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
