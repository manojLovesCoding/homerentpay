import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
      return alert("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.put(
        `/auth/tenant/${id}/password`,
        {
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Password updated successfully");

      navigate("/landlord/tenants");
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
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

  const strengthColor =
    passwordStrength === "Weak"
      ? "bg-red-500"
      : passwordStrength === "Medium"
        ? "bg-amber-500"
        : "bg-emerald-500";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/landlord/tenants")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <span className="text-lg">←</span>
            Back to Tenants
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Update Tenant Password
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Create a new secure password for this tenant's account.
          </p>
        </div>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.3fr]">
          {/* ===================================================
              SECURITY PANEL
          ==================================================== */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-6 shadow-xl shadow-blue-950/10 sm:p-8">
            {/* Decorative background */}

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">
              {/* Security badge */}

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                Secure Account
              </div>

              {/* Lock */}

              <div className="mt-10 flex justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-[2rem] border border-white/10 bg-white/10 shadow-2xl backdrop-blur">
                  <div className="absolute inset-3 rounded-[1.5rem] border border-blue-400/20" />

                  <span className="text-5xl">🔐</span>
                </div>
              </div>

              {/* Text */}

              <div className="mt-7 text-center">
                <h2 className="text-xl font-bold text-white">
                  Password Security
                </h2>

                <p className="mt-2 text-sm leading-6 text-blue-100/60">
                  Keep tenant accounts protected with a strong and unique
                  password.
                </p>
              </div>

              {/* Security points */}

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    ✓
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Minimum 6 characters
                    </p>

                    <p className="text-xs text-blue-100/50">
                      Longer passwords are recommended
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    🔒
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      Account protected
                    </p>

                    <p className="text-xs text-blue-100/50">
                      Password changes are secured
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning */}

              <div className="mt-6 rounded-2xl border border-amber-400/10 bg-amber-400/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-300/80">
                  Important
                </p>

                <p className="mt-2 text-xs leading-5 text-blue-100/60">
                  Make sure the new password is shared with the tenant securely.
                  Avoid using easily guessable information.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              PASSWORD FORM
          ==================================================== */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            {/* Form Header */}

            <div className="mb-7 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                  🔑
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">New Password</h2>

                  <p className="text-xs text-slate-400">
                    Set a new login password
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  New Password
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    🔒
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Password strength */}

                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">
                        Password strength
                      </span>

                      <span
                        className={`text-xs font-bold ${
                          passwordStrength === "Weak"
                            ? "text-red-500"
                            : passwordStrength === "Medium"
                              ? "text-amber-500"
                              : "text-emerald-500"
                        }`}
                      >
                        {passwordStrength}
                      </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strengthColor} ${
                          passwordStrength === "Weak"
                            ? "w-1/3"
                            : passwordStrength === "Medium"
                              ? "w-2/3"
                              : "w-full"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  REQUIREMENTS
              ================================================== */}

              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="mb-3 text-sm font-bold text-slate-800">
                  Password requirements
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        password.length >= 6
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      ✓
                    </span>

                    <span className="text-xs text-slate-500">
                      At least 6 characters
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        password.length >= 10
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      ✓
                    </span>

                    <span className="text-xs text-slate-500">
                      10+ characters recommended
                    </span>
                  </div>
                </div>
              </div>

              {/* =================================================
                  SECURITY NOTICE
              ================================================== */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    🛡️
                  </div>

                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Security notice
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700/70">
                      Changing the password will update the tenant's login
                      credentials. Make sure the tenant receives the new
                      password.
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/landlord/tenants")}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || password.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <span>🔐</span>
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
