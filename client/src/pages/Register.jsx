import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "tenant",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // HANDLE FORM INPUTS
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

  // SEND REGISTRATION OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/send-registration-otp", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      });

      setOtp("");
      setStep(2);

      setSuccess(data.message || "Verification code sent successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send verification code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP AND COMPLETE REGISTRATION
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!otp.trim()) {
      setError("Please enter the verification code.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/verify-registration-otp", {
        email: formData.email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      alert(data.message || "Registration successful!");

      navigate("/login", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP
  const handleResendOTP = async () => {
    setError("");
    setSuccess("");

    try {
      setResending(true);

      const { data } = await api.post("/auth/send-registration-otp", {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
      });

      setOtp("");

      setSuccess(data.message || "A new verification code has been sent.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend verification code. Please try again.",
      );
    } finally {
      setResending(false);
    }
  };

  // MASK EMAIL FOR DISPLAY
  const maskedEmail = (email) => {
    const [username, domain] = email.split("@");

    if (!domain) return email;

    const visible = username.slice(0, 2);
    const hidden = "*".repeat(Math.max(username.length - 2, 3));

    return `${visible}${hidden}@${domain}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 px-4 py-10 sm:px-6">
      {/* MAIN CONTAINER */}
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center">
        {/* BRAND */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-md">
              <img
                src="/logo.jpg"
                alt="HomeBridge Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="text-left">
              <p className="text-2xl font-extrabold tracking-tight text-slate-900">
                HomeBridge
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                Find Your Space. Make It Home.
              </p>
            </div>
          </Link>
        </div>

        {/* REGISTRATION CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 md:p-10">
          {/* HEADING */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
              {step === 1 ? "Join HomeBridge" : "Email Verification"}
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {step === 1 ? "Create your account" : "Verify your email"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              {step === 1
                ? "Get started with HomeBridge and find the right space for you."
                : "We have sent a 6-digit verification code to your email address."}
            </p>
          </div>

          {/* STEP INDICATOR */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step === 1
                    ? "bg-blue-700 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {step === 1 ? "1" : "✓"}
              </div>

              <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                Your Details
              </span>
            </div>

            <div className="h-px flex-1 bg-slate-200" />

            <div className="flex flex-1 items-center justify-end gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step === 2
                    ? "bg-blue-700 text-white"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </div>

              <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                Email Verification
              </span>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span className="mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              <span className="mt-0.5">✓</span>
              <p>{success}</p>
            </div>
          )}

          {/* STEP 1: REGISTRATION FORM */}
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* FULL NAME */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    👤
                  </span>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                  />
                </div>
              </div>

              {/* EMAIL + PHONE */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email Address
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      ✉
                    </span>

                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      ☎
                    </span>

                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      type="tel"
                      autoComplete="tel"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                    />
                  </div>
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔒
                  </span>

                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔐
                  </span>

                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                      formData.confirmPassword &&
                      formData.password !== formData.confirmPassword
                        ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition hover:text-blue-700"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {formData.confirmPassword &&
                  formData.password !== formData.confirmPassword && (
                    <p className="mt-2 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
              </div>

              {/* ROLE SELECTION */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  I want to register as a
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* TENANT */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "tenant",
                      }))
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      formData.role === "tenant"
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          formData.role === "tenant"
                            ? "bg-blue-700 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        🏠
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Tenant
                        </p>

                        <p className="text-xs text-slate-500">
                          Looking for a home
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* LANDLORD */}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        role: "landlord",
                      }))
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      formData.role === "landlord"
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                        : "border-slate-200 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          formData.role === "landlord"
                            ? "bg-blue-700 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        🏢
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Landlord
                        </p>

                        <p className="text-xs text-slate-500">
                          Listing my property
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* TERMS */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />

                <p className="text-xs leading-5 text-slate-500">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-semibold text-blue-700 hover:text-blue-800"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              {/* SEND OTP BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending Verification Code...
                  </>
                ) : (
                  <>
                    Send Verification Code
                    <span className="ml-2 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              {/* EMAIL INFORMATION */}
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl">
                  ✉
                </div>

                <p className="text-sm font-medium text-slate-600">
                  Verification code sent to
                </p>

                <p className="mt-1 break-all text-base font-bold text-slate-900">
                  {maskedEmail(formData.email)}
                </p>
              </div>

              {/* OTP INPUT */}
              <div>
                <label className="mb-3 block text-center text-sm font-semibold text-slate-700">
                  Enter 6-Digit Verification Code
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setError("");
                    setSuccess("");
                  }}
                  placeholder="000000"
                  autoFocus
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center text-3xl font-bold tracking-[0.5em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                />

                <p className="mt-3 text-center text-xs text-slate-500">
                  Enter the verification code received in your email.
                </p>
              </div>

              {/* VERIFY BUTTON */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Verifying Email...
                  </>
                ) : (
                  "Verify & Create Account"
                )}
              </button>

              {/* RESEND OTP */}
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Didn't receive the verification code?
                </p>

                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending || loading}
                  className="mt-2 font-semibold text-blue-700 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend Verification Code"}
                </button>
              </div>

              {/* BACK BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setSuccess("");
                }}
                disabled={loading || resending}
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                ← Back to Registration Details
              </button>
            </form>
          )}

          {/* LOGIN */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Already part of HomeBridge?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-700 transition hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} HomeBridge. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
