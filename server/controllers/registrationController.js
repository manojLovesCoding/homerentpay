
import crypto from "crypto";
import bcrypt from "bcrypt";

import User from "../models/User.js";
import PendingRegistration from "../models/PendingRegistration.js";
import { sendRegistrationOTP } from "../config/mailer.js";

const OTP_EXPIRY = 5 * 60 * 1000;
const RESEND_COOLDOWN = 60 * 1000;
const MAX_ATTEMPTS = 5;

// SEND REGISTRATION OTP
export const sendRegistrationOTPController = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (!["tenant", "landlord"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid registration role",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing registered users
    const existingUser = await User.findOne({
      $or: [
        { email: normalizedEmail },
        { phone: normalizedPhone },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or phone number already registered",
      });
    }

    // Check pending registrations
    const existingPending = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    const phoneConflict = await PendingRegistration.findOne({
      phone: normalizedPhone,
      email: { $ne: normalizedEmail },
    });

    if (phoneConflict) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already being used",
      });
    }

    // Resend cooldown
    if (existingPending) {
      const elapsed = Date.now() -
        existingPending.lastOtpSentAt.getTime();

      if (elapsed < RESEND_COOLDOWN) {
        const remaining = Math.ceil(
          (RESEND_COOLDOWN - elapsed) / 1000
        );

        return res.status(429).json({
          success: false,
          message: `Please wait ${remaining} seconds before requesting another OTP`,
        });
      }
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    const otpHash = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const registrationData = {
      name: name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      password: hashedPassword,
      role,
      otpHash,
      expiresAt: new Date(Date.now() + OTP_EXPIRY),
      attempts: 0,
      lastOtpSentAt: new Date(),
    };

    if (existingPending) {
      Object.assign(existingPending, registrationData);
      await existingPending.save();
    } else {
      await PendingRegistration.create(registrationData);
    }

    // Send OTP email
    try {
      await sendRegistrationOTP(normalizedEmail, otp);
    } catch (emailError) {
      await PendingRegistration.deleteOne({
        email: normalizedEmail,
      });

      console.error("OTP email error:", emailError);

      return res.status(500).json({
        success: false,
        message: "Unable to send verification email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// VERIFY OTP AND COMPLETE REGISTRATION
export const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const pending = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pending) {
      return res.status(404).json({
        success: false,
        message: "Registration request not found. Please request a new OTP.",
      });
    }

    // Check expiry
    if (pending.expiresAt.getTime() <= Date.now()) {
      await PendingRegistration.deleteOne({
        _id: pending._id,
      });

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check attempts
    if (pending.attempts >= MAX_ATTEMPTS) {
      await PendingRegistration.deleteOne({
        _id: pending._id,
      });

      return res.status(429).json({
        success: false,
        message: "Maximum OTP attempts exceeded. Please register again.",
      });
    }

    // Verify OTP
    const isValidOTP = await bcrypt.compare(
      String(otp),
      pending.otpHash
    );

    if (!isValidOTP) {
      pending.attempts += 1;
      await pending.save();

      const remaining = MAX_ATTEMPTS - pending.attempts;

      if (remaining <= 0) {
        await PendingRegistration.deleteOne({
          _id: pending._id,
        });
      }

      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid OTP. ${remaining} attempts remaining.`
          : "Maximum OTP attempts exceeded. Please register again.",
      });
    }

    // Recheck duplicate user before creating account
    const existingUser = await User.findOne({
      $or: [
        { email: pending.email },
        { phone: pending.phone },
      ],
    });

    if (existingUser) {
      await PendingRegistration.deleteOne({
        _id: pending._id,
      });

      return res.status(409).json({
        success: false,
        message: "Email or phone number already registered",
      });
    }

    // Create verified user
    const newUser = await User.create({
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      password: pending.password,
      role: pending.role,
      isEmailVerified: true,
    });

    // Delete pending registration
    await PendingRegistration.deleteOne({
      _id: pending._id,
    });

    return res.status(201).json({
      success: true,
      message: "Email verified and registration successful",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or phone number already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
