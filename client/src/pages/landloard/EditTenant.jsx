
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Mail,
  Phone,
  Pencil,
  ShieldCheck,
  Save,
  X,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";
import api from "../../api/axios.js";
import toast from "react-hot-toast";

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
          toast.error("Tenant not found");
          navigate("/landlord/tenants");
          return;
        }

        setFormData({
          name: tenant.name || "",
          email: tenant.email || "",
          phone: tenant.phone || "",
        });
      } catch (err) {
        console.error(err);
        toast.error(
          err.response?.data?.message || "Failed to load tenant"
        );
      } finally {
        setFetching(false);
      }
    };

    fetchTenant();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter tenant name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter email address");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await api.put(
        `/auth/tenant/${id}`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Tenant updated successfully");
      navigate("/landlord/tenants");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const tenantInitial =
    formData.name?.trim()?.charAt(0)?.toUpperCase() || "T";

  /* LOADING */

  if (fetching) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-56 animate-pulse rounded-lg bg-[#E8ECE5]" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.75fr_1.5fr]">
          <div className="h-64 animate-pulse rounded-xl bg-[#E8ECE5]" />
          <div className="h-80 animate-pulse rounded-xl bg-[#E8ECE5]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 text-[#242B26]">

      {/* HEADER */}

      <div>
        <button
          type="button"
          onClick={() => navigate("/landlord/tenants")}
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#68756A] transition hover:text-[#244B3C]"
        >
          <ArrowLeft size={14} />
          Back to Tenants
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
            <Pencil size={18} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#242B26]">
              Edit Tenant
            </h1>
            <p className="text-xs text-[#68756A]">
              Update tenant personal and contact information.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[0.75fr_1.5fr]">

        {/* PROFILE PANEL */}

        <div className="overflow-hidden rounded-xl border border-[#E6E3D9] bg-white">

          <div className="bg-[#244B3C] px-4 py-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-white/20 bg-white/10 text-2xl font-bold text-white">
              {tenantInitial}
            </div>

            <h2 className="mt-2 truncate text-base font-bold text-white">
              {formData.name || "Tenant"}
            </h2>

            <p className="mt-0.5 truncate text-xs text-[#DCE8DA]">
              {formData.email || "tenant@example.com"}
            </p>

            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-[#F7F4EA]">
              <CheckCircle2 size={11} />
              Editing Tenant
            </span>
          </div>

          <div className="space-y-2.5 p-3">
            <div className="flex items-center gap-2.5 rounded-lg bg-[#F7F4EA] p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#244B3C]">
                <UserRound size={15} />
              </div>
              <div>
                <p className="text-[10px] text-[#89928A]">
                  Account Type
                </p>
                <p className="text-xs font-semibold text-[#242B26]">
                  Tenant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg bg-[#F7F4EA] p-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#244B3C]">
                <ShieldCheck size={15} />
              </div>
              <div>
                <p className="text-[10px] text-[#89928A]">
                  Profile Status
                </p>
                <p className="text-xs font-semibold text-[#527C61]">
                  Changes pending
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[#E6E3D9] p-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#8B642F]">
                Important
              </p>
              <p className="mt-1 text-[11px] leading-5 text-[#68756A]">
                Updated information will be reflected throughout the landlord dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* EDIT FORM */}

        <div className="rounded-xl border border-[#E6E3D9] bg-white">

          <div className="flex items-center gap-2.5 border-b border-[#EEECE4] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF0E8] text-[#244B3C]">
              <Pencil size={15} />
            </div>

            <div>
              <h2 className="text-sm font-bold text-[#242B26]">
                Tenant Information
              </h2>
              <p className="text-[10px] text-[#89928A]">
                Update the details below
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 p-4">

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
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928A]"
                />

                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter tenant name"
                  autoComplete="name"
                  disabled={saving}
                  className="w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF7] py-2.5 pl-9 pr-3 text-xs text-[#242B26] outline-none transition placeholder:text-[#A0A79F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
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
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928A]"
                />

                <input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tenant@example.com"
                  type="email"
                  autoComplete="email"
                  disabled={saving}
                  className="w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF7] py-2.5 pl-9 pr-3 text-xs text-[#242B26] outline-none transition placeholder:text-[#A0A79F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
                  required
                />
              </div>
              <p className="mt-1 text-[10px] text-[#89928A]">
                Use a valid email address for tenant communication.
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
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89928A]"
                />

                <input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  type="tel"
                  autoComplete="tel"
                  disabled={saving}
                  className="w-full rounded-lg border border-[#E6E3D9] bg-[#FAFAF7] py-2.5 pl-9 pr-3 text-xs text-[#242B26] outline-none transition placeholder:text-[#A0A79F] focus:border-[#527C61] focus:bg-white focus:ring-2 focus:ring-[#527C61]/10 disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* INFO */}

            <div className="rounded-lg border border-[#E8DFC8] bg-[#F7F4EA] px-3 py-2.5">
              <p className="text-[11px] leading-5 text-[#8B642F]">
                Please verify all tenant details before saving your changes.
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-2 border-t border-[#EEECE4] pt-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => navigate("/landlord/tenants")}
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E6E3D9] bg-white px-4 py-2.5 text-xs font-semibold text-[#526056] transition hover:bg-[#F7F4EA] disabled:opacity-50"
              >
                <X size={14} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#244B3C] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#193A2E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTenant;
