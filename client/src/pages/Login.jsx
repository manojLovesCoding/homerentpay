import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "tenant",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already authenticated users
  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  // Role-based password recovery message
  const getForgotPasswordMessage = () => {
    switch (formData.role) {
      case "tenant":
        return "Please contact your landlord to reset your password.";

      case "landlord":
        return "Please contact the administrator to reset your password.";

      case "admin":
        return "Please contact the system administrator for password assistance.";

      default:
        return "Please contact the administrator for password assistance.";
    }
  };

  // Handle login
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

      navigate(`/${data.user.role}`, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 px-4 py-10 sm:px-6">
      {/* Main Container */}
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-2xl flex-col justify-center">
        {/* Brand */}
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

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 md:p-10">
          {/* Heading */}
          <div className="mb-8">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
              Welcome Back
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Sign in to your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span className="mt-0.5">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
                />
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
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10"
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

            {/* Remember Me + Forgot Password */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                />

                <span className="text-sm text-slate-600">Remember me</span>
              </label>

              {/* Role-based password recovery */}
              <button
                type="button"
                onClick={() => {
                  alert(getForgotPasswordMessage());
                }}
                className="text-sm font-semibold text-blue-700 transition hover:text-blue-800"
              >
                Forgot password?
              </button>
            </div>

            {/* Role Selection */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Sign in as
              </label>

              <div className="grid grid-cols-3 gap-3">
                {/* Tenant */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "tenant",
                    }))
                  }
                  className={`rounded-xl border p-3 text-center transition ${
                    formData.role === "tenant"
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                      formData.role === "tenant"
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    🏠
                  </div>

                  <p className="text-sm font-bold text-slate-900">Tenant</p>
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
                  className={`rounded-xl border p-3 text-center transition ${
                    formData.role === "landlord"
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                      formData.role === "landlord"
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    🏢
                  </div>

                  <p className="text-sm font-bold text-slate-900">Landlord</p>
                </button>

                {/* Admin */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      role: "admin",
                    }))
                  }
                  className={`rounded-xl border p-3 text-center transition ${
                    formData.role === "admin"
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600/10"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${
                      formData.role === "admin"
                        ? "bg-blue-700 text-white"
                        : "bg-white text-slate-500"
                    }`}
                  >
                    🛡️
                  </div>

                  <p className="text-sm font-bold text-slate-900">Admin</p>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In to HomeBridge
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-7 border-t border-slate-100 pt-6 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-700 transition hover:text-blue-800"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} HomeBridge. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
