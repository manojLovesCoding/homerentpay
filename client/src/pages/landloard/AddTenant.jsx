import React, { useState } from "react";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";

const AddTenant = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post("/auth/create-tenant", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Tenant created successfully");

      navigate("/landlord/tenants");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create tenant");
    } finally {
      setLoading(false);
    }
  };

  const tenantInitial = formData.name?.trim()?.charAt(0)?.toUpperCase() || "T";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* =====================================================
            TOP HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/landlord/tenants")}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
            >
              <span className="text-lg">←</span>
              Back to Tenants
            </button>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Add New Tenant
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Create a tenant account and add them to your rental management
              system.
            </p>
          </div>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.5fr]">
          {/* ===================================================
              LEFT PROFILE CARD
          ==================================================== */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
            {/* Decorative circles */}

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

            <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-indigo-950/20 blur-3xl" />

            <div className="relative">
              {/* Badge */}

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Tenant Account
              </div>

              {/* Avatar */}

              <div className="mt-8 flex justify-center">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border-4 border-white/20 bg-white/15 text-4xl font-bold text-white shadow-2xl backdrop-blur">
                  {tenantInitial}
                </div>
              </div>

              {/* Name */}

              <div className="mt-5 text-center">
                <h2 className="truncate text-xl font-bold text-white">
                  {formData.name || "New Tenant"}
                </h2>

                <p className="mt-1 truncate text-sm text-blue-100/70">
                  {formData.email || "tenant@example.com"}
                </p>
              </div>

              {/* Information */}

              <div className="mt-8 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      👤
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-blue-100/60">
                        Account Type
                      </p>

                      <p className="mt-1 text-sm font-semibold text-white">
                        Tenant
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      🔐
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-blue-100/60">
                        Account Status
                      </p>

                      <p className="mt-1 text-sm font-semibold text-emerald-300">
                        Active after creation
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip */}

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-100/60">
                  Tip
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-50/80">
                  Use the tenant's real email and phone number so you can easily
                  contact them regarding rent and property updates.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              FORM CARD
          ==================================================== */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            {/* Form header */}

            <div className="mb-7 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  👤
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Tenant Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Enter the tenant's account details
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* =================================================
                  NAME
              ================================================== */}

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
                    placeholder="Enter tenant's full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ✉️
                  </span>

                  <input
                    name="email"
                    placeholder="tenant@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  This email will be used for the tenant's account.
                </p>
              </div>

              {/* =================================================
                  PHONE
              ================================================== */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Phone Number
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    📱
                  </span>

                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* =================================================
                  PASSWORD
              ================================================== */}

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
                    placeholder="Create a secure password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Create a password that is difficult to guess.
                </p>
              </div>

              {/* =================================================
                  SECURITY INFO
              ================================================== */}

              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                    🛡️
                  </div>

                  <div>
                    <p className="text-sm font-bold text-blue-900">
                      Account Security
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700/70">
                      The tenant will use these credentials to access their
                      account. Keep login information secure.
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  BUTTONS
              ================================================== */}

              <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
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
                  disabled={loading}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Tenant...
                    </>
                  ) : (
                    <>
                      <span className="text-base">+</span>
                      Create Tenant
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

export default AddTenant;
