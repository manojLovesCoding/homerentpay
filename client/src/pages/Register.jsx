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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
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

      const { data } = await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      });

      alert(data.message);

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "tenant",
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen">
        {/* =====================================================
            LEFT BRAND SECTION
        ====================================================== */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-900" />

          {/* Decorative circles */}
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

          <div className="absolute right-20 top-20 h-32 w-32 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl" />

          {/* Content */}
          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-600 shadow-lg">
                R
              </div>

              <div>
                <p className="text-lg font-bold">RentalHub</p>

                <p className="text-xs text-blue-100">Rental Management</p>
              </div>
            </Link>

            {/* Main message */}
            <div className="max-w-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Your next home starts here
              </div>

              <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                Find a place
                <span className="block text-blue-200">you'll love.</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-blue-100/80">
                Join our rental community and discover properties that fit your
                lifestyle, budget, and needs.
              </p>

              {/* Features */}
              <div className="mt-10 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg backdrop-blur">
                    ✓
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      Verified Properties
                    </p>

                    <p className="text-sm text-blue-100/60">
                      Discover quality rental listings
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg backdrop-blur">
                    🔒
                  </div>

                  <div>
                    <p className="font-semibold text-white">Secure & Simple</p>

                    <p className="text-sm text-blue-100/60">
                      Manage your rental journey with ease
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg backdrop-blur">
                    ⚡
                  </div>

                  <div>
                    <p className="font-semibold text-white">Easy Management</p>

                    <p className="text-sm text-blue-100/60">
                      Everything in one convenient place
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-blue-100/50">
              © 2026 RentalHub. All rights reserved.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT REGISTER SECTION
        ====================================================== */}
        <div className="flex w-full items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-xl">
            {/* Mobile logo */}
            <div className="mb-8 text-center lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
                  R
                </div>

                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">RentalHub</p>

                  <p className="text-xs text-slate-500">Rental Management</p>
                </div>
              </Link>
            </div>

            {/* Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 md:p-10">
              {/* Heading */}
              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Get started
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Join us and start managing your rental journey.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <span className="mt-0.5">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Email */}
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
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {/* Phone */}
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
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
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
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
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
                      className={`w-full rounded-xl border bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                        formData.confirmPassword &&
                        formData.password !== formData.confirmPassword
                          ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 transition hover:text-slate-700"
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

                {/* Role */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    I am a
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Tenant */}
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
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            formData.role === "tenant"
                              ? "bg-blue-600 text-white"
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

                    {/* Landlord */}
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
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                            formData.role === "landlord"
                              ? "bg-blue-600 text-white"
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

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Login */}
              <div className="mt-7 border-t border-slate-100 pt-6 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Mobile footer */}
            <p className="mt-6 text-center text-xs text-slate-400 lg:hidden">
              © 2026 RentalHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
