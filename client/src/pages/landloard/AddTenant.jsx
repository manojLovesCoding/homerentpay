
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios.js";

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

    if (!formData.name.trim()) {
      return toast.error("Please enter the tenant's name");
    }

    if (!formData.email.trim()) {
      return toast.error("Please enter an email address");
    }

    if (!formData.phone.trim()) {
      return toast.error("Please enter a phone number");
    }

    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await api.post("/auth/create-tenant", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Tenant created successfully!");
      navigate("/landlord/tenants");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create tenant"
      );
    } finally {
      setLoading(false);
    }
  };

  const tenantInitial =
    formData.name.trim().charAt(0).toUpperCase() || "T";

  return (
    <div className="bg-[#F7F8F5] p-3 sm:p-5">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate("/landlord/tenants")}
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#68756A] transition hover:text-[#244B3C]"
          >
            <ArrowLeft size={15} />
            Back to Tenants
          </button>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#242B26]">
                Add New Tenant
              </h1>
              <p className="mt-1 text-xs text-[#68756A] sm:text-sm">
                Create a tenant account for your rental property.
              </p>
            </div>

            <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0E9] text-[#244B3C] sm:flex">
              <Users size={21} />
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.5fr]">

          {/* LEFT PROFILE CARD */}
          <div className="relative overflow-hidden rounded-2xl bg-[#244B3C] p-5 text-white shadow-sm">

            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-black/10 blur-2xl" />

            <div className="relative">

              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold text-[#DCE8DE]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#D6A45D]" />
                Tenant Account
              </div>

              {/* AVATAR */}
              <div className="mt-5 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-white/20 bg-white/10 text-3xl font-bold text-white">
                  {tenantInitial}
                </div>
              </div>

              {/* PROFILE */}
              <div className="mt-3 text-center">
                <h2 className="truncate text-lg font-bold">
                  {formData.name || "New Tenant"}
                </h2>

                <p className="mt-1 truncate text-xs text-[#DCE8DE]">
                  {formData.email || "tenant@example.com"}
                </p>
              </div>

              {/* ACCOUNT DETAILS */}
              <div className="mt-5 space-y-2.5">

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <UserRound size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#C7D9C8]">
                      Account Type
                    </p>
                    <p className="text-xs font-semibold">
                      Tenant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <ShieldCheck size={17} />
                  </div>

                  <div>
                    <p className="text-[10px] text-[#C7D9C8]">
                      Account Status
                    </p>
                    <p className="text-xs font-semibold text-[#C5DCC3]">
                      Active after creation
                    </p>
                  </div>
                </div>

                {formData.phone && (
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                      <Phone size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] text-[#C7D9C8]">
                        Phone Number
                      </p>
                      <p className="truncate text-xs font-semibold">
                        {formData.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* TIP */}
              <div className="mt-4 rounded-xl border border-white/10 bg-black/10 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#D6A45D]">
                  Helpful Tip
                </p>
                <p className="mt-1.5 text-xs leading-5 text-[#E1E9DF]">
                  Enter the tenant's correct contact details to make rent
                  communication and property updates easier.
                </p>
              </div>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="rounded-2xl border border-[#E6E3D9] bg-white p-4 shadow-sm sm:p-5">

            {/* FORM HEADER */}
            <div className="mb-4 flex items-center gap-3 border-b border-[#EEEDE7] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF0E9] text-[#244B3C]">
                <UserRound size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#242B26]">
                  Tenant Information
                </h2>
                <p className="text-[11px] text-[#68756A]">
                  Enter the tenant's account details.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-xs font-semibold text-[#526056]"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89958A]"
                  />

                  <input
                    id="name"
                    name="name"
                    placeholder="Enter tenant's full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#E6E3D9] bg-[#FAFBF9] py-2.5 pl-10 pr-3 text-sm text-[#242B26] outline-none transition placeholder:text-[#A0A99F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-[#526056]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89958A]"
                  />

                  <input
                    id="email"
                    name="email"
                    placeholder="tenant@example.com"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                    className="w-full rounded-xl border border-[#E6E3D9] bg-[#FAFBF9] py-2.5 pl-10 pr-3 text-sm text-[#242B26] outline-none transition placeholder:text-[#A0A99F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
                    required
                  />
                </div>
                <p className="mt-1 text-[10px] text-[#89958A]">
                  Used for the tenant's account login.
                </p>
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-xs font-semibold text-[#526056]"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89958A]"
                  />

                  <input
                    id="phone"
                    name="phone"
                    placeholder="Enter phone number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-[#E6E3D9] bg-[#FAFBF9] py-2.5 pl-10 pr-3 text-sm text-[#242B26] outline-none transition placeholder:text-[#A0A99F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-[#526056]"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#89958A]"
                  />

                  <input
                    id="password"
                    name="password"
                    placeholder="Create a secure password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#E6E3D9] bg-[#FAFBF9] py-2.5 pl-10 pr-11 text-sm text-[#242B26] outline-none transition placeholder:text-[#A0A99F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
                    required
                    minLength={6}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#89958A] transition hover:text-[#244B3C] disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}
                  </button>
                </div>

                <p className="mt-1 text-[10px] text-[#89958A]">
                  Use at least 6 characters.
                </p>
              </div>

              {/* SECURITY INFO */}
              <div className="flex gap-2.5 rounded-xl border border-[#E0E9DD] bg-[#F2F6EF] p-3">
                <ShieldCheck
                  size={19}
                  className="shrink-0 text-[#527C61]"
                />

                <div>
                  <p className="text-xs font-bold text-[#244B3C]">
                    Account Security
                  </p>
                  <p className="mt-0.5 text-[10px] leading-4 text-[#68756A]">
                    These credentials will allow the tenant to access their
                    account. Keep the password secure.
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col-reverse gap-2 border-t border-[#EEEDE7] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/landlord/tenants")}
                  disabled={loading}
                  className="w-full rounded-xl border border-[#E6E3D9] px-5 py-2.5 text-xs font-semibold text-[#526056] transition hover:bg-[#F7F8F5] disabled:opacity-50 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#244B3C] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Creating Tenant...
                    </>
                  ) : (
                    <>
                      Create Tenant
                      <ArrowRight size={15} />
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
