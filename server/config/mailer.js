
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendRegistrationOTP = async (email, otp) => {
  return await transporter.sendMail({
    from: `"${process.env.MAIL_FROM_NAME || "HomeBridge"}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify Your Email - HomeBridge",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 25px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1e40af;">Welcome to HomeBridge!</h2>

        <p>Thank you for registering with HomeBridge.</p>

        <p>Use the verification code below to verify your email address:</p>

        <div style="background: #eff6ff; padding: 20px; text-align: center; border-radius: 8px;">
          <h1 style="letter-spacing: 8px; color: #1e40af;">
            ${otp}
          </h1>
        </div>

        <p>This code expires in <strong>5 minutes</strong>.</p>

        <p>If you did not request this code, please ignore this email.</p>

        <hr />

        <p style="font-size: 12px; color: #6b7280;">
          © ${new Date().getFullYear()} HomeBridge. All rights reserved.
        </p>
      </div>
    `,
  });
};

export default transporter;
