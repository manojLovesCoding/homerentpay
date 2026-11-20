import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Home,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setError("");
    setSuccess("");
  };

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
      toast.success(data.message || "Verification code sent successfully.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to send verification code. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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

      toast.success(data.message || "Registration successful!");
      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "OTP verification failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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

      const message = data.message || "A new verification code has been sent.";

      setSuccess(message);
      toast.success(message);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Unable to resend verification code. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = (email) => {
    const [username, domain] = email.split("@");

    if (!domain) return email;

    const visible = username.slice(0, 2);
    const hidden = "*".repeat(Math.max(username.length - 2, 3));

    return `${visible}${hidden}@${domain}`;
  };

  const inputClass =
    "w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF6] py-2.5 pl-10 pr-3 text-sm text-[#242B26] outline-none transition placeholder:text-[#899489] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#A8BDA5]/25";

  const labelClass = "mb-1.5 block text-xs font-semibold text-[#37443A]";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F4EA] px-3 py-5 text-[#242B26] sm:px-5 sm:py-7">
      <div className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-[#A8BDA5]/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#D6A45D]/15 blur-3xl" />

      <main className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col justify-center">
        {/* Brand */}
        <div className="mb-5 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="HomeBridge"
              className="h-12 w-16 object-contain sm:h-14 sm:w-20"
            />

            <span className="text-left">
              <span className="block text-2xl font-extrabold tracking-tight text-[#244B3C]">
                HomeBridge
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A795C]">
                Find Your Space. Make It Home.
              </span>
            </span>
          </Link>
        </div>

        <div className="grid overflow-hidden rounded-2xl border border-[#E6E3D9] bg-white shadow-xl shadow-[#244B3C]/10 lg:grid-cols-[0.75fr_1.25fr]">
          {/* Intro panel */}
          <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#244B3C] p-8 text-white lg:flex">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full border-[35px] border-white/5" />
            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#527C61]/50 blur-2xl" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-[#E7EBDD]">
                A better rental experience
              </span>

              <h1 className="mt-7 text-4xl font-bold leading-tight">
                Find your place.
                <span className="mt-1 block text-[#D6A45D]">
                  Build your future.
                </span>
              </h1>

              <p className="mt-4 max-w-xs text-sm leading-7 text-[#E1E9DE]">
                Whether you're finding a home or listing a property, HomeBridge
                makes every step simpler and more connected.
              </p>
            </div>

            <div className="relative mt-10 rounded-xl border border-white/15 bg-white/10 p-4">
              <p className="text-xs font-semibold text-white">
                One platform. Two ways to get started.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/10 p-3">
                  <Home size={21} className="text-[#D6A45D]" />
                  <p className="mt-2 text-sm font-bold">Tenants</p>
                  <p className="mt-0.5 text-[11px] text-[#DDE7DB]">
                    Discover a home
                  </p>
                </div>

                <div className="rounded-lg bg-white/10 p-3">
                  <KeyRound size={21} className="text-[#D6A45D]" />
                  <p className="mt-2 text-sm font-bold">Landlords</p>
                  <p className="mt-0.5 text-[11px] text-[#DDE7DB]">
                    List your property
                  </p>
                </div>
              </div>
            </div>

            <div className="relative mt-6 flex items-center gap-2 text-[11px] text-[#DDE7DB]">
              <ShieldCheck size={15} className="text-[#D6A45D]" />
              Simple, secure account registration
            </div>
          </aside>

          {/* Form panel */}
          <section className="p-5 sm:p-7 lg:p-8">
            <div className="mx-auto max-w-xl">
              <div className="mb-5">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#527C61]">
                  {step === 1 ? "Join HomeBridge" : "Account security"}
                </p>

                <h2 className="text-2xl font-extrabold tracking-tight text-[#242B26] sm:text-3xl">
                  {step === 1 ? "Create your account" : "Verify your email"}
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-[#68756A] sm:text-sm">
                  {step === 1
                    ? "Enter your details to get started with a smoother rental experience."
                    : "We've sent a 6-digit verification code to your email address."}
                </p>
              </div>

              {/* Step indicator */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      step === 1
                        ? "bg-[#244B3C] text-white"
                        : "bg-[#527C61] text-white"
                    }`}
                  >
                    {step === 1 ? "1" : <CheckCircle2 size={16} />}
                  </span>

                  <span className="text-xs font-semibold text-[#37443A]">
                    Your details
                  </span>
                </div>

                <div className="h-px flex-1 bg-[#E6E3D9]" />

                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      step === 2
                        ? "bg-[#244B3C] text-white"
                        : "bg-[#F1F4EC] text-[#899489]"
                    }`}
                  >
                    2
                  </span>

                  <span className="text-xs font-semibold text-[#37443A]">
                    Verify email
                  </span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700"
                >
                  <span>⚠</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  role="status"
                  className="mb-4 flex items-start gap-2 rounded-lg border border-[#C9DCC8] bg-[#F1F7EF] p-3 text-xs text-[#315C3D]"
                >
                  <CheckCircle2 size={15} className="shrink-0" />
                  <p>{success}</p>
                </div>
              )}

              {/* Registration form */}
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label htmlFor="register-name" className={labelClass}>
                      Full name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899489]"
                      />

                      <input
                        id="register-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="register-email" className={labelClass}>
                        Email address
                      </label>

                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899489]"
                        />

                        <input
                          id="register-email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          type="email"
                          autoComplete="email"
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="register-phone" className={labelClass}>
                        Phone number
                      </label>

                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899489]"
                        />

                        <input
                          id="register-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          type="tel"
                          autoComplete="tel"
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-password" className={labelClass}>
                      Password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899489]"
                      />

                      <input
                        id="register-password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        minLength={6}
                        required
                        className={`${inputClass} pr-14`}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#527C61] hover:text-[#193A2E]"
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    <p className="mt-1 text-[10px] text-[#899489]">
                      Minimum 6 characters.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm-password"
                      className={labelClass}
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <LockKeyhole
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#899489]"
                      />

                      <input
                        id="register-confirm-password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        className={`w-full rounded-lg border bg-[#FAFAF6] py-2.5 pl-10 pr-10 text-sm text-[#242B26] outline-none transition placeholder:text-[#899489] focus:bg-white focus:ring-2 ${
                          formData.confirmPassword &&
                          formData.password !== formData.confirmPassword
                            ? "border-red-300 focus:border-red-400 focus:ring-red-500/10"
                            : "border-[#E6E3D9] focus:border-[#527C61] focus:ring-[#A8BDA5]/25"
                        }`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((value) => !value)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#527C61] hover:text-[#193A2E]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>

                    {formData.confirmPassword &&
                      formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-[10px] text-red-600">
                          Passwords do not match.
                        </p>
                      )}
                  </div>

                  {/* Role selection */}
                  <div>
                    <p className={labelClass}>Register as a</p>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            role: "tenant",
                          }))
                        }
                        aria-pressed={formData.role === "tenant"}
                        className={`rounded-lg border p-3 text-left transition ${
                          formData.role === "tenant"
                            ? "border-[#527C61] bg-[#F1F4EC] ring-1 ring-[#A8BDA5]/50"
                            : "border-[#E6E3D9] bg-white hover:border-[#A8BDA5]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              formData.role === "tenant"
                                ? "bg-[#244B3C] text-white"
                                : "bg-[#F1F4EC] text-[#527C61]"
                            }`}
                          >
                            <Home size={18} />
                          </span>

                          <span>
                            <span className="block text-xs font-bold text-[#242B26]">
                              Tenant
                            </span>
                            <span className="mt-0.5 block text-[10px] text-[#68756A]">
                              Looking for a home
                            </span>
                          </span>

                          {formData.role === "tenant" && (
                            <CheckCircle2
                              size={15}
                              className="ml-auto text-[#527C61]"
                            />
                          )}
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            role: "landlord",
                          }))
                        }
                        aria-pressed={formData.role === "landlord"}
                        className={`rounded-lg border p-3 text-left transition ${
                          formData.role === "landlord"
                            ? "border-[#527C61] bg-[#F1F4EC] ring-1 ring-[#A8BDA5]/50"
                            : "border-[#E6E3D9] bg-white hover:border-[#A8BDA5]"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                              formData.role === "landlord"
                                ? "bg-[#244B3C] text-white"
                                : "bg-[#F1F4EC] text-[#527C61]"
                            }`}
                          >
                            <KeyRound size={18} />
                          </span>

                          <span>
                            <span className="block text-xs font-bold text-[#242B26]">
                              Landlord
                            </span>
                            <span className="mt-0.5 block text-[10px] text-[#68756A]">
                              Listing my property
                            </span>
                          </span>

                          {formData.role === "landlord" && (
                            <CheckCircle2
                              size={15}
                              className="ml-auto text-[#527C61]"
                            />
                          )}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      required
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[#244B3C]"
                    />

                    <span className="text-[10px] leading-5 text-[#68756A]">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="font-semibold text-[#244B3C] hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="font-semibold text-[#244B3C] hover:underline"
                      >
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg bg-[#244B3C] py-3 text-sm font-semibold text-white shadow-md shadow-[#244B3C]/15 transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending verification code...
                      </>
                    ) : (
                      <>
                        Send verification code
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* OTP verification */}
              {step === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="rounded-xl border border-[#DCE6D9] bg-[#F1F4EC] p-4 text-center">
                    <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#527C61] shadow-sm">
                      <Mail size={20} />
                    </div>

                    <p className="text-xs text-[#68756A]">
                      Verification code sent to
                    </p>

                    <p className="mt-1 break-all text-sm font-bold text-[#244B3C]">
                      {maskedEmail(formData.email)}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="register-otp"
                      className="mb-2 block text-center text-xs font-semibold text-[#37443A]"
                    >
                      Enter your 6-digit verification code
                    </label>

                    <input
                      id="register-otp"
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
                      className="w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF6] px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] text-[#244B3C] outline-none transition placeholder:text-[#C8D4C6] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#A8BDA5]/25"
                    />

                    <p className="mt-2 text-center text-[10px] text-[#899489]">
                      Enter the code received in your email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#244B3C] py-3 text-sm font-semibold text-white shadow-md shadow-[#244B3C]/15 transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Verifying email...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        Verify & Create Account
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-xs text-[#68756A]">
                      Didn't receive the verification code?
                    </p>

                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resending || loading}
                      className="mt-1.5 text-xs font-semibold text-[#244B3C] transition hover:text-[#193A2E] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {resending ? "Sending..." : "Resend verification code"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setError("");
                      setSuccess("");
                    }}
                    disabled={loading || resending}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E6E3D9] bg-white py-2.5 text-xs font-semibold text-[#526056] transition hover:bg-[#F7F4EA] disabled:opacity-50"
                  >
                    <ArrowLeft size={14} />
                    Back to registration details
                  </button>
                </form>
              )}

              <div className="mt-5 border-t border-[#EEECE4] pt-4 text-center">
                <p className="text-xs text-[#68756A]">
                  Already part of HomeBridge?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-[#244B3C] transition hover:text-[#193A2E]"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>

        <p className="mt-4 text-center text-[10px] text-[#899489]">
          © {new Date().getFullYear()} HomeBridge. All rights reserved.
        </p>
      </main>
    </div>
  );
};

export default Register;
