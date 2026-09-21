import React, { useState, useEffect } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "tenant",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Auto redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`);
    }
  }, [user, navigate]);

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

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", formData);

      login(data);

      alert(data.message);

      navigate(`/${data.user.role}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen">
        {/* =====================================================
            LEFT BRANDING SECTION
        ====================================================== */}
        <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-900" />

          {/* Glow effects */}
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-400/20 blur-3xl" />

          <div className="absolute right-20 top-24 h-40 w-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl" />

          <div className="absolute bottom-32 left-20 h-20 w-20 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl" />

          {/* Content */}
          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 text-white">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-bold text-blue-600 shadow-lg">
                V
              </div>

              <div>
                <p className="text-lg font-bold">Vayuhu</p>

                <p className="text-xs text-blue-100">Rental Management</p>
              </div>
            </Link>

            {/* Main content */}
            <div className="max-w-lg">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-blue-50 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Welcome back
              </div>

              <h1 className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                Your home.
                <span className="block text-blue-200">Your journey.</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-8 text-blue-100/80">
                Sign in to manage your properties, discover new rentals, and
                stay connected with your rental community.
              </p>

              {/* Feature cards */}
              <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    🏠
                  </div>

                  <p className="font-semibold text-white">Find Homes</p>

                  <p className="mt-1 text-xs leading-5 text-blue-100/60">
                    Discover properties that fit your lifestyle.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                    📊
                  </div>

                  <p className="font-semibold text-white">Manage Easily</p>

                  <p className="mt-1 text-xs leading-5 text-blue-100/60">
                    Keep your rental activities organized.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-sm text-blue-100/50">
              © 2026 Vayuhu. All rights reserved.
            </p>
          </div>
        </div>

        {/* =====================================================
            RIGHT LOGIN SECTION
        ====================================================== */}
        <div className="flex w-full items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:w-1/2 lg:px-12">
          <div className="w-full max-w-xl">
            {/* Mobile logo */}
            <div className="mb-8 text-center lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
                  V
                </div>

                <div className="text-left">
                  <p className="text-lg font-bold text-slate-900">Vayuhu</p>

                  <p className="text-xs text-slate-500">Rental Management</p>
                </div>
              </Link>
            </div>

            {/* Login Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8 md:p-10">
              {/* Heading */}
              <div className="mb-8">
                <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                  Welcome back
                </p>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Sign in to your account
                </h2>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Enter your details to continue to RentalHub.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <span className="mt-0.5">⚠️</span>

                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* =================================================
                    EMAIL
                ================================================== */}
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
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================== */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      🔒
                    </span>

                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    ROLE SELECTOR
                ================================================== */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-slate-700">
                    Sign in as
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Tenant */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          role: "tenant",
                        }))
                      }
                      className={`rounded-xl border p-3 transition sm:p-4 ${
                        formData.role === "tenant"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${
                          formData.role === "tenant"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        🏠
                      </div>

                      <p className="mt-2 text-xs font-bold text-slate-900 sm:text-sm">
                        Tenant
                      </p>
                    </button>

                    {/* Landlord */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          role: "landlord",
                        }))
                      }
                      className={`rounded-xl border p-3 transition sm:p-4 ${
                        formData.role === "landlord"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${
                          formData.role === "landlord"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        🏢
                      </div>

                      <p className="mt-2 text-xs font-bold text-slate-900 sm:text-sm">
                        Landlord
                      </p>
                    </button>

                    {/* Admin */}
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          role: "admin",
                        }))
                      }
                      className={`rounded-xl border p-3 transition sm:p-4 ${
                        formData.role === "admin"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-lg ${
                          formData.role === "admin"
                            ? "bg-blue-600 text-white"
                            : "bg-white text-slate-500"
                        }`}
                      >
                        🛡️
                      </div>

                      <p className="mt-2 text-xs font-bold text-slate-900 sm:text-sm">
                        Admin
                      </p>
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />

                    <span className="text-sm text-slate-500">Remember me</span>
                  </label>
                </div>

                {/* =================================================
                    LOGIN BUTTON
                ================================================== */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <span className="ml-2 transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-100" />

                <span className="text-xs text-slate-400">
                  New to RentalHub?
                </span>

                <div className="h-px flex-1 bg-slate-100" />
              </div>

              {/* Register */}
              <Link
                to="/register"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                Create a new account
              </Link>
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

export default Login;
