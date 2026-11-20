
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
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

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email.trim() || !formData.password) {
      const message = "Please enter your email and password.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post("/auth/login", {
        ...formData,
        email: formData.email.trim().toLowerCase(),
      });

      login(data);

      toast.success(data.message || "Login successful!");

      navigate(`/${data.user.role}`, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials and try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "tenant",
      title: "Tenant",
      description: "Find your next home",
      icon: Home,
    },
    {
      value: "landlord",
      title: "Landlord",
      description: "Manage your property",
      icon: KeyRound,
    },
    {
      value: "admin",
      title: "Admin",
      description: "Platform access",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F4EA] px-3 py-5 text-[#242B26] sm:px-5 sm:py-7">
      {/* Background accents */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#A8BDA5]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#D6A45D]/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-xl shadow-[#244B3C]/10 lg:grid-cols-[1fr_0.95fr]">

          {/* Welcome panel */}
          <section className="relative hidden min-h-[620px] flex-col justify-between overflow-hidden bg-[#244B3C] p-8 text-white lg:flex xl:p-10">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(145deg, rgba(25,58,46,.96), rgba(36,75,60,.58)), url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85')",
              }}
            />

            <div className="absolute -right-24 top-24 h-72 w-72 rounded-full border border-white/15" />
            <div className="absolute -right-10 top-40 h-48 w-48 rounded-full border border-white/15" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#527C61]/40 blur-2xl" />

            {/* Brand */}
            <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-3">
              <img
                src="/logo.jpg"
                alt="HomeBridge"
                className="h-12 w-16 object-contain"
              />

              <span>
                <span className="block text-xl font-extrabold tracking-tight">
                  HomeBridge
                </span>
                <span className="mt-0.5 block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#D6A45D]">
                  Find Your Space. Make It Home.
                </span>
              </span>
            </Link>

            {/* Welcome content */}
            <div className="relative z-10 max-w-lg pb-6">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#E8D4AE] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#D6A45D]" />
                A better way to find home
              </span>

              <h1 className="text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
                Welcome back to a place that feels like home.
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                Connect with the right people, manage your rental journey,
                and make every step simpler with HomeBridge.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#244B3C] bg-[#A8BDA5] text-xs font-bold text-[#244B3C]">
                    H
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#244B3C] bg-[#D6A45D] text-xs font-bold text-[#244B3C]">
                    B
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#244B3C] bg-[#F7F4EA] text-xs font-bold text-[#244B3C]">
                    +
                  </div>
                </div>

                <p className="text-xs leading-5 text-white/75">
                  One simple bridge between
                  <br />
                  tenants and landlords.
                </p>
              </div>
            </div>

            <p className="relative z-10 text-[10px] text-white/55">
              © {new Date().getFullYear()} HomeBridge. All rights reserved.
            </p>
          </section>

          {/* Login form */}
          <section className="flex items-center justify-center px-5 py-7 sm:px-8 lg:px-9 xl:px-12">
            <div className="w-full max-w-md">

              {/* Mobile brand */}
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <Link to="/" className="inline-flex items-center gap-2">
                  <img
                    src="/logo.jpg"
                    alt="HomeBridge"
                    className="h-11 w-14 object-contain"
                  />

                  <span className="text-lg font-extrabold text-[#244B3C]">
                    HomeBridge
                  </span>
                </Link>

                <span className="rounded-full bg-[#EEF2EA] px-3 py-1.5 text-[10px] font-semibold text-[#527C61]">
                  Welcome back
                </span>
              </div>

              {/* Heading */}
              <div className="mb-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#527C61]">
                  Your HomeBridge account
                </p>

                <h2 className="text-3xl font-extrabold tracking-tight text-[#242B26]">
                  Sign in
                </h2>

                <p className="mt-2 text-xs leading-5 text-[#68756A] sm:text-sm">
                  Enter your account details to continue where you left off.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                >
                  <span className="font-bold">!</span>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-xs font-semibold text-[#34443A]"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899489]"
                    />

                    <input
                      id="login-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="email"
                      required
                      className="w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF6] py-2.5 pl-10 pr-3 text-sm text-[#242B26] outline-none transition placeholder:text-[#899489] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#A8BDA5]/25"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="mb-1.5 block text-xs font-semibold text-[#34443A]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899489]"
                    />

                    <input
                      id="login-password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF6] py-2.5 pl-10 pr-11 text-sm text-[#242B26] outline-none transition placeholder:text-[#899489] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#A8BDA5]/25"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
                      }
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#527C61] transition hover:text-[#193A2E]"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember and forgot password */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3.5 w-3.5 rounded accent-[#244B3C] focus:ring-[#527C61]"
                    />

                    <span className="text-xs text-[#68756A]">
                      Remember me
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      toast(getForgotPasswordMessage(), {
                        icon: "🔐",
                        duration: 4000,
                      })
                    }
                    className="text-xs font-semibold text-[#527C61] transition hover:text-[#193A2E]"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Role selection */}
                <div>
                  <p className="mb-2 text-xs font-semibold text-[#34443A]">
                    Sign in as
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((option) => {
                      const selected = formData.role === option.value;
                      const Icon = option.icon;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              role: option.value,
                            }))
                          }
                          className={`relative rounded-lg border px-2 py-3 text-center transition ${
                            selected
                              ? "border-[#527C61] bg-[#F1F4EC] ring-1 ring-[#A8BDA5]/50"
                              : "border-[#E6E3D9] bg-white hover:border-[#A8BDA5] hover:bg-[#FAFBF8]"
                          }`}
                        >
                          {selected && (
                            <CheckCircle2
                              size={13}
                              className="absolute right-1.5 top-1.5 text-[#527C61]"
                            />
                          )}

                          <span
                            className={`mx-auto mb-1.5 flex h-9 w-9 items-center justify-center rounded-lg ${
                              selected
                                ? "bg-[#244B3C] text-white"
                                : "bg-[#F1F4EC] text-[#527C61]"
                            }`}
                          >
                            <Icon size={17} />
                          </span>

                          <span className="block text-xs font-bold text-[#34443A]">
                            {option.title}
                          </span>

                          <span className="mt-0.5 hidden text-[9px] leading-4 text-[#7B877C] sm:block">
                            {option.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#244B3C] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#244B3C]/15 transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to HomeBridge
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              {/* Register link */}
              <div className="mt-6 border-t border-[#ECEDE7] pt-5 text-center">
                <p className="text-xs text-[#68756A]">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-[#244B3C] transition hover:text-[#193A2E]"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              <p className="mt-5 text-center text-[10px] text-[#9AA49A] lg:hidden">
                © {new Date().getFullYear()} HomeBridge. All rights reserved.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
