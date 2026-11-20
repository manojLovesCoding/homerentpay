import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

const UpdateTenantPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.put(
        `/auth/tenant/${id}/password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Tenant password updated successfully");
      navigate("/landlord/tenants");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength =
    password.length === 0
      ? null
      : password.length < 6
        ? "Weak"
        : password.length < 10
          ? "Medium"
          : "Strong";

  const strengthWidth =
    passwordStrength === "Weak"
      ? "w-1/3"
      : passwordStrength === "Medium"
        ? "w-2/3"
        : "w-full";

  const strengthColor =
    passwordStrength === "Weak"
      ? "bg-red-500"
      : passwordStrength === "Medium"
        ? "bg-amber-500"
        : "bg-[#527C61]";

  const strengthText =
    passwordStrength === "Weak"
      ? "text-red-500"
      : passwordStrength === "Medium"
        ? "text-amber-600"
        : "text-[#527C61]";

  return (
    <div className="min-h-[calc(100vh-2rem)] bg-[#F7F8F5] p-3 sm:p-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate("/landlord/tenants")}
            className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-[#68756A] transition hover:text-[#244B3C]"
          >
            <ArrowLeft size={15} />
            Back to Tenants
          </button>

          <h1 className="text-xl font-bold tracking-tight text-[#242B26] sm:text-2xl">
            Update Tenant Password
          </h1>

          <p className="mt-1 text-xs text-[#68756A] sm:text-sm">
            Create a new secure password for the tenant's account.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Security Panel */}
          <div className="relative overflow-hidden rounded-2xl bg-[#244B3C] p-5 text-white shadow-sm">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#527C61]/30 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#D6A45D]/10 blur-3xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-[#F7F4EA]">
                <span className="h-2 w-2 rounded-full bg-[#A8BDA5]" />
                Secure Account
              </div>

              <div className="my-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <LockKeyhole size={38} className="text-[#D6A45D]" />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-lg font-bold">Password Security</h2>
                <p className="mx-auto mt-1.5 max-w-xs text-xs leading-5 text-[#F7F4EA]/70">
                  Keep tenant accounts protected with a strong and unique
                  password.
                </p>
              </div>

              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#A8BDA5]/15 text-[#A8BDA5]">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">
                      Minimum 6 characters
                    </p>
                    <p className="mt-0.5 text-[10px] text-white/55">
                      Longer passwords are recommended
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#D6A45D]/15 text-[#D6A45D]">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Account protected</p>
                    <p className="mt-0.5 text-[10px] text-white/55">
                      Secure password update
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#D6A45D]/20 bg-[#D6A45D]/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#D6A45D]">
                  Important
                </p>
                <p className="mt-1 text-[11px] leading-5 text-white/65">
                  Share the new password with the tenant securely. Avoid easily
                  guessable information.
                </p>
              </div>
            </div>
          </div>

          {/* Password Form */}
          <div className="rounded-2xl border border-[#E6E3D9] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 flex items-center gap-3 border-b border-[#E6E3D9] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F7F4EA] text-[#244B3C]">
                <KeyRound size={19} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#242B26]">
                  New Password
                </h2>
                <p className="text-[11px] text-[#68756A]">
                  Set a new login password
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Password Input */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#526056]">
                  New Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8BDA5]"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-[#E6E3D9] bg-[#F7F8F5] py-2.5 pl-10 pr-11 text-sm text-[#242B26] outline-none transition placeholder:text-[#A0A99F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68756A] transition hover:text-[#244B3C]"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {/* Password Strength */}
                {password && (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-medium text-[#68756A]">
                        Password strength
                      </span>
                      <span className={`text-[10px] font-bold ${strengthText}`}>
                        {passwordStrength}
                      </span>
                    </div>

                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E6E3D9]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strengthColor} ${strengthWidth}`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Requirements */}
              <div className="rounded-xl border border-[#E6E3D9] bg-[#F7F8F5] p-3.5">
                <p className="mb-2.5 text-xs font-bold text-[#242B26]">
                  Password requirements
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className={
                        password.length >= 6
                          ? "text-[#527C61]"
                          : "text-[#C5CBC4]"
                      }
                    />
                    <span className="text-[11px] text-[#68756A]">
                      At least 6 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={15}
                      className={
                        password.length >= 10
                          ? "text-[#527C61]"
                          : "text-[#C5CBC4]"
                      }
                    />
                    <span className="text-[11px] text-[#68756A]">
                      10+ characters recommended
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex gap-3 rounded-xl border border-[#A8BDA5]/40 bg-[#F7F4EA] p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#527C61]">
                  <AlertCircle size={17} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#244B3C]">
                    Security notice
                  </p>
                  <p className="mt-1 text-[11px] leading-5 text-[#68756A]">
                    Changing the password updates the tenant's login
                    credentials. Make sure the tenant receives the new password
                    securely.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-2 border-t border-[#E6E3D9] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/landlord/tenants")}
                  disabled={loading}
                  className="rounded-xl border border-[#E6E3D9] bg-white px-5 py-2.5 text-xs font-semibold text-[#526056] transition hover:bg-[#F7F8F5] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || password.length < 6}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#244B3C] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <LockKeyhole size={15} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTenantPassword;
