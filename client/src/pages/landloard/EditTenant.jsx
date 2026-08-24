import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios.js";

const EditTenant = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/auth/tenants", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tenant = res.data.tenants.find((t) => t._id === id);

        if (!tenant) {
          alert("Tenant not found");
          navigate("/landlord/tenants");
          return;
        }

        setFormData({
          name: tenant.name || "",
          email: tenant.email || "",
          phone: tenant.phone || "",
        });
      } catch (err) {
        console.log(err);
        alert("Failed to load tenant");
      } finally {
        setFetching(false);
      }
    };

    fetchTenant();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await api.put(`/auth/tenant/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Tenant updated successfully");

      navigate("/landlord/tenants");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  /* ============================================================
     LOADING SKELETON
  ============================================================ */

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-9 w-64 animate-pulse rounded-lg bg-slate-200" />

            <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.5fr]">
            <div className="h-[600px] animate-pulse rounded-3xl bg-slate-200" />

            <div className="h-[600px] animate-pulse rounded-3xl bg-white" />
          </div>
        </div>
      </div>
    );
  }

  const tenantInitial = formData.name?.trim()?.charAt(0)?.toUpperCase() || "T";

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* =====================================================
            PAGE HEADER
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
            Edit Tenant
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Update the tenant's personal and contact information.
          </p>
        </div>

        {/* =====================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.5fr]">
          {/* ===================================================
              LEFT PROFILE PANEL
          ==================================================== */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-6 shadow-xl shadow-blue-900/10 sm:p-8">
            {/* Decorative circles */}

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-950/20 blur-3xl" />

            <div className="relative">
              {/* Badge */}

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Editing Tenant
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
                  {formData.name || "Tenant"}
                </h2>

                <p className="mt-1 truncate text-sm text-blue-100/70">
                  {formData.email || "tenant@example.com"}
                </p>
              </div>

              {/* Profile details */}

              <div className="mt-8 space-y-3">
                {/* Account */}

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
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

                {/* Profile */}

                <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                      ✏️
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-blue-100/60">
                        Profile
                      </p>

                      <p className="mt-1 text-sm font-semibold text-amber-300">
                        Changes pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notice */}

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-100/60">
                  Important
                </p>

                <p className="mt-2 text-sm leading-6 text-blue-50/80">
                  Changes made here will update the tenant's account information
                  immediately.
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              FORM
          ==================================================== */}

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
            {/* Form header */}

            <div className="mb-7 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  ✏️
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Tenant Information
                  </h2>

                  <p className="text-xs text-slate-400">
                    Update the details below
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
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tenant name"
                    autoComplete="name"
                    disabled={saving}
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
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tenant@example.com"
                    type="email"
                    autoComplete="email"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Make sure the email address is correct.
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
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    type="tel"
                    autoComplete="tel"
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* =================================================
                  INFO BOX
              ================================================== */}

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                    💡
                  </div>

                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      Profile update
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700/70">
                      Review the information carefully before saving. The
                      updated details will be reflected throughout the landlord
                      dashboard.
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
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-500 hover:to-indigo-500 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <span>✓</span>
                      Save Changes
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

export default EditTenant;
