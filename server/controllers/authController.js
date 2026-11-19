import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact your landlord.",
      });
    }

    if (user.role !== role) {
      return res.status(401).json({
        success: false,
        message: "Invalid role",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createTenant = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const tenant = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "tenant",
      createdBy: req.user.id, // landlord id
    });

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      tenant: {
        id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getTenants = async (req, res) => {
  try {
    const tenants = await User.find({
      role: "tenant",
      createdBy: req.user.id,
    }).select("-password");

    res.json({
      success: true,
      tenants,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const tenant = await User.findOne({
      _id: req.params.id,
      role: "tenant",
      createdBy: req.user.id,
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    tenant.name = name;
    tenant.email = email;
    tenant.phone = phone;

    await tenant.save();

    res.json({
      success: true,
      message: "Tenant updated successfully",
      tenant,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const deactivateTenant = async (req, res) => {
  try {
    const tenant = await User.findOne({
      _id: req.params.id,
      role: "tenant",
      createdBy: req.user.id,
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    tenant.isActive = false;

    await tenant.save();

    res.json({
      success: true,
      message: "Tenant deactivated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const updateTenantPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const tenant = await User.findOne({
      _id: req.params.id,
      role: "tenant",
      createdBy: req.user.id,
    });

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    tenant.password = hashedPassword;

    await tenant.save();

    res.status(200).json({
      success: true,
      message: "Tenant password updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createLandlord = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const landlord = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "landlord",
    });

    return res.status(201).json({
      success: true,
      message: "Landlord created successfully",
      landlord: {
        id: landlord._id,
        name: landlord.name,
        email: landlord.email,
        phone: landlord.phone,
        role: landlord.role,
        isActive: landlord.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL LANDLORDS
export const getLandlords = async (req, res) => {
  try {
    const landlords = await User.find({
      role: "landlord",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: landlords.length,
      landlords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE LANDLORD DETAILS
export const updateLandlord = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email and phone are required",
      });
    }

    const landlord = await User.findOne({
      _id: req.params.id,
      role: "landlord",
    });

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    const existingUser = await User.findOne({
      _id: { $ne: landlord._id },
      $or: [{ email }, { phone }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already exists",
      });
    }

    landlord.name = name;
    landlord.email = email;
    landlord.phone = phone;

    await landlord.save();

    return res.status(200).json({
      success: true,
      message: "Landlord updated successfully",
      landlord: {
        id: landlord._id,
        name: landlord.name,
        email: landlord.email,
        phone: landlord.phone,
        role: landlord.role,
        isActive: landlord.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DEACTIVATE LANDLORD
export const deactivateLandlord = async (req, res) => {
  try {
    const landlord = await User.findOne({
      _id: req.params.id,
      role: "landlord",
    });

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    landlord.isActive = false;

    await landlord.save();

    return res.status(200).json({
      success: true,
      message: "Landlord deactivated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE LANDLORD PASSWORD
export const updateLandlordPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const landlord = await User.findOne({
      _id: req.params.id,
      role: "landlord",
    });

    if (!landlord) {
      return res.status(404).json({
        success: false,
        message: "Landlord not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    landlord.password = hashedPassword;

    await landlord.save();

    return res.status(200).json({
      success: true,
      message: "Landlord password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
